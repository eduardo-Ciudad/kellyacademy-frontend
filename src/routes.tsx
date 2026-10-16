import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { EvolucaoSkeleton } from '@/components/evolucao/EvolucaoSkeleton';
import { HomeGate } from '@/components/landing/HomeGate';
import { RepertorioSkeleton } from '@/components/repertorio/RepertorioSkeleton';
import { AppShell } from '@/components/layout/AppShell';
import { LazyRoute } from '@/components/routing/LazyRoute';
import { PublicOnlyRoute, RequireAuth } from '@/lib/auth';

const CriarConta = lazy(() =>
  import('@/pages/CriarConta').then((module) => ({
    default: module.CriarConta,
  })),
);
const Entrar = lazy(() =>
  import('@/pages/Entrar').then((module) => ({ default: module.Entrar })),
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
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/entrar',
        element: (
          <LazyRoute>
            <Entrar />
          </LazyRoute>
        ),
      },
      {
        path: '/criar-conta',
        element: (
          <LazyRoute>
            <CriarConta />
          </LazyRoute>
        ),
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/temas',
            element: (
              <LazyRoute>
                <Temas />
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
