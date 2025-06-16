import { glob } from "glob";
import chalk from "chalk";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const files = glob.sync("src/assets/js/*.js");
console.log(
    `${chalk.gray(`[`)}${chalk.green(`Ew`)}${chalk.gray(`/Terser]`)}`,
    chalk.white(`Minifying ${files.length} file(s)`)
);
for (const file of files) {
    const out = path.join("public/js", path.basename(file));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    execSync(`terser "${file}" -o "${out}" -c -m`);
    console.log(
        `${chalk.gray(`[`)}${chalk.green(`Ew`)}${chalk.gray(`/Terser]`)}`,
        chalk.white(`Writing ${out}`),
        chalk.gray(`from ${file}`)
    );
}
console.log(
    `${chalk.gray(`[`)}${chalk.green(`Ew`)}${chalk.gray(`/Terser]`)}`,
    chalk.white(`Minification complete ${files.length} file(s)`)
);