# 🚀 Sistema de Gestão de Oficinas Acadêmicas - ELLP

**Status: ✅ SISTEMA FUNCIONAL E OPERACIONAL**

Este projeto é um sistema completo de gestão acadêmica desenvolvido para a disciplina de Oficina de Integração 2, focado no controle e registro de atividades do projeto de extensão **ELLP - Ensino Lúdico de Lógica e Programação**.

---

## 🎯 Sobre o Sistema

O **Sistema de Gestão de Oficinas Acadêmicas** é uma aplicação web robusta que permite o gerenciamento completo de alunos, professores e oficinas educacionais. O sistema oferece autenticação segura, interface intuitiva e funcionalidades específicas para cada tipo de usuário.

### 🌟 **Funcionalidades Implementadas**

✅ **Autenticação e Cadastro**
- Sistema de cadastro para alunos e professores
- Login seguro com validação de credenciais
- Gerenciamento de sessões de usuário
- Recuperação de senha
- Validação de email duplicado

✅ **Gestão de Alunos**
- Cadastro com RA e período acadêmico
- Dashboard personalizado para alunos
- Visualização de dados pessoais
- Listagem de alunos cadastrados

✅ **Gestão de Professores**
- Cadastro com ID único de professor
- Dashboard administrativo para professores
- Gerenciamento de oficinas
- Controle de acesso diferenciado

✅ **Sistema de Oficinas**
- Cadastro e listagem de oficinas
- Vinculação professor-oficina
- Interface de gerenciamento completa

✅ **Interface Responsiva**
- Design moderno e intuitivo
- Navegação fluida entre páginas
- Mensagens de feedback em tempo real
- Formulários com validação em tempo real

---

## 🏗️ Arquitetura do Sistema

O sistema utiliza uma **arquitetura moderna** baseada no padrão **MVC** (Model-View-Controller) com separação clara de responsabilidades e API RESTful.

### 📱 **Frontend (View Layer)**
- **HTML5** semântico com estrutura responsiva
- **CSS3** customizado com design system consistente
- **JavaScript** vanilla moderno com ES6+
- Interface de usuário intuitiva e acessível
- Sistema de componentes reutilizáveis

### 🔧 **Backend (Controller Layer)**
- **Node.js** com framework **Express.js**
- API RESTful com endpoints organizados
- Middleware de autenticação e validação
- Gerenciamento de sessões seguro
- Tratamento de erros centralizado

### 🗄️ **Banco de Dados (Model Layer)**
- **MongoDB** com **Mongoose** ODM
- Schemas bem definidos para cada entidade
- Validações de dados no banco
- Relacionamentos entre coleções
- Indexação para performance

### 🔐 **Segurança**
- Senhas criptografadas com **bcrypt**
- Validação de entrada de dados
- Proteção contra injeção de código
- Gerenciamento seguro de sessões

---

## 🚀 Tecnologias Utilizadas

| Categoria          | Tecnologia               | Versão    |
|--------------------|--------------------------|-----------|
| **Runtime**        | Node.js                  | v18+      |
| **Framework Web**  | Express.js               | v5.1.0    |
| **Banco de Dados** | MongoDB + Mongoose       | v8.14.1   |
| **Segurança**      | bcrypt                   | v5.1.1    |
| **HTTP Client**    | Axios                    | v1.9.0    |
| **CORS**           | cors                     | v2.8.5    |
| **Environment**    | dotenv                   | v16.5.0   |
| **Testing**        | Mocha + Chai             | v11.2.2   |
| **Development**    | Nodemon                  | -         |

---

## 📂 Estrutura do Projeto

