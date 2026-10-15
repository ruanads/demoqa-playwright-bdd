import { Credenciais, Livro, RespostaUsuario } from '@api/modelos/book-store.modelos';
import { DadosAluno } from '@data/factories/aluno.factory';
import { RegistroWebTable } from '@data/factories/registro-web-table.factory';
import { PaginaSample } from '@paginas/alerts-frame-windows/sample.pagina';

/**
 * Estado compartilhado entre os steps de um mesmo cenário.
 * `obter` falha com uma mensagem clara se o valor ainda não foi definido,
 * em vez de deixar um `undefined` estourar em outro lugar.
 */
export class Contexto<Dados extends object> {
  private readonly dados: Partial<Dados> = {};

  definir<C extends keyof Dados>(chave: C, valor: Dados[C]): void {
    this.dados[chave] = valor;
  }

  obter<C extends keyof Dados>(chave: C): Dados[C] {
    const valor = this.dados[chave];
    if (valor === undefined) {
      throw new Error(`"${String(chave)}" ainda não foi definido no cenário. Verifique se o step que o define rodou antes.`);
    }
    return valor as Dados[C];
  }

  possui(chave: keyof Dados): boolean {
    return this.dados[chave] !== undefined;
  }
}

// Cada funcionalidade tem o seu contexto, com apenas as chaves que ela usa.

export type DadosBookStore = {
  credenciais: Credenciais;
  idUsuario: string;
  token: string;
  livrosDisponiveis: Livro[];
  livrosAlugados: Livro[];
  detalhesUsuario: RespostaUsuario;
};

export type DadosPracticeForm = {
  aluno: DadosAluno;
};

export type DadosBrowserWindows = {
  novaJanela: PaginaSample;
};

export type DadosWebTables = {
  registro: RegistroWebTable;
  registroOriginal: RegistroWebTable;
  registros: RegistroWebTable[];
};

export type DadosProgressBar = {
  valorProgresso: number;
};
