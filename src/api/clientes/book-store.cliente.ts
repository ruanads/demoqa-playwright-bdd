import { APIRequestContext, APIResponse } from '@playwright/test';
import { Credenciais } from '@api/modelos/book-store.modelos';

/** Cliente das APIs de Account e BookStore do demoqa (https://demoqa.com/swagger/). */
export class ClienteBookStore {
  constructor(private readonly request: APIRequestContext) {}

  criarUsuario(credenciais: Credenciais): Promise<APIResponse> {
    return this.request.post('/Account/v1/User', { data: credenciais });
  }

  gerarToken(credenciais: Credenciais): Promise<APIResponse> {
    return this.request.post('/Account/v1/GenerateToken', { data: credenciais });
  }

  estaAutorizado(credenciais: Credenciais): Promise<APIResponse> {
    return this.request.post('/Account/v1/Authorized', { data: credenciais });
  }

  listarLivros(): Promise<APIResponse> {
    return this.request.get('/BookStore/v1/Books');
  }

  adicionarLivros(idUsuario: string, isbns: string[], token: string): Promise<APIResponse> {
    return this.request.post('/BookStore/v1/Books', {
      headers: this.autenticacao(token),
      data: { userId: idUsuario, collectionOfIsbns: isbns.map((isbn) => ({ isbn })) },
    });
  }

  obterUsuario(idUsuario: string, token: string): Promise<APIResponse> {
    return this.request.get(`/Account/v1/User/${idUsuario}`, { headers: this.autenticacao(token) });
  }

  deletarUsuario(idUsuario: string, token: string): Promise<APIResponse> {
    return this.request.delete(`/Account/v1/User/${idUsuario}`, { headers: this.autenticacao(token) });
  }

  private autenticacao(token: string) {
    return { Authorization: `Bearer ${token}` };
  }
}
