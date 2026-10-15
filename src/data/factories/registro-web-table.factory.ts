import { faker } from '@faker-js/faker';

export type RegistroWebTable = {
  nome: string;
  sobrenome: string;
  email: string;
  idade: string;
  salario: string;
  departamento: string;
};

export function gerarRegistroWebTable(): RegistroWebTable {
  const nome = faker.person.firstName();
  return {
    nome,
    sobrenome: faker.person.lastName(),
    email: `${nome.toLowerCase()}.${faker.string.alphanumeric(8).toLowerCase()}@qa.com`,
    idade: String(faker.number.int({ min: 18, max: 70 })),
    salario: String(faker.number.int({ min: 1000, max: 30000 })),
    departamento: faker.commerce.department(),
  };
}
