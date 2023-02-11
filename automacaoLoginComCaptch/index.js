const puppeteer = require('puppeteer');
const request = require('request');
const config = require ('./config.js')
require('dotenv').config({ path: '.env2' });

const login_key = process.env.API_KEY
const pass = process.env.SECRET_PASSWORD

async function sleep(seg) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve();
    }, seg * 1000);
  });
}

async function curl(options) {
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err)
        return reject(err);
      resolve(body);
    });
  });
}

async function resolve_captcha(site_key, site_url){
  
  return new Promise(async (resolve, reject) => {
    let url = `http://2captcha.com/in.php?key=${config.api_key}&method=userrecaptcha&googlekey=${site_key}&pageurl=${site_url}`;
    let resposta = await curl({
      url: url,
      method: "GET"
    })
    try {
      resposta = JSON.parse(resposta);
      if(resposta.status !== 1)
        return reject("Falha ao obter o id do captcha")
      let captcha_id = resposta.request;

      while(1) {

        await sleep(15)
        console.log("Verificando se o Captcha está pronto:")
        let resposta2 = await curl({
          url: `http://2captcha.com/res.php?key=${config.api_key}&action=get&id=${captcha_id}&json=true`,
          method: 'GET'
        })
        resposta2 = JSON.parse(resposta2)
        console.log(resposta2)

        if(resposta2 == 1)
          return resolve(resposta2.request)
        if(resposta2 !== 'CAPCHA_NOT_READY')
          return reject(resposta2.request)
      }
    } catch(e){
      console.log(e)
      reject(e)
    }
  });

}

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

