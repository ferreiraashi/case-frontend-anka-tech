import apiClient from '@/lib/axios';

export interface Client {
  id: string;
  name: string;
  email: string;
  status: 'ativo' | 'inativo'; 
  createdAt?: string; 
  updatedAt?: string;
}

// Função para buscar todos os clientes
export const fetchClients = async (): Promise<Client[]> => {
  const response = await apiClient.get<Client[]>('/clients');
  return response.data;
};

// Função para buscar um cliente específico por ID
// (Será útil para a edição mais tarde, mas bom já ter)
export const fetchClientById = async (id: string): Promise<Client> => {
  const response = await apiClient.get<Client>(`/clients/${id}`);
  return response.data;
};