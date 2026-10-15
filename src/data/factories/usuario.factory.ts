import { faker } from '@faker-js/faker';
import { Credenciais } from '@api/modelos/book-store.modelos';

/** A API exige senha com maiúscula, minúscula, número, caractere especial e 8+ caracteres. */
export function gerarCredenciais(): Credenciais {
  return {
    userName: `qa_${faker.internet.username().replace(/\W/g, '')}_${Date.now()}`,
    password: `Qa@${faker.string.alphanumeric(6)}1a`,
  };
}
