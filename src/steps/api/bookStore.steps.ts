import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { After, Given, Then, When } from '../../fixtures/fixtures';
import {
  AddBooksResponse,
  BooksResponse,
  CreateUserResponse,
  TokenResponse,
  UserResponse,
} from '../../api/models';
import { buildCredentials } from '../../utils/dataFactory';

Given('que eu crio um novo usuário', async ({ bookStoreApi, ctx }) => {
  ctx.credentials = buildCredentials();
  const response = await bookStoreApi.createUser(ctx.credentials);
  expect(response.status()).toBe(201);

  const body: CreateUserResponse = await response.json();
  expect(body.username).toBe(ctx.credentials.userName);
  expect(body.userID).toBeTruthy();
  expect(body.books).toEqual([]);
  ctx.userId = body.userID;
});

When('eu gero um token de acesso para o usuário', async ({ bookStoreApi, ctx }) => {
  const response = await bookStoreApi.generateToken(ctx.credentials!);
  expect(response.status()).toBe(200);

  const body: TokenResponse = await response.json();
  expect(body.status).toBe('Success');
  expect(body.result).toBe('User authorized successfully.');
  expect(body.token).toBeTruthy();
  ctx.token = body.token!;
});

Then('o usuário deve estar autorizado', async ({ bookStoreApi, ctx }) => {
  const response = await bookStoreApi.isAuthorized(ctx.credentials!);
  expect(response.status()).toBe(200);
  expect(await response.json()).toBe(true);
});

When('eu listo os livros disponíveis', async ({ bookStoreApi, ctx }) => {
  const response = await bookStoreApi.listBooks();
  expect(response.status()).toBe(200);

  const body: BooksResponse = await response.json();
  expect(body.books.length).toBeGreaterThan(0);
  for (const book of body.books) {
    expect(book).toEqual(expect.objectContaining({ isbn: expect.any(String), title: expect.any(String) }));
  }
  ctx.availableBooks = body.books;
});

When('eu alugo {int} livros de livre escolha', async ({ bookStoreApi, ctx }, amount: number) => {
  ctx.rentedBooks = faker.helpers.arrayElements(ctx.availableBooks!, amount);
  const isbns = ctx.rentedBooks.map((book) => book.isbn);

  const response = await bookStoreApi.addBooks(ctx.userId!, isbns, ctx.token!);
  expect(response.status()).toBe(201);

  const body: AddBooksResponse = await response.json();
  expect(body.books.map((book) => book.isbn)).toEqual(isbns);
});

When('eu consulto os detalhes do usuário', async ({ bookStoreApi, ctx }) => {
  const response = await bookStoreApi.getUser(ctx.userId!, ctx.token!);
  expect(response.status()).toBe(200);
  ctx.userDetails = (await response.json()) as UserResponse;
});

Then('os detalhes do usuário devem conter os livros alugados', async ({ ctx }) => {
  const details = ctx.userDetails!;
  expect(details.userId).toBe(ctx.userId);
  expect(details.username).toBe(ctx.credentials!.userName);
  expect(details.books).toHaveLength(ctx.rentedBooks!.length);
  expect(details.books).toEqual(expect.arrayContaining(ctx.rentedBooks!));
});

// Remove o usuário criado para não deixar sujeira no ambiente.
After({ tags: '@api' }, async ({ bookStoreApi, ctx }) => {
  if (ctx.userId && ctx.token) {
    await bookStoreApi.deleteUser(ctx.userId, ctx.token);
  }
});
