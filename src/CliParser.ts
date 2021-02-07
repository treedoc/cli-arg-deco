import { TD, TDJSONParser, TDJSONParserOption, TDNodeType } from "treedoc";
import CLISpec from "./CliSpec";
import { doIf } from "./core/LangUtil";
import { isIn } from "./core/ListUtil";
import Param from "./Param";

export default class CLIParser<T> {
  readonly target: T;
  readonly missingParams: Set<string>;
  argIndex: number;
  paramIndex = 0;
  extraArgs: string[] = [];
  errorMessages: Map<string, string> = new Map();

  public constructor(public readonly spec: CLISpec<T>, public readonly args: string[], argIndex: number, target?: T) {
    this.target = target === undefined ? spec.createDefaultInstance() : target;
    this.missingParams = new Set(spec.requiredParams);
    this.argIndex = argIndex;
  }

  public parse(): CLIParser<T> {
    for (; this.argIndex < this.args.length; this.argIndex++) {
      const arg2 = this.argIndex < this.args.length - 1 ? this.args[this.argIndex + 1] : undefined;
      if (this.parseOneParam(this.args[this.argIndex], arg2))
        this.argIndex ++;
    }
    return this;
  }

  /** @return true indicates it uses param2 */
  private parseOneParam(arg1: string, arg2?: string): boolean {
    if (arg1.startsWith("--"))
      return this.parseOption(arg1.substring(2), arg2);
    else if (arg1.startsWith("-"))
      return this.parseOption(arg1.substring(1), arg2);
    this.parseArg(arg1);
    return false;
  }

  private parseOption(arg1: string, arg2?: string): boolean {
    const p = arg1.indexOf('=');
    if (p >= 0) {
      this.parseNameValue(arg1.substring(0, p), arg1.substring(p+1));
      return false;
    }

    return this.parseNameValue(arg1, arg2!);
  }

  private parseNameValue(name: string, value: string): boolean {
    const param = this.spec.getOptionParamByName(name);
    if (param === undefined) {
      this.extraArgs.push(name);
      return false;
    }

    this.missingParams.delete(name);

    if (param.isBooleanType) {
      if (isIn(value, "true", "false")) {  // Boolean type only accept "true", "false" parameters
        param.set(this.target, value === "true");
        return true;
      }
      param.set(this.target, true);
      return false;
    }

    param.set(this.target, this.parseValue(param, value));
    return true;
  }

  private parseArg(arg: string) {
    if (this.paramIndex >= this.spec.indexedParams.length) {
      this.extraArgs.push(arg);
      return;
    }
    const param = this.spec.indexedParams[this.paramIndex++];
    this.missingParams.delete(param.name);
    param.set(this.target, this.parseValue(param, arg));
  }

  private parseValue(param: Param, val: string)  {
    const cls = param.type;
    try {
      if (param.decoder)
        return param.decoder(val);
      if (cls === Boolean) 
        return val === 'true';
      if (cls === Number)
        return parseInt(val);
      if (cls === String)
        return val;

      const rootType = cls === Array ? TDNodeType.ARRAY : TDNodeType.MAP;

      return TDJSONParser.get().parse(val, new TDJSONParserOption().setDefaultRootType(rootType)).toObject(false);
    } catch (e) {
      console.error(`Error parsing parameter:${param.name}, type: ${param.type}, value: ${val}`, e);
    }
    return null;
  }

  public hasError(): boolean { return this.missingParams.size > 0 || this.extraArgs.length > 0 || this.errorMessages.size > 0; }

  public getErrorsAsString(): string {
    let sb = '';
    doIf(this.missingParams.size > 0, () => sb += `\nMissing required arguments:${this.missingParams}`);
    doIf(this.extraArgs.length > 0, () => sb += `\nUnexpected arguments:${this.extraArgs}`);
    doIf(this.errorMessages.size > 0, () => sb += `\nError parsing following arguments:${this.errorMessages}`);
    return sb.toString();
  }
}