/*
 * ONE IDENTITY LLC. PROPRIETARY INFORMATION
 *
 * This software is confidential.  One Identity, LLC. or one of its affiliates or
 * subsidiaries, has supplied this software to you under terms of a
 * license agreement, nondisclosure agreement or both.
 *
 * You may not copy, disclose, or use this software except in accordance with
 * those terms.
 *
 *
 * Copyright 2021 One Identity LLC.
 * ALL RIGHTS RESERVED.
 *
 * ONE IDENTITY LLC. MAKES NO REPRESENTATIONS OR
 * WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR
 * NON-INFRINGEMENT.  ONE IDENTITY LLC. SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { RouteGuardService } from 'qbm';
import { RequestsComponent } from 'qer';
import { AdminGuardService } from './services/admin-guard.service';
import { CsvTableComponent } from 'projects/qer/src/lib/csv-table/csv-table.component';

const routes: Routes = [
  { path: 'configuration/requests',
    component: RequestsComponent,
    canActivate: [RouteGuardService, AdminGuardService],
    resolve: [RouteGuardService]
  },
  { path: 'csv-table', component: CsvTableComponent }, 
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy', enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(router: Router) {
  }
}
