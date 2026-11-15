import {readFileSync} from "node:fs";
import {pathToFileURL} from "node:url";
import {createHash} from "node:crypto";

export function run(input) {
  const {feature, users, percentage} = input;
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) throw new Error("Invalid percentage");
  return users.filter(user => {
    const hash = createHash("sha256").update(JSON.stringify([feature, user])).digest();
    return hash.readUInt32BE(0) / 2 ** 32 < percentage / 100;
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length !== 3) throw new Error("Usage: node index.mjs INPUT.json");
    const input = JSON.parse(readFileSync(process.argv[2], "utf8"));
    console.log(JSON.stringify(run(input), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
