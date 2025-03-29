import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const baseConfig: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  globals: { URL: "http://localhost:3000" },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^sanity/lib/client$': '<rootDir>/__mocks__/sanityClient.ts',
  },
  preset: "jest-puppeteer",
  testEnvironment: "jsdom",
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { // 添加轉換器
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
};

const serverActionsConfig: Config = {
  displayName: "server-actions",
  roots: ['<rootDir>/actions/__tests__'],
  testMatch: ['<rootDir>/actions/__tests__/?(*.)+(spec|test).[tj]s?(x)'],
  testEnvironment: "node",
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverage: true,
  coverageProvider: "v8",
  verbose: true,
};

const config: Config = {
  projects: [
    {
      ...baseConfig,
      displayName: "frontend",
      roots: ['<rootDir>/app', '<rootDir>'],
      testMatch: [
        '<rootDir>/**/__tests__/**/*.[jt]s?(x)', // 匹配所有 __tests__ 下的測試
        '<rootDir>/**/*.test.[jt]s?(x)',         // 匹配任意目錄下的 *.test.[jt]s?(x)
        '!<rootDir>/actions/__tests__/**/*.[jt]s?(x)', // 排除 server-actions 測試
      ],
    },
    serverActionsConfig,
  ],
};

export default createJestConfig(config);