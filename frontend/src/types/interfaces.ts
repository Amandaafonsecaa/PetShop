// Interfaces relacionadas a Animais
export interface Animal {
  id_animal: number;
  nome: string;
  especie: string;
  raca: string;
  peso: number;
  sexo: string;
  data_nascimento: Date;
  id_tutor: number;
  observacoes_medicas: string | null;
  status_animal: 'Ativo' | 'Inativo' | 'Falecido';
  createdAt?: Date;
  updatedAt?: Date;

  nomeAnimal?: string;
  nomeTutor?: string;
}

// Interfaces relacionadas a Tutores
export interface Tutor {
  id_tutor: number;
  nome: string;
  telefone: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaces relacionadas a Pagamentos
export interface Pagamento {
  id_pagamento: number;
  id_consulta: number;
  valor: number;
  data_pagamento: Date;
  metodo:
    | "Cartão de Crédito"
    | "Cartão de Débito"
    | "Dinheiro"
    | "Pix"
    | "Transferência";
  status_pagamento: "Pendente" | "Pago" | "Cancelado" | "Reembolsado";
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaces relacionadas a Funcionários
export interface Funcionario {
  id_funcionario: number;
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Consultas {
  id_consulta: number;
  id_animal: number;
  id_funcionario: number;
  data_hora: string;
  diagnostico: string | null;
  status_consulta: 'Agendada' | 'Realizada' | 'Cancelada' | 'Remarcada' | 'Não Compareceu' | 'Em Andamento';
  preco: number;
  nomeAnimal?: string;
  nomeFuncionario?: string;
  createdAt?: string;
  updatedAt?: string;
  animal?: Animal;
  funcionario?: Funcionario;
}
