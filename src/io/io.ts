import { readFile, opendir } from "node:fs/promises";
import { resolve, join } from "node:path";

export async function readJsonFile(filePath: string): Promise<any> {
  try {
    const fileData = await readFile(resolve(filePath), "utf-8");
    const parsedData = JSON.parse(fileData);
    return parsedData;
  } catch (error) {
    console.error("Error reading JSON file:", error);
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

  await traverseDirectory(directoryPath);

  return filepaths;
}
