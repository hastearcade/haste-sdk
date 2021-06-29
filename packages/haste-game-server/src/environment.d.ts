declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: string;
      HASTE_CLIENT_ID: string;
      HASTE_CLIENT_SECRET: string;
      HASTE_API_PROTOCOL: string;
      HASTE_API_HOST: string;
      HASTE_API_PORT: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
