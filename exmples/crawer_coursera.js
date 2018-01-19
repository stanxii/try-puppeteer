const puppeteer = require('puppeteer')
const logger = require('./Logger')
// var logger = require('debug-log')('foo');

const LOCAL_SERVER = 'http://localhost:5000'

async function run() {
	logger.time('打开浏览器')
	const browser = await puppeteer.launch()
	logger.time('打开浏览器')

	logger.time('打开页面')
	const page = await browser.newPage()
	page.setViewport({width: 1024, height: 768}); //1290 800
	await page.goto('https://www.coursera.org/browse?languages=en')
	await page.screenshot({
		path: 'screenshots/main-page.png'
	})
	logger.time('打开页面')

	logger.time('加载jQuery')
	// await page.addScriptTag(LOCAL_SERVER + "/jquery.min.js")
	await page.addScriptTag("https://code.jquery.com/jquery-3.2.1.min.js")
	logger.time('加载jQuery')

	logger.time('加载页面')
	await page.waitForSelector(".rc-DomainNav > a", { timeout: 2 * 1000 })
	logger.time('加载页面')

	const content = await page.evaluate(() => {
		const data = []
		$(".rc-DomainNav > a").each((index, element) => {
			const $element = $(element);
			const dataVal = JSON.parse($element.attr('data-click-value'))
			data.push(dataVal)

			console.log('dataVal', dataVal)
		})
		return Promise.resolve(data)
	})
	
	/*{
		namespace: {
			app: 'catalog',
			page: 'root',
			component: 'browse_left_nav',
			action: 'click'
		},
		domainId: 'language-learning',
		schema_type: 'FRONTEND',
		href: '/browse/language-learning'
	}*/
	logger.log("\nResults:")
	content.forEach(({domainId}) => {
		console.log(domainId)
	})

	browser.close()
}

run()
