/** @type {import('ts-jest').JestConfigWithTsJest} */
const config: import('ts-jest').JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: [".ts"],
    roots: ['<rootDir>/tests'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};

export default config;