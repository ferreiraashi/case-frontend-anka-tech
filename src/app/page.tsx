import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          Bem-vindo à Plataforma Anka Tech
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Selecione uma opção abaixo para começar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/clients" className="group">
          <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <Users className="w-10 h-10 text-blue-500" />
              <div>
                <CardTitle className="text-2xl font-semibold">
                  Gerenciar Clientes
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Adicione, liste, edite e exclua os clientes da sua carteira. 
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/assets" className="group">
          <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <BarChart3 className="w-10 h-10 text-green-500" />
              <div>
                <CardTitle className="text-2xl font-semibold">
                  Visualizar Ativos
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Veja a lista de ativos financeiros e seus valores atuais. 
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}