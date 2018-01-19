//global.Promise = require('bluebird');
const puppeteer = require('puppeteer');
const csv = require('csv-parse');
const csvWriter = require('csv-write-stream')
const fs  = require('fs');
const fse  = require('fs-extra');
let fetch = require('node-fetch');

const pageurl = "http://www.excelchips.cn/products/new-arrival.html?p=";

const purls = [
'http://www.excelchips.cn/manufacturers/microchip/8bit-microcontrollers.html',
'http://www.excelchips.cn/manufacturers/microchip/16bit-microcontrollers.html',
'http://www.excelchips.cn/manufacturers/microchip/32bit-pic-microcontrollers.html',
'http://www.excelchips.cn/manufacturers/microchip/application-specific-eeproms.html',
'http://www.excelchips.cn/manufacturers/microchip/arcnet-circlink-controllers.html',
'http://www.excelchips.cn/manufacturers/microchip/binary-and-bcd-a-d-converters.html',
'http://www.excelchips.cn/manufacturers/microchip/bluetooth-modules.html',
'http://www.excelchips.cn/manufacturers/microchip/brushless-dc-fan.html',
'http://www.excelchips.cn/manufacturers/microchip/clock.html',
'http://www.excelchips.cn/manufacturers/microchip/comparators.html',
'http://www.excelchips.cn/manufacturers/microchip/controller-area-network-can.html',
'http://www.excelchips.cn/manufacturers/microchip/cpu-system-supervisors.html',
'http://www.excelchips.cn/manufacturers/microchip/current-and-power-measurement-ics.html',
'http://www.excelchips.cn/manufacturers/microchip/d-a-converters.html',
'http://www.excelchips.cn/manufacturers/microchip/delta-sigma-a-d-converters.html',
'http://www.excelchips.cn/manufacturers/microchip/digital-potentiometers.html',
'http://www.excelchips.cn/manufacturers/microchip/display-a-d-converters.html',
'http://www.excelchips.cn/manufacturers/microchip/dual-slope-a-d-converters.html',
'http://www.excelchips.cn/manufacturers/microchip/energy-measurement.html',
'http://www.excelchips.cn/manufacturers/microchip/ethernet-controllers.html',
'http://www.excelchips.cn/manufacturers/microchip/ethernet-phys.html',
'http://www.excelchips.cn/manufacturers/microchip/ethernet-switches.html',
'http://www.excelchips.cn/manufacturers/microchip/equalizers.html',
'http://www.excelchips.cn/manufacturers/microchip/hd-3g-sdi.html',
'http://www.excelchips.cn/manufacturers/microchip/infrared.html',
'http://www.excelchips.cn/manufacturers/microchip/instrumentation-amplifiers.html',
'http://www.excelchips.cn/manufacturers/microchip/keeloq-decoder.html',
'http://www.excelchips.cn/manufacturers/microchip/keeloq-encoder.html',
'http://www.excelchips.cn/manufacturers/microchip/keeloq-transcoder.html',
'http://www.excelchips.cn/manufacturers/microchip/lcd-drivers.html',
'http://www.excelchips.cn/manufacturers/microchip/lin-transceiver.html',
'http://www.excelchips.cn/manufacturers/microchip/linear-regulators.html',
'http://www.excelchips.cn/manufacturers/microchip/logic-gate.html',
'http://www.excelchips.cn/manufacturers/microchip/microwire-serial-eeprom-family.html',
'http://www.excelchips.cn/manufacturers/microchip/op-amps.html',
'http://www.excelchips.cn/manufacturers/microchip/oscillator.html',
'http://www.excelchips.cn/manufacturers/microchip/passive-keyless-entry.html',
'http://www.excelchips.cn/manufacturers/microchip/pc-serial-eeprom-family.html',
'http://www.excelchips.cn/manufacturers/microchip/piezoelectric-horn-drivers.html',
'http://www.excelchips.cn/manufacturers/microchip/power-mosfet-drivers.html',
'http://www.excelchips.cn/manufacturers/microchip/programmable-gain-amplifiers.html',
'http://www.excelchips.cn/manufacturers/microchip/rfpic-ics-mcus-with-transmitters.html',
'http://www.excelchips.cn/manufacturers/microchip/rf-receivers-stand-alone.html',
'http://www.excelchips.cn/manufacturers/microchip/rf-transceivers.html',
'http://www.excelchips.cn/manufacturers/microchip/rtcc.html',
'http://www.excelchips.cn/manufacturers/microchip/selectable-gain-amplifiers.html',
'http://www.excelchips.cn/manufacturers/microchip/sensor-conditioning-ics.html',
'http://www.excelchips.cn/manufacturers/microchip/sensor-hubs.html',
'http://www.excelchips.cn/manufacturers/microchip/serial-peripherals.html',
'http://www.excelchips.cn/manufacturers/microchip/spi-serial-eeprom-family.html',
'http://www.excelchips.cn/manufacturers/microchip/mchp-sst-flash-firmware-lpc-flash.html',
'http://www.excelchips.cn/manufacturers/microchip/mchp-sst-flash-parallel-flash.html',
'http://www.excelchips.cn/manufacturers/microchip/sst-flash-serial-flash.html',
'http://www.excelchips.cn/manufacturers/microchip/stepper-and-brushed-dc-motor-drivers.html',
'http://www.excelchips.cn/manufacturers/microchip/sub-systems.html',
'http://www.excelchips.cn/manufacturers/microchip/successive-approximation-register-sar-a-d-converters.html',
'http://www.excelchips.cn/manufacturers/microchip/super-i-o.html',
'http://www.excelchips.cn/manufacturers/microchip/switching-regulators.html',
'http://www.excelchips.cn/manufacturers/microchip/temperature-sensors.html',
'http://www.excelchips.cn/manufacturers/microchip/three-phase-motor-drivers.html',
'http://www.excelchips.cn/manufacturers/microchip/touch-and-input-sensing.html',
'http://www.excelchips.cn/manufacturers/microchip/transceivers.html',
'http://www.excelchips.cn/manufacturers/microchip/ultrasonic-products.html',
'http://www.excelchips.cn/manufacturers/microchip/uni-o-serial-eerom-family.html',
'http://www.excelchips.cn/manufacturers/microchip/usb-bridges.html',
'http://www.excelchips.cn/manufacturers/microchip/usb-hubs.html',
'http://www.excelchips.cn/manufacturers/microchip/usb-graphics.html',
'http://www.excelchips.cn/manufacturers/microchip/usb-port-power-cntlr.html',
'http://www.excelchips.cn/manufacturers/microchip/usb-security.html',
'http://www.excelchips.cn/manufacturers/microchip/usb-switches.html',
'http://www.excelchips.cn/manufacturers/microchip/usb-to-ethernet.html',
'http://www.excelchips.cn/manufacturers/microchip/usb-transceivers.html',
'http://www.excelchips.cn/manufacturers/microchip/others.html',
'http://www.excelchips.cn/manufacturers/microchip/wi-fi-modules.html',
'http://www.excelchips.cn/manufacturers/microchip/microprocessor.html',
'http://www.excelchips.cn/manufacturers/microchip/memory.html'];

const plens = [
6831,
3264,
2628,
317,
15,
11,
6,
159,
123,
41,
100,
396,
87,
228,
140,
987,
46,
21,
79,
27,
261,
765,
1,
0,
26,
27,
17,
67,
10,
6,
99,
2749,
685,
689,
831,
1452,
36,
1075,
102,
548,
31,
12,
51,
12,
104,
19,
2,
5,
58,
611,
17,
354,
195,
4,
5,
96,
63,
1045,
550,
37,
91,
11,
249,
176,
53,
122,
4,
2240,
13,
5,
45,
50,
0,
1,
96,
208];



var sleep = function(ms) {
    return new Promise( (resolve, reject) => {
       setTimeout( () => {
           resolve();
       }, ms);
    })
}

const outfile = "/home/pptruser/ocr/data/out_excel.microchip.csv"

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


           //for test nums
          
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
