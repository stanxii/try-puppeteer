//global.Promise = require('bluebird');
const puppeteer = require('puppeteer');
const csv = require('csv-parse');
const csvWriter = require('csv-write-stream')
const fs  = require('fs');
const fse  = require('fs-extra');
let fetch = require('node-fetch');

const pageurl = "http://www.excelchips.cn/products/new-arrival.html?p=";

const purls = [
'http://www.excelchips.cn/manufacturers/adi/4-20-loop-interface-devices.html',
'http://www.excelchips.cn/manufacturers/adi/accelerometers.html',
'http://www.excelchips.cn/manufacturers/adi/accelerometer-with-digital-interface.html',
'http://www.excelchips.cn/manufacturers/adi/analog-crosspoint-switches.html',
'http://www.excelchips.cn/manufacturers/adi/ate-pmu-and-dps-devices.html',
'http://www.excelchips.cn/manufacturers/adi/ate-drivers-comparators-and-load-devices.html',
'http://www.excelchips.cn/manufacturers/adi/atv-audio-processors.html',
'http://www.excelchips.cn/manufacturers/adi/audio-adcs.html',
'http://www.excelchips.cn/manufacturers/adi/audio-amplifiers.html',
'http://www.excelchips.cn/manufacturers/adi/audio-codecs.html',
'http://www.excelchips.cn/manufacturers/adi/audio-dacs.html',
'http://www.excelchips.cn/manufacturers/adi/audio-sample-rate-converters.html',
'http://www.excelchips.cn/manufacturers/adi/audio-signal-processors-sigmadsp-devices.html',
'http://www.excelchips.cn/manufacturers/adi/battery-charge-and-control.html',
'http://www.excelchips.cn/manufacturers/adi/cable-active-devices.html',
'http://www.excelchips.cn/manufacturers/adi/cable-modem-and-if-baseband-signal-processing-devices.html',
'http://www.excelchips.cn/manufacturers/adi/capacitance-to-digital-converters.html',
'http://www.excelchips.cn/manufacturers/adi/clock-and-data-recovery-retiming-devices.html',
'http://www.excelchips.cn/manufacturers/adi/clock-distribution-devices.html',
'http://www.excelchips.cn/manufacturers/adi/comparators.html',
'http://www.excelchips.cn/manufacturers/adi/complex-and-or-special-function-converters.html',
'http://www.excelchips.cn/manufacturers/adi/dc-and-low-frequency-multipliers-dividers.html',
'http://www.excelchips.cn/manufacturers/adi/digital-bus-switches-and-level-translation-devices.html',
'http://www.excelchips.cn/manufacturers/adi/digital-potentiometers.html',
'http://www.excelchips.cn/manufacturers/adi/digital-power-management.html',
'http://www.excelchips.cn/manufacturers/adi/direct-digital-synthesis-devices.html',
'http://www.excelchips.cn/manufacturers/adi/display-and-lighting.html',
'http://www.excelchips.cn/manufacturers/adi/display-interface-hdmi-switches.html',
'http://www.excelchips.cn/manufacturers/adi/energy-measurement-and-line-communication-devices.html',
'http://www.excelchips.cn/manufacturers/adi/fiber-optic-amplifier-devices.html',
'http://www.excelchips.cn/manufacturers/adi/fiber-optic-laser-diode-drivers.html',
'http://www.excelchips.cn/manufacturers/adi/fiber-optic-tec-controller.html',
'http://www.excelchips.cn/manufacturers/adi/hart-comm-devices.html',
'http://www.excelchips.cn/manufacturers/adi/hot-swap-and-power-monitoring.html',
'http://www.excelchips.cn/manufacturers/adi/imaging-and-ccd-or-cis-signal-processing-devices.html',
'http://www.excelchips.cn/manufacturers/adi/industrial-and-hs-interface-devices.html',
'http://www.excelchips.cn/manufacturers/adi/instrumentation-type-amplifiers.html',
'http://www.excelchips.cn/manufacturers/adi/ios-subsystems.html',
'http://www.excelchips.cn/manufacturers/adi/isolated-digital-interface-devices.html',
'http://www.excelchips.cn/manufacturers/adi/isolation-amplifiers.html',
'http://www.excelchips.cn/manufacturers/adi/linear-regulators.html',
'http://www.excelchips.cn/manufacturers/adi/lvdt-signal-conditioning.html',
'http://www.excelchips.cn/manufacturers/adi/magnetic-field-sensors.html',
'http://www.excelchips.cn/manufacturers/adi/matched-transistors.html',
'http://www.excelchips.cn/manufacturers/adi/micro-controllers.html',
'http://www.excelchips.cn/manufacturers/adi/mosfet-drivers.html',
'http://www.excelchips.cn/manufacturers/adi/operational-amplifiers.html',
'http://www.excelchips.cn/manufacturers/adi/pll-synthesizers.html',
'http://www.excelchips.cn/manufacturers/adi/power-sequencing.html',
'http://www.excelchips.cn/manufacturers/adi/rms-to-dc-converters.html',
'http://www.excelchips.cn/manufacturers/adi/resolver-to-digital-converters.html',
'http://www.excelchips.cn/manufacturers/adi/rf-attenuators.html',
'http://www.excelchips.cn/manufacturers/adi/rf-demodulators.html',
'http://www.excelchips.cn/manufacturers/adi/rf-fixed-gain-blocks.html',
'http://www.excelchips.cn/manufacturers/adi/rf-power-detectors.html',
'http://www.excelchips.cn/manufacturers/adi/short-range-rf-txrx-solutions.html',
'http://www.excelchips.cn/manufacturers/adi/standard-adcs.html',
'http://www.excelchips.cn/manufacturers/adi/standard-dacs.html',
'http://www.excelchips.cn/manufacturers/adi/standard-multiplexers-and-switchers.html',
'http://www.excelchips.cn/manufacturers/adi/supervisory.html',
'http://www.excelchips.cn/manufacturers/adi/switching-power-converters.html',
'http://www.excelchips.cn/manufacturers/adi/temperature-sensors-and-control-devices.html',
'http://www.excelchips.cn/manufacturers/adi/touch-screen-converters-and-controllers.html',
'http://www.excelchips.cn/manufacturers/adi/track-and-hold-amplifiers.html',
'http://www.excelchips.cn/manufacturers/adi/video-codecs.html',
'http://www.excelchips.cn/manufacturers/adi/video-compression-decompression-devices.html',
'http://www.excelchips.cn/manufacturers/adi/video-decoders-and-interface-drivers-including-hdmi.html',
'http://www.excelchips.cn/manufacturers/adi/ah0606.html',
'http://www.excelchips.cn/manufacturers/adi/other-products.html',
'http://www.excelchips.cn/manufacturers/adi/humidity-sensor.html',
'http://www.excelchips.cn/manufacturers/adi/digital-isolators.html',
'http://www.excelchips.cn/manufacturers/adi/capacitance-to-digital-converters-1.html',
'http://www.excelchips.cn/manufacturers/adi/isopower.html',
'http://www.excelchips.cn/manufacturers/adi/analog-switches-and-multiplexers.html',
'http://www.excelchips.cn/manufacturers/adi/rf-if-mixers.html',
'http://www.excelchips.cn/manufacturers/adi/isolated-gate-drivers.html',
'http://www.excelchips.cn/manufacturers/adi/difference-amplifiers.html',
'http://www.excelchips.cn/manufacturers/adi/current-sense-amplifiers.html',
'http://www.excelchips.cn/manufacturers/adi/rf-switches.html'];

