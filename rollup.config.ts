import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import dts from "rollup-plugin-dts";
import { join } from "path";
// import { codecovRollupPlugin } from "@codecov/rollup-plugin";

const outputDir = join(import.meta.dirname, "/dist/npm/");

function stripShebang() {
  return {
    name: "strip-shebang",
    transform(code: string, id: string) {
      if (id.includes("bin/index.ts")) {
        return code.replace(/^#!.*\n/, "");
      }
      return code;
    },
  };
}

export default [
  {
    input: {
      index: "src/index.ts",
    },
    output: [
      {
        dir: join(outputDir, "es"),
        format: "es",
      },
      {
        dir: join(outputDir, "cjs"),
        format: "cjs",
      },
    ],
    external: ["yargs/yargs", "yargs/helpers", "fs/promises", "xml-js"],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      // codecovRollupPlugin({
      //   enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      //   bundleName: "package",
      //   uploadToken: process.env.CODECOV_TOKEN,
      // }),
    ],
  },
  {
    input: "src/index.ts",
    output: [
      { file: `${outputDir}/es/types.d.ts`, format: "es" },
      { file: `${outputDir}/cjs/types.d.ts`, format: "cjs" },
    ],
    plugins: [typescriptPaths({ preserveExtensions: true }), dts()],
  },
  {
    input: "bin/index.ts",
    output: {
      file: `${outputDir}/bin/index.js`,
      format: "es",
      banner: "#!/usr/bin/env node",
    },
    treeshake: false,
    preserveEntrySignatures: false,
    plugins: [
      stripShebang(),
      typescriptPaths({ preserveExtensions: true }),
      typescript(),
    ],
  },
];
