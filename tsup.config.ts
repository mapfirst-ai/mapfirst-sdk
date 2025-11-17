import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  dts: true,
  sourcemap: true,
  clean: true,
  globalName: "MyUniversalLib", // window.MyUniversalLib in browsers
  minify: true,
  target: "es2019",
});
