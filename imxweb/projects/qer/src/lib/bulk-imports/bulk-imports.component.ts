
import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { BulkImportsService } from './bulk-imports.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { ProgressDialogComponent } from './progress-dialog/progress-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ccc-bulk-imports',
  templateUrl: './bulk-imports.component.html',
  styleUrls: ['./bulk-imports.component.scss']
})

export class BulkImportsComponent implements OnInit {

  headers: string[] = [];
  csvData: any[] = [];
  displayedData: any[] = [];
  searchText: string = '';

  currentPage = 0;
  itemsPerPage = 20;
  totalItems = 0;

  fileLoaded: boolean = false;
  selectedOptionKey: any = null;
  showProgressBar: boolean = false;
  progressValue: number = 0;

  isButtonEnabled = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private bulkImportsService: BulkImportsService,
              public dialog: MatDialog) { }

ngOnInit(): void {
  this.bulkImportsService.isButtonEnabled$.subscribe((isEnabled) => {
    console.log('Button state changed:', isEnabled);
    this.isButtonEnabled = isEnabled;
  });
}
 
 onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.readCSV(file);
  }
}

onFileUploadButtonClick(): void {
  const fileInputElement: HTMLElement = this.fileInput.nativeElement as HTMLElement;
  if (fileInputElement) {
    fileInputElement.click();
  }
}

onDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer!.dropEffect = 'copy';
  document.getElementById('dropZone')!.classList.add('dragover');
}

onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById('dropZone')!.classList.remove('dragover');

  const file: File = event.dataTransfer!.files[0];
  if (file) {
    this.readCSV(file);
  }
}

onPageChange(event: PageEvent): void {
  this.currentPage = event.pageIndex;
  this.updateDisplayedData();
}

readCSV(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    const csvData = reader.result as string;
    const rows = csvData.trim().split('\n');
    this.headers = ['Index', ...rows[0].split(',').map(header => header.trim())];
    this.csvData = rows.slice(1).map((row, index) => {
      const data = row.split(',').map(value => value.trim());
      const rowData: any = { 'Index': index + 1 };
      for (let i = 0; i < this.headers.length - 1; i++) {
        rowData[this.headers[i + 1]] = data[i];
      }
      return rowData;
    });

    this.totalItems = this.csvData.length;

    this.displayedData = [...this.csvData]; 

    this.updateDisplayedData();
  };
  reader.readAsText(file);
}

  updateDisplayedData(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    this.displayedData = this.csvData.slice(startIndex, endIndex);
  }
  
  applyFilter() {
    const filterValue = this.searchText.toLowerCase();
    this.displayedData = this.csvData.filter((item) => {
      return Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(filterValue)
      );
    });
  }
  
  clearSearch() {
    this.searchText = '';
    this.applyFilter();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProgressDialogComponent, {
      disableClose: true 
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  

  }
}