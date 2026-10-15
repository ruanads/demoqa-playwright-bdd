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

Given('que eu crio um novo usuário', async ({ clienteBookStore, contextoBookStore }) => {
  const credenciais = gerarCredenciais();
  contextoBookStore.definir('credenciais', credenciais);
  const resposta = await clienteBookStore.criarUsuario(credenciais);
  const corpo: RespostaCriarUsuario = await resposta.json();
  // Registra o id antes das validações: se alguma falhar, a limpeza ainda remove o usuário.
  if (corpo.userID) contextoBookStore.definir('idUsuario', corpo.userID);

  expect(resposta.status()).toBe(201);
  expect(corpo.username).toBe(credenciais.userName);
  expect(corpo.userID).toBeTruthy();
  expect(corpo.books).toEqual([]);
});

When('eu gero um token de acesso para o usuário', async ({ clienteBookStore, contextoBookStore }) => {
  const resposta = await clienteBookStore.gerarToken(contextoBookStore.obter('credenciais'));
  expect(resposta.status()).toBe(200);

  const corpo: RespostaToken = await resposta.json();
  expect(corpo.status).toBe('Success');
  expect(corpo.result).toBe('User authorized successfully.');
  expect(corpo.token).toBeTruthy();
  contextoBookStore.definir('token', corpo.token!);
});

Then('o usuário deve estar autorizado', async ({ clienteBookStore, contextoBookStore }) => {
  const resposta = await clienteBookStore.estaAutorizado(contextoBookStore.obter('credenciais'));
  expect(resposta.status()).toBe(200);
  expect(await resposta.json()).toBe(true);
});

When('eu listo os livros disponíveis', async ({ clienteBookStore, contextoBookStore }) => {
  const resposta = await clienteBookStore.listarLivros();
  expect(resposta.status()).toBe(200);

  const corpo: RespostaLivros = await resposta.json();
  expect(corpo.books.length).toBeGreaterThan(0);
  for (const livro of corpo.books) {
    expect(livro).toEqual(expect.objectContaining({ isbn: expect.any(String), title: expect.any(String) }));
  }
  contextoBookStore.definir('livrosDisponiveis', corpo.books);
});

When('eu alugo {int} livros de livre escolha', async ({ clienteBookStore, contextoBookStore }, quantidade: number) => {
  const livrosDisponiveis = contextoBookStore.obter('livrosDisponiveis');
  // arrayElements devolve menos itens se não houver livros suficientes; sem essas
  // guardas o cenário poderia passar alugando menos livros do que o pedido.
  expect(livrosDisponiveis.length).toBeGreaterThanOrEqual(quantidade);
  const livros = faker.helpers.arrayElements(livrosDisponiveis, quantidade);
  expect(livros).toHaveLength(quantidade);
  const isbns = livros.map((livro) => livro.isbn);

  const resposta = await clienteBookStore.adicionarLivros(contextoBookStore.obter('idUsuario'), isbns, contextoBookStore.obter('token'));
  expect(resposta.status()).toBe(201);

  const corpo: RespostaAdicionarLivros = await resposta.json();
  expect(corpo.books.map((livro) => livro.isbn)).toEqual(isbns);
  contextoBookStore.definir('livrosAlugados', livros);
});

When('eu consulto os detalhes do usuário', async ({ clienteBookStore, contextoBookStore }) => {
  const resposta = await clienteBookStore.obterUsuario(contextoBookStore.obter('idUsuario'), contextoBookStore.obter('token'));
  expect(resposta.status()).toBe(200);
  contextoBookStore.definir('detalhesUsuario', (await resposta.json()) as RespostaUsuario);
});

Then('os detalhes do usuário devem conter os livros alugados', async ({ contextoBookStore }) => {
  const detalhes = contextoBookStore.obter('detalhesUsuario');
  const livrosAlugados = contextoBookStore.obter('livrosAlugados');
  expect(detalhes.userId).toBe(contextoBookStore.obter('idUsuario'));
  expect(detalhes.username).toBe(contextoBookStore.obter('credenciais').userName);
  expect(detalhes.books).toHaveLength(livrosAlugados.length);
  expect(detalhes.books).toEqual(expect.arrayContaining(livrosAlugados));
});

// Remove o usuário criado para não deixar sujeira no ambiente. Se o cenário falhou
// antes de gerar o token, gera um aqui só para conseguir fazer a limpeza.
After({ tags: '@api' }, async ({ clienteBookStore, contextoBookStore }) => {
  if (!contextoBookStore.possui('idUsuario')) return;
  const idUsuario = contextoBookStore.obter('idUsuario');

  let token = contextoBookStore.possui('token') ? contextoBookStore.obter('token') : undefined;
  if (!token) {
    const respostaToken = await clienteBookStore.gerarToken(contextoBookStore.obter('credenciais'));
    expect(respostaToken.status(), `limpeza: falha ao gerar token para remover o usuário ${idUsuario}`).toBe(200);
    token = ((await respostaToken.json()) as RespostaToken).token ?? undefined;
  }
  expect(token, `limpeza: token vazio, o usuário ${idUsuario} não pôde ser removido`).toBeTruthy();

  const resposta = await clienteBookStore.deletarUsuario(idUsuario, token!);
  expect(resposta.status(), `usuário de teste ${idUsuario} não foi removido`).toBe(204);
});
