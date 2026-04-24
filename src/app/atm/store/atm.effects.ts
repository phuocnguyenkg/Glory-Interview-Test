import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, switchMap, takeUntil, timer, withLatestFrom } from 'rxjs';

import { AtmApiService } from '../atm-api.service';
import { atmActions } from './atm.actions';
import { selectAtmCount, selectLastFetchedAt } from './atm.selectors';

@Injectable()
export class AtmEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(AtmApiService);
  private readonly store = inject(Store);

  readonly pollWhenOnPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(atmActions.enterTablePage),
      switchMap(() =>
        timer(0, 120_000).pipe(
          withLatestFrom(this.store.select(selectAtmCount), this.store.select(selectLastFetchedAt)),
          map(([tick, count, lastFetchedAt]) => {
            const isStale = !lastFetchedAt || Date.now() - lastFetchedAt > 120_000;
            const shouldLoad = tick > 0 || count === 0 || isStale;
            return shouldLoad ? atmActions.loadRequested() : null;
          }),
          filter((a): a is ReturnType<typeof atmActions.loadRequested> => a !== null),
          takeUntil(this.actions$.pipe(ofType(atmActions.leaveTablePage)))
        )
      )
    )
  );

  readonly loadAtms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(atmActions.loadRequested),
      exhaustMap(() =>
        this.api.fetchAtms().pipe(
          map((atms) => atmActions.loadSucceeded({ atms, fetchedAt: Date.now() })),
          catchError((err: unknown) => of(atmActions.loadFailed({ error: getErrorMessage(err) })))
        )
      )
    )
  );
}

function getErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (typeof err.error === 'string' && err.error.trim()) return err.error;
    if (err.message) return err.message;
    return `HTTP ${err.status}`;
  }

  if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
    return (err as any).message;
  }

  return 'Unknown error';
}
