import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { After, Given, Then, When } from '@fixtures';
import {
  RespostaAdicionarLivros,
  RespostaCriarUsuario,
  RespostaLivros,
  RespostaToken,
  RespostaUsuario,
} from '@api/modelos/book-store.modelos';
import { gerarCredenciais } from '@data/factories/usuario.factory';

Given('que eu crio um novo usuário', async ({ clienteBookStore, contexto }) => {
  contexto.credenciais = gerarCredenciais();
  const resposta = await clienteBookStore.criarUsuario(contexto.credenciais);
  expect(resposta.status()).toBe(201);

  const corpo: RespostaCriarUsuario = await resposta.json();
  expect(corpo.username).toBe(contexto.credenciais.userName);
  expect(corpo.userID).toBeTruthy();
  expect(corpo.books).toEqual([]);
  contexto.idUsuario = corpo.userID;
});

When('eu gero um token de acesso para o usuário', async ({ clienteBookStore, contexto }) => {
  const resposta = await clienteBookStore.gerarToken(contexto.credenciais!);
  expect(resposta.status()).toBe(200);

  const corpo: RespostaToken = await resposta.json();
  expect(corpo.status).toBe('Success');
  expect(corpo.result).toBe('User authorized successfully.');
  expect(corpo.token).toBeTruthy();
  contexto.token = corpo.token!;
});

Then('o usuário deve estar autorizado', async ({ clienteBookStore, contexto }) => {
  const resposta = await clienteBookStore.estaAutorizado(contexto.credenciais!);
  expect(resposta.status()).toBe(200);
  expect(await resposta.json()).toBe(true);
});

When('eu listo os livros disponíveis', async ({ clienteBookStore, contexto }) => {
  const resposta = await clienteBookStore.listarLivros();
  expect(resposta.status()).toBe(200);

  const corpo: RespostaLivros = await resposta.json();
  expect(corpo.books.length).toBeGreaterThan(0);
  for (const livro of corpo.books) {
    expect(livro).toEqual(expect.objectContaining({ isbn: expect.any(String), title: expect.any(String) }));
  }
  contexto.livrosDisponiveis = corpo.books;
});

When('eu alugo {int} livros de livre escolha', async ({ clienteBookStore, contexto }, quantidade: number) => {
  contexto.livrosAlugados = faker.helpers.arrayElements(contexto.livrosDisponiveis!, quantidade);
  const isbns = contexto.livrosAlugados.map((livro) => livro.isbn);

  const resposta = await clienteBookStore.adicionarLivros(contexto.idUsuario!, isbns, contexto.token!);
  expect(resposta.status()).toBe(201);

  const corpo: RespostaAdicionarLivros = await resposta.json();
  expect(corpo.books.map((livro) => livro.isbn)).toEqual(isbns);
});

When('eu consulto os detalhes do usuário', async ({ clienteBookStore, contexto }) => {
  const resposta = await clienteBookStore.obterUsuario(contexto.idUsuario!, contexto.token!);
  expect(resposta.status()).toBe(200);
  contexto.detalhesUsuario = (await resposta.json()) as RespostaUsuario;
});

Then('os detalhes do usuário devem conter os livros alugados', async ({ contexto }) => {
  const detalhes = contexto.detalhesUsuario!;
  expect(detalhes.userId).toBe(contexto.idUsuario);
  expect(detalhes.username).toBe(contexto.credenciais!.userName);
  expect(detalhes.books).toHaveLength(contexto.livrosAlugados!.length);
  expect(detalhes.books).toEqual(expect.arrayContaining(contexto.livrosAlugados!));
});

// Remove o usuário criado para não deixar sujeira no ambiente.
After({ tags: '@api' }, async ({ clienteBookStore, contexto }) => {
  if (contexto.idUsuario && contexto.token) {
    await clienteBookStore.deletarUsuario(contexto.idUsuario, contexto.token);
  }
});
