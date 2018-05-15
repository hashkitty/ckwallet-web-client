import { Injectable } from '@angular/core';
import { IKittySearchResult } from '../models/kitty-seach-result';
import { IKitty } from '../models/kitty';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { ITrait } from '../models/trait';

@Injectable()
export class KittyService {
    private _kittyServiceUrl = environment.kittyServiceUrl;
    constructor(private _http: HttpClient) {
    }

    getSuggestions(): Observable<string[]> {
        return this._http.get<string[]>(`${this._kittyServiceUrl}/suggestions`);
    }

    getKitties(search: string, sort: string, firstId: number): Observable<IKittySearchResult> {
        const url =
            `${this._kittyServiceUrl}?search=${search || ''}&sort=${sort || ''}&firstId=${firstId || ''}`;
        return this._http.get<any>(url)
            .map((value, index) => {
                let kitties = [];
                if (value && value.rows && value.rows.length) {
                    kitties = value.rows.map(this.kittiesFromJson);
                }
                const { total } = value;
                return { kitties, total };
            })
            .catch(err => {
                if (console) {
                    console.log(err);
                }
                return Observable.throw(err);
            });
    }

    kittiesFromJson(json: any): IKitty {
        const kitty = {
            id: json.ID,
            imageUrl: `https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/${json.ID}.svg`,
            generation: json.Generation,
            childrenCount: json.ChildrenCount,
            price: undefined,
            genes: undefined,
            matronId: undefined,
            patronId: undefined,
            birthBlock: undefined,
        };
        if (typeof json.Price !== 'undefined') {
            kitty.price = (json.Price ? Math.round(parseFloat(json.Price) * 10000) / 10000 : 0).toString(10);
        }
        return kitty;
    }

    public getTraits() {
        const url = `${this._kittyServiceUrl}/traits`;
        return this._http.get<ITrait>(url).toPromise();
    }

}
