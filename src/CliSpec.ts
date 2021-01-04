/**
 * CLI specification based on annotated java bean of `cls`. Following annotations will be processed:
 *
 * Class level:
 *   {@link Name}: Name of the command. (Optional) Default to the class simple name
 *   {@link Summary}: Summary of the command (Optional)
 *   {@link Description}: Description of the command (Optional)
 *   {@link Examples}: Array of string representation of samples usages (Optional)
 *
 * For field level annotations, please refer to class {@link Param}
 *
 * @param <T>
 */
import "reflect-metadata"
import CliDeco from "./CliDeco";
import CLIParser from "./CliParser";
import Assert from "./core/Assert";
import { Constructor, doIfNotNull } from "./core/LangUtil";

import Param from "./Param";
import TextFormatter from "./TextFormat";

export default class CLISpec<T> {
  defVal: T;
  name? : string;
  summary?: string;
  description?: string;
  examples?: string[];

  firstOptionalIndex = Number.MAX_SAFE_INTEGER;
  optionParams: Param[] = [];
  indexedParams: Param[] = [];
  requiredParams: Set<string> = new Set();

  public constructor(public cls : any) {
    this.defVal = this.createDefaultInstance();
    this.init();
  }

  init() {
    this.name = (this.cls as Constructor).name;
    doIfNotNull(CliDeco.getName(this.cls!), a => this.name = a!);
    doIfNotNull(CliDeco.getDescription(this.cls!), a => this.description = a);
    doIfNotNull(CliDeco.getSummary(this.cls!), a => this.summary = a);
    doIfNotNull(CliDeco.getExamples(this.cls!), a => this.examples = a);

    for(const key of Array.from(CliDeco.getFieldsMetadata(this.cls).keys())) {
      const param = new Param(key, this.cls, this.defVal);
      if(param.isRequired) this.requiredParams.add(param.name);
      if (param.index !== undefined) {
        this.indexedParams[param.index] = param;
        if (!param.isRequired)
          this.firstOptionalIndex = Math.min(this.firstOptionalIndex, param.index);
        else {
          Assert.isTrue(param.index < this.firstOptionalIndex,
              `Required index argument can't be after Non-Required argument: firstOptionalIndex:${this.firstOptionalIndex}; param:${param}`);
        }
      } else
        this.optionParams.push(param);
    }
    for (let i = 0; i < this.indexedParams.length; i++) {
      Assert.isTrue(this.indexedParams[i] !== undefined,
        `Indexed argument has to start from 0 and be continuos, missing defination at index: ${i}`);
    }
  }

  getOptionParamByName(name: string): Param | undefined {
    return this.optionParams.find(p => p.name === name || p.shortName === name);
  }

  printUsage(): string {
    let sb = `NAME: ${this.name}`;
    doIfNotNull(this.summary, s => sb += `\nSUMMARY: ${s}`);
    doIfNotNull(this.description, s=> sb += `\nDESCRIPTION\n  ${s}`);
    sb += `\nUSAGE\n  ${this.usage}`;
    if (this.examples != null && this.examples.length > 0) {
      sb  += `\nEXAMPLES`;
      for (const ex of this.examples)
        sb += "\n  " + ex;
    }

    sb += "\nARGUMENTS / OPTIONS";
    let optDesc = '';
    for (const p of this.indexedParams) 
      optDesc += `\n  ${p.getDescriptionLine()}`;

    for (const p of this.optionParams)
      optDesc += `\n  ${p.getDescriptionLine()}`;

    sb += TextFormatter.alignTabs(optDesc);
    return sb.toString();
  }

  get usage(): string {
    let sb = this.name!;
    for (const p of this.optionParams)
      sb += p.getUsage();

    for (const p of this.indexedParams)
      sb += p.getUsage();

    return sb;
  }

  public createDefaultInstance(): T { return new this.cls(); }
  public parse(args: string[], argIndex: number): CLIParser<T> { return new CLIParser<T>(this, args, argIndex).parse(); }
}
