import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { QerService } from '../qer.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MethodDescriptor, TimeZoneInfo } from 'imx-qbm-dbts';
import { AppConfigService, AuthenticationService, MenuService  } from 'qbm';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


export interface PeriodicElement {}
export interface ValidationElement{
  rowIndex: number;
  colIndex: number;
  message: string;
}

@Component({
  selector: 'imx-csvsync',
  templateUrl: './csvsync.component.html',
  styleUrls: ['./csvsync.component.scss']
})
export class CsvsyncComponent implements OnInit, AfterViewInit {

  totalRows: number = 0;
  allRowsValidated: boolean = false;
  validationResults$ = new BehaviorSubject<ValidationElement[]>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  csvDataSource: MatTableDataSource<any> = new MatTableDataSource();
  csvData: any[] = [];
  fileLoaded: boolean = false;
  dialogHide: boolean = false;
  headers: string[] = [];
  validationResponses: any[] = [];
  validationResults: ValidationElement[] = [];
  allvalidated: boolean = false;
  public noDataText = '#LDS#No data';
  public noDataIcon = 'table';
  public visibleRows: any[] = [];
  validating: boolean;
  initializing: boolean = false;
  shouldValidate: boolean = false;
  numberOfErrors: number;
  searchControl = new FormControl({value: '', disabled: true});
  loadingValidation = false;
  loadingImport = false;
  showProgressBar = false;
  processedRows = 0;
  configParams: { [key: string]: string } = {};
  selectedOptionKey: string;
  dataSource: string[] = [];
  CsvImporter: any;
  functionObjectsCount: number = 0;
  public BulkActionsCofigParamCount: number;
  progress: number = 0;
  estimatedRemainingTime: string;

  constructor(
    private dialog: MatDialog,
    private menuService: MenuService,
    private readonly config: AppConfigService,
    private readonly authentication: AuthenticationService,
    private qerService: QerService,
    private cdr: ChangeDetectorRef) {
      this.ConfigurationParameters().then((configParams) => {
        if (configParams) {
          this.configParams = this.convertObjectValuesToStrings(configParams);
        } else {
          console.error('ConfigurationParameters() returned an undefined or null object.');
        }
      });

    }

  public async ngOnInit(): Promise<void>  {

    this.selectedOptionKey = null;
    this.numberOfErrors = 0;
    this.loadingValidation = false;
    this.loadingImport = false;
    this.validating = true;
    this.allvalidated = false;
    await this.ConfigurationParameters();
    await this.getAERoleforCsvImporter(); // Wait for data to be fetched
    await this.filterConfigParams();
    console.log(this.configParams);
    this.BulkActionsCofigParamCount = await this.countPropertiesInConfigurationParameters();
    this.functionObjectsCount = this.countObjectsWithFunctionKey(this.dataSource);
    console.log("Number of objects with 'Function' property:", this.functionObjectsCount);

    this.authentication.update();
    this.cdr.detectChanges();

    console.log(this.allvalidated)
    console.log(this.validating)
  }

  ngOnDestroy() {
    this.progress = 0;
    this.totalRows = 0;
    this.processedRows = 0;
    this.selectedOptionKey = null;
    this.allRowsValidated = false;
    this.validationResults$.next([]);
    this.csvDataSource = new MatTableDataSource();
    this.csvData = [];
    this.fileLoaded = false;
    this.headers = [];
    this.validationResponses = [];
    this.validationResults = [];
    this.CsvImporter = [];
    this.allvalidated = false;
    this.visibleRows = [];
    this.validating = false;
    this.initializing = false;
    this.shouldValidate = false;
    this.numberOfErrors = 0;
  }

  dialogClose() {
    this.dialogHide = true;
  }

  replaceCsv() {
    this.progress = 0;
    this.totalRows = 0;
    this.processedRows = 0;
    this.fileLoaded = false;
    this.allvalidated = false;
    this.csvData = [];
    this.headers = [];
    this.csvDataSource.data = [];
    this.validationResponses = [];
    this.validationResults = [];
    this.validationResults$.next([]);
    this.validating = true;
    this.numberOfErrors = 0;
    this.visibleRows = [];
    this.shouldValidate = false;
    this.searchControl.disable();
  }

