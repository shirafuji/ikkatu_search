import Express from 'express'
import * as IkkyuEngine from './../engines/ikkyu'
import {Error} from './../domain/error'

export class IkkyuHandler {
    ikkyu: IkkyuEngine.Ikkyu
    constructor (ikkyu: IkkyuEngine.Ikkyu) {
        this.ikkyu = ikkyu
    }

    search (req: Express.Request, res: Express.Response) {
        this.ikkyu.search(req, res, this.callback)
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