import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
export var paths = {
    root: __dirname,
    sections: path.join(__dirname, "src/sections"),
    snippets: path.join(__dirname, "src/snippets"),
    core: path.join(__dirname, "src/core")
};
export default paths;
