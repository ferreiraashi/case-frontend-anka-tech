"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

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

import { clientFormSchema, ClientFormData } from "@/schemas/clientSchemas";
import { createClient, CreateClientPayload } from "@/services/clientService";

export default function NewClientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      status: undefined,
    },
  });

  const mutation = useMutation<unknown, Error, CreateClientPayload>({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente cadastrado com sucesso!");
      router.push("/clients");
    },
    onError: (error) => {
      console.error("Erro ao criar cliente:", error);
      let errorMessage = "Erro ao criar cliente. Tente novamente.";

      if (error instanceof AxiosError && error.response?.status === 409) {
        errorMessage =
          error.response?.data?.message || "Este email já está em uso.";
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

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button
        variant="outline"
        onClick={() => router.push("/clients")}
        className="mb-6"
      >
        &larr; Voltar para Clientes
      </Button>
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Cliente</h1>
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
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar Cliente"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
