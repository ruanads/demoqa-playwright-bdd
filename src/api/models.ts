export type Credentials = {
  userName: string;
  password: string;
};

export type Book = {
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

export type CreateUserResponse = {
  userID: string;
  username: string;
  books: Book[];
};

export type TokenResponse = {
  token: string | null;
  expires: string | null;
  status: 'Success' | 'Failed';
  result: string;
};

export type BooksResponse = {
  books: Book[];
};

export type AddBooksResponse = {
  books: Pick<Book, 'isbn'>[];
};

export type UserResponse = {
  userId: string;
  username: string;
  books: Book[];
};
