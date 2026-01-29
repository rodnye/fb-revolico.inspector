import 'dotenv/config';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

interface FbSession {
  cookies: {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
  }[];
  origins: {
    origin: string;
    localStorage: {
      name: string;
      value: string;
    }[];
  }[];
}

export const config = {
  executablePath: process.env.EXECUTABLE_PATH,
  headless: process.env.HEADLESS !== 'false',
  fbSessionJsonPath: path.resolve(process.cwd(), '.fb-session.json'),

  /**
   * The storageState object for Playwright and Facebook Session
   */
  getFbSession: (): FbSession => {
    // 1. get env FB_SESSION_JSON
    if (process.env.FB_SESSION_JSON) {
      try {
        return JSON.parse(process.env.FB_SESSION_JSON) as FbSession;
      } catch (error) {
        console.error(
          'Error parsing FB_SESSION_JSON from environment variable:',
          error,
        );
      }
    }

    // 2. try get .fb-session.json
    if (existsSync(config.fbSessionJsonPath)) {
      try {
        const fileContent = readFileSync(config.fbSessionJsonPath, 'utf8');
        return JSON.parse(fileContent) as FbSession;
      } catch (error) {
        console.error('Error reading or parsing .fb-session.json file:', error);
        throw new Error('Failed to load Facebook session from file');
      }
    }

    throw new Error(
      'Facebook session not found. Please set FB_SESSION_JSON environment variable ' +
        'or create a .fb-session.json file in the project root.',
    );
  },
};
