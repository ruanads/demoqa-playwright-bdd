// Os nomes dos campos seguem o contrato da API (em inglês), por isso não foram traduzidos.

export type Credenciais = {
  userName: string;
  password: string;
};

export type Livro = {
  isbn: string;
  title: string;
  subTitle: string;
  author: string;
  publish_date: string;
  publisher: string;
  pages: number;
  description: string;
  website: string;
};

export type RespostaCriarUsuario = {
  userID: string;
  username: string;
  books: Livro[];
};

export type RespostaToken = {
  token: string | null;
  expires: string | null;
  status: 'Success' | 'Failed';
  result: string;
};

export type RespostaLivros = {
  books: Livro[];
};

export type RespostaAdicionarLivros = {
  books: Pick<Livro, 'isbn'>[];
};

export type RespostaUsuario = {
  userId: string;
  username: string;
  books: Livro[];
};
