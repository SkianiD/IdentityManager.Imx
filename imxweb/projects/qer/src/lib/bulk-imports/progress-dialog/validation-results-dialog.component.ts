import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ccc-validation-results-dialog',
  templateUrl: './validation-results-dialog.component.html',
  styleUrls: ['./validation-results-dialog.component.scss']
})
export class ValidationResultsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ValidationResultsDialogComponent>) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
