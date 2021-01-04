export default class TextFormatter {
  public static indent(text: string, indent: string): string {
    return indent + text.replace(/\n/g, "\n" + indent);
  }

  public static alignTabs(text: string): string {
    if (text == null)
      return text;
    const lines = text.split("\n");
    const fields: string[][] = [];
    const columnsSize: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      fields[i] = lines[i].split("\t");
      for (let c = 0; c < fields[i].length; c++)
        columnsSize[c] = Math.max(columnsSize[c] || 0, fields[i][c].length);
    }

    let sb = '';
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > 0) {
        const line = fields[i];
        for (let c = 0; c < line.length; c++) 
          sb += c == line.length-1 ? line[c] : line[c].padEnd(columnsSize[c] + 1);
      }
      sb += "\n";
    }
    return sb;
  }
}
