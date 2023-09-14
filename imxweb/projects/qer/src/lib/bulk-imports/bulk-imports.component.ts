
import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { BulkImportsService } from './bulk-imports.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'ccc-bulk-imports',
  templateUrl: './bulk-imports.component.html',
  styleUrls: ['./bulk-imports.component.scss']
})

export class BulkImportsComponent implements OnInit {

  headers: string[] = [];
  csvData: any[] = [];
  displayedData: any[] = [];

  currentPage = 0;
  itemsPerPage = 20;
  totalItems = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private bulkImportsService: BulkImportsService) { }

  
  ngOnInit(): void {
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
    this.headers = rows[0].split(',').map(header => header.trim());
    this.csvData = rows.slice(1).map(row => {
      const data = row.split(',').map(value => value.trim());
      const rowData: any = {};
      for (let i = 0; i < this.headers.length; i++) {
        rowData[this.headers[i]] = data[i];
      }
      return rowData;
    });

    this.totalItems = this.csvData.length;

    this.updateDisplayedData();
  };
  reader.readAsText(file);
}

  updateDisplayedData(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    this.displayedData = this.csvData.slice(startIndex, endIndex);
  }
  
}

