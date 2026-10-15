import { Credenciais, Livro, RespostaUsuario } from '@api/modelos/book-store.modelos';
import { DadosAluno } from '@data/factories/aluno.factory';
import { RegistroWebTable } from '@data/factories/registro-web-table.factory';
import { PaginaSample } from '@paginas/alerts-frame-windows/sample.pagina';

/** Tudo que um step pode guardar para os steps seguintes do mesmo cenário. */
type DadosCenario = {
  credenciais: Credenciais;
  idUsuario: string;
  token: string;
  livrosDisponiveis: Livro[];
  livrosAlugados: Livro[];
  detalhesUsuario: RespostaUsuario;
  aluno: DadosAluno;
  registro: RegistroWebTable;
  registroOriginal: RegistroWebTable;
  registros: RegistroWebTable[];
  valorProgresso: number;
  novaJanela: PaginaSample;
};

/**
 * Estado compartilhado entre os steps de um mesmo cenário.
 * `obter` falha com uma mensagem clara se o valor ainda não foi definido,
 * em vez de deixar um `undefined` estourar em outro lugar.
 */
export class ContextoCenario {
  private readonly dados: Partial<DadosCenario> = {};

  definir<C extends keyof DadosCenario>(chave: C, valor: DadosCenario[C]): void {
    this.dados[chave] = valor;
  }

  obter<C extends keyof DadosCenario>(chave: C): DadosCenario[C] {
    const valor = this.dados[chave];
    if (valor === undefined) {
      throw new Error(`"${chave}" ainda não foi definido no cenário. Verifique se o step que o define rodou antes.`);
    }
    return valor as DadosCenario[C];
  }

  possui(chave: keyof DadosCenario): boolean {
    return this.dados[chave] !== undefined;
  }
}
