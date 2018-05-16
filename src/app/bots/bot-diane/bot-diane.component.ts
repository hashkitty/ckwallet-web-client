import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatDialog } from '@angular/material';
import { KittyContractService } from '../../services/kitty-contract.service';
import { Web3Service } from '../../services/web3.service';
import { IKitty } from '../../models/kitty';
import { KittyService } from '../../services/kitty.service';
import { GeneticsService } from '../../services/genetics.service';
import { ITrait } from '../../models/trait';
import { KittyFormComponent } from '../../components/kitty-form/kitty-form.component';

@Component({
  selector: 'app-bot-diane',
  templateUrl: './bot-diane.component.html',
  styleUrls: ['./bot-diane.component.scss'],
  providers: [Web3Service, KittyContractService, KittyService, GeneticsService]
})
export class BotDianeComponent implements OnInit, OnDestroy {
  private _knownTraitsCacheKey = 'BotDianeComponentKnownTraits';
  private _traitMap;
  private _subscriptionBlockNumber;
  private _subscriptionKitties;
  public kitties: Array<IKitty> = [];

  public gasPrice = '';
  public bidAmount = '';
  public network;
  public account;
  public currentBlockNumber;
  public dataSource;
  public columns = ['id', 'birthBlock', 'traits', 'actions'];

  constructor(
    private _web3: Web3Service,
    private _kittyContract: KittyContractService,
    private _kittyService: KittyService,
    private _genetics: GeneticsService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog) {
  }

  async windowLoad() {
    return new Promise(resolve => {
      window.addEventListener('load', () => resolve());
    });
  }
  async ngOnInit() {
    // to avoid race conditions with web3 injection timing
    await this.windowLoad();

    this.dataSource = new MatTableDataSource(this.kitties);
    this.network = this.getNetworkName(this._web3.getNetwork());
    if (this.network) {
      this._kittyContract.setNetwork(this.network.toLowerCase());
      this.account = this._web3.getAccount();
      const knownTraits = await this.loadKnowTraits(true);
      this._traitMap = this.initTraitMap(knownTraits);

      this._subscriptionKitties = this._kittyContract.observeNewGen0(1000).subscribe(
        kitty => {
          if (kitty) {
            this.processGen0(kitty);
          }
        },
        error => this.showError(error)
      );

      this._kittyContract.observeBlockNumber(1000).subscribe(
        res => {
          this.currentBlockNumber = res;
        },
        error => this.showError(error)
      );
    } else {
      this.showError('Network not found. Make sure your MetaMask is unlocked.');
    }
  }

  private getNetworkName(index) {
    let res;
    switch (index) {
      case '1':
        res = 'Main';
        break;
      case '3': // Ropsten
        res = 'Test';
        break;
    }
    return res;
  }

  initTraitMap(knownTraits: ITrait[]) {
    const res = {};
    for (let i = 0; i < knownTraits.length; i++) {
      const trait = knownTraits[i];
      const location = trait.Location.replace(' ', '').toLowerCase();
      res[location] = res[location] || {};
      res[location][trait.ID] = trait;
    }
    return res;
  }

  public async loadKnowTraits(updateCache = false): Promise<ITrait[]> {
    let res = null;
    const stored = localStorage[this._knownTraitsCacheKey];
    if (!stored || updateCache) {
      try {
        res = await this._kittyService.getTraits();
        localStorage[this._knownTraitsCacheKey] = JSON.stringify(res);
      } catch (err) {
        this.showError(err);
      }
    }

    if (!res && stored) {
      // fallback to store traits
      res = JSON.parse(stored);
    }
    return res;
  }

  public processGen0(kitty) {
    if (kitty) {
      const status = this.getKittyStatus(kitty);
      kitty.message = status.message;
      if (status.unknownGenes && status.unknownGenes.length > 0) {
        kitty.showBuyLink = true;
      }
      this.kitties.push(kitty);
      this.dataSource.data = this.kitties;
    }
  }

  getUnknownGenes(genes) {
    const res: ITrait[] = [];
    const types = Object.keys(genes);
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      for (let j = 0; j < 4; j++) {
        const gene = genes[type][j];
        if (!this._traitMap[type.toLowerCase()] || !this._traitMap[type.toLowerCase()][gene]) {
          res.push({
            Name: undefined,
            Location: type,
            ID: gene,
            TraitTypeID: undefined,
          });
        }
      }
    }
    return res;
  }

  getKittyStatus(kitty) {
    const res = {
      unknownGenes: null,
      message: 'no new traits found'
    };
    const genes = this._genetics.readGenes(kitty);
    res.unknownGenes = this.getUnknownGenes(genes);
    if (res.unknownGenes && res.unknownGenes.length > 0) {
      res.message = `unknown traits: ${res.unknownGenes.map(t => `${t.Location}:${t.ID}`).join(' ')}`;
    }
    return res;
  }

  showTraits(event, kitty) {
    event.preventDefault();
    const dialogRef = this._dialog.open(KittyFormComponent, {
      data: {
        kitty,
        traitMap: this._traitMap,
        height: '200px',
      }
    });
  }

  public showError(error) {
    const msg = error.message ? error.message : error;
    if (console) {
      console.error(msg);
    }
    this._snackBar.open(msg);
  }

  async buyKitty(e, kitty) {
    e.preventDefault();
    const txHash = await this._kittyContract.buyKitty(kitty.id, this.bidAmount, this.gasPrice);
    const txUrl = `https://${this.network === 'Test' ? 'ropsten.' : ''}etherscan.io/tx/${txHash}`;
    kitty.Transaction = txUrl;
  }

  ngOnDestroy() {
    this._subscriptionKitties.unsubscribe();
    this._subscriptionBlockNumber.unsubscribe();
  }
}


