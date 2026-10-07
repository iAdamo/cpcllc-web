import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Same "@/" alias as tsconfig.json, so tests can import modules that use it.
// tsconfig's jsx is "preserve" (Next compiles it) with NativeWind's import
// source, which needs react-native. Tests render with React's own automatic
// runtime; plain HTML components come out the same.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
});
