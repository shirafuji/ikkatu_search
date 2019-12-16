import * as YahooEngine from './../../engines/yahoo'
var puppeteer = require('puppeteer')
require('events').EventEmitter.defaultMaxListeners = 15;


export class YahooClient implements YahooEngine.IYahooClient {
    search (req: YahooEngine.IYahooRequest) :void {
        (async () => {
            try {
                var browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                var page = await browser.newPage();
                await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36')
                await page.goto("https://reservation.yahoo.co.jp/restaurant/");
                await page.type('input#area_input', req.area)
                await page.type('input#keyword', req.genre)
                await page.click('input.search__button')
                await page.waitForSelector('form.lsSort select', {timeout:4000})
                var isSelected = await page.evaluate((selector: any) => {
                    var list = document.querySelectorAll(selector)
                    var isSelected = false
                    for (var i = 0; i < list.length-1; i++) {
                        var text = list[i].innerText
                        if (text == "話題度順") {
                            if (list[i].getAttribute('selected') == 'selected') {
                                isSelected = true
                            }
                        }
                    }
                    return isSelected
                },'form.lsSort select option')
                if (!isSelected) {
                    var value = await page.evaluate((selector: any) => {
                        var list = document.querySelectorAll(selector)
                        for (var i = 0; i < list.length-1; i++) {
                            var text = list[i].innerText
                            if (text == "話題度順") {
                                return list[i].getAttribute('value')
                            }
                        }
                        return
                    },'form.lsSort select option')
                    await page.select('form.lsSort select', value)
                }
                await page.waitForSelector('div.LSajWrp')
                var rst_info_array = []
                var rsts = await page.$$("div.LSajWrp ul li")
                for (var i = 0; i < rsts.length; i++) {
                    var name = await page.evaluate((selector: any) => {
                        var name = document.querySelector(selector)
                        if (name) {
                            return name.innerText;
                        } else {
                            return
                        }
                    }, "div.LSajWrp ul > li:nth-child(" + (i+1) + ") div.hd a")
                    var url = await page.evaluate((selector: any) => {
                        var url = document.querySelector(selector)
                        if (url) {
                            return url.getAttribute('href');
                        } else {
                            return
                        }
                    }, "div.LSajWrp ul > li:nth-child(" + (i+1) + ") div.hd a")
                    var rating = await page.evaluate((selector: any) => {
                        var rating = document.querySelector(selector)
                        if (rating) {
                            return rating.innerText;
                        } else {
                            return
                        }
                    }, "div.LSajWrp ul > li:nth-child(" + (i+1) + ") div.bd div.data div.wwd")
                    var dayBudget = await page.evaluate((selector: any) => {
                        var dayBudget = document.querySelector(selector)
                        if (dayBudget) {
                            return dayBudget.innerText;
                        } else {
                            return
                        }
                    }, "div.LSajWrp ul > li:nth-child(" + (i+1) + ") div.bd div.data p.priceDay")
                    var nightBudget = await page.evaluate((selector: any) => {
                        var nightBudget = document.querySelector(selector)
                        if (nightBudget) {
                            return nightBudget.innerText;
                        } else {
                            return
                        }
                    }, "div.LSajWrp ul > li:nth-child(" + (i+1) + ") div.bd div.data p.priceNight")
                    var budget
                    if (dayBudget) {
                        if (nightBudget) {
                            budget = dayBudget + " , " + nightBudget
                        } else {
                            budget = dayBudget
                        }
                    } else {
                        budget = nightBudget
                    }
                    var info = await page.evaluate((selector: any) => {
                        var info = document.querySelector(selector)
                        if (info) {
                            return info.innerText;
                        } else {
                            return
                        }
                    }, "div.LSajWrp ul > li:nth-child(" + (i+1) + ") div.bd div.data p.access")
                    if (info) {
                        info = info + '\n' + await page.evaluate((selector: any) => {
                            var info = document.querySelector(selector)
                            if (info) {
                                return info.innerText;
                            } else {
                                return
                            }
                        }, "div.LSajWrp ul > li:nth-child(" + (i+1) + ") div.hd p.genre")
                    }
                    if (name) {
                        rst_info_array.push({
                            name: name,
                            url: url,
                            rating: rating,
                            budget: budget,
                            info: info,
                        })
                    }
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
    makeIYahooClient () :YahooEngine.IYahooClient {
        return this;
    }
}
