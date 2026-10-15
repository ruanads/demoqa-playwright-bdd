import path from 'node:path';

// Opções disponíveis no Practice Form do demoqa (os valores são os textos exibidos no site).
export const GENEROS = ['Male', 'Female', 'Other'] as const;
export const HOBBIES = ['Sports', 'Reading', 'Music'] as const;
export const MATERIAS = ['Maths', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Economics'];
export const ESTADOS_E_CIDADES: Record<string, string[]> = {
  NCR: ['Delhi', 'Gurgaon', 'Noida'],
  'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
  Haryana: ['Karnal', 'Panipat'],
  Rajasthan: ['Jaipur', 'Jaiselmer'],
};

// Exigência do desafio: o .txt do upload precisa estar versionado no repositório.
// O caminho é absoluto para funcionar independente da pasta de onde os testes são executados.
export const CAMINHO_ARQUIVO_UPLOAD = path.resolve(__dirname, '../files/upload.txt');
