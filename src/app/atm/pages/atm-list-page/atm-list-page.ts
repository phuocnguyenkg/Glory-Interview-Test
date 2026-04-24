import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { Atm, AtmId } from '../../atm.model';
import { atmActions } from '../../store/atm.actions';
import { selectAllAtms, selectAtmsError, selectAtmsLoading, selectLastFetchedAt } from '../../store/atm.selectors';
import { AtmTable } from '../../ui/atm-table/atm-table';

@Component({
  selector: 'app-atm-list-page',
  imports: [CommonModule, AtmTable],
  templateUrl: './atm-list-page.html',
  styleUrl: './atm-list-page.scss'
})
export class AtmListPage implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  private readonly pageSize = 10;
  readonly pageIndex = signal(0);

  readonly atms = toSignal(this.store.select(selectAllAtms), { initialValue: [] });
  readonly loading = toSignal(this.store.select(selectAtmsLoading), { initialValue: false });
  readonly error = toSignal(this.store.select(selectAtmsError), { initialValue: null });
  readonly lastFetchedAt = toSignal(this.store.select(selectLastFetchedAt), { initialValue: null });

  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.atms().length / this.pageSize)));

  readonly currentPageAtms = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.atms().slice(start, start + this.pageSize);
  });

  readonly pageLabel = computed(() => `${this.pageIndex() + 1} / ${this.pageCount()}`);

  ngOnInit(): void {
    this.store.dispatch(atmActions.enterTablePage());
  }

  ngOnDestroy(): void {
    this.store.dispatch(atmActions.leaveTablePage());
  }

  onPrevPage(): void {
    this.pageIndex.update((i) => Math.max(0, i - 1));
  }

  onNextPage(): void {
    this.pageIndex.update((i) => Math.min(this.pageCount() - 1, i + 1));
  }

  onRetry(): void {
    this.store.dispatch(atmActions.loadRequested());
  }

  onAddNew(): void {
    void this.router.navigate(['/atms/new']);
  }

  onView(atm: Atm): void {
    void this.router.navigate(['/atms', atm.id]);
  }

  onEdit(atm: Atm): void {
    void this.router.navigate(['/atms', atm.id, 'edit']);
  }

  onDelete(id: AtmId): void {
    const ok = window.confirm('Delete this ATM?');
    if (!ok) return;
    this.store.dispatch(atmActions.delete({ id }));
  }
}
