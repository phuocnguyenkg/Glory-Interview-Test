export type AtmId = number;

export interface Atm {
  id: AtmId;
  atmName: string;
  manufacturer: string;
  type: string;
  serialNumber: string;
  imageUrl: string;
}

export type AtmDraft = Omit<Atm, 'id'>;
