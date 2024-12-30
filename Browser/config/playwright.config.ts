import { defineConfig, devices } from '../dependencies/node_modules/@playwright/test'

export default defineConfig({
  testDir: './tests', // Directory containing your tests
  fullyParallel: true, // Run tests in parallel
  reporter: [['list'], ['html']], // Use HTML and list reporters
  retries: 2, // Retry failed tests
  workers: process.env.CI ? 1 : undefined, // Single worker on CI for stability
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    headless: !!process.env.CI, // Run headless in CI, but not locally
    screenshot: process.env.CI ? 'on' : 'on-first-retry', // Take screenshots for all tests
    trace: 'on-first-retry', // Collect trace only if retry occurs
    video: process.env.CI ? 'on' : 'on-first-retry', // Record video for all tests
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] }, // Test with Chrome
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] }, // Test with Firefox
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] }, // Test with Safari
    },
  ],
  webServer: {
    command: 'pnpm vite', // Command to start your dev server
    port: 5173, // Same port as `baseURL`
    reuseExistingServer: !process.env.CI, // Reuse server if running locally
  },
})
