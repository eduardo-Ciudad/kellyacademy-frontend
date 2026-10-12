export type NavDestination = '/' | '/temas' | '/repertorio' | '/evolucao';

export function isNavActive(to: NavDestination, pathname: string): boolean {
  if (to === '/') {
    return pathname === '/' || pathname.startsWith('/redacoes/');
  }

  return pathname === to || pathname.startsWith(`${to}/`);
}
