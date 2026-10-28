import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthRouteFallback } from '@/components/auth/AuthRouteFallback';
import { EvolucaoSkeleton } from '@/components/evolucao/EvolucaoSkeleton';
import { HomeGate } from '@/components/landing/HomeGate';
import { RepertorioSkeleton } from '@/components/repertorio/RepertorioSkeleton';
import { AppShell } from '@/components/layout/AppShell';
import { LazyRoute } from '@/components/routing/LazyRoute';
import { RequireAdmin } from '@/components/routing/RequireAdmin';
import { PublicOnlyRoute, RequireAuth } from '@/lib/auth';

const CriarConta = lazy(() =>
  import('@/pages/CriarConta').then((module) => ({
    default: module.CriarConta,
  })),
);
const Entrar = lazy(() =>
  import('@/pages/Entrar').then((module) => ({ default: module.Entrar })),
);
const VerificarEmail = lazy(() =>
  import('@/pages/VerificarEmail').then((module) => ({
    default: module.VerificarEmail,
  })),
);
const EsqueciSenha = lazy(() =>
  import('@/pages/EsqueciSenha').then((module) => ({
    default: module.EsqueciSenha,
  })),
);
const RedefinirSenha = lazy(() =>
  import('@/pages/RedefinirSenha').then((module) => ({
    default: module.RedefinirSenha,
  })),
);
const AlterarSenha = lazy(() =>
  import('@/pages/AlterarSenha').then((module) => ({
    default: module.AlterarSenha,
  })),
);
const Cookies = lazy(() =>
  import('@/pages/Cookies').then((module) => ({ default: module.Cookies })),
);
const Privacidade = lazy(() =>
  import('@/pages/Privacidade').then((module) => ({
    default: module.Privacidade,
  })),
);
const Termos = lazy(() =>
  import('@/pages/Termos').then((module) => ({ default: module.Termos })),
);
const Editor = lazy(() =>
  import('@/pages/Editor').then((module) => ({ default: module.Editor })),
);
const Historico = lazy(() =>
  import('@/pages/Historico').then((module) => ({ default: module.Historico })),
);
const NotFound = lazy(() =>
  import('@/pages/NotFound').then((module) => ({ default: module.NotFound })),
);
const Resultado = lazy(() =>
  import('@/pages/Resultado').then((module) => ({ default: module.Resultado })),
);
const Temas = lazy(() =>
  import('@/pages/Temas').then((module) => ({ default: module.Temas })),
);
const NovaRedacao = lazy(() =>
  import('@/pages/NovaRedacao').then((module) => ({
    default: module.NovaRedacao,
  })),
);
const TemasPossiveis = lazy(() =>
  import('@/pages/TemasPossiveis').then((module) => ({
    default: module.TemasPossiveis,
  })),
);
const Transcricao = lazy(() =>
  import('@/pages/Transcricao').then((module) => ({
    default: module.Transcricao,
  })),
);

