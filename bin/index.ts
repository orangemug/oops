#!/usr/bin/env ./node_modules/.bin/tsx
import chalk from "chalk";
import { doesPackageExistInCache } from '../src';
import minimist from 'minimist';



async function run (packages: string[]) {
    let hasErrors = false
    
    for (const pkg of packages) {
        const [pkgName, version] = pkg.split(":");
        if (pkgName && version) {
            const output = await doesPackageExistInCache(pkgName, version);            
            console.log(`${chalk.magenta(pkgName)}:${version}`)
            for (const [manager, versions] of Object.entries(output)) {
                if (versions.length > 0) {
                    hasErrors = true;
                    console.log(` - ${manager}`)
                    for (const version of versions) {
                        console.log(`    * ${chalk.red(version)}`)
                    }
                } else {
                    console.log(` - ${manager}: none`)
                }
            }
        }
    }

    process.exit(hasErrors ? 1 : 0);
}

const HELP_TEXT = `
./oops <dangerous_package_versions>

Example: ./oops @ctrl/tinycolor:4.1.1 @ctrl/tinycolor:4.1.2
`.trim();

const argv = minimist(process.argv.slice(2));

if (argv._.length < 1 && argv.help || argv.h) {
    console.log(HELP_TEXT)
    process.exit(0)
}

await run(argv._ as string[]);