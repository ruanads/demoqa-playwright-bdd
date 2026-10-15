import { APIRequestContext, APIResponse } from '@playwright/test';
import { Credentials } from './models';

/** Client das APIs de Account e BookStore do demoqa (https://demoqa.com/swagger/). */
export class BookStoreApi {
  constructor(private readonly request: APIRequestContext) {}

  createUser(credentials: Credentials): Promise<APIResponse> {
    return this.request.post('/Account/v1/User', { data: credentials });
  }

  generateToken(credentials: Credentials): Promise<APIResponse> {
    return this.request.post('/Account/v1/GenerateToken', { data: credentials });
  }

  isAuthorized(credentials: Credentials): Promise<APIResponse> {
    return this.request.post('/Account/v1/Authorized', { data: credentials });
  }

  listBooks(): Promise<APIResponse> {
    return this.request.get('/BookStore/v1/Books');
  }

  addBooks(userId: string, isbns: string[], token: string): Promise<APIResponse> {
    return this.request.post('/BookStore/v1/Books', {
      headers: this.auth(token),
      data: { userId, collectionOfIsbns: isbns.map((isbn) => ({ isbn })) },
    });
  }

  getUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.get(`/Account/v1/User/${userId}`, { headers: this.auth(token) });
  }

  deleteUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`/Account/v1/User/${userId}`, { headers: this.auth(token) });
  }

  private auth(token: string) {
    return { Authorization: `Bearer ${token}` };
  }
}
