async function run() {
  let site_url = 'https://plataforma.easyvirtualanalytics.com.br/login';
  let site_key = '6LcOdmofAAAAAHcAM1CwN5TSHOkDYJA-RzljJGsd';
  let token = await resolve_captcha(site_key, site_url);
  console.log('O token foi obtido:', token)

    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://plataforma.easyvirtualanalytics.com.br/');
    await page.waitForSelector('input[name="username"]', {delay: 100});
    await page.type('input[name="username"]', login_key, {delay: 100});
    await page.type('input[name="password"]', pass, {delay: 100});
    
    let navigationPromisse = page.waitForNavigation()
    await page.evaluate((token) => {
      document.getElementById('g-recaptcha-response').innerHTML = token
      document.getElementById('btn-login').click()
    }, token)
    await page.keyboard.press('Enter');
    await navigationPromisse

    let success = await page.$('.pace pace-inactive')
    if(success)
    console.log('Captcha foi ultrapassado')
    else
    console.log('Captcha nao foi ultrapassado')

    await sleep(10)
    await browser.close()
}

run();