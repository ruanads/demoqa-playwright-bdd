# language: pt
@ui @forms
Funcionalidade: Practice Form

  Contexto:
    Dado que eu acesso o site do DemoQA
    Quando eu escolho a opção "Forms" na página inicial
    E eu clico no submenu "Practice Form"

  Cenário: Preencher e submeter o formulário com valores aleatórios
    Quando eu preencho todo o formulário com valores aleatórios
    E eu submeto o formulário
    Então um popup deve ser aberto com os dados enviados
    Quando eu fecho o popup
    Então o popup não deve mais ser exibido

  # Bug encontrado: o botão "Close" recebe o clique, mas o modal continua aberto.
  # A tag @fail indica falha esperada; se o site for corrigido o teste passa a acusar.
  @bug @fail
  Cenário: Fechar o popup de confirmação pelo botão Close
    Quando eu preencho todo o formulário com valores aleatórios
    E eu submeto o formulário
    Então um popup deve ser aberto com os dados enviados
    Quando eu fecho o popup pelo botão Close
    Então o popup não deve mais ser exibido
