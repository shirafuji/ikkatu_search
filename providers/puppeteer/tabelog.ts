import * as TabelogEngine from './../../engines/tabelog'
var puppeteer = require('puppeteer')


export class TabelogClient implements TabelogEngine.ITabelogClient {
    search (req: TabelogEngine.ITabelogRequest) :void {
        (async () => {
            var browser = await puppeteer.launch({headless: false});
            var page = await browser.newPage();
            await page.goto("https://github.com/puppeteer/puppeteer");
            await page.waitFor(2000);
            await page.close();
            await browser.close();
            req.res.end(JSON.stringify({
                result: "resp.result"
            }))
        })();
    }
    makeITabelogClient () :TabelogEngine.ITabelogClient {
        return this;
    }
}
