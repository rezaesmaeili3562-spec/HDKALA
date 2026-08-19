import type { Coupon, StoreSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

export const defaultSettings: StoreSettings = { ...DEFAULT_SETTINGS };

export const defaultCoupons: Coupon[] = [
  {
    id: 'cpn-welcome',
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    active: true,
    minOrder: 0,
    usageCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'cpn-save50',
    code: 'SAVE50K',
    type: 'fixed',
    value: 50000,
    active: true,
    minOrder: 200000,
    usageCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];
