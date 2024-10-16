import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessData } from '../../../models/bussinessData';
import { Business } from '../../../models/Business';

@Component({
  selector: 'app-view-business-modal',
  standalone: true,
  imports: [],
  templateUrl: './view-business-modal.component.html',
  styleUrl: './view-business-modal.component.css'
})
export class ViewBusinessModalComponent {
  @Input() businessData: Business = <Business>{}; // Input property to receive business data

  constructor(public activeModal: NgbActiveModal) { }

  closeModal() {
    this.activeModal.dismiss('Close click'); // Dismiss the modal
  }


}
