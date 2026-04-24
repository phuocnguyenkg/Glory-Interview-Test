import { createFeature, createSelector } from '@ngrx/store';

import { atmEntityAdapter, atmReducer } from './atm.reducer';

export const atmFeature = createFeature({
  name: 'atm',
  reducer: atmReducer,
  extraSelectors: ({ selectAtmState }) => {
    const entitySelectors = atmEntityAdapter.getSelectors(selectAtmState);

    return {
      ...entitySelectors,
      selectAtmCount: createSelector(entitySelectors.selectIds, (ids) => ids.length)
    };
  }
});
