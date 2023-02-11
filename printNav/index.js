const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false //para abrir o navegador e mostrar as ações
  }
  );
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  await page.goto('https://github.com/feDaher');
  await page.screenshot({path:'meugit.png'});
  await browser.close();

  // Pega a informação de um elemento na página web
  const info = await page.evaluate(() => {
    return document.querySelector('.info').textContent;
  });

  console.log(info);

  await browser.close();
})();

/*
Printar automaticamente e em 'backdoor' a tela do navegação
(async () => {
  const browser = await puppeteer.launch({
    headless: false //para abrir o navegador e mostrar as ações
  }
  );
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  await page.goto('https://github.com/feDaher');
  await page.screenshot({path:'meugit.png'});
  await browser.close();
})();
*/
