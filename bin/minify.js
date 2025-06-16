import { glob } from "glob";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const files = glob.sync("src/assets/js/*.js");
for (const file of files) {
    const out = path.join("public/js", path.basename(file));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    execSync(`terser "${file}" -o "${out}" -c -m`);
    console.log(`Minified: ${file} -> ${out}`);
}