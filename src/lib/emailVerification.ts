export function consumeVerificationToken(
  location: Pick<Location, 'hash' | 'pathname' | 'search'>,
  history: Pick<History, 'replaceState' | 'state'>,
) {
  const token = new URLSearchParams(location.hash.slice(1)).get('token');
  history.replaceState(
    history.state,
    '',
    `${location.pathname}${location.search}`,
  );
  return token?.trim() || null;
}
