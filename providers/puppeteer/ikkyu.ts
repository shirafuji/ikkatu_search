import * as IkkyuEngine from './../../engines/ikkyu'
var puppeteer = require('puppeteer')
require('events').EventEmitter.defaultMaxListeners = 15;

export class IkkyuClient implements IkkyuEngine.IIkkyuClient {
    search (req: IkkyuEngine.IIkkyuRequest) :void {
        (async () => {
            try {
                var browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                var page = await browser.newPage();
                await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36')
                await page.goto("https://restaurant.ikyu.com/");
                await page.click('span.des_srchTitle[objectid="search_2_rstname"]')
                await page.waitFor(50)
                await page.type('input#searchbox-text', req.area + " ")
                await page.type('input#searchbox-text', req.genre)
                await page.click('button[type="button"]')
                var rank_link_selector = 'a[objectid="sort__rvw"]'
                await page.waitForSelector(rank_link_selector, {timeout: 5000})
                var rank_link = await page.$(rank_link_selector)
                if (rank_link == null) {
                    await page.close()
                    await browser.close()
                    req.callback(req.res, null, null)
                }
                await page.click(rank_link_selector)
                await page.waitForSelector('div#des_main_content_wrap')
                var rst_list = await page.$$('div#des_main_content_wrap > div.des_res_wrap')
                var rst_info_array = []
                for (var i = 0; i < rst_list.length; i++) {
                    if (i == 50) {
                        break;
                    }
                    var name = await page.evaluate ((selector: any) => {
                        var name = document.querySelector(selector)
                        if (name) {
                            return name.innerText
                        } else {
                            return name
                        }
                    }, 'div#des_main_content_wrap > div.des_res_wrap:nth-child(' + (i+2) + ') span.res_name')
                    var url = await page.evaluate ((selector: any) => {
                        var url = document.querySelector(selector)
                        if (url) {
                            return url.getAttribute('href')
                        } else {
                            return url
                        }
                    }, 'div#des_main_content_wrap > div.des_res_wrap:nth-child(' + (i+2) + ') div.top_item_text a')
                    var rating = await page.evaluate ((selector: any) => {
                        var rating = document.querySelector(selector)
                        if (rating) {
                            return rating.innerText
                        } else {
                            return rating
                        }
                    }, 'div#des_main_content_wrap > div.des_res_wrap:nth-child(' + (i+2) + ') span.rate_nmb')
                    var budget = await page.evaluate ((selector: any) => {
                        var budget = document.querySelector(selector)
                        if (budget) {
                            return budget.innerText
                        } else {
                            return budget
                        }
                    }, 'div#des_main_content_wrap > div.des_res_wrap:nth-child(' + (i+2) + ') .des_budgetBox')
                    var info = await page.evaluate ((selector: any) => {
                        var info = document.querySelector(selector)
                        if (info) {
                            return info.innerText
                        } else {
                            return info
                        }
                    }, 'div#des_main_content_wrap > div.des_res_wrap:nth-child(' + (i+2) + ') .res_area_name')
                    rst_info_array.push({
                        name: name,
                        url: "https://restaurant.ikyu.com"+url,
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
            }　finally {
                //例外が発生しても発生しなくてもここは必ず通る
                await browser.close();
              }
        })();
    }
    makeIIkkyuClient () :IkkyuEngine.IIkkyuClient {
        return this;
    }
}
