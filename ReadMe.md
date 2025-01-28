# 1. Products API Automation
This repository contains API automation tests for Keygen's Products API using Playwright. It covers the full lifecycle of product operations including creation, retrieval, update, and deletion. 

## Prerequisites

Before running the tests, ensure you have the following installed:
- **Node.js** (>= 14.x)
- **npm**

## Setup

1. Clone the repository:

   ```bash
   git clone <git@github.com:psmehtre/Playwright-PracticeJs.git>
   cd <your-repository-directory>


### Steps:
1. Clone the repo.
2. Install dependencies with `npm install`.
3. Create the `.env` file with necessary values (or edit the values directly in the code).
4. Run tests with `npx playwright test` or `playwright test`.

# 2. Keygen UI Automation
This repository contains UI automation tests for Keygen's platform using Playwright. It includes the automation of login, dashboard interactions, product management (create, edit, delete), and user management (create, edit, delete).

## Prerequisites

Before running the tests, ensure you have the following installed:
- **Node.js** (>= 14.x)
- **npm**

## Setup

1. Clone the repository:

   ```bash
   git clone <git@github.com:psmehtre/Playwright-PracticeJs.git>
   cd <your-repository-directory>

## Environment Variables
1. API_BASE_URL: The base URL for the Keygen platform (default is https://app.keygen.sh).
2. USERNAME: Your Keygen account email/username.
3. PASSWORD: Your Keygen account password.

## Reporting & Observations
1. Test execution results are captured in the console output.
2. Screenshots can be taken during UI execution by uncommenting:
3. `await page.screenshot({ path: 'screenshot.png' });`
4. Logs and reports are available in the test-results/ directory after execution.


## Running the Tests 
1. API Tests
   To execute API test cases, run:
   ```bash
   npx playwright test tests/backendApiAutomation.spec.js --headed
(using --headed it will get execute in browser, as by default playwright executes script in headless mode)

2. UI Tests
   To execute UI test cases, run:
   ```bash
   npx playwright test tests/UI_Automation.spec.js --headed
3. To run all tests:
   ```bash
   npx playwright test
4. Command to Record & Generate Code
   ```bash
   npx playwright codegen <URL>

   


