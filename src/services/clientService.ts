import apiClient from '@/lib/axios';

export interface Client {
  id: string;
  name: string;
  email: string;
  status: 'ativo' | 'inativo'; 
  createdAt?: string; 
  updatedAt?: string;
}


export interface CreateClientPayload {
  name: string;
  email: string;
  status: 'ativo' | 'inativo';
}

export const fetchClients = async (): Promise<Client[]> => {
  const response = await apiClient.get<Client[]>('/clients');
  return response.data;
};

export const fetchClientById = async (id: string): Promise<Client> => {
  const response = await apiClient.get<Client>(`/clients/${id}`);
  return response.data;
};

export const createClient = async (clientData: CreateClientPayload): Promise<Client> => {
  const response = await apiClient.post<Client>('/clients', clientData);
  return response.data;
};