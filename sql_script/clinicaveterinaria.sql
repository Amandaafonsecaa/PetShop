DROP DATABASE IF EXISTS clinicaveterinaria;
CREATE DATABASE clinicaveterinaria;
USE clinicaveterinaria;

CREATE TABLE Tutor (
    id_tutor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20)  NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE Animal (
    id_animal INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    especie VARCHAR(100) NOT NULL,
    raca VARCHAR(100)  NOT NULL,
    peso DECIMAL(6,2)  NOT NULL,
    sexo CHAR(1)  NOT NULL,
    data_nascimento DATE  NOT NULL,
    observacoes_medicas TEXT,
    status_animal VARCHAR(50) DEFAULT 'Ativo',
    id_tutor INT NOT NULL,
    FOREIGN KEY (id_tutor) REFERENCES Tutor(id_tutor)
);

CREATE TABLE Funcionario (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Consulta (
    id_consulta INT AUTO_INCREMENT PRIMARY KEY,
    id_animal INT NOT NULL,
    data_hora DATETIME NOT NULL,
    id_funcionario INT NOT NULL,
    FOREIGN KEY (id_funcionario) REFERENCES Funcionario(id_funcionario),
    diagnostico TEXT,
    status_consulta VARCHAR(50) DEFAULT 'Agendada',
    preco DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_animal) REFERENCES Animal(id_animal)
);

CREATE TABLE Pagamento (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    valor DECIMAL(10, 2) NOT NULL,
    data_pagamento DATE NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    id_consulta INT NOT NULL,
    status_pagamento VARCHAR(50) DEFAULT 'Pendente',
    FOREIGN KEY (id_consulta) REFERENCES Consulta(id_consulta)
);

ALTER TABLE Animal 
MODIFY COLUMN status_animal ENUM('Ativo', 'Inativo', 'Falecido') DEFAULT	'Ativo';
ALTER TABLE Consulta
MODIFY COLUMN status_consulta ENUM('Agendada', 'Realizada', 'Cancelada', 'Remarcada', 'Não Compareceu', 'Em Andamento')
DEFAULT 'Agendada';
ALTER TABLE Pagamento
MODIFY COLUMN metodo ENUM('Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Pix', 'Transferência');
ALTER TABLE Pagamento
MODIFY COLUMN status_pagamento ENUM('Pendente', 'Pago', 'Cancelado', 'Reembolsado')
DEFAULT 'Pendente';

INSERT INTO Tutor (nome, telefone, email) VALUES
('João Silva', '11987654321', 'joao.silva@example.com'),
('Maria Souza', '21998765432', 'maria.souza@example.com'),
('Carlos Pereira', '31976543210', 'carlos.p@example.com');

INSERT INTO Animal (nome, espécie, raça, data_nascimento, id_tutor) VALUES
('Rex', 'Cachorro', 'Labrador', '2020-03-15', 1),
('Miau', 'Gato', 'Siamês', '2022-01-20', 2),
('Buddy', 'Cachorro', 'Golden Retriever', '2019-11-01', 1),
('Luna', 'Gato', 'Persa', '2023-05-10', 3);

INSERT INTO Funcionario (nome, cargo, telefone, email) VALUES
('Dr. Pedro Pinheiro', 'Veterinário Chefe', '11111111111', 'pedro.p@example.com'),
('Dra. Ana Costa', 'Veterinário Geral', '22222222222', 'ana.c@example.com');

INSERT INTO Consulta (id_animal, data_hora, id_funcionario, diagnóstico, preço) VALUES
(1, '2025-05-20 10:00:00', 1, 'Vacinação anual. Animal saudável.', 150.00),
(2, '2025-05-21 14:30:00', 2, 'Dor de barriga, receitado medicamento.', 200.00),
(3, '2025-05-22 09:00:00', 1, 'Check-up de rotina. Sem alterações.', 100.00);

INSERT INTO Pagamento (valor, data_pagamento, metodo, id_consulta) VALUES
(150.00, '2025-05-20', 'Cartão de Crédito', 1),
(200.00, '2025-05-21', 'Pix', 2);