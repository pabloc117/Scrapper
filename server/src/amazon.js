const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const preparePageForTests = async (page) => {

    // Pass the User-Agent Test.
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
}
let amazon = async (url) => {
    try {
        const browser = await puppeteer.launch({
            // ignore extensions on Windows 10
            args: ['--start-maximized'],
            ignoreDefaultArgs: ['--disable-extensions'],
            //devtools: true,//sin devtools abiertas
            // headless true this means chrome page is not opened but you can do false
            headless: false,
            defaultViewport: null, // arregla la vista
            dumpio: true
            //ventana maximizada
        })
        // create new page 
        const page = await browser.newPage();
        page.on('console', consoleObj => console.log(consoleObj.text()));
        await preparePageForTests(page);
        await page.goto(url);
        //await page.screenshot({ path: 'headless-test-result.png' });
        console.log(url);

        /*         const hrefElement = await page.$('.a-declarative');
                await hrefElement.click(); */
        console.log('Cargo la pagina.');
        /* Ciclo para buscar elemento por elemento */
        const items = await page.$$('div[class="sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 AdHolder sg-col sg-col-4-of-20"]');
        /*         console.log(items); */
        for (let i = 0, length = items.length; i < length; i++) {
            const item = await page.evaluateHandle((i) => {
                return document.querySelectorAll('div[class="sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 AdHolder sg-col sg-col-4-of-20"]')[i];
            }, i);
            await delay(3000);
            const data = await item.evaluate(() => {
                const tds = Array.from(document.querySelectorAll('.sg-col-inner'))
                console.log(tds);
                return tds.map(td => td.textContent);
                
            });
            //console.log(data);
            try {
                var Offers = await item.$x("//a[contains(., 'offer')]");
                await Offers[i].click();
                var masOpciones = await item.$x("//a[contains(., 'See more')]");
                await masOpciones[0].click();
                console.log(masOpciones, "SIUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
                await delay(3000);

                var cerrarBarra =  await item.$x("//a[contains(., 'See more')]", { visible: true });
                await cerrarBarra[0].click();

            } catch (error) {
                console.log("The element didn't appear.", error);
            }
            //console.log(elements);

        }

        //console.log(item);
        /*             await item.click();
                    await page.waitForSelector('.');
                    await page.goBack({ waitUntil: 'load' });
                    await page.waitForSelector('div[class="sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 AdHolder sg-col sg-col-4-of-20"]'); */


        const products = await page.evaluate(() => {
            // gets all items with span tag

            let items = Array.from(document.querySelectorAll('div[class="sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 AdHolder sg-col sg-col-4-of-20"]'));

            return items.map(item => {
                // textContent does not write null gives error because of that if else is needed 
                // if item has price return 

                if (item.querySelector(".a-price-whole")) {
                    return {
                        name: item.querySelector('h2').innerText,
                        price: item.querySelector('.a-link-normal.a-text-normal > span[class="a-price"] > span[class="a-offscreen"]').textContent.replace(/[Count,/]/g, m => (m === '' ? '' : '')),
                        url: item.querySelector('.a-link-normal.a-text-normal').href,
                        img: item.querySelector('.s-image').src,
                        rating: item.querySelector('.a-icon-alt').innerText || 'No disponible'
                    };
                } else {
                    // without price
                    return {
                        name: item.querySelector('h2').innerText,
                        price: 'price is not given',
                        url: item.querySelector('.a-link-normal.a-text-normal').href,
                        img: item.querySelector('.s-image').src,
                        rating: item.querySelector('.a-icon-alt').innerText || 'No disponible'
                    }
                }
            })
        });

        return products

    }
    catch (error) {
        return (null)
    }
}
module.exports = amazon
//busca la "X" para cerrar el panel


/* const aElementscerrar = await page.waitForSelector('#aod-close');
await aElementscerrar[0].click(); */

/*         const getThemAll = await page.$$('a-declarative')
        getThemAll.forEach(async link => {
            console.log('Encontro link');
          await page.evaluate(() => link.click())
        });  */

/* var divs = document.getElementsByTagName('div');
for (var i = 0, len = divs.length; i < len; ++i) {
    if (divs[i].innerHTML.indexOf("new offers") !== -1) {
    }
} */
//console.log(divs);
// close browser // cerrar browser
//await browser.close()
// send all scraping data to client

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}