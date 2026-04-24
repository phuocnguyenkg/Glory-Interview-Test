import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-atm-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './atm-form.html',
  styleUrl: './atm-form.scss'
})
export class AtmForm {
  @Input({ required: true }) title = '';
  @Input({ required: true }) mode: 'create' | 'edit' | 'view' = 'create';
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) canSave = false;

  @Output() readonly cancel = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<void>();
}
