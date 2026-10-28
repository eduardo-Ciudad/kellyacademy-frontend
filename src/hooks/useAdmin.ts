import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
  AdminUsuarioDetalhe,
  AdminUsuarioResumo,
  AdminUsuariosFiltros,
  AdminVisaoGeral,
  PeriodoAdmin,
  ConcessaoPro,
} from '@/types/admin';
import type { Pagina } from '@/types/api';

const ADMIN_STALE_TIME = 30_000;
export const adminQueryKey = ['admin'] as const;

export function adminUsuariosPath(filtros: AdminUsuariosFiltros) {
  const params = new URLSearchParams();
  const busca = filtros.busca?.trim();
  if (busca) params.set('busca', busca);
  if (filtros.plano) params.set('plano', filtros.plano);
  if (filtros.email) params.set('email', filtros.email);
  params.set('pagina', String(filtros.pagina));
  params.set('tamanho', String(filtros.tamanho));
  return `/admin/usuarios?${params.toString()}`;
}

export function useAdminVisaoGeral(periodo: PeriodoAdmin) {
  return useQuery({
    queryKey: [...adminQueryKey, 'visao-geral', periodo],
    queryFn: ({ signal }) =>
      api<AdminVisaoGeral>(`/admin/visao-geral?periodo=${periodo}`, { signal }),
    placeholderData: keepPreviousData,
    staleTime: ADMIN_STALE_TIME,
  });
}

export function useAdminUsuarios(filtros: AdminUsuariosFiltros) {
  return useQuery({
    queryKey: [...adminQueryKey, 'usuarios', filtros],
    queryFn: ({ signal }) =>
      api<Pagina<AdminUsuarioResumo>>(adminUsuariosPath(filtros), { signal }),
    placeholderData: keepPreviousData,
    staleTime: ADMIN_STALE_TIME,
  });
}

export function useAdminUsuario(id: string) {
  return useQuery({
    queryKey: [...adminQueryKey, 'usuarios', id],
    queryFn: ({ signal }) =>
      api<AdminUsuarioDetalhe>(`/admin/usuarios/${encodeURIComponent(id)}`, {
        signal,
      }),
    enabled: Boolean(id),
    staleTime: ADMIN_STALE_TIME,
  });
}

function useAdminMutation(pathForId: (id: string) => string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api<void>(pathForId(id), { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryKey }),
  });
}

function useConcessaoMutation<TBody>(
  pathForId: (id: string) => string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & TBody) =>
      api<ConcessaoPro>(pathForId(id), {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKey });
      void queryClient.invalidateQueries({
        queryKey: [...adminQueryKey, 'usuarios', variables.id],
      });
    },
  });
}

export function useConcederPro() {
  return useConcessaoMutation<{ dias: number; motivo: string }>(
    (id) => `/admin/usuarios/${encodeURIComponent(id)}/concessao-pro`,
  );
}

export function useRevogarPro() {
  return useConcessaoMutation<{ motivo: string }>(
    (id) => `/admin/usuarios/${encodeURIComponent(id)}/concessao-pro/revogar`,
  );
}

export function useReenviarVerificacao() {
  return useAdminMutation(
    (id) => `/admin/usuarios/${encodeURIComponent(id)}/reenviar-verificacao`,
  );
}

export function useZerarCotaHoje() {
  return useAdminMutation(
    (id) => `/admin/usuarios/${encodeURIComponent(id)}/zerar-cota-hoje`,
  );
}
