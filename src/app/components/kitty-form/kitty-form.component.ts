import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IKitty } from '../../models/kitty';
import { GeneticsService } from '../../services/genetics.service';
import { ITrait } from '../../models/trait';
import { IGenes } from '../../models/genes';

@Component({
  selector: 'app-kitty-form',
  templateUrl: './kitty-form.component.html',
  styleUrls: ['./kitty-form.component.scss'],
  providers: [GeneticsService]
})
export class KittyFormComponent implements OnInit {

  traitTypes = [];
  kitty: IKitty;
  traitMap: any;
  genes: IGenes;
  traits;

  constructor(
    private _genetics: GeneticsService,
    public dialogRef: MatDialogRef<KittyFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.kitty = data.kitty;
    this.traitMap = data.traitMap;
  }

  ngOnInit() {
    this.genes = this._genetics.readGenes(this.kitty);
    this.traitTypes = this._genetics.getTraitTypes();
    this.traits = {};
    for (let i = 0; i < this.traitTypes.length; i++) {
      const type = this.traitTypes[i].Name;
      this.traits[type] = this.getTraits(type);
    }
  }

  getTraits(type): ITrait[] {
    const res: ITrait[] = [];
    const positions = ['D', 'R1', 'R2', 'R3'];
    const traits = this.genes[type];
    for (let i = 0; i < 4; i++) {
      const traitId = traits[i];
      let trait: ITrait = this.traitMap[type.toLowerCase()][traitId];
      if (!trait) {
        trait = {
          Name: `unknown(${traitId})`,
          ID: traitId,
          Location: type,
          TraitTypeID: undefined
        };
      }
      trait['Position'] = positions[i];
      trait['Color'] = trait.Name === 'unknown' ? 'Primary' : 'Basic';
      res.push(trait);
    }
    return res;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
