import Express from 'express'
import * as TabelogEngine from './../engines/tabelog'
import {Error} from './../domain/error'

export class TabelogHandler {
    tabelog: TabelogEngine.Tabelog
    constructor (tabelog: TabelogEngine.Tabelog) {
        this.tabelog = tabelog
    }

    search (req: Express.Request, res: Express.Response) {
        this.tabelog.search(req, res, this.callback)
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