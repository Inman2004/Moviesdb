import { test, expect } from '@playwright/test';

test('take screenshots of homepage and watch page', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');

  // Search for a specific movie known to have a trailer
  await page.fill('input[type="text"]', 'Inception');
  await page.press('input[type="text"]', 'Enter');

  // Wait for the search results to load
  await page.waitForSelector('.movie-card');

  // Take a screenshot of the search results
  await page.screenshot({ path: '/home/jules/verification/search-results.png' });

  // Click the first movie
  await page.locator('.movie-card').first().click();

  // Wait for the watch page to load
  await page.waitForURL('**/movie/**');

  // Wait for the player to be ready
  await page.waitForSelector('.react-player');

  // Take a screenshot of the watch page to show the Glassmorphism effect
  await page.screenshot({ path: '/home/jules/verification/watchpage.png' });

  // Go back to the homepage to screenshot the recommendations
  await page.goBack();
  await page.waitForURL('**/');

  // Add the movie to favorites to trigger recommendations
  await page.locator('.movie-card').first().hover();
  await page.locator('.fav-btn').first().click();

  // Wait for the recommendations carousel to be visible
  await page.waitForSelector('text=Recommended for You');

  // Take a screenshot of the homepage
  await page.screenshot({ path: '/home/jules/verification/homepage.png' });
});
