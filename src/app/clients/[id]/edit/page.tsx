// frontend/src/app/clients/[id]/edit/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { AxiosError } from 'axios';
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

import { clientFormSchema, ClientFormData } from '@/schemas/clientSchemas';
import { fetchClientById, updateClient, UpdateClientPayload, Client } from '@/services/clientService';

export default function EditClientPage() {
  const router = useRouter(); //
  const queryClient = useQueryClient(); // 
  const routeParams = useParams<{ id: string }>();
  const clientId = routeParams.id;

  const { data: client, isLoading: isLoadingClient, isError: isErrorClient, error: clientError } = useQuery<Client, Error>({
    queryKey: ['client', clientId],
    queryFn: () => fetchClientById(clientId),
    enabled: !!clientId,
  });

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        email: client.email,
        status: client.status,
      });
    }
  }, [client, form]);


  const mutation = useMutation<Client, Error, UpdateClientPayload>({
    mutationFn: (data) => updateClient(clientId, data),
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      queryClient.setQueryData(['client', clientId], updatedClient);

      toast.success("Cliente atualizado com sucesso!");
      router.push('/clients');
    },
    onError: (error) => {
      console.error("Erro ao atualizar cliente:", error);
      let errorMessage = "Erro ao atualizar cliente. Tente novamente.";
      if (error instanceof AxiosError && error.response?.status === 409) {
        errorMessage = error.response?.data?.message || "Este email já está em uso por outro cliente.";
        form.setError("email", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        errorMessage = error.message || errorMessage;
        form.setError("root.serverError", {
          type: "manual",
          message: errorMessage,
        });
      }
      toast.error(errorMessage);
    },
  });

  function onSubmit(data: ClientFormData) {
    mutation.mutate(data);
  }

  if (isLoadingClient) return <div className="container mx-auto p-4"><p>Carregando dados do cliente...</p></div>;
  if (isErrorClient) return <div className="container mx-auto p-4"><p>Erro ao carregar dados do cliente: {clientError?.message}</p></div>;
  if (!client && !isLoadingClient) return <div className="container mx-auto p-4"><p>Cliente não encontrado.</p></div>;
  if (!client) return <div className="container mx-auto p-4"><p>Carregando...</p></div>;


  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Cliente: {client?.name || 'Carregando...'}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root?.serverError && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.serverError.message}
            </p>
          )}

          <Button type="submit" disabled={mutation.isPending || isLoadingClient}> 
            {mutation.isPending ? 'Salvando alterações...' : 'Salvar Alterações'}
          </Button>
        </form>
      </Form>
    </div>
  );
}