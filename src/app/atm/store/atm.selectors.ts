import { atmFeature } from './atm.feature';

export const {
  selectAll: selectAllAtms,
  selectEntities: selectAtmEntities,
  selectAtmCount,
  selectLoading: selectAtmsLoading,
  selectError: selectAtmsError,
  selectLastFetchedAt
} = atmFeature;
