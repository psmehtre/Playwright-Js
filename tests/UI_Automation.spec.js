import {
    test,
    expect
} from '@playwright/test';

const baseUrl = 'https://app.keygen.sh';

test.describe.serial('Keygen UI Automation', () => {
    let page;
    const uniqueCode = `test${Math.floor(Math.random() * 100000)}`;

    test.beforeAll(async ({
        browser
    }) => {
        page = await browser.newPage();
        await page.goto(baseUrl + '/login'); // Go to login page 

        //login function
        await page.locator("//input[@id='account']").fill('uniacco-com');
        await page.locator("//input[@id='email']").fill('priyadarshan.m@uniacco.com');
        await page.locator("//input[@id='password']").fill('darshan@123');
        await page.locator("//button[normalize-space()='Login']").click();
        await page.waitForTimeout(3000); // Wait for the page to load after login
        await expect(page).toHaveURL(baseUrl);
        //   await page.screenshot({ path: 'dashboard_after_login.png' });
    });

    test.afterAll(async () => {
        await page.close();
        console.log("✅ Page closed after execution.");
    });
    

    test('UI Automation login', async () => {
        //verify able to dashboard after successful login
        await expect(page).toHaveURL(baseUrl);
        console.log('✅ Login successful');
    });

    test('Dashboard Interactions', async () => {
        // await page.screenshot({ path: 'dashboard_after_login.png' });
        await expect(page.locator("//h1[@class='header']")).toContainText('Dashboard');
        await expect(page.locator("//h5[normalize-space()='Dashboard']")).toBeVisible();
        console.log('✅ Dashboard interaction validated');
    });

    // Create Product
    test('Create Product', async () => {
        await page.goto(baseUrl + '/products');

        // Navigate to the create product page
        await page.locator("//a[normalize-space()='New Product']").click();
        await expect(page).toHaveURL(baseUrl + '/products/new');
        
        //Fill the form with valid inputs
        await page.locator("//input[@id='name']").fill('Test Product 001');
        await page.locator("//input[@id='code']").fill(uniqueCode);
        await page.locator("//input[@id='url']").fill('https://google.com');
        await page.locator("//select[@id='distributionStrategy']").selectOption('OPEN');
        await page.locator("//button[normalize-space()='Submit']").click();
        
        //assertions to verify product got created
        await expect(page.locator("//h1[@class='header']")).toContainText('show');
        await expect(page).toHaveURL(/https:\/\/app\.keygen\.sh\/products\/[a-zA-Z0-9]+/);
        await page.waitForTimeout(3000)
        await page.getByRole('link', { name: 'Products' }).click();
        await expect(page.getByRole('link', { name: uniqueCode })).toBeVisible();

        console.log('✅ Product created successfully');
    });

    // Edit Product
    test('Edit Product', async () => {
        //Edit the created product
        await page.getByRole('link', { name: 'Products' }).click();
        await page.getByRole('link', { name: uniqueCode }).click();
        await page.getByRole('link', { name: 'Edit', exact: true }).click();
        await page.getByPlaceholder('example', { exact: true }).click();
        await page.getByPlaceholder('example', { exact: true }).fill('test code 2');
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(3000)

        //assertion to validate edit done successfully
        await expect(page).toHaveURL(/https:\/\/app\.keygen\.sh\/products\/[a-zA-Z0-9]+/);
        console.log('✅ Product updated successfully');
    });

    // Delete Product
    test('Delete Product', async () => {
        await page.goto(baseUrl + '/products');
        await page.getByRole('link', { name: 'test code 2', exact: true }).click();
        await page.locator("//button[normalize-space()='Delete']").click();
        
        const fullText = await page.locator('text=Please type').textContent();
        
        // Extract delete text from the HTML content
        const extractedText = fullText.trim().replace(/^Please type\s+(.+?)\s+to confirm\.$/s, '$1');

        // Ensure extractedText is a string before filling the input
        if (extractedText) {
            await page.locator("//p[contains(text(),'Please type')]/following-sibling::input[@type='text']").fill(extractedText);
            await page.getByRole('button', { name: 'I understand the consequences' }).click();
        } else {
            console.error('Could not extract delete text!');
        }
        console.log('✅ Product deleted successfully');
    });

    // Create User
    test('Create User', async () => {
        //goto create user page
        await page.goto(baseUrl + '/users/new');
        await page.waitForTimeout(3000)

        //Fill the form with valid inputs
        await page.getByPlaceholder('First Name').fill('test');
        await page.getByPlaceholder('Last Name').fill('tester');
        await page.getByPlaceholder('Email').fill('test@gmail.com');
        await page.locator('form div').filter({ hasText: 'Password help_center View' }).getByRole('link').press('Tab');
        await page.getByPlaceholder('Password').fill('test@1234');
        await page.getByRole('button', { name: 'User' }).click();
        await page.getByRole('option', { name: 'Read Only' }).click();
        await page.locator('form').click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(5000)

        //assertoins to verify user is added
        await expect(page.getByText('ID', { exact: true })).toBeVisible();
        await expect(page).toHaveURL(/https:\/\/app\.keygen\.sh\/users\/[a-zA-Z0-9]+/);
        console.log('✅ User created successfully');
    });

    // Edit User
    test('Edit User', async () => {
        await page.goto(baseUrl + '/users');

        //goto the users page list & verify on the same entry of created
        await page.getByRole('link', { name: 'test@gmail.com' }).click();
        await page.getByRole('link', { name: 'Edit', exact: true }).click();
        await page.getByPlaceholder('Last Name').click();
        await page.getByPlaceholder('Last Name').fill('tester 001');
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByText('tester 001', { exact: true }).click();

        await expect(page).toHaveURL(/https:\/\/app\.keygen\.sh\/users\/[a-zA-Z0-9]+/);
        console.log('✅ User updated successfully');
    });

    // Delete User
    test('Delete User', async () => {
        
        await page.getByRole('button', { name: 'Delete' }).click();
        const fullText = await page.locator('text=Please type').textContent();
        
        // Extract delete text from the HTML content
        const extractedText = fullText.trim().replace(/^Please type\s+(.+?)\s+to confirm\.$/s, '$1');

        // Ensure extractedText is a string before filling the input
        if (extractedText) {
            await page.locator("//p[contains(text(),'Please type')]/following-sibling::input[@type='text']").fill(extractedText);
            await page.getByRole('button', { name: 'I understand the consequences' }).click();
        } else {
            console.error('Could not extract delete text!');
        }
        await expect(page).toHaveURL('https://app.keygen.sh/users');
        console.log('✅ User deleted successfully');

    });
});
