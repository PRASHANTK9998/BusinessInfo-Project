import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../services/api.service';
import { DropdownComponent } from '../components/dropdown/dropdown.component';
import { DataGridComponent } from '../components/data-grid/data-grid.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'welcome',
  standalone: true,
  imports: [DropdownComponent, DataGridComponent, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  encapsulation: ViewEncapsulation.None  
})
export class WelcomeComponent implements OnInit {
  public dropdownConfigPropertiesf531530eff89: any;
  public dropdownFormValidationf531530eff89: any;
  public dataGridConfigPropertiescb46826a850a: any;
  public dataGridInterfaceConfigcb46826a850a: any;
  inactiveBusinesses: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getAllInactiveBusinesses();
    // this.getAllInactiveBusinessesBySponseredOrNot();
    this.dropdownConfigPropertiesf531530eff89 = {
      helpText: '',
      styles: { stylesClassName: '', labelStylesClassName: '' },
      isHidden: false,
      propertyName: '8d9f8167-2491-4f94-b187-f531530eff89',
      showLabel: false,
      type: 'dropdown',
      placeHolder: 'Select an option',
      formControlName: 'dropdownele',
      navigateTo: '',
      customCssClasses: ['my-1'],
      childs: [],
      icon: 'faCaretSquareDown',
      dropValue: '',
      dropDisplayName: '',
      listChilds: [],
      styleType: '',
      variableName: 'dropdownConfigPropertiesf531530eff89',
      listOfOptions: [
        { displayName: 'Sponsered List', value: true },
        { displayName: 'Non-Sponsered List', value: false },
        { displayName: 'Sponsered List', value: true },
        { displayName: 'Non-Sponsered List', value: false },
        { displayName: 'Sponsered List', value: true },
        { displayName: 'Non-Sponsered List', value: false },
      ],
    };
    this.dropdownFormValidationf531530eff89 = {
      validations: [
        { validationType: 'readonly', required: false },
        { validationType: 'mandatory', required: false },
      ],
    };
    this.dataGridConfigPropertiescb46826a850a = {
      helpText: '',
      styles: { stylesClassName: 'height-400', labelStylesClassName: '' },
      isHidden: false,
      propertyName: '860b9db7-1b14-4de0-84de-cb46826a850a',
      showLabel: false,
      type: 'data-grid',
      formControlName: 'inactivebusinessestable',
      navigateTo: '',
      customCssClasses: ['my-1'],
      childs: [],
      icon: 'faTable',
      rowData: [],
      listChilds: [],
      styleType: '',
      variableName: 'dataGridConfigPropertiescb46826a850a',
      listOfOptions: [],
    };
    this.dataGridInterfaceConfigcb46826a850a = {
      tableTheme: 'ag-theme-alpine',
      isSortable: false,
      isTableSearchable: false,
      isTableFilterable: false,
      isColumnFilterable: false,
      isPaginationEnabled: true,
      dataSize: '10',
      isColumnMovable: false,
      isColumnResizable: false,
      isRowSelected: false,
      isRowExpandable: false,
      isRowEditable: false,
      isExportToCSVEnabled: false,
      isBulkAddEnabled: false,
      isBulkEditEnabled: false,
      isTableRefreshable: false,
      isRowAddable: false,
      addBtnLabel: 'New Row',
      isRowDeletable: false,
      isEditDrawerEnabled: false,
      columns: [
        {
          label: 'Business Name',
          type: 'text',
          hidden: false,
          dropdownOptions: [],
          dateFormat: 'MMM d, yyyy hh:mm:ss',
          alignment: 'left',
          tooltip: true,
          editable: false,
          onClick: {
            storeRowData: false,
            keyToStoredData: '',
            navigateTo: -1,
            apis: [],
          },
          customClass: '',
          field: 'businessName',
        },
        {
          label: 'Email',
          type: 'text',
          hidden: false,
          dropdownOptions: ['Canada', 'India', 'US'],
          dateFormat: 'MMM d, yyyy hh:mm:ss',
          alignment: 'left',
          tooltip: false,
          editable: false,
          onClick: {
            storeRowData: false,
            keyToStoredData: '',
            navigateTo: -1,
            apis: [],
          },
          customClass: '',
          field: 'email',
        },
        {
          label: 'GST No',
          type: 'text',
          hidden: false,
          dropdownOptions: [],
          dateFormat: 'yyyy',
          alignment: 'left',
          tooltip: false,
          editable: false,
          onClick: {
            storeRowData: false,
            keyToStoredData: '',
            navigateTo: -1,
            apis: [],
          },
          customClass: '',
          field: 'gstNo',
        },
        {
          label: 'Website',
          type: 'link',
          hidden: false,
          dropdownOptions: [],
          dateFormat: 'MMM d, yyyy hh:mm:ss',
          alignment: 'left',
          tooltip: false,
          editable: false,
          onClick: {
            storeRowData: false,
            keyToStoredData: '',
            navigateTo: -1,
            apis: [],
          },
          customClass: '',
          field: 'website',
        },
        {
          label: 'Category',
          type: 'text',
          dropdownOptions: [],
          hidden: false,
          dateFormat: 'MMM d, yyyy hh:mm:ss',
          alignment: 'left',
          tooltip: false,
          editable: false,
          onClick: {
            storeRowData: false,
            keyToStoredData: '',
            navigateTo: -1,
            apis: [],
          },
          customClass: '',
          field: 'businessCategoryName',
        },
        {
          label: 'Sponsered',
          type: 'link',
          dropdownOptions: [],
          hidden: false,
          dateFormat: 'MMM d, yyyy hh:mm:ss',
          alignment: 'left',
          tooltip: false,
          editable: false,
          onClick: {
            storeRowData: false,
            keyToStoredData: '',
            navigateTo: -1,
            apis: [],
          },
          customClass: '',
          field: 'isSponsored',
        },
        {
          label: 'Transaction No',
          type: 'text',
          dropdownOptions: [],
          hidden: false,
          dateFormat: 'MMM d, yyyy hh:mm:ss',
          alignment: 'center',
          tooltip: false,
          onClick: {
            storeRowData: false,
            keyToStoredData: '',
            navigateTo: -1,
            apis: [],
          },
          customClass: '',
          field: 'transactionNumber',
          editable: false,
        },
        {
          label: 'Amount',
          type: 'text',
          dropdownOptions: [],
          hidden: false,
          dateFormat: 'MMM d, yyyy hh:mm:ss',
          alignment: 'center',
          tooltip: false,
          onClick: {
            storeRowData: false,
            keyToStoredData: '',
            navigateTo: -1,
            apis: [],
          },
          customClass: '',
          field: 'amount',
          editable: false,
        },
        {
          label: 'Payment Status',
          type: 'text',
          dropdownOptions: [],
          hidden: false,
          dateFormat: 'MMM d, yyyy hh:mm:ss',
          alignment: 'center',
          tooltip: false,
          onClick: {
            storeRowData: false,
            keyToStoredData: '',
            navigateTo: -1,
            apis: [],
          },
          customClass: '',
          field: 'paymentStatus',
          editable: false,
        },
      ],
      apis: [],
      addRowApis: [],
      deleteRowApis: [],
    };
  }

  getAllInactiveBusinesses() {
    this.apiService.getInactiveBusinesses().subscribe((data: any) => {
      console.log(data);
      this.inactiveBusinesses = data;
      this.updateRowData();
    })
  }

  getAllInactiveBusinessesBySponseredOrNot(isSponsered: boolean) {
    console.log('In sponsered or not');
    this.apiService.getInactiveBusinessesBySponseredOrNot(isSponsered).subscribe((data: any) => {
      console.log(data);
      this.inactiveBusinesses = data;
      this.updateRowData();
    })
  }

  updateRowData() {
    
      this.dataGridConfigPropertiescb46826a850a.rowData = this.inactiveBusinesses;
    
  }

  dropdownChangedf531530eff89(event: any) {
    this.dropdownConfigPropertiesf531530eff89 = event;
    console.log('Value of dropdown from welcome component: '+event.value);
    if(event.value != undefined)
    this.getAllInactiveBusinessesBySponseredOrNot(event.value);
    }
  gridRowChangedcb46826a850a(event: any) {
    this.dataGridConfigPropertiescb46826a850a.rowData = [...event.rowData];
  }
  onDeleteRowcb46826a850a(rowData: any) {
    this.dataGridConfigPropertiescb46826a850a.rowData =
      this.dataGridConfigPropertiescb46826a850a.rowData.filter(
        (row: any) => row.id !== rowData.id,
      );
  }
  saveBulkDatacb46826a850a(event: any) {
    this.dataGridConfigPropertiescb46826a850a.rowData = [...event.rowData];
  }
}
