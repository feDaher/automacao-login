const pup = require('puppeteer')
require('dotenv').config();

const apiKey = process.env.API_KEY;
const pass = process.env.SECRET_PASSWORD;
async function automaticLogin () {
  const browser = await pup.launch({headless: false})

  const page = await browser.newPage()
  await page.setViewport({width: 1920, height: 1080}) 
  await page.goto('https://www.bet365.com/#/HO/')
  await page.waitForSelector('.hm-MainHeaderLogoWide')

  await page.evaluate(( ) => {
    document.querySelector('.hm-MainHeaderRHSLoggedOutWide_Login').click()
  })
  await page.waitForSelector('.lms-StandardLogin_Username');
  await page.type('.lms-StandardLogin_Username', apiKey, {delay: 50})
  await page.type('.lms-StandardLogin_Password', pass, {delay: 50})
  await page.keyboard.press('Enter')
  

  await setTimeout(() => {
    browser.close()
  }, 5000);

};

automaticLogin()