  public formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }


  filterConfigParams() {
    // Create a set to store the values from the dataSource array
    const dataSourceValues = new Set<string>();

    // Iterate through each item in the dataSource array
    this.dataSource.forEach(item => {
      // Get the value from the object in the array and add it to the set
      const value = Object.values(item)[0];
      dataSourceValues.add(value);
    });

    // Iterate through the keys in the configParams object
    for (const key in this.configParams) {
      if (!dataSourceValues.has(key)) {
        // If the key doesn't exist in the dataSource array, remove it from configParams
        delete this.configParams[key];
      }
    }
  }

  checkAllRowsValidated(): boolean {
    // All rows are validated if there are no errors
    return this.numberOfErrors === 0;
  }

  ngAfterViewInit() {
    this.initializing = true;
    setTimeout(() => {
      this.csvDataSource.paginator = this.paginator;
      this.validating = true;
      this.cdr.detectChanges();
      if (this.paginator) {
        // Create a new PageEvent and manually trigger the page change event
        const initialPageEvent = new PageEvent();
        initialPageEvent.pageIndex = 0;
        initialPageEvent.pageSize = this.paginator.pageSize;
        initialPageEvent.length = this.csvDataSource.data.length;

        this.pageChanged(initialPageEvent);

        // Subscribe to future page changes
        this.paginator.page.subscribe((event) => {
          this.pageChanged(event);
        });
      } else {
        console.warn('Paginator is not available');
      }
      this.initializing = false;
    }, 500); // Adjust the delay as needed, typically a small value like 500ms should be sufficient
  }

  applyFilter() {
    const filterValue = this.searchControl.value;
    this.csvDataSource.filter = filterValue.trim().toLowerCase();

    if (this.csvDataSource.paginator) {
      this.csvDataSource.paginator.firstPage();
    }
    this.cdr.detectChanges();
  }

  getObjectValues(obj: any): string[] {
    return Object.values(obj);
  }

  getReversedKey(value: string): string {
    return this.getReversedConfigParams()[value];
  }

  getReversedConfigParams(): { [key: string]: string } {
    // Reverse the key-value pairs of the configParams object
    const reversedObject: { [key: string]: string } = {};
    for (const key in this.configParams) {
      if (this.configParams.hasOwnProperty(key)) {
        reversedObject[this.configParams[key]] = key;
      }
    }
    return reversedObject;
  }


  getErrorRowsAndHeaders(): string {
    const errorInfos = this.validationResults.map(result => {
      const headerName = this.headers[result.colIndex];
      return `At row ${result.rowIndex + 1} the value of ${headerName}`;
    });
    return errorInfos.join(', ');
  }

  isRowError(rowIndex: number): boolean {
    // Get the row index in the filtered data
    const adjustedRowIndex = this.csvDataSource.filteredData[rowIndex + (this.paginator.pageIndex * this.paginator.pageSize)]?.[0] - 1;
    return this.validationResults.some(result => result.rowIndex === adjustedRowIndex);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
    this.cdr.detectChanges();
  }

  onDragOver(event: any) {
    event.preventDefault();
    if (event.target) {
      event.target.classList.add('dragover');
    }
  }

  onDragLeave(event: any) {
    event.preventDefault();
    if (event.target) {
      event.target.classList.remove('dragover');
    }
  }

  triggerFileUpload() {
    const fileInput = document.getElementById('csv-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onDrop(event: any) {
    event.preventDefault();
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      let file = files[0];
      if (file.type.match(/.csv/)) {
        this.processFile(file);
      }
    }
  }

  private processFile(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
        const data = reader.result as string;
        const lines = data.split('\n').filter(line => line.trim().length > 0);  // Filter out empty lines
        this.headers = ['Index', ...lines[0].split(',').map(header => header ? header.trim() : '')];
        for (let i = 1; i < lines.length; i++) {
            const row = [i, ...lines[i].split(',').map(cell => cell ? cell.trim() : '')];
            this.csvData.push(row);
        }
        this.csvDataSource.data = this.csvData;
        this.fileLoaded = true;
        this.totalRows = lines.length - 1;
    };
    this.searchControl.enable();
    reader.readAsText(file);
    this.allvalidated = false;
  }

