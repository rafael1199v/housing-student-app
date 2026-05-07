import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "./vite.shared.config";

export default mergeConfig(
	baseConfig,
	defineConfig({
		test: {
			environment: "jsdom",
			setupFiles: ["./src/test/setupTests.ts"],
		},
	}),
);