const plens = [
87,
105,
78,
47,
13,
4,
2,
20,
90,
70,
30,
5,
52,
33,
26,
8,
46,
2,
216,
180,
85,
89,
39,
592,
35,
99,
63,
23,
77,
20,
27,
4,
7,
72,
79,
485,
574,
155,
728,
20,
839,
7,
6,
15,
103,
69,
2268,
82,
70,
93,
58,
60,
7,
45,
112,
35,
2099,
2143,
1064,
663,
489,
233,
36,
42,
14,
10,
251,
55,
4418,
0,
415,
2,
26,
34,
63,
62,
2,
9,
41];



var sleep = function(ms) {
    return new Promise( (resolve, reject) => {
       setTimeout( () => {
           resolve();
       }, ms);
    })
}

const outfile = "/home/pptruser/ocr/data/out_excel.ai.csv"

async function getFinalUrls(purls, plens) {

    let finalurls = [];
    let idx = 0;
    for (let purl of purls) {

         let nums = plens[idx];
         console.log('idex=, nums=', idx, nums);
         let pages = 0;

         if (nums <= 10 ) {
            pages = 1
         }
         else if (nums % 10 == 0) {
               pages = Number.parseInt(nums / 10);
          }else {
               pages = Number.parseInt(nums / 10 ) + 1;
          }

          if (pages == 1 ) {
              console.log('i=======  pages=======', idx, pages);
              let tmpurl = purl;
              finalurls.push(tmpurl);
          } else if ( pages > 1) {
            console.log('i=======  pages=======', idx, pages);
            for( let i = 1; i <= pages; i++) {
                  let tmpurl = purl + '?p=' + i.toString();
                  console.log('now will push page url ===============================', tmpurl);
                  finalurls.push(tmpurl);
            }
          }

          idx ++;

    }

    //console.log('final url in function arrays =', finalurls);
    return finalurls;
}


async function getProxyIps() {
      var result = { proxyip: {}, found: false };

    try {
        const url = 'http://' + '10.8.15.9' + ':9999/api/v1/getip/1';
        let response = await fetch.get(url);
	let res = response.json();
	console.log('got proxy response json', res);
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


    } catch (e) {
        console.log('async fetch in node js proxy ip err.' + e);
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
          pt.pkg = row.querySelector(' td.wbk.span-align.promin').innerText.trim().replace(/\r\n|\n/g, "");

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
	   let pns = [];

	   //console.log("all finished csv:", pns);
	   console.log("xxxxxoooo kkk fffk page numbers len: ", pns.length);


           try {
		   pns = await getFinalUrls(purls, plens);

		   console.log('final url outside xxx lens=', pns, pns.length);
		   if (pns.length <= 0) {
		       console.log('page nums <= 0');
		       return
		   }

           } catch (e ) {
               console.log('get urls error', e);
           }
          
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
	      console.log('Exception: ge proxy err', e);
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

          console.log('pupetter.launch');
	  const browser = await puppeteer.launch(
		args
	  );

          console.log('pupetter.launch stp 1');
	  const page = await browser.newPage();
          console.log('pupetter.launch stp 2');

	  await page.setViewport({
	      width: 1920,
	      height: 1080
	  });

          console.log('pupetter.launch stp 3');
         let writer = {};
	  //delete old outfile
         //try {
          //await remove(outfile);
          //} catch( e) {}



         try {
          
           //writer = csvWriter({ headers: ["cat","pt","attr","pkg"]});
      
           writer = csvWriter({ sendHeaders: false});
           //writer = csvWriter();
           console.log('pupetter.launch... cswrit 1');

	    writer.pipe(fs.createWriteStream(outfile, {flags: 'a'})); 
          } catch (e) {
           console.log('pupetter.launch... cswrit exception catch ');
	    console.log(e);
          }

          
           console.log('pupetter.launch... 2');
	   // await  只能使用源生语法 var v of values
	   let i = 1;
	   for (pn of pns) {
             try {
		       let url =  pn;

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