getValidationResult(rowIndex: number, colIndex: number): string | undefined {
  // Get the row index in the filtered data
  const adjustedRowIndex = this.csvDataSource.filteredData[rowIndex + (this.paginator.pageIndex * this.paginator.pageSize)]?.[0] - 1;

  // Find the validation result using the adjusted row index
  const validationResult = this.validationResults.find(result => result.rowIndex === adjustedRowIndex && result.colIndex === colIndex);
  return validationResult?.message;
}

  isValidationError(rowIndex: number, colIndex: number): boolean {
    return this.getValidationResult(rowIndex, colIndex) !== undefined;
  }

  public pageChanged(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    if (endIndex > this.csvDataSource.data.length) {
      endIndex = this.csvDataSource.data.length;
    }

    this.visibleRows = this.csvDataSource.data.slice(startIndex, endIndex);
    this.cdr.detectChanges();

  }

  public async importToDatabase(endpoint: string): Promise<PeriodicElement[]> {
    this.loadingImport = true;
    const inputParameters: any[] = [];
    const csvData = this.csvDataSource.data;
    const results: PeriodicElement[] = [];
    this.validating = true;

    // Get the mapping object from the mapping function
    const mappingObject = await this.mapping(endpoint);
    let totalTimeTaken = 0; // Total time taken for processing rows
    let estimatedRemainingSecs = 0;
    for (const csvRow of csvData) {
      const inputParameterName: any = {};

      for (const csvColumn in mappingObject) {
        const dbColumn = mappingObject[csvColumn];
        const cleanCellValue = typeof csvRow[csvColumn] === 'string'
          ? csvRow[csvColumn].replace(/[\r\n]+/g, '').trim()
          : csvRow[csvColumn];

        inputParameterName[dbColumn] = cleanCellValue;
      }

      inputParameters.push(inputParameterName);
    }

    for (const inputParameter of inputParameters) {

      const startTime = performance.now();
      console.log(inputParameter);
      try {
        const data = await this.config.apiClient.processRequest(this.PostObject(endpoint, inputParameter));
        results.push(data);
      } catch (error) {
        console.error(`Error submitting CSV data: ${error}`);
      } finally {


        const endTime = performance.now();
        const timeTaken = endTime - startTime;
        totalTimeTaken += timeTaken;

        // Calculate the average time taken per row
        const averageTimePerRow = totalTimeTaken / (this.processedRows + 1);

        estimatedRemainingSecs = (averageTimePerRow * (this.totalRows - this.processedRows - 1)) / 1000; // Convert to seconds
        // Calculate the progress and update the progress bar
        this.progress = (this.processedRows / this.totalRows) * 100;
        this.estimatedRemainingTime = this.formatTime(estimatedRemainingSecs);
        this.processedRows++;

      }
    }

    this.allRowsValidated = false;

    setTimeout(() => {

      this.loadingImport = false;
      this.progress = 0;
      this.processedRows = 0;
      this.estimatedRemainingTime = null;

    });

    return results;
  }

