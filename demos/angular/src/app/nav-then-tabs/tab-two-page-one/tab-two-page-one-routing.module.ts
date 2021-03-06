import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabTwoPageOne } from './tab-two-page-one';

const routes: Routes = [
  { path: '', component: TabTwoPageOne}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabTwoPageOneRoutingModule { }
