import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ValidationResultsDialogComponent } from './validation-results-dialog.component';


@Component({
  selector: 'ccc-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.scss']
})
export class ProgressDialogComponent implements OnInit {

  progressValue: number = 0;

  isLoading: boolean = true;

  constructor(public dialogRef: MatDialogRef<ProgressDialogComponent>,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.updateProgress();
  }

  updateProgress() {
    
    const interval = setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += 10; 
      } else {
        clearInterval(interval); 
        this.isLoading = false;
        this.dialogRef.close();
        this.openNewDialog();
      }
    }, 1000); 
  }

  onNoClick(): void {
    if (!this.isLoading) {
      this.dialogRef.close();
    }
  }

  openNewDialog(): void {
    this.dialog.open(ValidationResultsDialogComponent, {
      disableClose: true 
    });
  }


}

