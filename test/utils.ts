export function extractText(buffer: any, x: any, y: any, width: any) {
  let output = "";
  for (let i = x; i < x + width; ++i) {
    const data = buffer.get(i, y);
    const ch = String.fromCharCode(data.ch || 32);
    output += ch;
  }
  return output.trim();
}
