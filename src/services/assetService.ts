import apiClient from '@/lib/axios';

export interface Asset {
  name: string;
  currentValue: number;
}

export const fetchAssets = async (): Promise<Asset[]> => {
  const response = await apiClient.get<Asset[]>('/assets');
  return response.data;
};