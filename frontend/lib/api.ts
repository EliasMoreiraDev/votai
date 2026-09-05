// Vem do arquivo .env. Variáveis NEXT_PUBLIC_ são substituídas pelo valor
// literal na hora do build — mudar o .env exige reiniciar o `next dev`.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Erro de uma resposta HTTP fora da faixa 2xx. Guarda o `status` para quem
 * precisar decidir algo com ele — por exemplo, não repetir um 404.
 */
export class ErroApi extends Error {
  readonly status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status;
  }
}

type Metodo = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type OpcoesFetch = {
  metodo?: Metodo;
  /** Vira a query string. Chaves com `undefined` ou `null` são ignoradas. */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Enviado como JSON no corpo da requisição. */
  body?: unknown;
  /** Para cancelar a requisição — o React Query fornece um. */
  signal?: AbortSignal;
};

/**
 * Helper para extrair a mensagem de erro de forma segura, evitando [object Object]
 */
function extrairMensagemSegura(json: any, status: number): string {
  if (json?.errors && Array.isArray(json.errors) && json.errors.length > 0) {
    const primeiroErro = json.errors[0];
    return typeof primeiroErro === "string" ? json.errors.join(", ") : JSON.stringify(primeiroErro);
  }
  
  if (json?.message) {
    return typeof json.message === "string" ? json.message : JSON.stringify(json.message);
  }

  // Fallbacks comuns de middlewares node
  if (json?.error && typeof json.error === "string") return json.error;

  return `A API respondeu com status ${status}. (Não autorizado ou token inválido)`;
}

/**
 * Único ponto de contato com a API. Monta a URL, envia e devolve já o `data`
 * de dentro do envelope, tipado como `T`.
 */
export async function fetchApi<T>(
  caminho: string,
  { metodo = "GET", params, body, signal }: OpcoesFetch = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("Defina NEXT_PUBLIC_API_URL no arquivo .env.");
  }

  const url = new URL(`${API_URL}${caminho}`);
  for (const [chave, valor] of Object.entries(params ?? {})) {
    if (valor !== undefined && valor !== null) {
      url.searchParams.set(chave, String(valor));
    }
  }

  const resposta = await fetch(url, {
    method: metodo,
    signal,
    // CRÍTICO: Permite que cookies de sessão do BetterAuth sejam enviados/recebidos entre subdomínios
    credentials: "include", 
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // 204 significa "deu certo, sem conteúdo": chamar .json() aqui explodiria.
  if (resposta.status === 204) return undefined as T;

  let json;
  try {
    json = await resposta.json();
  } catch (err) {
    // Se a resposta não for JSON (ex: erro 502/nginx de HTML puro), protege a aplicação
    throw new ErroApi(`Falha inesperada do servidor (Status ${resposta.status}).`, resposta.status);
  }

  // O fetch não lança sozinho em 4xx/5xx — a checagem é nossa.
  if (!resposta.ok) {
    const motivo = extrairMensagemSegura(json, resposta.status);
    throw new ErroApi(motivo, resposta.status);
  }

  return json as T;
}