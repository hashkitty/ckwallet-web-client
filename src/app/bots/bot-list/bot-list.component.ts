import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BotDianeInfoComponent } from '../bot-diane/bot-diane-info.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bot-list',
  templateUrl: './bot-list.component.html',
  styleUrls: ['./bot-list.component.scss']
})
export class BotListComponent implements OnInit {

  private _botInfoClasses = {};
  constructor(private _dialog: MatDialog, private _router: Router) { }

  ngOnInit() {
    this._botInfoClasses['diane'] = BotDianeInfoComponent;
  }

  navigateBot(event, name) {
    event.preventDefault();
    const info = this._botInfoClasses[name];
    if (info) {
      const dialogRef = this._dialog.open(info);

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
          this._router.navigate(['bots', name]);
        }
      });
    } else {
      this._router.navigate(['bots', name]);
    }
  }
}

