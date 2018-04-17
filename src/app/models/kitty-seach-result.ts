import { IKitty } from './kitty';

export interface IKittySearchResult {
    kitties: IKitty[];
    total: number;
}
