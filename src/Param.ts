import CliDeco from "./CliDeco";
import { doIf, doIfNotNull } from "./core/LangUtil";
import { noNull } from "./core/StringUtil";


/**
 * Represent an command line parameter, it can be either argument or option
 * If index is not null indicate it's argument
 *   Argument default to required unless explicitly specified.
 *   required argument can't follow non-required argument which index less than it
 * If index is null indicates it's an option, option default to not required, unless specified
 *
 * For option of Boolean type, it will be mapped as flag, that means the value of the option can be omitted.
 *
 * For Param of complex type, the value can be specified as JSON(ex) string, the top level "{" or "[", can be
 * omitted. The quote for key and value can be omitted.
 *
 * Following Annotation will be processed for each parameter:
 *
 * {@link Name}  Name of the parameter, optional, default to field name
 * {@link ShortName}  The optional short name
 * {@link Description}  The optional description
 * {@link Index}  Indicate this an indexed parameter
 * {@link Required}  Indicate if this field is required. all the index fields are required unless explicitly indicated.
 *     All the non-index fields are not required unless explicitly indicated.
 */
export default class Param {
  type?: any;
  name: string;
  shortName?: string;
  index?: number;
  description?: string;
  defVal?: any;
  required?: boolean;
  decoder?: (s: string) => any;
  
  public constructor(public key: string, public cls: any, defObj: any) {
    this.name = key;
    this.defVal = defObj[key];

    doIfNotNull(CliDeco.getName(cls, key), a => this.name = a);
    doIfNotNull(CliDeco.getShortName(cls, key), a => this.shortName = a);
    doIfNotNull(CliDeco.getDescription(cls, key), a => this.description = a);
    doIfNotNull(CliDeco.getIndex(cls, key), a => this.index = a);
    doIfNotNull(CliDeco.getRequired(cls, key), a => this.required = a);
    doIfNotNull(CliDeco.getDecoder(cls, key), a => this.decoder = a);
    doIfNotNull(CliDeco.getDesignType(cls, key), a => this.type = a);
    if (this.type === Object && this.defVal !== undefined && this.defVal !== null) {
      this.type = this.defVal.__proto__.constructor;
    }
  }

  public get isRequired() : boolean {
    return this.required !== undefined ? this.required : this.index !== undefined;
  }

  public get isBooleanType(): boolean {
    return this.type === Boolean;
  }

  getUsage(): string {
    if (this.index != null)
      return this.isRequired ? ` <${this.name}>` :  ` [${this.name}]`;

    let sb = this.shortName != null ? `-${this.shortName}` : `--${this.name}`;
    doIf(!this.isBooleanType, () => sb += " <value>");

    return this.isRequired ? ` ${sb}` : ` [${sb}]`;
  }

  getDescriptionLine(): string {
    let sb = "";
    if (this.index == null) {
      if (this.shortName) sb += `-${this.shortName}, `;
      sb += `--${this.name}`;
    } else {
      sb += `<${this.name}>`;
    }
    sb += `:\t${noNull(this.description)}`;
    return sb.toString();
  }

  set(target: any, val: any) {
    target[this.key] = val;
  }
}
