import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'ccc-bulk-imports-tile',
  templateUrl: './bulk-imports-tile.component.html',
  styleUrls: ['./bulk-imports-tile.component.scss']
})
export class BulkImportsTileComponent implements OnInit {


  constructor(private readonly router: Router) { }

  ngOnInit(): void {
  }

  public goToBulkImports(): void {
    this.router.navigate(['bulkimports']);
  }

}
