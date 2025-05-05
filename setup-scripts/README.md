# Ambiente de Desenvolvimento MERN Stack

Este repositório contém scripts de instalação automática para configurar um ambiente de desenvolvimento completo para projetos usando a MERN Stack (MongoDB, Express, React, Node.js).

## Descrição

Os scripts neste repositório automatizam a instalação e configuração das ferramentas necessárias para desenvolvimento com a MERN Stack em diferentes sistemas operacionais:

- Frontend: React
- Backend: Node.js + Express
- Bancos de Dados: MongoDB e/ou PostgreSQL
- Testes: Playwright, Mocha e Chai
- Documentação: Draw.io
- Controle de versão: Git + GitHub

## Scripts Disponíveis

### setup.sh (Linux e macOS)

Script de configuração para ambientes Unix-like (Linux e macOS) que configura automaticamente todas as dependências necessárias usando os gerenciadores de pacotes nativos (apt para Linux ou Homebrew para macOS).

**Recursos:**
- Detecção automática do sistema operacional (Linux ou macOS)
- Instalação do Node.js usando NVM (Node Version Manager)
- Instalação e configuração de MongoDB e/ou PostgreSQL
- Instalação do Visual Studio Code com extensões recomendadas
- Configuração do Git e GitHub CLI
- Criação de estrutura de projeto MERN opcional
- Instalação de ferramentas de teste (Playwright)

**Requisitos:**
- Bash shell
- Permissões de administrador (sudo)
- Conexão à internet

**Como usar:**
```bash
# Dar permissão de execução
chmod +x setup.sh

# Executar o script
./setup.sh

# Opções disponíveis:
./setup.sh -n  # Modo não-interativo
./setup.sh -g  # Não instalar interfaces gráficas
./setup.sh -e  # Não instalar ferramentas extras
./setup.sh -s  # Modo silencioso
./setup.sh -h  # Mostrar ajuda
```

### setup.ps1 (Windows)

Script PowerShell equivalente para ambientes Windows que configura o mesmo ambiente de desenvolvimento usando o gerenciador de pacotes Chocolatey.

**Recursos:**
- Instalação e configuração automática do Chocolatey
- Instalação do Node.js usando NVM para Windows
- Instalação e configuração de MongoDB e/ou PostgreSQL
- Instalação do Visual Studio Code com extensões recomendadas
- Configuração do Git e GitHub CLI
- Criação de estrutura de projeto MERN opcional
- Instalação de ferramentas de teste (Playwright)

**Requisitos:**
- Windows 10/11
- PowerShell executado como Administrador
- Conexão à internet

**Como usar:**
```powershell
# Verificar política de execução
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Executar o script
.\setup.ps1

# Opções disponíveis:
.\setup.ps1 -n  # Modo não-interativo
.\setup.ps1 -g  # Não instalar interfaces gráficas
.\setup.ps1 -e  # Não instalar ferramentas extras
.\setup.ps1 -s  # Modo silencioso
.\setup.ps1 -h  # Mostrar ajuda
```

## Ferramentas Instaladas

Os scripts instalam e configuram as seguintes ferramentas:

1. **Gerenciamento de Versões e Runtime**
   - Node.js v18.17.1 (LTS)
   - NVM (Node Version Manager)
   - NPM (Node Package Manager)

2. **Bancos de Dados**
   - MongoDB v6.0
   - PostgreSQL v15
   - MongoDB Compass (GUI para MongoDB)
   - pgAdmin 4 (GUI para PostgreSQL)

3. **Ferramentas de Desenvolvimento**
   - Visual Studio Code
   - Git
   - GitHub CLI (opcional)
   - Playwright (para testes)
   - Draw.io Desktop

4. **Ferramentas de Teste**
   - Playwright (para testes end-to-end)
   - Mocha (framework de teste para JavaScript)
   - Chai (biblioteca de asserção para testes)

5. **Pacotes NPM Globais**
   - nodemon
   - express-generator
   - create-react-app
   - yarn

6. **Extensões do VS Code**
   - React/JavaScript: ES7 React Snippets, ESLint, Prettier
   - Node.js: NPM IntelliSense, DotENV
   - Banco de dados: MongoDB, PostgreSQL Client
   - Git: GitLens, GitHub Pull Requests
   - Teste: Playwright
   - Documentação: Draw.io Integration
   - Temas e utilidades: GitHub Theme, Material Icon Theme, etc.

## Estrutura do Projeto Criado

Ambos os scripts podem criar uma estrutura básica de projeto com a seguinte organização:

```
my_project/
├── frontend/         # Aplicação React
├── backend/          # API Express
│   └── test/         # Testes unitários com Mocha e Chai
├── docs/             # Documentação
├── .gitignore        # Configurado para Node.js/React
├── docker-compose.yml  # Configuração para MongoDB e PostgreSQL
├── .vscode/          # Configurações recomendadas para VS Code
└── README.md         # Arquivo README básico
```

## Observações

- Os scripts verificam se cada componente já está instalado antes de tentar instalá-lo novamente
- Configurações personalizadas podem ser feitas através das opções de linha de comando
- O script roda em modo interativo por padrão, perguntando preferências quando necessário
- Relatório de tempo total de execução é exibido ao final
- Mocha e Chai são configurados automaticamente com um exemplo de teste básico

---

*Scripts desenvolvidos para facilitar a configuração de ambiente de projetos de desenvolvimento web utilizando a stack MERN.*