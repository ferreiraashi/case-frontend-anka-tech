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

export type UpdateClientPayload = CreateClientPayload;

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

export const updateClient = async (id: string, clientData: UpdateClientPayload): Promise<Client> => {
  const response = await apiClient.put<Client>(`/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await apiClient.delete(`/clients/${id}`);
};