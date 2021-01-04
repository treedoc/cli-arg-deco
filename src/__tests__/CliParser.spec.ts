import CliDeco from "../CliDeco"
import CLISpec from "../CliSpec";
import { EnumsValueOf, EnumValues } from "../core/LangUtil";


const { Name, Summary, Description, Examples, Index, ShortName, Required, Decoder } = CliDeco;

class Point {
  name?: string;
  x?: number;
  y?: number;
}

enum Opt{ VAL1, VAL2 }

@Name("TestArg1") 
@Summary("This is a test arg1") 
@Description("Description of test Args")
@Examples([
    "arg1 2",
    "arg1 4",
])
class Arg1 {
  @Index(0) @Description("Str parameter")
  strParam?: string;

  @Index(1) @Description("number parameter")
  numParam?: number;

  @Index(2) @Description("Object Point") @Required(false)
  point?: Point;

  // TODO: Add enum support, Typescript metadata information of `design:type` will set as `object` for enum which is not correct
  @ShortName("o") @Description( `Opt: possibleValues:[${EnumValues(Opt)}]`) @Required(true) @Decoder(_ => EnumsValueOf(Opt, _))
  opt = Opt.VAL1;

  @ShortName("i")
  optInt: number = 10;
}


describe('CliParser', () => {
  test('testParse', () => {
    const spec = new CLISpec(Arg1);
    expect(spec).toMatchSnapshot("spec");
    expect(spec.usage).toMatchSnapshot("usage");
    console.info("spec:\n" + spec.printUsage());
    expect(spec.printUsage()).toMatchSnapshot("printUsage");

    const args = ["abc", "10", 'name:n1,x:1,y:2', "-o", "VAL2", "--optInt", "100"];
    const parser = spec.parse(args, 0);
    console.info("parsedValue:\n" + JSON.stringify(parser.target, null, 2));
    expect(parser.target).toMatchSnapshot("parserTarget");
  });
});