```
oficina_2/
├── 📄 app.js                    # Servidor principal
├── 📄 db.js                     # Configuração do MongoDB
├── 📄 seed.js                   # Script de dados iniciais
├── 📄 package.json              # Dependências do projeto
│
├── 📁 controllers/              # Lógica de negócio
│   ├── authController.js        # Autenticação
│   ├── alunoController.js       # Gestão de alunos
│   ├── professorController.js   # Gestão de professores
│   └── oficinaController.js     # Gestão de oficinas
│
├── 📁 models/                   # Esquemas do banco
│   ├── user.js                  # Modelo base de usuário
│   ├── aluno.js                 # Modelo de aluno
│   ├── professor.js             # Modelo de professor
│   └── oficina.js               # Modelo de oficina
│
├── 📁 routes/                   # Definição de rotas
│   ├── authRoutes.js            # Rotas de autenticação
│   ├── alunoRoutes.js           # Rotas de alunos
│   ├── professorRoutes.js       # Rotas de professores
│   └── oficinaRoutes.js         # Rotas de oficinas
│
├── 📁 frontend/                 # Interface do usuário
│   ├── 📁 html/                 # Páginas HTML
│   │   ├── login.html           # Página de login
│   │   ├── cadastro.html        # Página de cadastro
│   │   ├── alunoMain.html       # Dashboard do aluno
│   │   ├── professorMain.html   # Dashboard do professor
│   │   └── ...                  # Outras páginas
│   │
│   ├── 📁 css/                  # Folhas de estilo
│   │   ├── style.css            # Estilos principais
│   │   └── lista-extra.css      # Estilos extras
│   │
│   └── 📁 script/               # JavaScript do frontend
│       ├── api.js               # Cliente de API
│       ├── login.js             # Lógica de login
│       ├── cadastro.js          # Lógica de cadastro
│       └── ...                  # Outros scripts
│
└── 📁 docs/                     # Documentação
    ├── DiagramaDeClasses.drawio.png
    └── DiagramaDeCasosDeUso.drawio.png
```

---

## 🛠️ Instalação e Execução

### **Pré-requisitos**
- Node.js v18+ instalado
- MongoDB instalado e rodando
- Git para versionamento

### **1️⃣ Clonar o Repositório**
```bash
git clone <url-do-repositorio>
cd oficina_2
```

### **2️⃣ Instalar Dependências**
```bash
npm install
```

### **3️⃣ Configurar Banco de Dados**
```bash
# Iniciar MongoDB (macOS com Homebrew)
brew services start mongodb-community

# Ou iniciar manualmente
mongod --config /usr/local/etc/mongod.conf
```

### **4️⃣ Popular Banco com Dados Iniciais (Opcional)**
```bash
npm run seed
```

### **5️⃣ Executar o Sistema**

**Modo Produção:**
```bash
npm start
```

**Modo Desenvolvimento:**
```bash
npm run dev
```

### **6️⃣ Acessar o Sistema**
Abra seu navegador e acesse: **http://localhost:3000**

---

## 🎮 Como Usar o Sistema

### **👨‍🎓 Para Alunos**
1. Acesse `/cadastro` para criar uma conta
2. Selecione "Aluno" e preencha RA e período
3. Faça login em `/login`
4. Acesse seu dashboard personalizado

### **👨‍🏫 Para Professores**
1. Acesse `/cadastro` para criar uma conta
2. Selecione "Professor" e informe seu ID
3. Faça login em `/login`
4. Gerencie oficinas e visualize dados

### **🔐 Funcionalidades Principais**
- **Dashboard personalizado** para cada tipo de usuário
- **Gestão de dados pessoais** e acadêmicos
- **Listagem e busca** de alunos/professores/oficinas
- **Sistema de autenticação** seguro
- **Interface responsiva** para desktop e mobile

---

## 🧪 Testes e Qualidade

### **Executar Testes**
```bash
# Executar todos os testes
npm test

# Os testes são executados com Mocha e Chai
# Configurados para não falhar o build (|| exit 0)
```

### **Estrutura de Testes**
- **Testes unitários** para controllers e models
- **Testes de integração** para APIs
- **Validação de dados** e regras de negócio
- **Cobertura de código** para principais funcionalidades

---

## 📊 APIs Disponíveis

### **🔐 Autenticação**
```
POST /api/auth/login          # Fazer login
GET  /api/auth/verificar-email # Verificar email existente
```

### **👨‍🎓 Alunos**
```
GET    /api/alunos           # Listar todos os alunos
POST   /api/alunos           # Criar novo aluno
GET    /api/alunos/:id       # Buscar aluno por ID
PUT    /api/alunos/:id       # Atualizar aluno
DELETE /api/alunos/:id       # Excluir aluno
```

### **👨‍🏫 Professores**
```
GET    /api/professores      # Listar todos os professores
POST   /api/professores      # Criar novo professor
GET    /api/professores/:id  # Buscar professor por ID
PUT    /api/professores/:id  # Atualizar professor
DELETE /api/professores/:id  # Excluir professor
```

### **🏫 Oficinas**
```
GET    /api/oficinas         # Listar todas as oficinas
POST   /api/oficinas         # Criar nova oficina
GET    /api/oficinas/:id     # Buscar oficina por ID
PUT    /api/oficinas/:id     # Atualizar oficina
DELETE /api/oficinas/:id     # Excluir oficina
```

---

