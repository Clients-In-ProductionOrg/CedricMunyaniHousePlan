import { HousePlan } from '@/types/housePlan';
import { fallbackPlans } from '@/data/fallbackPlans';

export const housePlans: HousePlan[] = fallbackPlans as unknown as HousePlan[];
