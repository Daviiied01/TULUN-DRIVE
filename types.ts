
export enum UserRole {
  ADMIN = 'ADMIN',
  MOTORIZADO = 'MOTORIZADO'
}

export enum CarreraStatus {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
  LIQUIDADA = 'LIQUIDADA'
}

export enum LiquidacionStatus {
  SOLICITADA = 'SOLICITADA',
  PAGADA = 'PAGADA'
}

export enum TarifaType {
  MENSAJERIA = 'MENSAJERIA',
  CUMBAYA = 'CUMBAYA',
  TULUN_BASICO = 'TULUN_BASICO',
  TULUN_PREMIUM = 'TULUN_PREMIUM',
  ESTANDAR = 'ESTANDAR'
}

export enum RewardType {
  MONETARY = 'MONETARY',
  PERK = 'PERK'
}

export interface IncentiveChallenge {
  id: string;
  title: string;
  description: string;
  goal: number; // Número de carreras necesarias
  rewardType: RewardType;
  rewardValue: number | string; // Valor en $ o nombre del premio
  isActive: boolean;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  active: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  active: boolean;
  defaultTarifa: TarifaType;
}

export interface RateRange {
  minKm: number;
  maxKm: number;
  price: number;
}

export interface TarifaConfig {
  type: TarifaType;
  name: string;
  ranges: RateRange[];
  baseIncrementKm?: number;
  incrementPrice?: number;
}

export interface Carrera {
  id: string;
  motorizadoId: string;
  motorizadoName: string;
  restaurantId: string;
  restaurantName: string;
  clientName: string;
  pointA: string;
  pointB: string;
  km: number;
  price: number;
  motorizadoEarnings: number;
  status: CarreraStatus;
  date: string;
  tarifaUsed: TarifaType;
  liquidacionId?: string;
}

export interface Liquidacion {
  id: string;
  motorizadoId: string;
  motorizadoName: string;
  amount: number;
  date: string;
  status: LiquidacionStatus;
  voucherRef?: string;
  carrerasIds: string[];
}
