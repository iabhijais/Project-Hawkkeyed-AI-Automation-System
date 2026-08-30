/**
 * Server-side URL retrieval for the Web Extraction workflow.
 *
 * The workflow was labelled "Web Extraction" but never fetched anything — the
 * user pasted text and Gemini read it. This module does the actual retrieval,
 * with the guards a public endpoint needs.
 */

const FETCH_TIMEOUT_MS = 10_000;
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_REDIRECTS = 3;
const MAX_CHARS = 50_000;

const USER_AGENT =
  'Mozilla/5.0 (compatible; ProjectHawkkeyed/1.0; +https://hawkkeyed.vercel.app)';

export class UrlFetchError extends Error {}

/** Reject anything that is not a plain public https URL. */
function assertSafeUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new UrlFetchError('That does not look like a valid URL.');
  }

  if (url.protocol !== 'https:') {
    throw new UrlFetchError('Only https URLs are supported.');
  }

  const host = url.hostname.toLowerCase();

  // Block loopback, link-local, and private ranges (SSRF).
  const blockedHosts = ['localhost', '0.0.0.0', '[::1]', '::1'];
  if (blockedHosts.includes(host)) {
    throw new UrlFetchError('That host is not allowed.');
  }
  if (host.endsWith('.local') || host.endsWith('.internal')) {
    throw new UrlFetchError('That host is not allowed.');
  }

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    const isPrivate =
      a === 10 ||
      a === 127 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254) ||
      a === 0;
    if (isPrivate) throw new UrlFetchError('That host is not allowed.');
  }

  return url;
}

/** Turn an HTML document into readable plain text. */
export function htmlToText(html: string): string {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/(p|div|h[1-6]|li|tr|section|article)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();

  return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}\n\n[truncated]` : text;
}

export function looksLikeUrl(input: string): boolean {
  const trimmed = input.trim();
  return /^https?:\/\/\S+$/i.test(trimmed) && !/\s/.test(trimmed);
}

export interface FetchedPage {
  url: string;
  title: string | null;
  text: string;
  bytes: number;
}

export async function fetchPageText(raw: string): Promise<FetchedPage> {
  const url = assertSafeUrl(raw.trim());

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,text/plain;q=0.9' },
    });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new UrlFetchError(`The page did not respond within ${FETCH_TIMEOUT_MS / 1000}s.`);
    }
    throw new UrlFetchError('Could not reach that URL.');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new UrlFetchError(`The page returned HTTP ${response.status}.`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!/text\/html|text\/plain|application\/xhtml/i.test(contentType)) {
    throw new UrlFetchError(`That URL is ${contentType || 'not a web page'}, not readable text.`);
  }

  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > MAX_BYTES) {
    throw new UrlFetchError('That page is larger than the 2 MB limit.');
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_BYTES) {
    throw new UrlFetchError('That page is larger than the 2 MB limit.');
  }

  const html = new TextDecoder('utf-8').decode(buffer);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  return {
    url: response.url || url.toString(),
    title: titleMatch ? titleMatch[1].trim().slice(0, 200) : null,
    text: htmlToText(html),
    bytes: buffer.byteLength,
  };
}

export const URL_FETCH_LIMITS = { FETCH_TIMEOUT_MS, MAX_BYTES, MAX_REDIRECTS, MAX_CHARS };
