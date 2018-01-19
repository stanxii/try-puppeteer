//global.Promise = require('bluebird');
const puppeteer = require('puppeteer');
const csv = require('csv-parse');
const csvWriter = require('csv-write-stream')
const fs  = require('fs');
const fse  = require('fs-extra');
var request = require('request');

const file = "./szlc.csv"
async function papaFile(file) {
  return new Promise(async (resolve, reject) => {
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

       let res = await end;

       console.log("all outside csv done:", csvrows);

        //return res;
        resolve( csvrows);

    });
}


var sleep = function(ms) {
    return new Promise( (resolve, reject) => {
       setTimeout( () => {
           resolve();
       }, ms);
    })
}

const outfile = "/home/pptruser/ocr/data/out_szlc.csv"

/*
async function writerCSVFile(row) {

   if (!fs.existsSync(outfile)) {
     writer = csvWriter({ headers: ['category','title','attr','pkg']});
   } else {
     writer = csvWriter({ sendHeaders: false});
   }

   writer.pipe(fs.createWriteStream(outfile, {flags: 'a'}));

   writer.write({
       category: 'cap',
       title: 'SMT-1080',
       attr: '10 pF',
       pkg: 'ea'
   });


   writer.end();
}
*/

async function getProxyIps() {
      var result = { proxyip: {}, found: false };

    try {
        // const url = 'http://tvp.daxiangdaili.com/ip/?' + config.daxiang.params;
        //const url = 'http://tvp.daxiangdaili.com' + '/ip/?tid=555040800113736&num=1&foreign=only';

        //IN FIREWALL
        // const url = 'http://tvp.daxiangdaili.com' + '/ip/?tid=555040800113736&num=1';
        const url = 'http://' + '10.8.15.9' + ':9999/api/v1/getip/1';


        //const url = 'http://tvp.daxiangdaili.com' + '/ip/?tid=555040800113736&num=1&foreign=only&category=2&longlife=10';

        //get ips from daxiang api.
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
  //proxyserver = 

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
  const resultSelector = '#producContainer table > tbody';
  await page.waitForSelector(resultSelector);

  //await page.click(resultSelector );

  

  //Extract the result from the page
  res  = await page.evaluate( resultSelector  => {
      const rowsSelector = '#producContainer table > tbody > tr';
      const rows = Array.from(document.querySelectorAll(rowsSelector )); 
      
      return rows.map( row =>  {
          //const title = anchor.textContext.split('|')[0].trim();
          //const title = anchor.textContent;
          //return `$(title} - ${anchor.href}`;
          //return title ;

          let pt = {};

          pt.cat = document.querySelector('#producContainer table > tbody > tr > td.two > div.two_01 > ul.l02_zb > li:nth-child(1) > a').textContent;
          pt.pt = document.querySelector('#producContainer table > tbody > tr > td.two > div.two_01 > ul.l02_zb > li:nth-child(2)').textContent;
       	  pt.attr = document.querySelector('#producContainer table > tbody > tr > td.two > div.two_01 > ul.l02_zb > li:nth-child(3)').textContent;
          pt.pkg = document.querySelector('#producContainer table > tbody > tr > td.two > div.two_01 > ul.l02_zb > li:nth-child(4)').textContent;



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
	   let rows = await papaFile(file);

	   //console.log("all finished csv:", rows);
	   console.log("xxxxxoooo kkk fffk rows len: ", rows.length);

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



  /*
   writer.write({
       category: 'cap',
       title: 'SMT-1080',
       attr: '10 pF',
       pkg: 'ea'
   });


   writer.end();
   */



           //csv end

	   // await  只能使用源生语法 var v of values
	   let i = 1;
	   for (row of rows) {
             try {
		       let url = baseurl + row;

		       console.log("crawling url:", url);
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
