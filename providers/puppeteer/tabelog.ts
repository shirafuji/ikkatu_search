import * as TabelogEngine from './../../engines/tabelog'
var puppeteer = require('puppeteer')
require('events').EventEmitter.defaultMaxListeners = 15;


export class TabelogClient implements TabelogEngine.ITabelogClient {
    search (req: TabelogEngine.ITabelogRequest) :void {
        (async () => {
            try {
                var browser = await puppeteer.launch();
                var page = await browser.newPage();
                await page.goto("https://tabelog.com/rstLst/");
                await page.type('input#sa', req.area)
                await page.type('input#sk', req.genre)
                await page.click('button#js-global-search-btn')
                var rank_selector = '.navi-rstlst__label.navi-rstlst__label--rank'
                await page.waitForSelector('a'+rank_selector, {timeout: 5000})
                var rank_link = await page.$('a'+rank_selector)
                if (rank_link == null) {
                    await page.close()
                    await browser.close()
                    req.callback(req.res, null, null)
                }
                await page.click('a'+rank_selector)
                await page.waitForSelector('strong'+rank_selector)
                await page.waitForSelector("div.list-rst__wrap")
                var rst_info_array = []
                var rsts = await page.$$("span.list-rst__rating-val")
                for (var i = 0; i < rsts.length; i++) {
                    if (i == 51) {
                        break
                    }
                    if (i == 5) {
                        continue
                    }
                    var name = await page.evaluate((selector: any) => {
                        var name = document.querySelector(selector)
                        if (name) {
                            return name.innerText;
                        } else {
                            return
                        }
                    }, "ul.rstlist-info > li:nth-child(" + (i+1) + ") a.list-rst__rst-name-target")
                    var url = await page.evaluate((selector: any) => {
                        var url = document.querySelector(selector)
                        if (url) {
                            return url.getAttribute('href');
                        } else {
                            return
                        }
                    }, "ul.rstlist-info > li:nth-child(" + (i+1) + ") a.list-rst__rst-name-target")
                    var rating = await page.evaluate((selector: any) => {
                        var rating = document.querySelector(selector)
                        if (rating) {
                            return rating.innerText;
                        } else {
                            return
                        }
                    }, "ul.rstlist-info > li:nth-child(" + (i+1) + ") span.list-rst__rating-val")
                    var budget = await page.evaluate((selector: any) => {
                        var budget = document.querySelector(selector)
                        if (budget) {
                            return budget.innerText;
                        } else {
                            return
                        }
                    }, "ul.rstlist-info > li:nth-child(" + (i+1) + ") .list-rst__budget")
                    var info = await page.evaluate((selector: any) => {
                        var info = document.querySelector(selector)
                        if (info) {
                            return info.innerText;
                        } else {
                            return
                        }
                    }, "ul.rstlist-info > li:nth-child(" + (i+1) + ") span.list-rst__area-genre")
                    rst_info_array.push({
                        name: name,
                        url: url,
                        rating: rating,
                        budget: budget,
                        info: info,
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
                        Code: 500,
                        Message: e.message,
                    })
            } finally {
                //例外が発生しても発生しなくてもここは必ず通る
                await browser.close();
              }
        })();
    }
    makeITabelogClient () :TabelogEngine.ITabelogClient {
        return this;
    }
}