## 🚀 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Produção** | `npm start` | Inicia o servidor em modo produção |
| **Desenvolvimento** | `npm run dev` | Inicia com nodemon (auto-reload) |
| **Testes** | `npm test` | Executa suíte completa de testes |
| **Seed** | `npm run seed` | Popula banco com dados iniciais |

---

## 🔧 Configuração do Ambiente

### **Variáveis de Ambiente (.env)**
```env
# Configuração do MongoDB
MONGODB_URI=mongodb://localhost:27017/oficina_2

# Configuração do servidor
PORT=3000
NODE_ENV=development

# Chaves de segurança (configurar em produção)
JWT_SECRET=sua_chave_secreta_aqui
SESSION_SECRET=sua_chave_de_sessao_aqui
```

### **Estrutura de Dados**

**Aluno:**
```json
{
  "user": {
    "email": "aluno@email.com",
    "senha": "senha_criptografada"
  },
  "ra": 12345,
  "periodo": 3
}
```

**Professor:**
```json
{
  "user": {
    "email": "professor@email.com",
    "senha": "senha_criptografada"
  },
  "idP": 1001,
  "oficinas": []
}
```

**Oficina:**
```json
{
  "nome": "Lógica de Programação",
  "descricao": "Introdução à lógica computacional",
  "professor": "ObjectId_do_professor",
  "alunos": ["ObjectId_aluno1", "ObjectId_aluno2"]
}
```

---

## 🐛 Resolução de Problemas

### **❌ Problemas Comuns**

**MongoDB não conecta:**
```bash
# Verificar se MongoDB está rodando
brew services list | grep mongodb

# Reiniciar MongoDB
brew services restart mongodb-community
```

**Porta 3000 em uso:**
```bash
# Encontrar processo usando a porta
lsof -ti:3000

# Matar processo
kill -9 $(lsof -ti:3000)
```

**Erro de dependências:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### **🔧 Debug e Logs**
```bash
# Executar com logs detalhados
DEBUG=* npm run dev

# Verificar logs do MongoDB
tail -f /usr/local/var/log/mongodb/mongo.log
```

---

## 📚 Documentação Técnica

### **📋 Diagramas de Sistema**

**Diagrama de Classes**: Modelagem das entidades do sistema
![Diagrama de Classes](./docs/DiagramaDeClasses.drawio.png)

**Diagrama de Casos de Uso**: Interações dos usuários
![Diagrama de Casos de Uso](./docs/DiagramaDeCasosDeUso.drawio.png)

### **🔄 Fluxo de Dados**
1. **Frontend** → Requisição HTTP → **Backend**
2. **Backend** → Validação → **Controller**
3. **Controller** → Regras de Negócio → **Model**
4. **Model** → Query → **MongoDB**
5. **MongoDB** → Dados → **Model** → **Controller** → **Frontend**

### **📝 Padrões de Código**
- **ES6+** para JavaScript moderno
- **Async/Await** para operações assíncronas
- **Error Handling** centralizado
- **Validation** em múltiplas camadas
- **RESTful APIs** com códigos HTTP corretos

---

## 🤝 Contribuição

### **📋 Como Contribuir**
1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### **📏 Padrões de Código**
- Utilize **ESLint** e **Prettier** para formatação
- Siga as **convenções de nomenclatura** existentes
- Adicione **testes** para novas funcionalidades
- Mantenha **documentação** atualizada
- Use **commits semânticos** (feat, fix, docs, etc.)

### **🧪 Antes de Submeter**
```bash
# Executar testes
npm test

# Verificar se não há erros
npm run lint

# Testar build
npm run build
```

---

## 📞 Suporte e Contato

### **🆘 Suporte Técnico**
- **Issues**: Reporte bugs através das Issues do GitHub
- **Documentação**: Consulte este README e código comentado
- **Comunidade**: Participe das discussões do projeto

### **📧 Contatos da Equipe**
Para dúvidas específicas sobre o projeto, entre em contato com a equipe de desenvolvimento.

---

## 👨‍💻 Equipe de Desenvolvimento

| Nome | RA |
|------|-----|
| **João Pedro Vaciloto Montilha** | 2348012 |
| **Luis Henrique de Jesus Lima** | 2313642 |
| **Marcus Vinícius Molina Freitas** | 2383969 |

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da disciplina de **Oficina de Integração 2**.

**Todos os direitos reservados aos desenvolvedores.**

**🚀 Sistema em operação em `http://localhost:3000`**

---

*Última atualização: 29 de maio de 2025*