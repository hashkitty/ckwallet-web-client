import { Component } from '@angular/core';
import { KittyService } from './services/kitty.service';

@Component({
  selector: 'app-root', // tslint:disable-line
  template: '<app-sidenav></app-sidenav>',
  providers: [KittyService]
})
export class AppComponent {
  title = 'app';
}
