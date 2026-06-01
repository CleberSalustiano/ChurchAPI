import baseConfig from "./jest.config";

export default {
  ...baseConfig,
  setupFilesAfterEnv: ["<rootDir>/src/shared/infra/http/e2e/setup.ts"],
  testMatch: ["**/*.e2e.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  testTimeout: 30000,
};
