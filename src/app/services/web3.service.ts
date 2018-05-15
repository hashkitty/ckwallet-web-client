import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/switchMap';
import { IKitty } from '../models/kitty';

declare let window: any;
declare let Web3: any;

@Injectable()
export class Web3Service {
    private _web3: any;

    constructor() {
        if (typeof window.web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            this._web3 = new Web3(window.web3.currentProvider);
        }
    }

    public getAccount() {
        return this._web3 ? this._web3.eth.accounts[0] : undefined;
    }

    public getNetwork() {
        return this._web3 ? this._web3.version.network : undefined;
    }

    public getContract(abi, address) {
        return this._web3 ? this._web3.eth.contract(abi).at(address) : undefined;
    }

    public toWei(amount, unit) {
        return this._web3 ? this._web3.toWei(amount, unit) : undefined;
    }

    public getCurrentBlockNumber(): Promise<number> {
        return new Promise((resolve, reject) => {
            if (!this._web3) {
                reject('Network not available');
            } else {
                this._web3.eth.getBlockNumber((error, block) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(block);
                    }
                });
            }
        });
    }
}
