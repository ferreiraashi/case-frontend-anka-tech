"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchAssets, Asset } from '@/services/assetService';

export default function AssetsPage() {
  const { data: assets, isLoading, isError, error } = useQuery<Asset[], Error>({
    queryKey: ['assets'],
    queryFn: fetchAssets,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ativos Financeiros</h1>
        <p>Carregando ativos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Ativos Financeiros</h1>
        <p>Erro ao carregar ativos: {error?.message || 'Erro desconhecido'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ativos Financeiros</h1>
      {assets && assets.length > 0 ? (
        <ul className="space-y-2">
          {assets.map((asset, index) => (
            <li key={index} className="p-4 border rounded-md shadow-sm">
              <h2 className="text-xl font-semibold">{asset.name}</h2>
              <p className="text-lg">Valor Atual: R$ {asset.currentValue.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum ativo encontrado.</p>
      )}
    </div>
  );
}