import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  KeyValueDiffer,
  KeyValueDiffers,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'dropdown',
  standalone: true,
  imports:[NgSelectModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  @Input() configProperties: any;
  @Input() formValidation: any;
  @Output() configPropertiesChanged = new EventEmitter<string>();

  public form!: FormGroup;
  private configPropertiesDiffer!: KeyValueDiffer<string, any>;
  defaultDropDownValue: any;
  constructor(
    private fb: FormBuilder,
    private differs: KeyValueDiffers,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      [this.configProperties.formControlName]: ['', this.getValidations()],
    });
    this.setDefaultToDropDown();
    this.updateFormControlValue();

    this.configPropertiesDiffer = this.differs
      .find(this.configProperties)
      .create();
  }

  getCustomCssClasses() {
    let classes = '';
    if (
      this.configProperties.customCssClasses &&
      this.configProperties.customCssClasses.length > 0
    ) {
      classes = this.configProperties.customCssClasses.join(' ');
    }
    return classes;
  }

  ngDoCheck() {
    if (this.configPropertiesDiffer.diff(this.configProperties)) {
      this.updateFormControlValue();
    }
  }

  updateFormControlValue() {
    if (this.configProperties.value !== undefined) {
      this.form
        ?.get(this.configProperties.formControlName)
        ?.setValue(this.configProperties.value);
    }
  }

  getValidations() {
    let validations: any[] = [];
    if (!this.isReadOnly()) {
      this.formValidation.validations.forEach((v: any) => {
        switch (v.validationType) {
          case 'mandatory':
            if (v.required) {
              validations.push(Validators.required);
            }
            break;
        }
      });
      return validations;
    } else {
      return validations;
    }
  }

  isReadOnly(): boolean {
    const item = this.formValidation.validations.find(
      (item: any) => item.validationType === 'readonly',
    );
    return item ? item.required : false;
  }

  isMandatory() {
    return (
      this.formValidation.validations.find(
        (val: any) => val.validationType === 'mandatory',
      )?.required ?? false
    );
  }

  setDefaultToDropDown() {
    if (this.configProperties.type !== 'dropdown') return;
    if (this.configProperties.placeHolder) {
      return;
    } else {
      const option: any = this.configProperties?.listOfOptions[0] ?? undefined;
      const value =
        option[
          this.configProperties['dropValue'] ??
            this.configProperties['dropDisplayName'] ??
            'value'
        ] ?? option['displayName'];
      this.defaultDropDownValue = value;
    }
  }

  onDropdownChanged() {
    this.configProperties.value = this.form?.get(
      this.configProperties.formControlName,
    )?.value;
    console.log('value in DropDown Component: '+this.configProperties.value);
    this.configPropertiesChanged.emit(this.configProperties);
  }
}
