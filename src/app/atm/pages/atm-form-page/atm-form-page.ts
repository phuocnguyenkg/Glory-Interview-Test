import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Atm, AtmDraft, AtmId } from '../../atm.model';
import { atmActions } from '../../store/atm.actions';
import { selectAllAtms, selectAtmEntities, selectAtmsLoading } from '../../store/atm.selectors';
import { AtmForm } from '../../ui/atm-form/atm-form';

type FormMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-atm-form-page',
  imports: [CommonModule, ReactiveFormsModule, AtmForm],
  templateUrl: './atm-form-page.html',
  styleUrl: './atm-form-page.scss'
})
export class AtmFormPage implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly mode = signal<FormMode>('create');
  readonly id = signal<AtmId | null>(null);

  readonly atms = toSignal(this.store.select(selectAllAtms), { initialValue: [] });
  readonly entities = toSignal(
    this.store.select(selectAtmEntities) as unknown as Observable<Dictionary<Atm>>,
    { initialValue: {} as Dictionary<Atm> }
  );
  readonly loading = toSignal(this.store.select(selectAtmsLoading), { initialValue: false });

  readonly selectedAtm = computed<Atm | null>(() => {
    const id = this.id();
    if (id == null) return null;
    return this.entities()[String(id)] ?? null;
  });

  readonly title = computed(() => {
    const m = this.mode();
    if (m === 'create') return 'Add New ATM';
    if (m === 'edit') return 'Edit ATM';
    return 'View ATM';
  });

  readonly form = this.fb.nonNullable.group({
    atmName: ['', [Validators.required]],
    manufacturer: ['', [Validators.required]],
    type: ['', [Validators.required]],
    serialNumber: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]]
  });

  readonly canSave = computed(() => this.mode() !== 'view' && this.form.valid && !this.loading());

  constructor() {
    effect(() => {
      const atm = this.selectedAtm();
      const mode = this.mode();

      if (mode === 'create') return;
      if (!atm) return;

      this.form.setValue(mapAtmToDraft(atm));
      if (mode === 'view') this.form.disable();
      else this.form.enable();
    });
  }

  ngOnInit(): void {
    const mode = (this.route.snapshot.data['mode'] as FormMode | undefined) ?? 'create';
    this.mode.set(mode);

    const rawId = this.route.snapshot.paramMap.get('id');
    if (rawId) this.id.set(Number(rawId));

    if (mode !== 'create' && this.selectedAtm() == null) {
      this.store.dispatch(atmActions.loadRequested());
    }

    if (mode === 'create') {
      this.form.enable();
      this.form.reset();
    }
  }

  onCancel(): void {
    void this.router.navigate(['/atms']);
  }

  onSave(): void {
    if (this.mode() === 'view') return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const draft = this.form.getRawValue();

    if (this.mode() === 'create') {
      const nextId = getNextId(this.atms());
      this.store.dispatch(atmActions.add({ atm: { id: nextId, ...draft } }));
      void this.router.navigate(['/atms']);
      return;
    }

    if (this.mode() === 'edit') {
      const id = this.id();
      if (id == null) return;
      this.store.dispatch(atmActions.update({ atm: { id, ...draft } }));
      void this.router.navigate(['/atms']);
      return;
    }
  }
}

function mapAtmToDraft(atm: Atm): AtmDraft {
  return {
    atmName: atm.atmName,
    manufacturer: atm.manufacturer,
    type: atm.type,
    serialNumber: atm.serialNumber,
    imageUrl: atm.imageUrl
  };
}

function getNextId(atms: Atm[]): AtmId {
  let max = 0;
  for (const a of atms) max = Math.max(max, a.id);
  return max + 1;
}
