import path from "path";
import { fileURLToPath } from "url";

const currentFolder = path.dirname(fileURLToPath(import.meta.url));
export const dataFolder = path.join(currentFolder, "data");
