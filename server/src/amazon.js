const puppeteer = require('puppeteer');
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
            ignoreDefaultArgs: ['--disable-extensions'],
            //devtools: true,//sin devtools abiertas
            // headless true this means chrome page is not opened but you can do false
            headless: false,
            defaultViewport: null, // arregla la vista
            args: ['--start-maximized'] //ventana maximizada
        })
        // create new page 
        const page = await browser.newPage()
        await preparePageForTests(page);
        await page.goto(url);
        await page.screenshot({ path: 'headless-test-result.png' });
        console.log(url);
        
/*         const hrefElement = await page.$('.a-declarative');
        await hrefElement.click(); */
        console.log('Cargo la pagina.');
        // evaluate the page
        const aElementsoffer = await page.$x("//a[contains(., 'offer')]");
        await aElementsoffer[0].click();
        await page.evaluate(async() => {
            await new Promise(function(resolve) { 
                   setTimeout(resolve, 4000)
            });
        });
        if (masOpciones = await page.waitForSelector('#aod-pinned-offer-show-more-link')) {
            await masOpciones.click();
        }
        await page.evaluate(async() => {
            await new Promise(function(resolve) { 
                   setTimeout(resolve, 4000)
            });
        });
        const cerrarBarra = await page.waitForSelector('#aod-close', { visible: true });
        await cerrarBarra.click();
        
        /* const aElementscerrar = await page.waitForSelector('#aod-close');
        await aElementscerrar[0].click(); */

        console.log(aElementsoffer);
        const products = await page.evaluate(() => {
            // gets all items with span tag
            let items = Array.from(document.querySelectorAll('div[class="sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 AdHolder sg-col sg-col-4-of-20"]'));
            console.log(items);
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
        return products
    } catch (error) {
        return (null)
    }
}

module.exports = amazon