const Evolucao = lazy(() =>
  import('@/pages/Evolucao').then((module) => ({ default: module.Evolucao })),
);
const Repertorio = lazy(() =>
  import('@/pages/Repertorio').then((module) => ({
    default: module.Repertorio,
  })),
);
const Planos = lazy(() =>
  import('@/pages/Planos').then((module) => ({ default: module.Planos })),
);
const AssinaturaSucesso = lazy(() =>
  import('@/pages/AssinaturaSucesso').then((module) => ({
    default: module.AssinaturaSucesso,
  })),
);
const AdminShell = lazy(() =>
  import('@/components/admin/AdminShell').then((module) => ({
    default: module.AdminShell,
  })),
);
const AdminVisaoGeral = lazy(() =>
  import('@/pages/admin/AdminVisaoGeral').then((module) => ({
    default: module.AdminVisaoGeral,
  })),
);
const AdminUsuarios = lazy(() =>
  import('@/pages/admin/AdminUsuarios').then((module) => ({
    default: module.AdminUsuarios,
  })),
);
const AdminUsuarioDetalhe = lazy(() =>
  import('@/pages/admin/AdminUsuarioDetalhe').then((module) => ({
    default: module.AdminUsuarioDetalhe,
  })),
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeGate />,
    children: [
      {
        index: true,
        element: (
          <LazyRoute>
            <Historico />
          </LazyRoute>
        ),
      },
    ],
  },
  {
    path: '/cookies',
    element: (
      <LazyRoute>
        <Cookies />
      </LazyRoute>
    ),
  },
  {
    path: '/privacidade',
    element: (
      <LazyRoute>
        <Privacidade />
      </LazyRoute>
    ),
  },
  {
    path: '/termos',
    element: (
      <LazyRoute>
        <Termos />
      </LazyRoute>
    ),
  },
  {
    path: '/verificar-email',
    element: (
      <Suspense fallback={<AuthRouteFallback variant="login" />}>
        <VerificarEmail />
      </Suspense>
    ),
  },
  {
    path: '/esqueci-senha',
    element: (
      <Suspense fallback={<AuthRouteFallback variant="login" />}>
        <EsqueciSenha />
      </Suspense>
    ),
  },
  {
    path: '/redefinir-senha',
    element: (
      <Suspense fallback={<AuthRouteFallback variant="login" />}>
        <RedefinirSenha />
      </Suspense>
    ),
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/entrar',
        element: (
          <Suspense fallback={<AuthRouteFallback variant="login" />}>
            <Entrar />
          </Suspense>
        ),
      },
      {
        path: '/criar-conta',
        element: (
          <Suspense fallback={<AuthRouteFallback variant="cadastro" />}>
            <CriarConta />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <RequireAdmin />,
        children: [
          {
            element: (
              <LazyRoute>
                <AdminShell />
              </LazyRoute>
            ),
            children: [
              {
                path: '/admin',
                element: (
                  <LazyRoute>
                    <AdminVisaoGeral />
                  </LazyRoute>
                ),
              },
              {
                path: '/admin/usuarios',
                element: (
                  <LazyRoute>
                    <AdminUsuarios />
                  </LazyRoute>
                ),
              },
              {
                path: '/admin/usuarios/:id',
                element: (
                  <LazyRoute>
                    <AdminUsuarioDetalhe />
                  </LazyRoute>
                ),
              },
            ],
          },
        ],
      },
      {
        element: <AppShell />,
        children: [
          {
            path: '/planos',
            element: (
              <LazyRoute>
                <Planos />
              </LazyRoute>
            ),
          },
          {
            path: '/assinatura/sucesso',
            element: (
              <LazyRoute>
                <AssinaturaSucesso />
              </LazyRoute>
            ),
          },
          {
            path: '/temas',
            element: (
              <LazyRoute>
                <Temas />
              </LazyRoute>
            ),
          },
          {
            path: '/nova-redacao/:temaId?',
            element: (
              <LazyRoute>
                <NovaRedacao />
              </LazyRoute>
            ),
          },
          {
            path: '/temas/possiveis',
            element: (
              <LazyRoute>
                <TemasPossiveis />
              </LazyRoute>
            ),
          },
          {
            path: '/repertorio/:codigo?',
            element: (
              <Suspense fallback={<RepertorioSkeleton />}>
                <Repertorio />
              </Suspense>
            ),
          },
          {
            path: '/evolucao',
            element: (
              <Suspense fallback={<EvolucaoSkeleton />}>
                <Evolucao />
              </Suspense>
            ),
          },
          {
            path: '/conta/senha',
            element: (
              <LazyRoute>
                <AlterarSenha />
              </LazyRoute>
            ),
          },
          {
            path: '/redacoes/:id',
            element: (
              <LazyRoute>
                <Resultado />
              </LazyRoute>
            ),
          },
        ],
      },
      {
        path: '/temas/:temaId/escrever',
        element: (
          <LazyRoute>
            <Editor />
          </LazyRoute>
        ),
      },
      {
        path: '/temas/:temaId/foto',
        element: (
          <LazyRoute>
            <Transcricao />
          </LazyRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <LazyRoute>
        <NotFound />
      </LazyRoute>
    ),
  },
]);
