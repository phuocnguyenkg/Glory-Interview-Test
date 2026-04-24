import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Atm } from '../atm.model';
import { atmActions } from './atm.actions';

export const atmEntityAdapter = createEntityAdapter<Atm>({
  selectId: (atm) => atm.id
});

export interface AtmState extends EntityState<Atm> {
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  deletedIds: Record<number, true>;
}

export const initialAtmState: AtmState = atmEntityAdapter.getInitialState({
  loading: false,
  error: null,
  lastFetchedAt: null,
  deletedIds: {}
});

export const atmReducer = createReducer(
  initialAtmState,
  on(atmActions.loadRequested, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(atmActions.loadSucceeded, (state, { atms, fetchedAt }) =>
    atmEntityAdapter.addMany(
      atms.filter((a) => !state.deletedIds[a.id]),
      {
      ...state,
      loading: false,
      error: null,
      lastFetchedAt: fetchedAt
      }
    )
  ),
  on(atmActions.loadFailed, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(atmActions.add, (state, { atm }) => {
    const { [atm.id]: _, ...rest } = state.deletedIds;
    return atmEntityAdapter.addOne(atm, { ...state, deletedIds: rest });
  }),
  on(atmActions.update, (state, { atm }) => atmEntityAdapter.upsertOne(atm, state)),
  on(atmActions.delete, (state, { id }) =>
    atmEntityAdapter.removeOne(id, {
      ...state,
      deletedIds: {
        ...state.deletedIds,
        [id]: true
      }
    })
  )
);
