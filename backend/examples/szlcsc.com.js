//global.Promise = require('bluebird');
const puppeteer = require('puppeteer');
const csv = require('csv-parse');
const fs  = require('fs');

const file = "./szlc.csv"
async function papaFile(file) {

    let csvrows = [];

    let i = 0;
    fd = fs.createReadStream(file)
        .pipe(csv(['parnumber']))
        .on('data', function( row) {
            //console.log("csv row:", row[0]);
            if (i != 0 ) {
                csvrows.push(row[0]);
            }
            i = 1;
         })
         .on('end', function() {
             //console.log("all csv done:", csvrows);
             return csvrows;
             
         });

        //wait for all promise wrape for waiting end.

        var end = new Promise( (resolve, reject) => {
             fd.on('end', () => { 

                //console.log("all end csv done:", csvrows);

                resolve(csvrows);
             });
             fd.on('error', reject); //or something like that
       });

       let res = await end

       console.log("all outside csv done:", csvrows, csvrows[0], csvrows[1]);
       return res;
}

var sleep = function(ms) {
    return new Promise( (resolve, reject) => {
       setTimeout( () => {
           resolve();
       }, ms);
    })
}



async function crawlerOnePage(url) {


  //proxyserver = 

  const browser = await puppeteer.launch(
    {executablePath: 'google-chrome-unstable',
     headless: true,
     args: ['--no-sandbox', '--disable-setuid-sandbox',
            '--ignore-certificate-errors',
            '--user-data-dir=./user-data',
            //'--proxy-server="127.0.0.1:8080"'
           ]}
  );

  const page = await browser.newPage();

  await page.setViewport({
      width: 1920,
      height: 1080
  });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
  
  //await page.goto('https://github.com');
  //await page.screenshot({ path: 'screenshots/github.png' });

  // const patnumber = 'DE1E3KX102MA4BN01F';
  // const baseurl = 'http://www.szlcsc.com/so/global.html?globalCurrentCatalog=312&globalSearchKeyword=';
  // const url = baseurl + patnumber;

  console.log("now will google chrome crawling...url: ", url);
  await page.goto(url);

  await sleep(1000);
  //Wait for result
  //const resultSelector = '#content > pre:nth-child(4) > code';
  const resultSelector = '#product_tbody_line_87024 > tbody';
  await page.waitForSelector(resultSelector);

  //await page.click(resultSelector );

  

  //Extract the result from the page
  const res = await page.evaluate( resultSelector  => {
      const rowsSelector = '#product_tbody_line_87024 > tbody > tr';
      const rows = Array.from(document.querySelectorAll(rowsSelector )); 
    
      let data = [];
      return rows.map( row =>  {
          //const title = anchor.textContext.split('|')[0].trim();
          //const title = anchor.textContent;
          //return `$(title} - ${anchor.href}`;
          //return title ;

          let pt = {};

          pt.cat = document.querySelector('#product_tbody_line_87024 > tbody > tr > td.two > div.two_01 > ul.l02_zb > li:nth-child(1) > a').textContent;
          pt.pt = document.querySelector('#product_tbody_line_87024 > tbody > tr > td.two > div.two_01 > ul.l02_zb > li:nth-child(2)').textContent;
       	  pt.attr = document.querySelector('#product_tbody_line_87024 > tbody > tr > td.two > div.two_01 > ul.l02_zb > li:nth-child(3)').textContent;
          pt.pkg = document.querySelector('#product_tbody_line_87024 > tbody > tr > td.two > div.two_01 > ul.l02_zb > li:nth-child(4)').textContent;

          data.push(pt);

	  return data;

      });

  }, resultSelector );

  //print result
  //console.log('got result arrays'  res);
  //console.log(res);
  
  await browser.close();

  return res;
}



(async () => {
	   let rows = await papaFile(file);

	   //console.log("all finished csv:", rows);
	   console.log("xxxxxoooo kkk fffk rows len: ", rows.length);

	   const baseurl = 'http://www.szlcsc.com/so/global.html?globalCurrentCatalog=312&globalSearchKeyword=';

	   // await  只能使用源生语法 var v of values
	   let i = 1;
	   for (row of rows) {
             try {
		       let url = baseurl + row;

		       console.log("crawling url:", url);
		       pts = await crawlerOnePage(url);

		       console.log("loop.....: ", pts);
		       //write results. to csv files.
	      } catch (err) {
		      console.log( err ); 
	      }
	   }

})();



//cache for resolve Un Promise reject error
