import TextFormatter from "../TextFormat";


const str1 = `ab\tcdef\tghijk
a\tbcdefg\th
a\tb\tcde\tfg\th
`
const str2 = `abcd
efg
hijk
lmn
`

describe('TextFormatter', () => {
  test('testAlignTabs', () => {
    expect(TextFormatter.alignTabs(str1)).toMatchSnapshot();
  });

  test('testIndent', () => {
    expect(TextFormatter.indent(str2, "  ")).toMatchSnapshot();
  })
});