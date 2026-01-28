# 🐾 VetCare - Sistema de Gerenciamento de Clínica Veterinária

O **VetCare** é uma plataforma Fullstack desenvolvida para centralizar e otimizar a operação de clínicas veterinárias. O sistema abrange desde o registro de tutores e animais até a agenda de consultas e gestão financeira[cite: 53]. [cite_start]Desenvolvido com uma arquitetura moderna, o foco do projeto é oferecer eficiência operacional e uma interface reativa para o usuário[cite: 54, 55].

---

## 🚀 Funcionalidades

* **Dashboard Administrativo**: Visualização de métricas como total de animais, tutores e funcionários.
* **Gestão de Consultas**: Acompanhamento de agendamentos diários com status em tempo real.
* **Controle Financeiro**: Monitoramento de pagamentos pendentes, realizados ou cancelados[cite: 53, 353].
* **Fichas Técnicas**: Histórico detalhado dos animais, incluindo espécie, raça, peso e observações médicas[cite: 315, 323].

---

## 🛠️ Tecnologias Utilizadas

### **Backend (API)**
* **Runtime**: [Node.js](https://nodejs.org/) [cite: 59]
* **Linguagem**: [TypeScript](https://www.typescriptlang.org/) [cite: 60]
* **Framework**: [Express.js](https://expressjs.com/) [cite: 61]
* **ORM**: [Sequelize](https://sequelize.org/) para comunicação com MySQL [cite: 62]

### **Frontend (Interface)**
* **Framework**: [React](https://reactjs.org/) com [TypeScript](https://www.typescriptlang.org/) [cite: 64, 65]
* **Build Tool**: [Vite](https://vitejs.dev/) [cite: 67]
* **Estilização**: CSS puro para um design personalizado [cite: 68]

### **Banco de Dados**
* **MySQL**: Gerenciado via XAMPP para desenvolvimento local [cite: 69, 70]

---

## 📊 Arquitetura de Dados

O sistema baseia-se em um modelo relacional (DER) que garante a integridade das informações entre as entidades de Tutores, Animais, Funcionários e Pagamentos

[Image of an Entity-Relationship Diagram for a veterinary clinic management system]

---

## 🏁 Como Executar o Projeto

### **Pré-requisitos**
* Node.js (v18.x ou superior)
* XAMPP (para o banco de dados MySQL) 

### **Passo 1: Banco de Dados**
1. Inicie o MySQL no painel do XAMPP
2. Crie um banco de dados chamado `clinicaveterinaria` no phpMyAdmin
3. Importe o arquivo `schema.sql` fornecido na pasta raiz

### **Passo 2: Configuração do Backend**
```bash
cd backend
npm install
# Ajuste as credenciais no arquivo config/config.json se necessário
npm run dev
