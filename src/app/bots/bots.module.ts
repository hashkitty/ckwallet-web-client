import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';
import { BotListComponent } from './bot-list/bot-list.component';
import { BotDianeComponent } from './bot-diane/bot-diane.component';
import { BotDianeInfoComponent } from './bot-diane/bot-diane-info.component';
import { KittyFormComponent } from '../components/kitty-form/kitty-form.component';

const routes: Routes = [
  { path: 'bots', component: BotListComponent },
  { path: 'bots/diane', component: BotDianeComponent },
  { path: 'bots/**', redirectTo: 'bots', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    BotListComponent,
    BotDianeComponent,
    BotDianeInfoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  entryComponents: [ BotDianeInfoComponent, KittyFormComponent ]
})
export class BotsModule { }
