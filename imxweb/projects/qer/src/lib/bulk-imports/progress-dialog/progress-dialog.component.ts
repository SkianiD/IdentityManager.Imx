import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ccc-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.scss']
})
export class ProgressDialogComponent implements OnInit {

  progressValue: number = 0;

  constructor(public dialogRef: MatDialogRef<ProgressDialogComponent>) { }

  ngOnInit(): void {
    this.updateProgress();
  }

  updateProgress() {
    
    const interval = setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += 10; 
      } else {
        clearInterval(interval); 
      }
    }, 1000); 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

