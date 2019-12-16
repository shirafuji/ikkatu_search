import {TabelogHandler} from './adapters/tabelog'
import * as TabelogEngine from './engines/tabelog'
import {TabelogClient} from './providers/puppeteer/tabelog'
import {IkkyuHandler} from './adapters/ikkyu'
import * as IkkyuEngine from './engines/ikkyu'
import {IkkyuClient} from './providers/puppeteer/ikkyu'
import {YahooHandler} from './adapters/yahoo'
import * as YahooEngine from './engines/yahoo'
import {YahooClient} from './providers/puppeteer/yahoo'
import Express from 'express'

var express = require("express");
var app = express();

var tabelogClient = new TabelogClient()
var tabelog = new TabelogEngine.Tabelog(tabelogClient.makeITabelogClient())
var tabelogHandler = new TabelogHandler(tabelog)

var ikkyuClient = new IkkyuClient()
var ikkyu = new IkkyuEngine.Ikkyu(ikkyuClient.makeIIkkyuClient())
var ikkyuHandler = new IkkyuHandler(ikkyu)

var yahooClient = new YahooClient()
var yahoo = new YahooEngine.Yahoo(yahooClient.makeIYahooClient())
var yahooHandler = new YahooHandler(yahoo)

app.get('/tabelog', (req: Express.Request, res: Express.Response) => {
    tabelogHandler.search(req, res)
});
app.get('/ikkyu', (req: Express.Request, res: Express.Response) => {
    ikkyuHandler.search(req, res)
});
app.get('/yahoo', (req: Express.Request, res: Express.Response) => {
    yahooHandler.search(req, res)
});
app.listen(3000, () => {
    console.log("the server listening on port 3000")
});