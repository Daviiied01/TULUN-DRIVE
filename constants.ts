
import { TarifaType, TarifaConfig, Restaurant } from './types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  { id: 'r1', name: 'Pizza Nostra', imageUrl: 'https://picsum.photos/seed/pizza/400/300', active: true, defaultTarifa: TarifaType.ESTANDAR },
  { id: 'r2', name: 'Sushi Zen', imageUrl: 'https://picsum.photos/seed/sushi/400/300', active: true, defaultTarifa: TarifaType.TULUN_PREMIUM },
  { id: 'r3', name: 'Burger Lab', imageUrl: 'https://picsum.photos/seed/burger/400/300', active: true, defaultTarifa: TarifaType.CUMBAYA },
  { id: 'r4', name: 'Tacos el Rey', imageUrl: 'https://picsum.photos/seed/tacos/400/300', active: true, defaultTarifa: TarifaType.TULUN_BASICO },
];

export const DEFAULT_TARIFAS: TarifaConfig[] = [
  {
    type: TarifaType.MENSAJERIA,
    name: 'Tarifa Mensajería',
    ranges: [
      { minKm: 0, maxKm: 5, price: 2.00 },
      { minKm: 5.001, maxKm: 10, price: 3.50 }
    ]
  },
  {
    type: TarifaType.CUMBAYA,
    name: 'Tarifa Cumbayá',
    ranges: [
      { minKm: 0, maxKm: 3, price: 3.50 },
      { minKm: 3.001, maxKm: 6, price: 4.50 },
      { minKm: 6.001, maxKm: 9, price: 5.50 },
      { minKm: 9.001, maxKm: 12, price: 6.50 }
    ],
    baseIncrementKm: 12,
    incrementPrice: 1.00
  },
  {
    type: TarifaType.TULUN_BASICO,
    name: 'Tarifa Tulún Básico',
    ranges: [
      { minKm: 0, maxKm: 5, price: 2.50 },
      { minKm: 5.001, maxKm: 8, price: 3.50 },
      { minKm: 8.001, maxKm: 11, price: 4.50 },
      { minKm: 11.001, maxKm: 14, price: 5.50 },
      { minKm: 14.001, maxKm: 17, price: 6.50 }
    ],
    baseIncrementKm: 17,
    incrementPrice: 1.00
  },
  {
    type: TarifaType.TULUN_PREMIUM,
    name: 'Tarifa Tulún Premium',
    ranges: [
      { minKm: 0, maxKm: 3, price: 2.00 },
      { minKm: 3.001, maxKm: 5, price: 2.50 },
      { minKm: 5.001, maxKm: 8, price: 3.50 },
      { minKm: 8.001, maxKm: 11, price: 4.50 },
      { minKm: 11.001, maxKm: 14, price: 5.50 },
      { minKm: 14.001, maxKm: 17, price: 6.50 }
    ],
    baseIncrementKm: 17,
    incrementPrice: 1.00
  },
  {
    type: TarifaType.ESTANDAR,
    name: 'Tarifa Motorizado Estándar',
    ranges: [
      { minKm: 0, maxKm: 3, price: 1.60 },
      { minKm: 3.001, maxKm: 5, price: 2.00 },
      { minKm: 5.001, maxKm: 8, price: 2.40 },
      { minKm: 8.001, maxKm: 11, price: 3.20 },
      { minKm: 11.001, maxKm: 14, price: 4.00 },
      { minKm: 14.001, maxKm: 17, price: 4.80 }
    ],
    baseIncrementKm: 17,
    incrementPrice: 0.80
  }
];