private PostObject(endpoint: string, inputParameterName: any): MethodDescriptor<PeriodicElement> {
  return {
    path: `/portal/bulkactions/${endpoint}/import`,
    parameters: [
      {
        name: 'inputParameterName',
        value: inputParameterName,
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

public async countPropertiesInConfigurationParameters(): Promise<number> {
  const configurationParameters = await this.ConfigurationParameters();
  return Object.keys(configurationParameters).length;
}

public async ConfigurationParameters(): Promise<object> {
  const ConfigurationParameters = await this.config.apiClient.processRequest(this.getConfigCsv());
  console.log(ConfigurationParameters);
  return ConfigurationParameters;
 }

 private getConfigCsv(): MethodDescriptor<object> {
  const parameters = [];
  return {
    path: `/portal/ConfigCsv`,
    parameters,
    method: 'GET',
    headers: {
      'imx-timezone': TimeZoneInfo.get(),
    },
    credentials: 'include',
    observe: 'response',
    responseType: 'json',
  };
}

convertObjectValuesToStrings(obj: { [key: string]: any }): { [key: string]: string } {
  const convertedObj: { [key: string]: string } = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Convert the value to a string, or use a default string if it's not a string
      convertedObj[key] = String(obj[key]);
    }
  }
  return convertedObj;
}

public async mapping(endpoint: string): Promise<object> {
  const mapping = await this.config.apiClient.processRequest(this.getMapping(endpoint));
  console.log(mapping);
  return mapping;
 }

private getMapping(endpoint: string): MethodDescriptor<object> {
  const parameters = [];
  return {
    path: `/portal/bulkactions/${endpoint}/mapping`,
    parameters,
    method: 'GET',
    headers: {
      'imx-timezone': TimeZoneInfo.get(),
    },
    credentials: 'include',
    observe: 'response',
    responseType: 'json',
  };
}

public async notes(endpoint: string): Promise<object> {
  const notes = await this.config.apiClient.processRequest(this.notebook(endpoint));
  console.log(notes);
  return notes;
 }

private notebook(endpoint: string): MethodDescriptor<object> {
  const parameters = [];
  return {
    path: `/portal/bulkactions/${endpoint}/noduplicates`,
    parameters,
    method: 'GET',
    headers: {
      'imx-timezone': TimeZoneInfo.get(),
    },
    credentials: 'include',
    observe: 'response',
    responseType: 'json',
  };
}

private async validateNoDuplicates(columnMapping: any): Promise<void> {
  const columnToUniqueValues: { [key: string]: string[] } = {};

  for (const [rowIndex, csvRow] of this.csvDataSource.data.entries()) {
    Object.keys(columnMapping).forEach(colIndex => {
      const columnName = columnMapping[colIndex];
      const columnValue = csvRow[colIndex].trim();

      if (!(columnName in columnToUniqueValues)) {
        columnToUniqueValues[columnName] = [];
      }

      if (columnToUniqueValues[columnName].includes(columnValue)) {
        this.validationResults.push({
          rowIndex,
          colIndex: Number(colIndex),
          message: `CSV already contains an entry ${columnValue}`,
        });
        this.allvalidated = false;
        this.numberOfErrors++;
      } else {
        columnToUniqueValues[columnName].push(columnValue);
      }
    });
  }
}


public async onValidateClicked(endpoint: string): Promise<void> {
  this.shouldValidate = true;
  const mapping = await this.mapping(endpoint); // Fetch the mapping from API
  await this.validate(endpoint, mapping);
  this.allRowsValidated = this.checkAllRowsValidated(); // Call the new method after validation
  this.dialogHide = false;
}

public async validate(endpoint: string, columnMapping: any): Promise<void> {

  this.loadingValidation = true;
  if(this.initializing || !this.shouldValidate) {
    setTimeout(() => {
      this.loadingValidation = false;

    });
    return;
  }
  this.validationResults = []; // Clear the previous validation results
  this.allvalidated = true;
  this.validating = true;
  this.numberOfErrors = 0; // Reset the error count before new validation

  const NoDuplicates = await this.notes(endpoint);
  await this.validateNoDuplicates(NoDuplicates);


  let totalTimeTaken = 0; // Total time taken for processing rows
  let estimatedRemainingSecs = 0;

  for (const [rowIndex, csvRow] of this.csvDataSource.data.entries()) { // Validate all rows
    const rowToValidate: any = {};
    Object.keys(columnMapping).forEach(colIndex => {
      const columnName = columnMapping[colIndex];
      rowToValidate[columnName] = csvRow[colIndex].trim(); // Trim the values here
    });

    const startTime = performance.now();
    try {
      let validationResponse: any = await this.config.apiClient.processRequest(this.validateRow(endpoint, rowToValidate));


      console.log(validationResponse);

      Object.keys(columnMapping).forEach(colIndex => {
        const columnName = columnMapping[colIndex];
        if (validationResponse[columnName] && validationResponse[columnName] !== "ok") {
          this.validationResults.push({ rowIndex, colIndex: Number(colIndex), message: validationResponse[columnName] });
          this.allvalidated = false;
          this.numberOfErrors++;
        }
      });

    } catch (error) {
      console.error(`Error validating row ${rowIndex}: ${error}`);
      this.allvalidated = false;
      this.validationResults$.next(this.validationResults);
    } finally {


      const endTime = performance.now();
      const timeTaken = endTime - startTime;
      totalTimeTaken += timeTaken;

      // Calculate the average time taken per row
      const averageTimePerRow = totalTimeTaken / (this.processedRows + 1);

      estimatedRemainingSecs = (averageTimePerRow * (this.totalRows - this.processedRows - 1)) / 1000; // Convert to seconds
      // Calculate the progress and update the progress bar
      this.progress = (this.processedRows / this.totalRows) * 100;
      this.estimatedRemainingTime = this.formatTime(estimatedRemainingSecs);
      this.processedRows++;

    }
  }

  this.validating = false;
  console.log(this.allvalidated);
  this.cdr.detectChanges();
  setTimeout(() => {
    this.loadingValidation = false;
    this.progress = 0;
    this.processedRows = 0;
    this.estimatedRemainingTime = null;
  });
}

public async val(endpoint: string, rowToValidate: any): Promise<object> {
  const val = await this.config.apiClient.processRequest(this.validateRow(endpoint, rowToValidate));
  console.log(val);
  return val;
 }

private validateRow(endpoint: string, rowToValidate: any): MethodDescriptor<ValidationElement> {
  return {
    path: `/portal/bulkactions/${endpoint}/validate`,
    parameters: [
      {
        name: 'rowToValidate',
        value: rowToValidate,
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


public async start(endpoint: string, startobject: any): Promise<object> {
  const val = await this.config.apiClient.processRequest(this.startmethod(endpoint, startobject));
  console.log(val);
  return val;
 }

private startmethod(endpoint: string, startobject: any): MethodDescriptor<ValidationElement> {
  return {
    path: `/portal/bulkactions/${endpoint}/start`,
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


private countObjectsWithFunctionKey(data: any): number {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return 0; // Return 0 if data is undefined, null, or an empty array
  }

  if (Array.isArray(data)) {
    // If data is an array, count objects with "Function" or "function" keys
    return data.reduce((count, item) => {
      return count + (item.hasOwnProperty("Function") || item.hasOwnProperty("function") ? 1 : 0);
    }, 0);
  } else if (typeof data === 'object') {
    // If data is an object, check if it has "Function" or "function" keys
    return (data.hasOwnProperty("Function") || data.hasOwnProperty("function")) ? 1 : 0;
  }

  return 0; // Return 0 for other data types
}



public async getAERoleforCsvImporter(): Promise<void> {
  const CsvImporter = await this.config.apiClient.processRequest<string[]>(this.getWhoForCSV());
  console.log(CsvImporter);
  this.dataSource = CsvImporter;
 }

 private getWhoForCSV(): MethodDescriptor<void> {
  const parameters = [];
  return {
    path: `/portal/BulkActionsFunctionsForUser`,
    parameters,
    method: 'GET',
    headers: {
      'imx-timezone': TimeZoneInfo.get(),
    },
    credentials: 'include',
    observe: 'response',
    responseType: 'json',
  };
}


openConfirmationDialog(): void {
  const selectedOptionValue = this.getObjectValues(this.configParams).find(
    (value) => this.getReversedKey(value) === this.selectedOptionKey
  );

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      selectedOptionKey: this.selectedOptionKey,
      selectedOptionValue: selectedOptionValue,
      totalRows: this.totalRows
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // User confirmed, perform the import action here
      this.importToDatabase(result.selectedOptionKey);
    }
  });
}

}


