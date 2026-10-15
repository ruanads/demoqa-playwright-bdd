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

export const CAMINHO_ARQUIVO_UPLOAD = 'src/data/files/upload.txt';
