#!/usr/bin/env ./node_modules/.bin/tsx
import chalk from "chalk";
import { doesPackageExistInCache } from "../src";

async function run(packages: string[]) {
  let hasErrors = false;

  for (const pkg of packages) {
    const [pkgName, version] = pkg.split(":");
    if (version === undefined || version === "") {
      console.error(
        chalk.red(
          `'${pkg}' doesn't contain a version, add a version, for example '${pkg}:^2' (change the semver version)`,
        ),
      );
      process.exit(2);
    }
    if (pkgName && version) {
      const output = await doesPackageExistInCache(pkgName, version);
      console.log(`${chalk.magenta(pkgName)}:${version}`);
      for (const [manager, versions] of Object.entries(output)) {
        if (versions.length > 0) {
          hasErrors = true;
          console.log(` - ${manager}`);
          for (const version of versions) {
            console.log(`    * ${chalk.red(version)}`);
          }
        } else {
          console.log(` - ${manager}: none`);
        }
      }
    }
  }

  process.exit(hasErrors ? 1 : 0);
}

const HELP_TEXT = `
npx @orangemug/oops <dangerous_package_versions>

Example: npx @orangemug/oops '@ctrl/tinycolor:4.1.1' '@ctrl/tinycolor:4.1.2'
`.trim();


const argv = process.argv.slice(2);
if (argv.length < 1 || argv[0] == "--help" || argv[0] == "-h") {
  console.log(HELP_TEXT);
  process.exit(0);
}

await run(argv);
