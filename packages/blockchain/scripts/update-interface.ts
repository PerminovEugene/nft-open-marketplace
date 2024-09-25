import { promises as fs } from "fs";
import * as path from "path";

/**
 * Cleans the specified folders by deleting all files and subdirectories within them.
 * @param folders - An array of folder paths to clean.
 */
async function cleanFolders(folders: string[]): Promise<void> {
  for (const folder of folders) {
    const folderPath = path.resolve(folder);
    try {
      await fs.rm(folderPath, { recursive: true, force: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error(`Error deleting folder ${folder}:`, error);
      }
    }
  }
}

/**
 * Checks if a file has a .ts or .json extension.
 * @param filePath - The file path or name to check.
 * @returns True if the file has a valid extension, false otherwise.
 */
function isValidExtension(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".ts" || (ext === ".json" && !filePath.endsWith(".dbg.json"));
}

/**
 * Copies all files and subdirectories from the source directory to the destination directory.
 * @param srcDir - The source directory path.
 * @param destDir - The destination directory path.
 */
async function copyAllFiles(srcDir: string, destDir: string): Promise<void> {
  const srcPath = path.resolve(srcDir);
  const destPath = path.resolve(destDir);

  try {
    await fs.mkdir(destPath, { recursive: true });
    const entries = await fs.readdir(srcPath, { withFileTypes: true });

    for (const entry of entries) {
      const srcEntry = path.join(srcPath, entry.name);
      const destEntry = path.join(destPath, entry.name);

      if (entry.isDirectory()) {
        await copyAllFiles(srcEntry, destEntry);
      } else {
        if (isValidExtension(srcEntry)) {
          await fs.copyFile(srcEntry, destEntry);
        }
      }
    }
  } catch (error) {
    console.error(`Error copying from ${srcDir} to ${destDir}:`, error);
  }
}

/**
 * Copies a single file from the source path to the destination path.
 * @param srcFile - The source file path.
 * @param destFile - The destination file path.
 */
async function copySingleFile(
  srcFile: string,
  destFile: string
): Promise<void> {
  const srcPath = path.resolve(srcFile);
  const destPath = path.resolve(destFile);

  try {
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(srcPath, destPath);
  } catch (error) {
    console.error(`Error copying file from ${srcFile} to ${destFile}:`, error);
  }
}

export async function updateInterface() {
  await cleanFolders([
    "interface/src/artifacts",
    "interface/src/typechain-types",
  ]);

  // 2) Copy all files from ../a/b to a/b
  await copyAllFiles(
    "artifacts/contracts",
    "interface/src/artifacts/contracts"
  );

  // Copy all files from ../c/d to c/d
  await copyAllFiles(
    "typechain-types/contracts",
    "interface/src/typechain-types/contracts"
  );

  // Copy ../a/common.ts to a/common.ts
  await copySingleFile(
    "typechain-types/common.ts",
    "interface/src/typechain-types/common.ts"
  );
}
