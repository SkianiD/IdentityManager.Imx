import { Injectable } from '@angular/core';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { BehaviorSubject } from 'rxjs';

export interface PreActionElement{
  message: string;
  permission: boolean;
}

export interface ValidationElement{
  rowIndex: number;
  colIndex: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CsvsyncService {
  private estimatedRemainingTimeSource = new BehaviorSubject<string>('');
  private processedRowsSource = new BehaviorSubject<number>(0);
  private totalRowsSource = new BehaviorSubject<number>(0);
  private progressSource = new BehaviorSubject<number>(0);
  private numberOfErrorsSource = new BehaviorSubject<number>(0);
  private hardErrorSource = new BehaviorSubject<string>('');
  private fileLoadedSource = new BehaviorSubject<boolean>(false);
  private allRowsValidatedSource = new BehaviorSubject<boolean>(false);
  private processingSource = new BehaviorSubject<boolean>(false);
  private initializingSource = new BehaviorSubject<boolean>(false);

  estimatedRemainingTime$ = this.estimatedRemainingTimeSource.asObservable();
  processedRows$ = this.processedRowsSource.asObservable();
  totalRows$ = this.totalRowsSource.asObservable();
  progress$ = this.progressSource.asObservable();
  numberOfErrors$ = this.numberOfErrorsSource.asObservable();
  hardError$ = this.hardErrorSource.asObservable();
  fileLoaded$ = this.fileLoadedSource.asObservable();
  allRowsValidated$ = this.allRowsValidatedSource.asObservable();
  processing$ = this.processingSource.asObservable();
  initializing$ = this.initializingSource.asObservable();


  constructor(public dialog: MatDialog) { }

  setEstimatedRemainingTime(estimatedRemainingTime: string) {
    this.estimatedRemainingTimeSource.next(estimatedRemainingTime);
  }

  setProcessedRows(processedRows: number) {
    this.processedRowsSource.next(processedRows);
  }

  settotalRows(totalRows: number) {
    this.totalRowsSource.next(totalRows);
  }

  setprogress(progress: number) {
    this.progressSource.next(progress);
  }

  setnumberOfErrors(numberOfErrors: number) {
    this.numberOfErrorsSource.next(numberOfErrors);
  }

  sethardError(hardError: string) {
    this.hardErrorSource.next(hardError);
  }

  setfileLoaded(fileLoaded: boolean) {
    this.fileLoadedSource.next(fileLoaded);
  }
  
  setallRowsValidated(allRowsValidated: boolean) {
    this.allRowsValidatedSource.next(allRowsValidated);
  }

  setprocessing(processing: boolean) {
    this.processingSource.next(processing);
  }

  setinitializing(initializing: boolean) {
    this.initializingSource.next(initializing);
  }



 
public startValidateMethod(endpoint: string, startobject: any): MethodDescriptor<PreActionElement> {

  return {
    path: `/portal/bulkactions/${endpoint}/startvalidate`,
    parameters: [
      {
        name: 'startobject',
        value: startobject,
        in: 'body'
      },
    ],
    method: 'POST',
    headers: {
      'imx-timezone': TimeZoneInfo.get(),
    },
    credentials: 'include',
    observe: 'response',
    responseType: 'json'
  };
}


public startImportMethod(endpoint: string, startobject: any): MethodDescriptor<PreActionElement> {
  return {
    path: `/portal/bulkactions/${endpoint}/startimport`,
    parameters: [
      {
        name: 'startobject',
        value: startobject,
        in: 'body'
      },
    ],
    method: 'POST',
    headers: {
      'imx-timezone': TimeZoneInfo.get(),
    },
    credentials: 'include',
    observe: 'response',
    responseType: 'json'
  };
}

public endImportMethod(endpoint: string, startobject: any): MethodDescriptor<PreActionElement> {
  return {
    path: `/portal/bulkactions/${endpoint}/endimport`,
    parameters: [
      {
        name: 'startobject',
        value: startobject,
        in: 'body'
      },
    ],
    method: 'POST',
    headers: {
      'imx-timezone': TimeZoneInfo.get(),
    },
    credentials: 'include',
    observe: 'response',
    responseType: 'json'
  };
}

}