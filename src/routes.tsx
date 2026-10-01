import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PublicOnlyRoute, RequireAuth } from '@/lib/auth';
import { CriarConta } from '@/pages/CriarConta';
import { Entrar } from '@/pages/Entrar';
import { Editor } from '@/pages/Editor';
import { Historico } from '@/pages/Historico';
import { NotFound } from '@/pages/NotFound';
import { Resultado } from '@/pages/Resultado';
import { Temas } from '@/pages/Temas';

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/entrar', element: <Entrar /> },
      { path: '/criar-conta', element: <CriarConta /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/',
            element: <Historico />,
          },
          {
            path: '/temas',
            element: <Temas />,
          },
          {
            path: '/redacoes/:id',
            element: <Resultado />,
          },
        ],
      },
      {
        path: '/temas/:temaId/escrever',
        element: <Editor />,
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
