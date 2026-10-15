# language: pt
@api
Funcionalidade: Book Store API
  Como usuário da Book Store
  Quero criar uma conta e alugar livros
  Para consultar os livros vinculados ao meu usuário

  Cenário: Criar usuário, autorizar e alugar dois livros
    Dado que eu crio um novo usuário
    Quando eu gero um token de acesso para o usuário
    Então o usuário deve estar autorizado
    Quando eu listo os livros disponíveis
    E eu alugo 2 livros de livre escolha
    E eu consulto os detalhes do usuário
    Então os detalhes do usuário devem conter os livros alugados
