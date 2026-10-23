const fs = require("fs");
const path = require("path");
const [,, targetPath, base64Data] = process.argv;
const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64').toString('utf8'), 'utf8');
console.log('Successfully wrote:', targetPath);
