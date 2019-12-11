import {TabelogHandler} from './adapters/tabelog'
import * as TabelogEngine from './engines/tabelog'
import {TabelogClient} from './providers/puppeteer/tabelog'
import Express from 'express'

var express = require("express");
var app = express();

var tabelogClient = new TabelogClient()
var tabelog = new TabelogEngine.Tabelog(tabelogClient.makeITabelogClient())
var tabelogHandler = new TabelogHandler(tabelog)

app.get('/tabelog', (req: Express.Request, res: Express.Response) => {
    tabelogHandler.search(req, res)
});
app.listen(3000, () => {
    console.log("the server listening on port 3000")
});