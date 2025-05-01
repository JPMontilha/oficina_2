# 📘 Sistema de Registro de Presença - ELLP

Este projeto faz parte da disciplina de Oficina de Integração 2, cujo objetivo é o desenvolvimento de um sistema para o registro de presença de alunos nas oficinas do projeto de extensão **ELLP - Ensino Lúdico de Lógica e Programação**.

---

## 📌 Objetivo do Sistema

O objetivo do sistema é permitir o controle eficiente da participação dos alunos nas oficinas do projeto ELLP.
Com essa plataforma, espera-se otimizar o processo de registro de presença, garantir a organização dos dados acadêmicos e facilitar o acesso a relatórios gerenciais para os responsáveis pelas oficinas.

---

## 🛠️ Funcionalidades Planejadas

- Cadastro de alunos
- Cadastro de oficinas
- Login de administradores/professores
- Registro de presença por aluno em cada aula
- Consulta de presenças por aluno ou por oficina
- Geração de relatórios de frequência

---

## 🧱 Arquitetura do Sistema

A aplicação será desenvolvida utilizando o padrão **MVC** (Model-View-Controller), uma arquitetura que separa o sistema em três camadas principais, facilitando a organização e manutenção do código.

### 1. Model (Modelo)

A camada **Model** é responsável pela lógica dos dados da aplicação. Ela representa as entidades do sistema e contém as regras de negócio e a comunicação com o banco de dados. Os seus atributos podem ser representados pelo diagrama de classes. Essa camada é responsável pelo **CRUD** (criar, consultar, atualizar e deletar) dos dados e validar as regras de negócio.

Diagrama de Classes: modelagem das entidades (Aluno, Professor, Oficina)
![Diagrama de classes](./docs/DiagramaDeClasses.drawio.png)

### 2. View (Visão)

A camada **View** é a interface do usuário. É onde o usuário interage com o sistema, seja para registrar a presença, fazer login, visualizar relatório, etc. As ações dos usuários podem ser visto no diagrama de casos de uso. Essa camada é responsável por exibir as informações ao usuário, capturar seus inputs e enviar a ação para o controller.

Diagrama de Casos de Uso: descrição das principais interações dos usuários com o sistema
![Diagrama de Casos de Uso](./docs/DiagramaDeCasosDeUso.drawio.png)

### 3. Controller (Controle)

A camada **Controller** atua como o intermediário entre o **View** e o **Model**. Ele recebe as requisições da UI, processa as ações e consulta ou atualiza os dados no **Model**, retornando a resposta para o **View**. Ele é responsável por gerenciar o fluxo da aplicação e coordenar, validar e tratar as chamadas entre o **View** e o **Model**

---

## 🧪 Estratégia de Testes

Utilizaremos uma combinação de:

- **Testes de unidade** para validação das funções do backend
- **Testes de integração** para verificar o fluxo entre as camadas
- **Testes automatizados** com scripts para garantir a estabilidade

Ferramentas de teste planejadas: `Playwright`.

---

## 🧰 Tecnologias Previstas

| Camada             | Tecnologia            |
|--------------------|-----------------------|
| Frontend           | HTML + CSS + React    |
| Backend            | Node.js + Express     |
| Banco de Dados     | MongoDB ou PostgreSQL |
| Testes             | Playwright            |
| Documentação       | Draw.io               |
| Controle de versão | Git + GitHub          |

---

## 👨‍💻 Equipe

- João Pedro Vaciloto Montilha - RA: 2348012
- Luis Henrique de Jesus Lima - RA: 2313642
- Marcus Vinícius Molina Freitas - RA: 2383969
