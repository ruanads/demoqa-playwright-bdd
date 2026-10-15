import { Page } from '@playwright/test';
import { Credenciais, Livro, RespostaUsuario } from '@api/modelos/book-store.modelos';
import { DadosAluno } from '@data/factories/aluno.factory';
import { RegistroWebTable } from '@data/factories/registro-web-table.factory';

/** Estado compartilhado entre os steps de um mesmo cenário. */
export type ContextoCenario = {
  credenciais?: Credenciais;
  idUsuario?: string;
  token?: string;
  livrosDisponiveis?: Livro[];
  livrosAlugados?: Livro[];
  detalhesUsuario?: RespostaUsuario;
  aluno?: DadosAluno;
  registro?: RegistroWebTable;
  registros?: RegistroWebTable[];
  valorProgresso?: number;
  novaJanela?: Page;
};
