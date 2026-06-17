export default {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest',{jsc: {
                                            parser: {
                                                syntax: 'ecmascript',
                                                jsx: true,
                                                importMeta: true,
                                            },
                                            transform: {
                                                react: {
                                                    runtime: 'automatic',
                                                },
                                            },
                                        },
                                        },
                                    ],
    },
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy', 
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    globals: {
        'import.meta': {
            env: {
                VITE_SUPABASE_URL: 'dummy-url',
                VITE_SUPABASE_ANON_KEY: 'dummy-key',
            }
        }
    }
};