import { readFile, opendir, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import { logger } from "../log/logger";

const log = logger.child({ module: "io" });

export async function readJsonFile(filePath: string): Promise<any> {
  try {
    log.trace(`Reading JSON file: ${filePath}`);

    const fileData = await readFile(resolve(filePath), "utf-8");

    log.trace(`JSON file read with data: ${fileData}`);

    const parsedData = JSON.parse(fileData);

    log.trace(`JSON file parsed with data: ${JSON.stringify(parsedData)}`);

    return parsedData;
  } catch (error: any) {
    log.error("Error reading JSON file:", error.message);
    throw error;
  }
}

export async function getAllFilePaths(directoryPath: string, fileNameEnd = ".expectations.json"): Promise<string[]> {
  const filepaths: string[] = [];

  async function traverseDirectory(currentPath: string) {
    const dir = await opendir(currentPath);

    for await (const dirent of dir) {
      const filePath = join(currentPath, dirent.name);

      if (dirent.isDirectory()) {
        await traverseDirectory(filePath);
      } else {
        if (filePath.endsWith(fileNameEnd)) {
          filepaths.push(filePath);
        }
      }
    }
  }

  try {
    log.trace(`Getting all filepaths from directory: ${directoryPath}`);

    await traverseDirectory(directoryPath);

    log.trace(`All filepaths from directory resolved to: ${JSON.stringify(filepaths)}`);

    return filepaths;
  } catch (error: any) {
    log.error("Error traversing directory:", error.message);
    throw error;
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    log.trace(`Checking if file exists at path: ${filePath}`);

    await access(filePath);

    log.trace("File exists");

    return true;
  } catch (error) {
    log.trace("File does not exist");

    return false;
  }
}
