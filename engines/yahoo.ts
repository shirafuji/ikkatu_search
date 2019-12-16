import Express from 'express'
import {Error} from './../domain/error'

export interface IYahooClient {
    search(req: IYahooRequest) :void
}

export interface IYahooRequest {
    area: String
    genre: String
    res: Express.Response
    callback: (res: Express.Response, result: any, err: Error|null) => void
}

export class Yahoo {
    yahooClient: IYahooClient

    constructor (yahooClient: IYahooClient) {
        this.yahooClient = yahooClient
    }
    search (req: Express.Request, res: Express.Response, callback: (res: Express.Response, result: any, err: Error|null) => void) {
        this.yahooClient.search({area: req.query.area, genre: req.query.genre, res: res, callback: callback})
    }
}