import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Atm } from './atm.model';

interface DummyJsonProductsResponse {
  products: Array<{
    id: number;
    title: string;
    brand?: string;
    category?: string;
    sku?: string;
    thumbnail?: string;
    images?: string[];
  }>;
}

@Injectable({ providedIn: 'root' })
export class AtmApiService {
  private readonly http = inject(HttpClient);

  fetchAtms(): Observable<Atm[]> {
    return this.http
      .get<DummyJsonProductsResponse>('https://dummyjson.com/products?limit=100')
      .pipe(
        map((res) =>
          res.products.map((p) => ({
            id: p.id,
            atmName: p.title,
            manufacturer: p.brand ?? 'Unknown',
            type: p.category ?? 'General',
            serialNumber: String(p.sku ?? p.id),
            imageUrl: p.thumbnail ?? p.images?.[0] ?? ''
          }))
        )
      );
  }
}
