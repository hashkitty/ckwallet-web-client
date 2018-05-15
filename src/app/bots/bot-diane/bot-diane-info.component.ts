import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-bot-diane-info',
  templateUrl: './bot-diane-info.component.html',
})
export class BotDianeInfoComponent {
  constructor(
    private _dialogRef: MatDialogRef<BotDianeInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    clickConfirm() {
      this._dialogRef.close('confirm');
    }

    clickCancel() {
      this._dialogRef.close('cancel');
    }
}
