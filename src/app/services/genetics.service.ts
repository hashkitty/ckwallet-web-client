import { Injectable } from '@angular/core';
import { IKitty } from '../models/kitty';
import { BN } from 'bn.js';
import { IGenes } from '../models/genes';

@Injectable()
export class GeneticsService {
    constructor() {
    }

    public readGenes(kitty): IGenes {
        const res = this.newGenes();
        const split = [];
        const genes = new BN(kitty.genes.toString(16), 16);
        for (let i = 0; i < 48; i++) {
            const gene = genes.shrn(i * 5).mod(new BN(32)).toNumber();
            split.push(gene);
        }
        const types = this.getTraitTypes();
        for (let i = 0; i < 12; i += 1) {
            res[types[i]][0] = split[i * 4];
            res[types[i]][1] = split[i * 4 + 1];
            res[types[i]][2] = split[i * 4 + 2];
            res[types[i]][3] = split[i * 4 + 3];
        }
        return res;
    }

    getTraitTypes() {
        return [
            'body',
            'pattern',
            'eyeColor',
            'eyeType',
            'bodyColor',
            'patternColor',
            'accentColor',
            'wild',
            'mouth',
            'environment',
            'secret',
            'unknown',
        ];
    }

    newGenes(): IGenes {
        const res = {
            body: [],
            pattern: [],
            eyeColor: [],
            eyeType: [],
            bodyColor: [],
            patternColor: [],
            accentColor: [],
            wild: [],
            mouth: [],
            environment: [],
            secret: [],
            unknown: [],
        };
        return res;
    }
}
