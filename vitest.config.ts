import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // allows using describe/it/expect without import
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
        },
    },
});
