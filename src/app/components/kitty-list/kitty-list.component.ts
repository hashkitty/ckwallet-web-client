import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IKitty } from '../../models/kitty';
import { KittyService } from '../../services/kitty.service';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './kitty-list.component.html',
  styleUrls: ['./kitty-list.component.scss']
})
export class KittyListComponent implements OnInit {
  title = 'app';
  kitties: IKitty[] = [];
  total = 0;
  errorMessage = '';
  search = '';
  sort = '';
  loading = false;

  constructor(private _kittyService: KittyService, private _route: ActivatedRoute) {
  }

  getKitties(search, sort, firstId, append): void {
    this.loading = true;
    this._kittyService.getKitties(search, sort, firstId).subscribe(
      res => {
        if (res) {
        if (append) {
          this.kitties.push(...res.kitties);
        } else {
          this.kitties = res.kitties;
        }
        this.total = res.total;
      }
        this.loading = false;
      },
      error => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe(map => {
      this.search = map.get('search');
      this.sort = map.get('sort');
      this.getKitties(this.search, this.sort, null, false);
    });
  }

  setFallbackImage(img) {
    if (img.src && img.src.endsWith('.svg')) {
      img.src = img.src.replace('.svg', '.png');
    } else if (img.src && img.src.endsWith('.png')) {
      img.src = environment.nullKittyUrl;
    }
  }

  onLoadMore() {
    const lastId = this.kitties.length > 0 ? this.kitties[this.kitties.length - 1].id : null;
    const nextId = /ID DESC/i.test(this.sort) ? lastId - 1 : lastId + 1;
    this.getKitties(this.search, this.sort, nextId, true);
  }
}
