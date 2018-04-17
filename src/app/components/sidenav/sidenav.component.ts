import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { ILink } from '../../models/link';

const SMALL_WIDTH_BREAKPOINT = 720;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  private mediaMatcher: MediaQueryList =
    matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  links: ILink[] = [
    { title: 'home', icon: 'home', link: '/' },
    { title: 'search', icon: 'search', link: '/search' },
    { title: 'about', icon: 'help', link: '/about' },
  ];

  isDarkTheme = false;
  dir = 'ltr';

  constructor(
    zone: NgZone,
    private router: Router) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => this.mediaMatcher = mql));
  }

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  toggleTheme() {
    this.isDarkTheme = true;
  }

  toggleDir() {
    this.dir = this.dir === 'ltr' ? 'rtl' : 'ltr';
    this.sidenav.toggle().then(() => this.sidenav.toggle());
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

}
