import Express from 'express'
import {Error} from './../domain/error'

export interface ITabelogClient {
    search(req: ITabelogRequest) :void
}

export interface ITabelogRequest {
    area: String
    genre: String
    res: Express.Response
    callback: (res: Express.Response, result: any, err: Error|null) => void
}

export class Tabelog {
    tabelogClient: ITabelogClient

    constructor (tabelogClient: ITabelogClient) {
        this.tabelogClient = tabelogClient
    }
    search (req: Express.Request, res: Express.Response, callback: (res: Express.Response, result: any, err: Error|null) => void) {
        this.tabelogClient.search({area: req.query.area, genre: req.query.genre, res: res, callback: callback})
    }
}