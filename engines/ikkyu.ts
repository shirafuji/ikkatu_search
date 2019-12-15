import Express from 'express'
import {Error} from './../domain/error'

export interface IIkkyuClient {
    search(req: IIkkyuRequest) :void
}

export interface IIkkyuRequest {
    area: String
    genre: String
    res: Express.Response
    callback: (res: Express.Response, result: any, err: Error|null) => void
}

export class Ikkyu {
    ikkyuClient: IIkkyuClient

    constructor (ikkyuClient: IIkkyuClient) {
        this.ikkyuClient = ikkyuClient
    }
    search (req: Express.Request, res: Express.Response, callback: (res: Express.Response, result: any, err: Error|null) => void) {
        this.ikkyuClient.search({area: req.query.area, genre: req.query.genre, res: res, callback: callback})
    }
}