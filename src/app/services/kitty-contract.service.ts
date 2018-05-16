import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/last';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import { IKitty } from '../models/kitty';
import { Web3Service } from './web3.service';


declare let require;

@Injectable()
export class KittyContractService {
    private _kittyCoreContract;
    private _saleAuctionContract;

    private _addresses = {
        'main': {
            Core: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
            SaleAuction: '0xb1690c08e213a35ed9bab7b318de14420fb57d8c',
        },
        'test': {
            Core: '0x1cd8c56d57492d836866d14a9fe89b01e9ed0568',
            SaleAuction: '0x1cd8c56d57492d836866d14a9fe89b01e9ed0568',
        }
    };

    constructor(private _web3Service: Web3Service) {
        // Use Mist/MetaMask's provider
        this.setNetwork('main');
    }

    public setNetwork(network) {
        const ckCoreAbi = require('../../assets/ckcore-abi.json');
        const saleAuctionAbi = require('../../assets/cksale-abi.json');
        this._kittyCoreContract = this._web3Service.getContract(ckCoreAbi, this._addresses[network].Core);
        this._saleAuctionContract = this._web3Service.getContract(saleAuctionAbi, this._addresses[network].SaleAuction);
    }

    public async getNewGen0(blocksToCheck): Promise<any> {
        const currentBlock = await this._web3Service.getCurrentBlockNumber();
        const from = currentBlock - blocksToCheck;
        return new Promise<IKitty>(((resolve, reject) => {
            this._kittyCoreContract.Birth(
                {},
                {
                    fromBlock: from,
                }).get((error, events) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (events && events.length > 0) {
                            const kitties = events.map(e => this.kittyFromEvent(e))
                                .filter(k => k.matronId === 0)
                                .sort((k1, k2) => k1.birthBlock - k2.birthBlock);
                            const last = kitties.length > 0 ? kitties[kitties.length - 1] : undefined;
                            resolve(last);
                        } else {
                            resolve();
                        }
                    }
                },
            );
        }));
    }

    public observeNewGen0(interval): Observable<IKitty> {
        return Observable.interval(interval)
            .switchMap(() => Observable.fromPromise(this.getNewGen0(200)))
            .distinct(k => k && k.id);
    }

    kittyFromEvent(event: any): IKitty {
        const kitty = {
            id: event.args.kittyId.toNumber(),
            imageUrl: undefined,
            generation: undefined,
            childrenCount: undefined,
            price: undefined,
            genes: event.args.genes,
            matronId: event.args.matronId.toNumber(),
            patronId: event.args.sireId.toNumber(),
            birthBlock: event.blockNumber,
        };
        return kitty;
    }

    public observeBlockNumber(interval): Observable<any> {
        return Observable.interval(interval)
            .switchMap(() => Observable.fromPromise(this._web3Service.getCurrentBlockNumber()))
            .distinct();
    }

    public async buyKitty(id, value, gasPriceGwei) {
        const gasPriceInWei = this._web3Service.toWei(gasPriceGwei, 'gwei');
        const valueInWei = this._web3Service.toWei(value, 'ether');
        return new Promise((resolve, reject) => {
            this._saleAuctionContract.bid(
                id,
                {
                    value: valueInWei,
                    gasPrice: gasPriceInWei,
                    gas: 150000
                },
                (error, tx) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(tx);
                }
            );
        });
    }
}
