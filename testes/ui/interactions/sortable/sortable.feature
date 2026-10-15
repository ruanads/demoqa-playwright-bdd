# language: pt
@ui @sortable
Funcionalidade: Sortable

  Cenário: Ordenar os elementos em ordem crescente com drag and drop
    Dado que eu acesso o site do DemoQA
    E eu escolho a opção "Interactions" na página inicial
    E eu clico no submenu "Sortable"
    E eu embaralho os elementos da lista usando drag and drop
    Quando eu coloco os elementos em ordem crescente usando drag and drop
    Então os elementos devem estar em ordem crescente
