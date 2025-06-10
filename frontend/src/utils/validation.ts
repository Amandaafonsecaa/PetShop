interface ValidationError {
  field: string;
  message: string;
}

export const validateName = (name: string): ValidationError | null => {
  if (!name.trim()) {
    return { field: 'nome', message: 'Nome é obrigatório' };
  }
  if (/\d/.test(name)) {
    return { field: 'nome', message: 'Nome não pode conter números' };
  }
  if (name.length < 3) {
    return { field: 'nome', message: 'Nome deve ter pelo menos 3 caracteres' };
  }
  return null;
};

export const validatePhone = (phone: string): ValidationError | null => {
  if (!phone.trim()) {
    return { field: 'telefone', message: 'Telefone é obrigatório' };
  }
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return { field: 'telefone', message: 'Formato inválido. Use (00) 0000-0000 ou (00) 00000-0000' };
  }
  return null;
};

export const validateEmail = (email: string): ValidationError | null => {
  if (!email.trim()) {
    return { field: 'email', message: 'Email é obrigatório' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Email inválido' };
  }
  return null;
};

export const validateDate = (date: string | Date): ValidationError | null => {
  if (!date) {
    return { field: 'data', message: 'Data é obrigatória' };
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { field: 'data', message: 'Data inválida' };
  }
  if (dateObj > new Date()) {
    return { field: 'data', message: 'Data não pode ser futura' };
  }
  return null;
};

export const validateDateTime = (dateTime: string | Date): ValidationError | null => {
  if (!dateTime) {
    return { field: 'data_hora', message: 'Data e hora são obrigatórias' };
  }
  const dateObj = new Date(dateTime);
  if (isNaN(dateObj.getTime())) {
    return { field: 'data_hora', message: 'Data e hora inválidas' };
  }
  return null;
};

export const validateNumber = (value: number, field: string): ValidationError | null => {
  if (value === undefined || value === null || isNaN(value)) {
    return { field, message: 'Valor é obrigatório' };
  }
  if (value < 0) {
    return { field, message: 'Valor não pode ser negativo' };
  }
  return null;
};

export const validateRequired = (value: string, field: string): ValidationError | null => {
  if (!value || !value.trim()) {
    return { field, message: `${field} é obrigatório` };
  }
  return null;
};

export interface FormErrors {
  [key: string]: string;
}

export const formatErrors = (errors: ValidationError[]): FormErrors => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as FormErrors);
};

// Função para formatar telefone automaticamente
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

// Função para formatar data para o formato brasileiro
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString('pt-BR');
}; 