import * as TabelogEngine from './../../engines/tabelog'
var puppeteer = require('puppeteer')


export class TabelogClient implements TabelogEngine.ITabelogClient {
    search (req: TabelogEngine.ITabelogRequest) :void {
        (async () => {
            try {
                var browser = await puppeteer.launch({headless: false});
                var page = await browser.newPage();
                await page.goto("https://tabelog.com/rstLst/");
                await page.type('input#sa', req.area)
                await page.type('input#sk', req.genre)
                await page.click('button#js-global-search-btn')
                var rank_selector = '.navi-rstlst__label.navi-rstlst__label--rank'
                await page.waitForSelector('a'+rank_selector)
                await page.click('a'+rank_selector)
                await page.waitForSelector('strong'+rank_selector)
                await page.waitForSelector("div.list-rst__wrap")
                var rst_info_array = []
                var rsts = await page.$$("span.list-rst__rating-val")
                for (var i = 0; i < rsts.length; i++) {
                    if (i == 11) {
                        break
                    }
                    if (i == 5) {
                        continue
                    }
                    var name  = await page.evaluate((selector: any) => {
                        var name = document.querySelector(selector).innerText;
                        return name
                    }, "ul.rstlist-info > li:nth-child(" + (i+1) + ") a.list-rst__rst-name-target")
                    var url  = await page.evaluate((selector: any) => {
                        var url = document.querySelector(selector).getAttribute('href');
                        return url
                    }, "ul.rstlist-info > li:nth-child(" + (i+1) + ") a.list-rst__rst-name-target")
                    var rating  = await page.evaluate((selector: any) => {
                        var rating = document.querySelector(selector).innerText;
                        return rating
                    }, "ul.rstlist-info > li:nth-child(" + (i+1) + ") span.list-rst__rating-val")
                    var budget  = await page.evaluate((selector: any) => {
                        var budget = document.querySelector(selector).innerText;
                        return budget
                    }, "ul.rstlist-info > li:nth-child(" + (i+1) + ") .list-rst__budget")
                    rst_info_array.push({
                        name: name,
                        url: url,
                        rating: rating,
                        budget: budget,
                    })
                }
                await page.close()
                await browser.close();
                req.callback(
                    req.res,
                    rst_info_array,
                    null,
                )
            } catch(e) {
                req.callback(
                    req.res,
                    null,
                    {
                        Code: e.code,
                        Message: e.message,
                    })
            }
        })();
    }
    makeITabelogClient () :TabelogEngine.ITabelogClient {
        return this;
    }
}
