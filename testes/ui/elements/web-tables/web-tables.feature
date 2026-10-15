# language: pt
@ui @webtables
Funcionalidade: Web Tables

  Contexto:
    Dado que eu acesso o site do DemoQA
    E eu escolho a opção "Elements" na página inicial
    E eu clico no submenu "Web Tables"

  Cenário: Criar, editar e deletar um registro
    Quando eu crio um novo registro
    Então o registro deve ser exibido na tabela
    Quando eu edito o registro criado
    Então o registro deve ser exibido com os dados atualizados
    Quando eu deleto o registro criado
    Então o registro não deve mais ser exibido na tabela

  @bonus
  Esquema do Cenário: Criar <quantidade> registros dinamicamente e deletar todos
    Quando eu crio <quantidade> novos registros
    Então todos os registros criados devem ser exibidos na tabela
    Quando eu deleto todos os registros criados
    Então nenhum dos registros criados deve ser exibido na tabela

    Exemplos:
      | quantidade |
      | 12         |

  # Bug encontrado: deletar um registro novo remove todos os registros adicionados.
  @bug @fail
  Cenário: Deletar um registro não deve remover os demais
    Quando eu crio 2 novos registros
    E eu deleto o primeiro registro criado
    Então os demais registros criados devem continuar na tabela
