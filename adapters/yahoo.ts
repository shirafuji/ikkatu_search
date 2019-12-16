import Express from 'express'
import * as YahooEngine from './../engines/yahoo'
import {Error} from './../domain/error'

export class YahooHandler {
    yahoo: YahooEngine.Yahoo
    constructor (yahoo: YahooEngine.Yahoo) {
        this.yahoo = yahoo
    }

    search (req: Express.Request, res: Express.Response) {
        this.yahoo.search(req, res, this.callback)
    }

    callback (res: Express.Response, result: any, err: Error|null) {
        if (err) {
            res.writeHead(err.Code, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({
                message: err.Message,
            }))
        }  else  {
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({
                result: result
            }))
        }
    }
}