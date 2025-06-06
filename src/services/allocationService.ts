import apiClient from '@/lib/axios';
import type { Asset } from './assetService';

export interface Allocation {
  id: string;
  quantity: number;
  clientId: string;
  assetId: string;
  assignedAt: string;
  asset: Asset;
}

export interface CreateAllocationPayload {
    assetId: string;
    quantity: number;
}

export const fetchClientAllocations = async (clientId: string): Promise<Allocation[]> => {
  if (!clientId) return []; 
  const response = await apiClient.get<Allocation[]>(`/clients/${clientId}/allocations`);
  return response.data;
};

export const createClientAllocation = async (
    clientId: string,
    payload: CreateAllocationPayload
): Promise<Allocation> => {
  const response = await apiClient.post<Allocation>(`/clients/${clientId}/allocations`, payload);
  return response.data;
};