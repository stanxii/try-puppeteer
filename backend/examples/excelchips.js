//global.Promise = require('bluebird');
const puppeteer = require('puppeteer');
const csv = require('csv-parse');
const csvWriter = require('csv-write-stream')
const fs  = require('fs');
const fse  = require('fs-extra');
var request = require('request');

const pageurl = "http://www.excelchips.cn/products/new-arrival.html?p=";


var sleep = function(ms) {
    return new Promise( (resolve, reject) => {
       setTimeout( () => {
           resolve();
       }, ms);
    })
}

const outfile = "/home/pptruser/ocr/data/out_excel.csv"


async function getProxyIps() {
      var result = { proxyip: {}, found: false };

    try {
        const url = 'http://' + '10.8.15.9' + ':9999/api/v1/getip/1';
        await request.get(url)
            .then(res => {
                console.log("get proxy ip===" + res.data);
                console.log("get proxy ip===" + JSON.stringify(res.data));
                //let sip = JSON.parse(res.data);
                //console.log("get proxy ip===" + sip);
                if(res.data.bestip) {
                  if (res.data.bestip.status== 0) {
                      result.proxyip = res.data.bestip.ip;
                      result.found = true;
                      console.log("get xxx proxy ip===" + JSON.stringify(result));
                   }
                }else {
                    console.log("Err get proxy ip doenst exist res ===" + JSON.stringify(result));
                }

            }).catch(e => {
                console.error('axios with catch err' + e);
            });

    } catch (e) {
        console.log('get proxy ip err.' + e);
    }

    return result;
}

async function crawlerOnePage(page, url ) {


  let res = [];

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

  console.log("now will google chrome crawling...url: ", url);
  await page.goto(url);

  await sleep(1000);
  //Wait for result
  //const resultSelector = '#content > pre:nth-child(4) > code';
  const resultSelector = 'table.pc-tab.data-table.products_new_list';
  await page.waitForSelector(resultSelector);

  //await page.click(resultSelector );

  //Extract the result from the page
  res  = await page.evaluate( resultSelector  => {
      //const rowsSelector = '.category-products > table.pc-tab.data-table.products_new_list > tr.order-row';
      const rowsSelector = 'table.pc-tab.data-table.products_new_list   tr.order-row';
      const rows = Array.from(document.querySelectorAll(rowsSelector )); 
      
      return rows.map( row =>  {
          let pt = {};

          //pt.cat = row.querySelector('tbody > tr > td.two > div.two_01 > ul.l02_zb > li:nth-child(1)').textContent.trim();
          pt.pt = row.querySelector(' td.wbk a').innerText.trim();
          pt.attr = row.querySelector(' td.short_description .short_desc').innerText.trim();
          pt.cat = pt.pt;
          pt.pkg = row.querySelector(' td.wbk.span-align.promin').innerText.trim();

          //console.log('got result one page result  pt =',  pt);
	  return pt;

      });

  }, resultSelector );

  //print result
  console.log('got result arrays',  res);
  //console.log(res);
  
  //await page.close();

  return res;
}


async function remove(filename)  {
  return new Promise((resolve, reject) => {
    fs.unlink(filename, (err) => {
       if (err) {
          reject(console.log(err)); 
       }
       resolve(console.log('dele file ok'))
    });
  })
}


(async () => {
	   let pns = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];

	   //console.log("all finished csv:", pns);
	   console.log("xxxxxoooo kkk fffk page numbers len: ", pns.length);

	   const baseurl = 'http://www.szlcsc.com/so/global.html?globalCurrentCatalog=312&globalSearchKeyword=';

          //get proxy ip
          
           let proxyIp = {}
           
           try {
               vs = [1,2,3,4,5];
		    for(v of vs) {
		      console.log('now doing....v', v);
		      proxyIp = await getProxyIps();

		      if (!proxyIp.found) {
			     console.log('does not get a da xiang proxy ip. error\n');
		       } else {
			 console.log('get daxing proxy ip=' + proxyIp.proxyip.toString());
			 break;
		      }
		    }

	    console.log('get daxing proxy final true or false?' + proxyIp.found);
           } catch( e) {
	      console.log('get proxy err', e);
           }

           let args = {};

           if (!proxyIp.found) {
             console.log('does not get a da xiang proxy ip. error\n');
               
	       args =   {
 			     executablePath: 'google-chrome-unstable',
	     		     headless: true,
			     args: ['--no-sandbox', '--disable-setuid-sandbox',
				    '--ignore-certificate-errors',
				    '--user-data-dir=./user-data',
				   ]
                        };
           } else {
              console.log('get daxing proxy ip=' + proxyIp.proxyip.toString());
                
	       args =   {
 			     executablePath: 'google-chrome-unstable',
	     		     headless: true,
			     args: ['--no-sandbox', '--disable-setuid-sandbox',
				    '--ignore-certificate-errors',
				    '--user-data-dir=./user-data',
				    //'--proxy-server="127.0.0.1:8080"'
				    '--proxy-servero=' + await proxyIp.proxyip.toString() 
				   ]
                        };
           }

	  const browser = await puppeteer.launch(
		args
	  );

	  const page = await browser.newPage();

	  await page.setViewport({
	      width: 1920,
	      height: 1080
	  });

         let writer = {};
	  //delete old outfile
         //try {
          //await remove(outfile);
          //} catch( e) {}



         try {
          
           //writer = csvWriter({ headers: ["cat","pt","attr","pkg"]});
      
           writer = csvWriter({ sendHeaders: false});
           //writer = csvWriter();

	    writer.pipe(fs.createWriteStream(outfile, {flags: 'a'})); 
          } catch (e) {
	    console.log(e);
          }

	   // await  只能使用源生语法 var v of values
	   let i = 1;
	   for (pn of pns) {
             try {
		       let url = pageurl + pn;

		       console.log("crawling page url:", url);
		       let pts = await crawlerOnePage(page, url);

		       console.log("loop... csv writering... [] .....: ", pts);
		       //write results. to csv files.
		

                        
                       for ( pt of pts) {

                       	 await writer.write( pt );
			
			}
  	
			await sleep(2000);

	      } catch (err) {
		      console.log( err ); 
	      }
	   }

	   try {
           await writer.end();
           } catch( e) {}

           await browser.close();
})();



//cache for resolve Un Promise reject error
