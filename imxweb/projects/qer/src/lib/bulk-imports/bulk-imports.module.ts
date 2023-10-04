
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkImportsComponent } from './bulk-imports.component';
import { BulkImportsService } from './bulk-imports.service';
import { BulkImportsTileComponent } from './bulk-imports-tile/bulk-imports-tile.component';
import { TilesModule } from '../tiles/tiles.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { EuiCoreModule } from '@elemental-ui/core';
import { EuiMaterialModule } from '@elemental-ui/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressDialogComponent } from './progress-dialog/progress-dialog.component';

@NgModule({
  declarations: [
    BulkImportsComponent,
    BulkImportsTileComponent,
    ProgressDialogComponent
  ],
  imports: [
    CommonModule,
    TilesModule,
    TranslateModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    EuiCoreModule,
    EuiMaterialModule, 
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    MatProgressBarModule
  ],
  providers: [
    BulkImportsService
  ],
  exports: [
    BulkImportsComponent,
    BulkImportsTileComponent,
    ProgressDialogComponent
  ]
})
export class BulkImportsModule { }



