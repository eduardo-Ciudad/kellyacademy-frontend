import { afterEach, describe, expect, it, vi } from 'vitest';
import { isMaintenanceMode } from './maintenance';

describe('isMaintenanceMode', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('retorna true quando a flag é exatamente "true"', () => {
    vi.stubEnv('VITE_MAINTENANCE_MODE', 'true');
    expect(isMaintenanceMode()).toBe(true);
  });

  it.each([undefined, 'false'])('retorna false para %s', (value) => {
    vi.stubEnv('VITE_MAINTENANCE_MODE', value);
    expect(isMaintenanceMode()).toBe(false);
  });
});
