import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material.module';
import { AppComponent } from './app.component';
import { KittyListComponent } from './components/kitty-list/kitty-list.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { AboutComponent } from './components/about/about.component';
import { AuctionListComponent } from './components/auction-list/auction-list.component';
import { BotsModule } from './bots/bots.module';

const routes: Routes = [
  { path: 'search', component: KittyListComponent },
  { path: 'about', component: AboutComponent },
  { path: 'auctions', component: AuctionListComponent },
  { path: '**', redirectTo: 'search', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    KittyListComponent,
    SearchBarComponent,
    SidenavComponent,
    ToolbarComponent,
    AboutComponent,
    AuctionListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    BotsModule,
  ],
  providers: [MediaMatcher],
  bootstrap: [AppComponent]
})
export class AppModule { }
