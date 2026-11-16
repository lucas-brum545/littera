/**
 * Utilitários para decodificação e validação de tokens JWT (Spring Boot / Littera API)
 */

export function decodificarToken(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const partes = token.split(".");
    if (partes.length !== 3) return null;
    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Retorna true se o token for nulo, inválido, malformado ou se a data de expiração (exp) já tiver passado.
 * Adiciona uma margem de segurança de 5 segundos para evitar requisições no limite da expiração.
 */
export function isTokenExpirado(token) {
  if (!token) return true;
  const payload = decodificarToken(token);
  if (!payload || typeof payload.exp !== "number") return true;
  // payload.exp é em segundos (padrão JWT / Spring Boot); Date.now() é em milissegundos
  return Date.now() >= (payload.exp * 1000) - 5000;
}

/**
 * Retorna o tempo restante em milissegundos até o token expirar.
 * Se já expirou ou for inválido, retorna 0.
 */
export function obterTempoRestanteToken(token) {
  if (!token) return 0;
  const payload = decodificarToken(token);
  if (!payload || typeof payload.exp !== "number") return 0;
  const restanteMs = (payload.exp * 1000) - Date.now();
  return Math.max(0, restanteMs);
}

/**
 * Limpa o armazenamento e redireciona recarregando a página para a tela de login.
 */
export function encerrarSessaoExpirada(motivo = "expirado") {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  const caminhoAtual = window.location.pathname;
  // Evita recarregar em loop se já estiver na página de login
  if (caminhoAtual !== "/" && !caminhoAtual.startsWith("/login")) {
    window.location.href = `/login?sessao=${motivo}`;
  }
}
