import { useEffect } from 'react';

const SITE_URL = 'https://kellyacademy.com.br';

export const DEFAULT_META_DESCRIPTION =
  'Treine a redação do ENEM com correção por IA nas 5 competências do INEP, repertório organizado por tema e evolução da sua nota.';

export type PageMetaOptions = {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
};

export function canonicalUrl(path = '/') {
  return new URL(path, `${SITE_URL}/`).toString();
}

function restoreElement(
  element: HTMLElement,
  attribute: 'content' | 'href',
  previousValue: string | null,
  created: boolean,
) {
  if (created) element.remove();
  else if (previousValue === null) element.removeAttribute(attribute);
  else element.setAttribute(attribute, previousValue);
}

export function applyPageMeta(
  doc: Document,
  { title, description, path = '/', noindex = false }: PageMetaOptions,
) {
  const previousTitle = doc.title;
  doc.title = title;

  const previousDescription = doc.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );
  const descriptionElement = previousDescription ?? doc.createElement('meta');
  const descriptionCreated = !previousDescription;
  const previousDescriptionContent = descriptionElement.getAttribute('content');
  if (descriptionCreated) {
    descriptionElement.name = 'description';
    doc.head.append(descriptionElement);
  }
  if (description !== undefined) descriptionElement.content = description;

  const previousRobots = doc.querySelector<HTMLMetaElement>(
    'meta[name="robots"]',
  );
  const robotsElement = previousRobots ?? doc.createElement('meta');
  const robotsCreated = !previousRobots;
  const previousRobotsContent = robotsElement.getAttribute('content');
  if (robotsCreated) {
    robotsElement.name = 'robots';
    doc.head.append(robotsElement);
  }
  robotsElement.content = noindex ? 'noindex, nofollow' : 'index, follow';

  const previousCanonical = doc.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  const canonicalElement = previousCanonical ?? doc.createElement('link');
  const canonicalCreated = !previousCanonical;
  const previousCanonicalHref = canonicalElement.getAttribute('href');
  if (noindex) previousCanonical?.remove();
  else {
    if (canonicalCreated) {
      canonicalElement.rel = 'canonical';
      doc.head.append(canonicalElement);
    }
    canonicalElement.href = canonicalUrl(path);
  }

  return () => {
    doc.title = previousTitle;
    restoreElement(
      descriptionElement,
      'content',
      previousDescriptionContent,
      descriptionCreated,
    );
    restoreElement(
      robotsElement,
      'content',
      previousRobotsContent,
      robotsCreated,
    );
    if (noindex && previousCanonical) doc.head.append(previousCanonical);
    else
      restoreElement(
        canonicalElement,
        'href',
        previousCanonicalHref,
        canonicalCreated,
      );
  };
}

export function usePageMeta({
  title,
  description,
  path = '/',
  noindex = false,
}: PageMetaOptions) {
  useEffect(
    () => applyPageMeta(document, { title, description, path, noindex }),
    [description, noindex, path, title],
  );
}
