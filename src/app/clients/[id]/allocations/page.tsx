"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { fetchClientById, Client } from "@/services/clientService";
import { fetchAssets, Asset } from "@/services/assetService";
import {
  fetchClientAllocations,
  createClientAllocation,
  Allocation,
  CreateAllocationPayload,
} from "@/services/allocationService";
import {
  allocationFormSchema,
  AllocationFormData,
} from "@/schemas/allocationSchemas";

export default function AllocationsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const clientId = routeParams.id;

  const { data: client, isLoading: isLoadingClient } = useQuery<Client, Error>({
    queryKey: ["client", clientId],
    queryFn: () => fetchClientById(clientId),
    enabled: !!clientId,
  });

  const { data: allocations, isLoading: isLoadingAllocations } = useQuery<
    Allocation[],
    Error
  >({
    queryKey: ["allocations", clientId],
    queryFn: () => fetchClientAllocations(clientId),
    enabled: !!clientId,
  });

  const { data: availableAssets, isLoading: isLoadingAssets } = useQuery<
    Asset[],
    Error
  >({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  const allocationForm = useForm<AllocationFormData>({
    resolver: zodResolver(allocationFormSchema),
    defaultValues: { assetId: "", quantity: 0 },
  });

  const allocationMutation = useMutation<
    Allocation,
    Error,
    CreateAllocationPayload
  >({
    mutationFn: (data) => createClientAllocation(clientId, data),
    onSuccess: () => {
      toast.success("Ativo alocado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["allocations", clientId] });
      allocationForm.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao alocar ativo.");
    },
  });

  function onAllocateSubmit(data: AllocationFormData) {
    allocationMutation.mutate(data);
  }

  if (isLoadingClient)
    return (
      <div className="container mx-auto p-4">
        <p>Carregando...</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-8xl">
      <Button
        variant="outline"
        onClick={() => router.push("/clients")}
        className="mb-6"
      >
        &larr; Voltar para Clientes
      </Button>
      <h1 className="text-3xl font-bold mb-2">
        Alocações de {client?.name || "Cliente"}
      </h1>
      <p className="text-gray-500 mb-8">
        Gerencie os ativos financeiros alocados para este cliente.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Portfólio Atual</h2>
          {isLoadingAllocations ? (
            <p>Carregando alocações...</p>
          ) : allocations && allocations.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border text-left">Ativo</th>
                    <th className="px-4 py-2 border text-right">Quantidade</th>
                    <th className="px-4 py-2 border text-right">Valor Unit.</th>
                    <th className="px-4 py-2 border text-right">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((alloc) => (
                    <tr key={alloc.id} className="border-t">
                      <td className="px-4 py-2 border">{alloc.asset.name}</td>
                      <td className="px-4 py-2 border text-right">
                        {alloc.quantity}
                      </td>
                      <td className="px-4 py-2 border text-right">
                        {alloc.asset.currentValue.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-4 py-2 border text-right font-semibold">
                        {(
                          alloc.quantity * alloc.asset.currentValue
                        ).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              Este cliente ainda não possui alocações cadastradas.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Alocar Novo Ativo</h2>
          <div className="p-6 bg-white rounded-lg shadow">
            <Form {...allocationForm}>
              <form
                onSubmit={allocationForm.handleSubmit(onAllocateSubmit)}
                className="flex items-start gap-4"
              >
                <FormField
                  control={allocationForm.control}
                  name="assetId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Ativo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger disabled={isLoadingAssets}>
                            <SelectValue
                              placeholder={
                                isLoadingAssets
                                  ? "Carregando ativos..."
                                  : "Selecione um ativo"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableAssets?.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={allocationForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="self-end"
                  disabled={allocationMutation.isPending}
                >
                  {allocationMutation.isPending ? "Alocando..." : "Alocar"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
