import {vi, describe, test, expect, Mock} from "vitest"
import { doesPackageExistInCache } from "."
import { exec } from "node:child_process";
import { stdout } from "node:process";

// Mock before importing the module under test
vi.mock('child_process', () => {
  return {
    exec: vi.fn(),
  }
})

describe("doesPackageExistInCache", () => {
    test("missing", async () => {
        (exec as unknown as Mock).mockImplementation((cmd, callback) => {
            callback(null, {stdout: '{}', stderr: ''})
        })
        const output = await doesPackageExistInCache("@ctrl/tinycolor", "4.1.1")
        expect(exec).toHaveBeenNthCalledWith(1, "npm cache ls @ctrl/tinycolor", expect.anything())
        expect(exec).toHaveBeenNthCalledWith(2, "pnpm cache view @ctrl/tinycolor", expect.anything())
        expect(exec).toHaveBeenNthCalledWith(3, "yarn cache list --pattern @ctrl/tinycolor", expect.anything())
    })

    test("missing", async () => {
        (exec as unknown as Mock).mockImplementation((cmd, callback) => {
            if (cmd.match(/^npm/)) {
                callback(null, {stdout: `
make-fetch-happen:request-cache:https://registry.npmjs.org/@ctrl/tinycolor
make-fetch-happen:request-cache:https://registry.npmjs.org/@ctrl/tinycolor/-/@ctrl/tinycolor-4.1.2.tgz
make-fetch-happen:request-cache:https://registry.npmjs.org/@ctrl/tinycolor/-/@ctrl/tinycolor-4.1.1.tgz
make-fetch-happen:request-cache:https://registry.npmjs.org/@ctrl/tinycolor/-/@ctrl/tinycolor-4.1.3.tgz                
`.trim(), stderr: ''})
            } else if (cmd.match(/^pnpm/)) {
                callback(null, {
                    stdout: JSON.stringify({
                        "registry.npmjs.org": {
                            "cachedVersions": [
                                "4.1.2",
                                "4.1.1",
                                "4.1.3",
                            ],
                            "cachedAt": "Tue Mar 17 2026 13:21:50 GMT+0000 (Greenwich Mean Time)",
                            "distTags": {
                                "latest": "4.17.23"
                            }
                        }
                        }, null, 2),
                        stderr: "",
                })
            } else if (cmd.match(/^yarn/)) {
                callback(null, {stdout: `
yarn cache v1.22.22
Name                 Version Registry Resolved                                                                                                                   
@ctrl/tinycolor      4.1.1   npm      https://registry.yarnpkg.com/lodash/-/@ctrl/tinycolor-4.1.2.tgz#679591c564c3bffaae8454cf0b3df370c3d6911c
@ctrl/tinycolor      4.1.2   npm      https://registry.yarnpkg.com/lodash/-/@ctrl/tinycolor-4.1.1.tgz#679591c564c3bffaae8454cf0b3df370c3d6911c
@ctrl/tinycolor      4.1.3   npm      https://registry.yarnpkg.com/lodash/-/@ctrl/tinycolor-4.1.3.tgz#679591c564c3bffaae8454cf0b3df370c3d6911c
`.trim(), stderr: ''})
            } else {
                callback(null, {stdout: ``, stderr: ''})
            }
        })
        const output = await doesPackageExistInCache("@ctrl/tinycolor", "4.1.1")
        expect(output).toEqual({ npm: [ '4.1.1' ], pnpm: [ '4.1.1' ], yarn: [ '4.1.1' ] })
        expect(exec).toHaveBeenNthCalledWith(1, "npm cache ls @ctrl/tinycolor", expect.anything())
        expect(exec).toHaveBeenNthCalledWith(2, "pnpm cache view @ctrl/tinycolor", expect.anything())
        expect(exec).toHaveBeenNthCalledWith(3, "yarn cache list --pattern @ctrl/tinycolor", expect.anything())
    })
})