import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Atm, AtmId } from '../atm.model';

export const atmActions = createActionGroup({
  source: 'ATM',
  events: {
    'Enter Table Page': emptyProps(),
    'Leave Table Page': emptyProps(),

    'Load Requested': emptyProps(),
    'Load Succeeded': props<{ atms: Atm[]; fetchedAt: number }>(),
    'Load Failed': props<{ error: string }>(),

    'Add': props<{ atm: Atm }>(),
    'Update': props<{ atm: Atm }>(),
    'Delete': props<{ id: AtmId }>()
  }
});
