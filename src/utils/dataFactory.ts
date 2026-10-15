import { faker } from '@faker-js/faker';
import { Credentials } from '../api/models';

export const UPLOAD_FILE_PATH = 'test-data/files/upload.txt';

const GENDERS = ['Male', 'Female', 'Other'] as const;
const HOBBIES = ['Sports', 'Reading', 'Music'] as const;
const SUBJECTS = ['Maths', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Economics'];
const STATES_AND_CITIES: Record<string, string[]> = {
  NCR: ['Delhi', 'Gurgaon', 'Noida'],
  'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
  Haryana: ['Karnal', 'Panipat'],
  Rajasthan: ['Jaipur', 'Jaiselmer'],
};

export type StudentData = {
  firstName: string;
  lastName: string;
  email: string;
  gender: (typeof GENDERS)[number];
  mobile: string;
  dateOfBirth: Date;
  subjects: string[];
  hobbies: string[];
  uploadFilePath: string;
  currentAddress: string;
  state: string;
  city: string;
};

export type WebTableRecord = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
};

/** A API exige senha com maiúscula, minúscula, número, caractere especial e 8+ caracteres. */
export function buildCredentials(): Credentials {
  return {
    userName: `qa_${faker.internet.username().replace(/\W/g, '')}_${Date.now()}`,
    password: `Qa@${faker.string.alphanumeric(6)}1a`,
  };
}

export function buildStudent(): StudentData {
  const state = faker.helpers.objectKey(STATES_AND_CITIES);
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    gender: faker.helpers.arrayElement(GENDERS),
    mobile: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
    subjects: faker.helpers.arrayElements(SUBJECTS, { min: 1, max: 3 }),
    hobbies: faker.helpers.arrayElements([...HOBBIES], { min: 1, max: 3 }),
    uploadFilePath: UPLOAD_FILE_PATH,
    currentAddress: faker.location.streetAddress({ useFullAddress: true }),
    state,
    city: faker.helpers.arrayElement(STATES_AND_CITIES[state]),
  };
}

export function buildWebTableRecord(): WebTableRecord {
  const firstName = faker.person.firstName();
  return {
    firstName,
    lastName: faker.person.lastName(),
    email: `${firstName.toLowerCase()}.${faker.string.alphanumeric(8).toLowerCase()}@qa.com`,
    age: String(faker.number.int({ min: 18, max: 70 })),
    salary: String(faker.number.int({ min: 1000, max: 30000 })),
    department: faker.commerce.department(),
  };
}
