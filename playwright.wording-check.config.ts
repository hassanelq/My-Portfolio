import { defineConfig } from '@playwright/test';
import base from './playwright.config';
export default defineConfig({ ...base, use: { ...base.use, baseURL: 'http://localhost:3000' }, webServer: { command: 'npm run dev -- --webpack --port 3000', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 60000 } });
