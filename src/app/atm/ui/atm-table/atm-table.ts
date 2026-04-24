import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Atm, AtmId } from '../../atm.model';

@Component({
  selector: 'app-atm-table',
  imports: [CommonModule],
  templateUrl: './atm-table.html',
  styleUrl: './atm-table.scss'
})
export class AtmTable {
  @Input({ required: true }) atms: Atm[] = [];
  @Input({ required: true }) loading = false;
  @Input({ required: true }) error: string | null = null;
  @Input({ required: true }) lastFetchedAt: number | null = null;

  @Input({ required: true }) pageLabel = '1 / 1';
  @Input({ required: true }) canPrev = false;
  @Input({ required: true }) canNext = false;

  @Output() readonly addNew = new EventEmitter<void>();
  @Output() readonly retry = new EventEmitter<void>();
  @Output() readonly prevPage = new EventEmitter<void>();
  @Output() readonly nextPage = new EventEmitter<void>();

  @Output() readonly view = new EventEmitter<Atm>();
  @Output() readonly edit = new EventEmitter<Atm>();
  @Output() readonly delete = new EventEmitter<AtmId>();
}
