import { readFile, opendir, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import { logger } from "../log/logger.js";

const log = logger.child({ module: "io" });

export async function readJsonFile(filePath: string): Promise<any> {
  try {
    const fileData = await readFile(resolve(filePath), "utf-8");
    const parsedData = JSON.parse(fileData);
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
    await traverseDirectory(directoryPath);

    return filepaths;
  } catch (error: any) {
    log.error("Error traversing directory:", error.message);
    throw error;
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
