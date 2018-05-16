import { Injectable } from '@angular/core';
import { IKitty } from '../models/kitty';
import { BN } from 'bn.js';
import { IGenes } from '../models/genes';
import { ITraitType } from '../models/traitType';

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
        const types = this.getTraitTypes().map(t => t.Name);
        for (let i = 0; i < 12; i += 1) {
            res[types[i]][0] = split[i * 4];
            res[types[i]][1] = split[i * 4 + 1];
            res[types[i]][2] = split[i * 4 + 2];
            res[types[i]][3] = split[i * 4 + 3];
        }
        return res;
    }

    getTraitTypes(): ITraitType[] {
        return [
            { Name: 'body', Label: 'Body' },
            { Name: 'pattern', Label: 'Pattern' },
            { Name: 'eyeColor', Label: 'Eye color' },
            { Name: 'eyeType', Label: 'Eye type' },
            { Name: 'bodyColor', Label: 'Body color' },
            { Name: 'patternColor', Label: 'Pattern color' },
            { Name: 'accentColor', Label: 'Accent color' },
            { Name: 'wild', Label: 'Wild' },
            { Name: 'mouth', Label: 'Mouth' },
            { Name: 'environment', Label: 'Environment' },
            { Name: 'secret', Label: 'Secret' },
            { Name: 'unknown', Label: 'Unknown' },
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
