//global.Promise = require('bluebird');

const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch(
    {executablePath: 'google-chrome-unstable',
     args: ['--headless', '--no-sandbox', '--disable-setuid-sandbox']}
  );
  const page = await browser.newPage();
  
  //await page.goto('https://github.com');
  //await page.screenshot({ path: 'screenshots/github.png' });

  await page.goto('http://goexample.cn/');

  //Wait for result
  //const resultSelector = '#content > pre:nth-child(4) > code';
  const resultSelector = '#main > ul > li'
  await page.waitForSelector(resultSelector);

  //await page.click(resultSelector );


  //Extract the result from the page
  const res = await page.evaluate( resultSelector  => {
      const anchors = Array.from(document.querySelectorAll(resultSelector )); 
    
      //return anchors.map( anchor =>  {
          //const title = anchor.textContext.split('|')[0].trim();
          //const title = anchor.textContent;
          //return `$(title} - ${anchor.href}`;
          //return title ;
      //});

     const text = document.querySelector('#main > ul:nth-child(3) > li:nth-child(1) > a').textContent;
     //const text = document.querySelector('resultSelector').innerText;
     return text;
  }, resultSelector );

  //print result
  console.log(res);

  
  await browser.close();
}

run()
.catch( (e) => {
    console.log(e);
});

//cache for resolve Un Promise reject error
