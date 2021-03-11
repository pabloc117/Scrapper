const puppeteer = require('puppeteer'); 
const preparePageForTests = async (page) => {

    // Pass the User-Agent Test.
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
    }
let amazon = async(url) => {
    try { 
        const browser = await puppeteer.launch({ 
            // ignore extensions on Windows 10
            ignoreDefaultArgs: ['--disable-extensions'],
            //devtools: true,
            // headless true this means chrome page is not opened but you can do false
            headless: false,
            defaultViewport: null
        })
        // create new page 
        const page = await browser.newPage() 
        await preparePageForTests(page);
        await page.goto(url);
        await page.screenshot({path: 'headless-test-result.png'});
        console.log(url);
        console.log('Espera 5');
        await page.waitForSelector('.s-main-slot');
        console.log('Cargo la pagina.');
        // evaluate the page
        const products = await page.evaluate(() => {
            // gets all items with span tag
            let items = Array.from(document.querySelectorAll('div[class="sg-col-4-of-12 s-result-item s-asin sg-col-4-of-16 AdHolder sg-col sg-col-4-of-20"]'));
            return items.map(item => {
                // textContent does not write null gives error because of that if else is needed 
                // if item has price return 
                if (item.querySelector(".a-price-whole")){
                    return {
                        name: item.querySelector('h2').innerText,
                        price: item.querySelector('.a-link-normal.a-text-normal > span[class="a-price"] > span[class="a-offscreen"]').textContent.replace(/[Count,/]/g, m => (m === '' ? '' : '')),
                        url: item.querySelector('.a-link-normal.a-text-normal').href,
                        img: item.querySelector('.s-image').src,
                        rating: item.querySelector(elementArray[text].querySelector('div > span > div > div a > i ')?elementArray[text].querySelector('div > span > div > div a > i').innerText:"")
                    }; 
                } else { 
                    // without price
                    return {
                        name: item.querySelector('h2').innerText,
                        price: 'price is not given',
                        url: item.querySelector('.a-link-normal.a-text-normal').href,
                        img: item.querySelector('.s-image').src,
                        //rating : item.querySelector('.a-section a-spacing-none a-spacing-top-micro').innerText
                    }
                }
            })
        });   
        // close browser
        await browser.close()
        // send all scraping data to client
        return products
    } catch (error) {
        return (null)
    }
} 
 
module.exports = amazon