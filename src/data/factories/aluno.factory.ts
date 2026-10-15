import { faker } from '@faker-js/faker';
import {
  CAMINHO_ARQUIVO_UPLOAD,
  ESTADOS_E_CIDADES,
  GENEROS,
  HOBBIES,
  MATERIAS,
} from '@data/constants/demoqa.constants';

export type DadosAluno = {
  nome: string;
  sobrenome: string;
  email: string;
  genero: (typeof GENEROS)[number];
  celular: string;
  dataNascimento: Date;
  materias: string[];
  hobbies: string[];
  caminhoArquivo: string;
  endereco: string;
  estado: string;
  cidade: string;
};

export function gerarAluno(): DadosAluno {
  const estado = faker.helpers.objectKey(ESTADOS_E_CIDADES);
  return {
    nome: faker.person.firstName(),
    sobrenome: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    genero: faker.helpers.arrayElement(GENEROS),
    celular: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
    dataNascimento: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
    materias: faker.helpers.arrayElements(MATERIAS, { min: 1, max: 3 }),
    hobbies: faker.helpers.arrayElements([...HOBBIES], { min: 1, max: 3 }),
    caminhoArquivo: CAMINHO_ARQUIVO_UPLOAD,
    endereco: faker.location.streetAddress({ useFullAddress: true }),
    estado,
    cidade: faker.helpers.arrayElement(ESTADOS_E_CIDADES[estado]),
  };
}
