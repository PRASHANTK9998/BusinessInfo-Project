import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'data-grid-side-drawer',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './data-grid-side-drawer.component.html',
  styleUrls: ['./data-grid-side-drawer.component.scss'],
})
export class DataGridSideDrawerComponent implements OnInit {
  @Input() columnDefs: any;
  @Input() rowData: any;

  @Output() onUpdate: EventEmitter<any> = new EventEmitter();

  faChevronsRight = faChevronRight as IconProp;

  constructor(private bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  updateData() {
    this.closeModal();
    this.onUpdate.emit({ action: true, data: this.rowData });
  }

  closeModal() {
    this.onUpdate.emit({ action: false, data: [] });
    this.bsModalRef.hide();
  }

  deleteRecord() {
    this.onUpdate.emit({ action: 'delete', data: this.rowData });
    this.bsModalRef.hide();
  }
}
