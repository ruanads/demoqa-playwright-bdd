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
  const credenciais = gerarCredenciais();
  const resposta = await clienteBookStore.criarUsuario(credenciais);
  expect(resposta.status()).toBe(201);

  const corpo: RespostaCriarUsuario = await resposta.json();
  expect(corpo.username).toBe(credenciais.userName);
  expect(corpo.userID).toBeTruthy();
  expect(corpo.books).toEqual([]);
  contexto.definir('credenciais', credenciais);
  contexto.definir('idUsuario', corpo.userID);
});

When('eu gero um token de acesso para o usuário', async ({ clienteBookStore, contexto }) => {
  const resposta = await clienteBookStore.gerarToken(contexto.obter('credenciais'));
  expect(resposta.status()).toBe(200);

  const corpo: RespostaToken = await resposta.json();
  expect(corpo.status).toBe('Success');
  expect(corpo.result).toBe('User authorized successfully.');
  expect(corpo.token).toBeTruthy();
  contexto.definir('token', corpo.token!);
});

Then('o usuário deve estar autorizado', async ({ clienteBookStore, contexto }) => {
  const resposta = await clienteBookStore.estaAutorizado(contexto.obter('credenciais'));
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
  contexto.definir('livrosDisponiveis', corpo.books);
});

When('eu alugo {int} livros de livre escolha', async ({ clienteBookStore, contexto }, quantidade: number) => {
  const livros = faker.helpers.arrayElements(contexto.obter('livrosDisponiveis'), quantidade);
  const isbns = livros.map((livro) => livro.isbn);

  const resposta = await clienteBookStore.adicionarLivros(contexto.obter('idUsuario'), isbns, contexto.obter('token'));
  expect(resposta.status()).toBe(201);

  const corpo: RespostaAdicionarLivros = await resposta.json();
  expect(corpo.books.map((livro) => livro.isbn)).toEqual(isbns);
  contexto.definir('livrosAlugados', livros);
});

When('eu consulto os detalhes do usuário', async ({ clienteBookStore, contexto }) => {
  const resposta = await clienteBookStore.obterUsuario(contexto.obter('idUsuario'), contexto.obter('token'));
  expect(resposta.status()).toBe(200);
  contexto.definir('detalhesUsuario', (await resposta.json()) as RespostaUsuario);
});

Then('os detalhes do usuário devem conter os livros alugados', async ({ contexto }) => {
  const detalhes = contexto.obter('detalhesUsuario');
  const livrosAlugados = contexto.obter('livrosAlugados');
  expect(detalhes.userId).toBe(contexto.obter('idUsuario'));
  expect(detalhes.username).toBe(contexto.obter('credenciais').userName);
  expect(detalhes.books).toHaveLength(livrosAlugados.length);
  expect(detalhes.books).toEqual(expect.arrayContaining(livrosAlugados));
});

// Remove o usuário criado para não deixar sujeira no ambiente. Se o cenário falhou
// antes de gerar o token, gera um aqui só para conseguir fazer a limpeza.
After({ tags: '@api' }, async ({ clienteBookStore, contexto }) => {
  if (!contexto.possui('idUsuario')) return;
  const idUsuario = contexto.obter('idUsuario');

  let token = contexto.possui('token') ? contexto.obter('token') : undefined;
  if (!token) {
    const respostaToken = await clienteBookStore.gerarToken(contexto.obter('credenciais'));
    token = ((await respostaToken.json()) as RespostaToken).token ?? undefined;
  }
  expect(token, 'não foi possível gerar token para remover o usuário de teste').toBeTruthy();

  const resposta = await clienteBookStore.deletarUsuario(idUsuario, token!);
  expect(resposta.status(), `usuário de teste ${idUsuario} não foi removido`).toBe(204);
});
