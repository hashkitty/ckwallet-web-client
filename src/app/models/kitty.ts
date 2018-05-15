import { BN } from 'bn.js';

export interface IKitty {
    id: number;
    imageUrl: string;
    generation: number;
    matronId: number;
    patronId: number;
    birthBlock: number;
    childrenCount: number;
    price: number;
    genes: BN;

}
