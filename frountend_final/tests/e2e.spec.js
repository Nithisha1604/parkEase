import { test, expect } from '@playwright/test';

test.describe('ParkEase App E2E Tests', () => {
  
  test('Driver can login and navigate to all driver pages', async ({ page }) => {
    await page.goto('/login');
    
    // Select driver role
    await page.click('button:has-text("Driver")');
    
    // Fill credentials
    await page.fill('input[placeholder="Email Address"]', 'driver@example.com');
    await page.fill('input[placeholder="Password"]', 'password');
    
    // Login
    await page.click('button:has-text("Login as Driver")');
    
    // Check navigation to dashboard (Find Spot is the default)
    await expect(page).toHaveURL('/driver');
    
    // Navigate to History
    await page.click('nav a[href="/driver/history"]');
    await expect(page).toHaveURL('/driver/history');
    await expect(page.locator('main h1')).toHaveText('Booking History');
    
    // Navigate to Favorites
    await page.click('nav a[href="/driver/favorites"]');
    await expect(page).toHaveURL('/driver/favorites');
    await expect(page.locator('main h1')).toHaveText('My Favorites');
    
    // Navigate to Wallet
    await page.click('nav a[href="/driver/wallet"]');
    await expect(page).toHaveURL('/driver/wallet');
    await expect(page.locator('main h1')).toHaveText('My Wallet');
    
    // Navigate to Profile
    await page.click('nav a[href="/driver/profile"]');
    await expect(page).toHaveURL('/driver/profile');
    await expect(page.locator('main h1')).toHaveText('Account Settings');
  });

  test('Owner can login and navigate to all owner pages', async ({ page }) => {
    await page.goto('/login');
    
    // Select owner role
    await page.click('button:has-text("Owner")');
    
    // Fill credentials
    await page.fill('input[placeholder="Email Address"]', 'owner@example.com');
    await page.fill('input[placeholder="Password"]', 'password');
    
    // Login
    await page.click('button:has-text("Login as Owner")');
    
    // Check navigation to dashboard
    await expect(page).toHaveURL('/owner');
    await expect(page.locator('main h1')).toHaveText('Space Owner Dashboard');
    
    // Navigate to Manage Spaces
    await page.click('nav a[href="/owner/spaces"]');
    await expect(page).toHaveURL('/owner/spaces');
    await expect(page.locator('main h1')).toHaveText('Manage Parking Spaces');
    
    // Navigate to Wallet
    await page.click('nav a[href="/owner/wallet"]');
    await expect(page).toHaveURL('/owner/wallet');
    await expect(page.locator('main h1')).toHaveText('Earnings & Wallet');
  });

  test('Admin can login and navigate to all admin pages', async ({ page }) => {
    await page.goto('/login');
    
    // Select admin role
    await page.click('button:has-text("Admin")');
    
    // Fill credentials
    await page.fill('input[placeholder="Email Address"]', 'admin@example.com');
    await page.fill('input[placeholder="Password"]', 'password');
    
    // Login
    await page.click('button:has-text("Login as Admin")');
    
    // Check navigation to dashboard
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('main h1')).toContainText('Admin Control Center');
    
    // Navigate to Manage Users
    await page.click('nav a[href="/admin/users"]');
    await expect(page).toHaveURL('/admin/users');
    await expect(page.locator('main h1')).toHaveText('Manage Users');
    
    // Navigate to Manage Spaces
    await page.click('nav a[href="/admin/spaces"]');
    await expect(page).toHaveURL('/admin/spaces');
    await expect(page.locator('main h1')).toHaveText('Manage All Spaces');
    
    // Navigate to Transactions
    await page.click('nav a[href="/admin/transactions"]');
    await expect(page).toHaveURL('/admin/transactions');
    await expect(page.locator('main h1')).toHaveText('System Transactions');
  });
});
