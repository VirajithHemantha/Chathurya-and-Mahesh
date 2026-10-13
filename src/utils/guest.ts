// Helper to resolve personalized guest display name from URL (pathname or search params)

export function formatDisplayName(prefix: string, name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';

  if (prefix === 'Family') {
    return `${trimmed} and Family`;
  }
  if (prefix === 'Dear') {
    return trimmed;
  }
  if (prefix) {
    return `${prefix} ${trimmed}`;
  }
  return trimmed;
}

export function getGuestDisplayName(): string {
  if (typeof window === 'undefined') return '';

  // 1. Check URL query parameters (?name=... and ?prefix=...)
  const params = new URLSearchParams(window.location.search);
  const queryName = params.get('name')?.trim() || '';
  const queryPrefix = params.get('prefix')?.trim() || '';

  if (queryName) {
    return formatDisplayName(queryPrefix, queryName);
  }

  // 2. Check URL pathname (e.g. /sanjaya or /Mr.%20Sanjaya or /Sanjaya%20and%20Family)
  const pathname = window.location.pathname;
  if (pathname && pathname !== '/' && pathname.toLowerCase() !== '/admin') {
    const raw = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    const decoded = decodeURIComponent(raw).trim();
    if (decoded) {
      return decoded;
    }
  }

  return '';
}
