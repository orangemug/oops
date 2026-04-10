import { exec as execCallback } from "child_process";
import { promisify } from "util";
import semver from "semver";
import validSemver from "semver/ranges/valid.js";

const exec = promisify(execCallback);

async function doesCommandExists (cmd: string) {
  try {
    await exec(`which ${cmd}`);
    return true;
  } catch (err: any) {
    if (err.code === 1) {
      return false;
    }
    throw err;
  }
}

async function pnpmDoesPackageExist(pkgName: string) {
  if (!await doesCommandExists("pnpm")) {
    return []
  }
  const result = await exec(`pnpm cache view ${pkgName}`);
  const obj = JSON.parse(result.stdout);
  for (const [_registry, data] of Object.entries<any>(obj)) {
    return data.cachedVersions ?? [];
  }
  return [];
}

async function npmDoesPackageExist(pkgName: string) {
  if (!await doesCommandExists("npm")) {
    return []
  }
  const result = await exec(`npm cache ls ${pkgName}`);
  const out = [];
  for (const line of result.stdout.split("\n")) {
    const matches = line.match(/\/(.*)-(.*)\.tgz$/);
    if (matches) {
      out.push(matches[2]);
    }
  }
  return out;
}

async function yarnDoesPackageExist(pkgName: string) {
  if (!await doesCommandExists("yarn")) {
    return []
  }
  const result = await exec(`yarn cache list --pattern ${pkgName}`);
  const items = result.stdout.split("\n").map((line) => line.split(/\s+/));
  const out = [];
  for (const item of items) {
    if (item[0] === pkgName) {
      out.push(item[1]);
    }
  }
  return out;
}

export async function doesPackageExistInCache(
  pkgName: string,
  version: string,
) {
  if (!validSemver(version)) {
    throw new Error(`Invalid version range "${version}"`);
  }

  const affectedVersions: Record<string, string[]> = {};

  for (const [managerName, pkgVersions] of [
    ["npm", await npmDoesPackageExist(pkgName)],
    ["pnpm", await pnpmDoesPackageExist(pkgName)],
    ["yarn", await yarnDoesPackageExist(pkgName)],
  ] as [string, string[]][]) {
    const sorted = pkgVersions.sort((v1, v2) => {
      if (semver.lt(v1, v2)) {
        return -1;
      } else if (semver.gt(v1, v2)) {
        return 1;
      }
      return 0;
    });

    const filteredVersions = sorted.filter((pkgVersion) => {
      return semver.satisfies(pkgVersion, version);
    });
    affectedVersions[managerName] = filteredVersions;
  }

  return affectedVersions;
}
