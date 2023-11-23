import { Component, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { CsvsyncService } from '../csvsync.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export interface ValidationElement{
  rowIndex: number;
  colIndex: number;
  message: string;
}

@Component({
  selector: 'imx-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  estimatedRemainingTime: string;
  processedRows = 0;
  totalRows: number = 0;
  progress: number = 0;
  numberOfErrors: number;
  hardError: string = '';
  fileLoaded: boolean = false;
  allRowsValidated: boolean = false;
  processing: boolean;
  initializing: boolean = false;
  importError: boolean = false;
  loadingValidation = false;
  validateDialog: boolean = false;
  loadingImport = false;
  allImported: boolean = false;
  importErrorMsg: string = '';

  private estimatedRemainingTimeSubscription: Subscription;
  private processedRowsSubscription: Subscription;
  private totalRowsSubscription: Subscription;
  private progressSubscription: Subscription;
  private numberOfErrorsSubscription: Subscription;
  private hardErrorSubscription: Subscription;
  private fileLoadedSubscription: Subscription;
  private allRowsValidatedSubscription: Subscription;
  private processingSubscription: Subscription;
  private initializingSubscription: Subscription;
  private importErrorSubscription: Subscription;
  private loadingValidationSubscription: Subscription;
  private validateDialogSubscription: Subscription;
  private loadingImportSubscription: Subscription;
  private allImportedSubscription: Subscription;
  private importErrorMsgSubscription: Subscription

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public csvsyncService: CsvsyncService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {console.log('Received data in the dialog component:', this.data);
  }


  dialogClose(): void {

    if (this.data.processing) {
      this.data.cancelAction = true;
      this.data.cancelCheck = true;
    } else {
      this.data.cancelCheck = false;
    }
  
    this.data.importError = false;
    this.data.importErrorMsg = '';
    this.data.hardError = '';
  
    if (this.data.processing) {
      this.csvsyncService.setcancelAction(true);
    }
    

    this.dialogRef.close();

    this.estimatedRemainingTimeSubscription.unsubscribe();
    this.processedRowsSubscription.unsubscribe();
    this.totalRowsSubscription.unsubscribe();
    this.progressSubscription.unsubscribe();
    this.numberOfErrorsSubscription.unsubscribe();
    this.hardErrorSubscription.unsubscribe();
    this.fileLoadedSubscription.unsubscribe();
    this.allRowsValidatedSubscription.unsubscribe();
    this.processingSubscription.unsubscribe();
    this.initializingSubscription.unsubscribe();
    this.importErrorSubscription.unsubscribe();
    this.loadingValidationSubscription.unsubscribe();
    this.validateDialogSubscription.unsubscribe();
    this.loadingImportSubscription.unsubscribe();
    this.allImportedSubscription.unsubscribe();
    this.importErrorMsgSubscription.unsubscribe();
  }

    ngOnInit(): void {
    // Subscribe to estimatedRemainingTime$ and processedRows$
    this.estimatedRemainingTimeSubscription = this.csvsyncService.estimatedRemainingTime$.subscribe((value) => {
      console.log('Estimated Remaining Time:', value);
      this.estimatedRemainingTime = value;
  });
  

    this.processedRowsSubscription = this.csvsyncService.processedRows$.subscribe((value) => {
      this.processedRows = value;
    });

    this.totalRowsSubscription = this.csvsyncService.totalRows$.subscribe((value) => {
      this.totalRows = value;
    });

    this.progressSubscription = this.csvsyncService.progress$.subscribe((value) => {
      this.progress = value;
    });

    this.numberOfErrorsSubscription = this.csvsyncService.numberOfErrors$.subscribe((value) => {
      this.numberOfErrors = value;
    });

    this.hardErrorSubscription = this.csvsyncService.hardError$.subscribe((value) => {
      this.hardError = value;
    });

    this.fileLoadedSubscription = this.csvsyncService.fileLoaded$.subscribe((value) => {
      this.fileLoaded = value;
    });

    this.allRowsValidatedSubscription = this.csvsyncService.allRowsValidated$.subscribe((value) => {
      this.allRowsValidated = value;
    });

    this.processingSubscription = this.csvsyncService.processing$.subscribe((value) => {
      this.processing = value;
      this.cdr.detectChanges();
    });

    this.initializingSubscription = this.csvsyncService.initializing$.subscribe((value) => {
      this.initializing = value;
    });

    this.importErrorSubscription = this.csvsyncService.importError$.subscribe((value) => {
      this.importError = value;
    });

    this.loadingValidationSubscription = this.csvsyncService.loadingValidation$.subscribe((value) => {
      this.loadingValidation = value;
    });

    this.validateDialogSubscription = this.csvsyncService.validateDialog$.subscribe((value) => {
      this.validateDialog = value;
    });

    this.loadingImportSubscription = this.csvsyncService.loadingImport$.subscribe((value) => {
      this.loadingImport = value;
    });

    this.allImportedSubscription = this.csvsyncService.allImported$.subscribe((value) => {
      this.allImported = value;
    });

    this.importErrorMsgSubscription = this.csvsyncService.importErrorMsg$.subscribe((value) => {
      this.importErrorMsg = value;
    });
  }



}
