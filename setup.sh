#!/bin/bash

# Script de configuração de ambiente de desenvolvimento - Oficina Integração

# Configurações do script para melhorar confiabilidade
set -e  # Sair se qualquer comando falhar
set -u  # Tratar variáveis não definidas como erro

# Definir versões centralizadas
NODE_VERSION="18.17.1"  # LTS version
MONGODB_VERSION="6.0"
POSTGRESQL_VERSION="15"
NVM_VERSION="0.39.3"
DRAWIO_VERSION="21.8.2" 
MONGODB_COMPASS_VERSION="1.40.2"

# Opções padrão
MODO_INTERATIVO=true
INSTALAR_GUI=true
INSTALAR_EXTRAS=true
MODO_SILENCIOSO=false

mostrar_ajuda() {
    echo "Uso: $0 [opções]"
    echo "Opções:"
    echo "  -n      Modo não-interativo (usa todas as opções padrão)"
    echo "  -g      Não instalar interfaces gráficas (MongoDB Compass, pgAdmin)"
    echo "  -e      Não instalar ferramentas extras"
    echo "  -s      Modo silencioso (menos saídas)"
    echo "  -h      Exibir esta ajuda"
    exit 0
}

while getopts "ngehs" opt; do
    case $opt in
        n) MODO_INTERATIVO=false ;;
        g) INSTALAR_GUI=false ;;
        e) INSTALAR_EXTRAS=false ;;
        s) MODO_SILENCIOSO=true ;;
        h) mostrar_ajuda ;;
        *) echo "Opção inválida"; mostrar_ajuda ;;
    esac
done

log() {
    local msg="$1"
    local tipo="${2:-INFO}"
    
    if ! $MODO_SILENCIOSO || [ "$tipo" = "ERRO" ]; then
        echo -e "\033[1m[$tipo]\033[0m $msg"
    fi
}

comando_existe() {
    command -v "$1" >/dev/null 2>&1
}

detectar_so() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "outro"
    fi
}

detectar_linux_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$ID"
    else
        echo "unknown"
    fi
}

instalar_linux() {
    local distro=$(detectar_linux_distro)
    if [[ "$distro" != "ubuntu" && "$distro" != "debian" ]]; then
        log "Este script foi testado apenas em Ubuntu/Debian. Outras distribuições podem não funcionar corretamente." "AVISO"
        read -p "Deseja continuar mesmo assim? (s/n): " continuar
        if [[ "$continuar" != "s" && "$continuar" != "S" ]]; then
            log "Instalação cancelada pelo usuário" "INFO"
            exit 0
        fi
    fi

    sudo -v
    
    log "Atualizando sistema..."
    if ! sudo apt update && sudo apt upgrade -y; then
        log "Falha ao atualizar o sistema. Verificando repositórios..." "AVISO"
        sudo apt update
    fi

    log "Instalando ferramentas básicas de desenvolvimento..."

    local pacotes_necessarios=()
    for pkg in build-essential git curl wget unzip zip software-properties-common apt-transport-https ca-certificates gnupg lsb-release; do
        if ! dpkg -s "$pkg" &>/dev/null; then
            pacotes_necessarios+=("$pkg")
        fi
    done
    
    if [ ${#pacotes_necessarios[@]} -gt 0 ]; then
        log "Instalando pacotes: ${pacotes_necessarios[*]}"
        sudo apt install -y "${pacotes_necessarios[@]}"
    else
        log "Todas as ferramentas básicas já estão instaladas" "SUCESSO"
    fi

    if ! comando_existe node || [[ "$(node -v 2>/dev/null)" != "v$NODE_VERSION" ]]; then
        log "Instalando NVM e Node.js $NODE_VERSION..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v$NVM_VERSION/install.sh | bash
        
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        nvm install $NODE_VERSION
        nvm use $NODE_VERSION
        nvm alias default $NODE_VERSION
        
        log "Versão do Node.js instalada: $(node -v)"
        log "Versão do NPM instalada: $(npm -v)"
    else
        log "Node.js $NODE_VERSION já está instalado" "SUCESSO"
    fi
    
    if $MODO_INTERATIVO; then
        PS3="Escolha o banco de dados para instalar (1-3): "
        select banco in "MongoDB" "PostgreSQL" "Ambos"; do
            case $banco in
                "MongoDB")
                    instalar_mongodb_linux
                    break
                    ;;
                "PostgreSQL")
                    instalar_postgresql_linux
                    break
                    ;;
                "Ambos")
                    instalar_mongodb_linux
                    instalar_postgresql_linux
                    break
                    ;;
                *) 
                    log "Opção inválida, tente novamente" "AVISO"
                    ;;
            esac
        done
    else
        instalar_mongodb_linux
    fi
    
    log "Instalando ferramentas de desenvolvimento web..."
    
    if ! comando_existe code; then
        log "Instalando Visual Studio Code..."
        wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
        sudo install -D -o root -g root -m 644 microsoft.gpg /usr/share/keyrings/microsoft-archive-keyring.gpg
        sudo sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list'
        sudo apt update
        sudo apt install -y code
        rm microsoft.gpg
    else
        log "VS Code já está instalado" "SUCESSO"
    fi
    
    if ! comando_existe playwright; then
        log "Instalando Playwright para testes..."
        npm install -g @playwright/test
        npx playwright install --with-deps chromium
    else
        log "Playwright já está instalado" "SUCESSO"
    fi
    
    if ! comando_existe git; then
        log "Instalando Git..."
        sudo apt install -y git
    else
        log "Git já está instalado" "SUCESSO"
    fi
    
    if $INSTALAR_GUI; then
        if ! comando_existe drawio; then
            log "Instalando Draw.io Desktop..."
            wget -q "https://github.com/jgraph/drawio-desktop/releases/download/v$DRAWIO_VERSION/drawio-amd64-$DRAWIO_VERSION.deb"
            sudo apt install -y "./drawio-amd64-$DRAWIO_VERSION.deb"
            rm "drawio-amd64-$DRAWIO_VERSION.deb"
        else
            log "Draw.io Desktop já está instalado" "SUCESSO"
        fi
        
        if ! comando_existe google-chrome; then
            log "Instalando Google Chrome..."
            wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
            sudo apt install -y ./google-chrome-stable_current_amd64.deb
            rm google-chrome-stable_current_amd64.deb
        else
            log "Google Chrome já está instalado" "SUCESSO"
        fi
    fi
}

instalar_mongodb_linux() {
    if comando_existe mongod && systemctl is-active --quiet mongod; then
        log "MongoDB já está instalado e em execução" "SUCESSO"
        return 0
    fi

    log "Instalando MongoDB $MONGODB_VERSION..."
    
    curl -fsSL https://pgp.mongodb.com/server-$MONGODB_VERSION.asc | \
        sudo gpg -o /usr/share/keyrings/mongodb-server-$MONGODB_VERSION.gpg \
        --dearmor
        
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-$MONGODB_VERSION.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/$MONGODB_VERSION multiverse" | \
        sudo tee /etc/apt/sources.list.d/mongodb-org-$MONGODB_VERSION.list
        
    sudo apt update
    if ! sudo apt install -y mongodb-org; then
        log "Falha ao instalar MongoDB. Verifique os logs para mais detalhes." "ERRO"
        return 1
    fi
    
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    if ! systemctl is-active --quiet mongod; then
        log "MongoDB instalado, mas o serviço não iniciou corretamente." "AVISO"
        log "Verifique o status: sudo systemctl status mongod"
    else
        log "MongoDB instalado e iniciado com sucesso!" "SUCESSO"
    fi
    
    if $INSTALAR_GUI; then
        log "Instalando MongoDB Compass..."
        wget -q "https://downloads.mongodb.com/compass/mongodb-compass_${MONGODB_COMPASS_VERSION}_amd64.deb"
        if ! sudo dpkg -i "mongodb-compass_${MONGODB_COMPASS_VERSION}_amd64.deb"; then
            sudo apt --fix-broken install -y
        fi
        rm "mongodb-compass_${MONGODB_COMPASS_VERSION}_amd64.deb"
    fi
}

instalar_postgresql_linux() {
    if comando_existe psql && systemctl is-active --quiet postgresql; then
        log "PostgreSQL já está instalado e em execução" "SUCESSO"
        return 0
    fi

    log "Instalando PostgreSQL $POSTGRESQL_VERSION..."
    
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
        sudo gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | \
        sudo tee /etc/apt/sources.list.d/pgdg.list > /dev/null
    
    sudo apt update
    if ! sudo apt install -y postgresql-$POSTGRESQL_VERSION postgresql-contrib-$POSTGRESQL_VERSION; then
        log "Falha ao instalar PostgreSQL. Verifique os logs para mais detalhes." "ERRO"
        return 1
    fi
    
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    if ! systemctl is-active --quiet postgresql; then
        log "PostgreSQL instalado, mas o serviço não iniciou corretamente." "AVISO"
        log "Verifique o status: sudo systemctl status postgresql"
    else
        log "PostgreSQL instalado e iniciado com sucesso!" "SUCESSO"
    fi
    
    if $INSTALAR_GUI; then
        log "Instalando pgAdmin 4..."

        curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | \
            sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg
        sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list'
        
        sudo apt update
        sudo apt install -y pgadmin4-desktop
    fi
}

instalar_macos() {
    if ! comando_existe brew; then
        log "Instalando Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        if [[ -f "$HOME/.zshrc" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zshrc"
            eval "$(/opt/homebrew/bin/brew shellenv)"
        elif [[ -f "$HOME/.bash_profile" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.bash_profile"
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
    else
        log "Atualizando Homebrew..."
        brew update
    fi

    log "Verificando ferramentas básicas de desenvolvimento..."
    local pacotes_para_instalar=()
    
    for pkg in git curl wget unzip; do
        if ! brew list --formula | grep -q "^${pkg}\$"; then
            pacotes_para_instalar+=("$pkg")
        fi
    done
    
    if [ ${#pacotes_para_instalar[@]} -gt 0 ]; then
        log "Instalando: ${pacotes_para_instalar[*]}"
        brew install "${pacotes_para_instalar[@]}"
    else
        log "Todas as ferramentas básicas já estão instaladas" "SUCESSO"
    fi

    if ! comando_existe node || [[ "$(node -v 2>/dev/null)" != "v$NODE_VERSION" ]]; then
        log "Instalando NVM e Node.js $NODE_VERSION..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v$NVM_VERSION/install.sh | bash
        
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        nvm install $NODE_VERSION
        nvm use $NODE_VERSION
        nvm alias default $NODE_VERSION
        
        log "Versão do Node.js instalada: $(node -v)"
        log "Versão do NPM instalada: $(npm -v)"
    else
        log "Node.js $NODE_VERSION já está instalado" "SUCESSO"
    fi
    
    if $MODO_INTERATIVO; then
        PS3="Escolha o banco de dados para instalar (1-3): "
        select banco in "MongoDB" "PostgreSQL" "Ambos"; do
            case $banco in
                "MongoDB")
                    instalar_mongodb_macos
                    break
                    ;;
                "PostgreSQL")
                    instalar_postgresql_macos
                    break
                    ;;
                "Ambos")
                    instalar_mongodb_macos
                    instalar_postgresql_macos
                    break
                    ;;
                *) 
                    log "Opção inválida, tente novamente" "AVISO"
                    ;;
            esac
        done
    else
        instalar_mongodb_macos
    fi
    
    log "Instalando ferramentas de desenvolvimento web..."
    
    if ! comando_existe code; then
        log "Instalando Visual Studio Code..."
        if ! brew install --cask visual-studio-code; then
            log "Falha ao instalar VS Code através do Homebrew. Tente instalá-lo manualmente." "ERRO"
        fi
    else
        log "VS Code já está instalado" "SUCESSO"
    fi
    
    if ! comando_existe playwright; then
        log "Instalando Playwright para testes..."
        npm install -g @playwright/test
        npx playwright install --with-deps chromium
    else
        log "Playwright já está instalado" "SUCESSO"
    fi
    
    if $INSTALAR_GUI; then
        if ! mdfind "kMDItemKind == 'Application'" | grep -i drawio &>/dev/null; then
            log "Instalando Draw.io Desktop..."
            brew install --cask drawio
        else
            log "Draw.io Desktop já está instalado" "SUCESSO"
        fi
    fi
    
    if ! mdfind "kMDItemKind == 'Application'" | grep -i "Google Chrome.app" &>/dev/null; then
        log "Instalando Google Chrome..."
        brew install --cask google-chrome
    else
        log "Google Chrome já está instalado" "SUCESSO"
    fi
}

instalar_mongodb_macos() {
    if brew list --formula | grep -q "^mongodb-community\$"; then
        if brew services list | grep mongodb-community | grep -q started; then
            log "MongoDB já está instalado e em execução" "SUCESSO"
            return 0
        else
            log "MongoDB já está instalado, iniciando serviço..."
            brew services start mongodb-community
        fi
    else
        log "Instalando MongoDB..."
        brew tap mongodb/brew
        if ! brew install mongodb-community; then
            log "Falha ao instalar MongoDB" "ERRO"
            return 1
        fi
        
        brew services start mongodb-community
    fi
    
    log "MongoDB instalado e iniciado!" "SUCESSO"
    
    if $INSTALAR_GUI; then
        if ! mdfind "kMDItemKind == 'Application'" | grep -i "MongoDB Compass" &>/dev/null; then
            log "Instalando MongoDB Compass..."
            brew install --cask mongodb-compass
        else
            log "MongoDB Compass já está instalado" "SUCESSO"
        fi
    fi
}

instalar_postgresql_macos() {
    if brew list --formula | grep -q "^postgresql[@0-9.]*\$"; then
        if brew services list | grep postgresql | grep -q started; then
            log "PostgreSQL já está instalado e em execução" "SUCESSO"
            return 0
        else
            log "PostgreSQL já está instalado, iniciando serviço..."
            brew services start postgresql
        fi
    else
        log "Instalando PostgreSQL..."
        if ! brew install postgresql; then
            log "Falha ao instalar PostgreSQL" "ERRO"
            return 1
        fi
        
        brew services start postgresql
    fi
    
    log "PostgreSQL instalado e iniciado!" "SUCESSO"
    
    if $INSTALAR_GUI; then
        if ! mdfind "kMDItemKind == 'Application'" | grep -i "pgAdmin 4" &>/dev/null; then
            log "Instalando pgAdmin 4..."
            brew install --cask pgadmin4
        else
            log "pgAdmin 4 já está instalado" "SUCESSO"
        fi
    fi
}

configurar_git() {
    log "Configurando Git..."
    
    local git_nome=$(git config --global user.name)
    local git_email=$(git config --global user.email)
    
    if [[ -z "$git_nome" ]]; then
        if $MODO_INTERATIVO; then
            read -p "Digite seu nome para configuração do Git: " git_nome
        else
            git_nome="Developer"
            log "Modo não interativo: usando nome padrão '$git_nome' para o Git" "INFO"
        fi
        git config --global user.name "$git_nome"
    else
        log "Nome do Git já configurado: $git_nome" "INFO"
    fi
    
    if [[ -z "$git_email" ]]; then
        if $MODO_INTERATIVO; then
            read -p "Digite seu email para configuração do Git: " git_email
        else
            git_email="dev@example.com"
            log "Modo não interativo: usando email padrão '$git_email' para o Git" "INFO"
        fi
        git config --global user.email "$git_email"
    else
        log "Email do Git já configurado: $git_email" "INFO"
    fi
    
    if [[ "$(git config --global init.defaultBranch)" != "main" ]]; then
        git config --global init.defaultBranch main
    fi
    
    if [[ -z "$(git config --global core.editor)" ]]; then
        git config --global core.editor "code --wait"
    fi
    
    if [[ -z "$(git config --global push.default)" ]]; then
        git config --global push.default simple
    fi
    
    if [[ -z "$(git config --global pull.rebase)" ]]; then
        git config --global pull.rebase false
    fi
    
    git config --global color.ui true
    git config --global core.autocrlf input
    
    log "Git configurado com sucesso!" "SUCESSO"
    
    if comando_existe gh; then
        log "GitHub CLI já está instalado" "INFO"
        return 0
    fi
    
    local instalar_gh="n"
    if $MODO_INTERATIVO; then
        read -p "Deseja instalar e configurar GitHub CLI? (s/n): " instalar_gh
    fi
    
    if [[ "$instalar_gh" == "s" || "$instalar_gh" == "S" ]]; then
        so=$(detectar_so)
        
        if [[ "$so" == "linux" ]]; then
            log "Instalando GitHub CLI no Linux..."
            curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
            sudo apt update
            sudo apt install -y gh
        elif [[ "$so" == "macos" ]]; then
            log "Instalando GitHub CLI no macOS..."
            brew install gh
        fi
        
        if $MODO_INTERATIVO; then
            log "Autenticando no GitHub..."
            gh auth login
        else
            log "Modo não interativo: pulando autenticação no GitHub" "INFO"
        fi
    fi
}

configurar_aliases() {
    log "Configurando aliases úteis..."
    
    if [[ -f "$HOME/.bashrc" ]]; then
        config_file="$HOME/.bashrc"
    elif [[ -f "$HOME/.zshrc" ]]; then
        config_file="$HOME/.zshrc"
    else
        log "Não foi possível detectar um arquivo de configuração de shell compatível" "ERRO"
        return 1
    fi
    
    cat << EOF >> "$config_file"

# Aliases de desenvolvimento adicionados pelo script de configuração
alias gs='git status'
alias gl='git log --oneline --graph --all'
alias gp='git pull'
alias gd='git diff'
alias gc='git commit -m'
alias gph='git push'
alias ll='ls -la'

# Aliases para o projeto React/Node
alias nrs='npm run start'
alias nrd='npm run dev'
alias nrb='npm run build'
alias nrt='npm run test'
alias nri='npm run install'

# Aliases para Express
alias esp='npx express-generator'

# Aliases para Playwright
alias pw='npx playwright test'
alias pwui='npx playwright test --ui'
alias pwdebug='npx playwright test --debug'
EOF
    
    log "Aliases configurados! Execute 'source $config_file' para aplicar as mudanças." "SUCESSO"
}

instalar_ferramentas_extras() {
    if ! $INSTALAR_EXTRAS; then
        log "Instalação de ferramentas extras desativada" "INFO"
        return 0
    fi
    
    log "Instalando ferramentas extras para o projeto..."
    
    log "Verificando pacotes globais do Node.js..."
    local pacotes_npm=("nodemon" "express-generator" "create-react-app" "yarn" "mocha")
    local pacotes_para_instalar=()
    
    for pkg in "${pacotes_npm[@]}"; do
        if ! comando_existe "$pkg"; then
            pacotes_para_instalar+=("$pkg")
        fi
    done
    
    if [ ${#pacotes_para_instalar[@]} -gt 0 ]; then
        log "Instalando pacotes npm globais: ${pacotes_para_instalar[*]}"
        if ! npm install -g "${pacotes_para_instalar[@]}"; then
            log "Falha ao instalar alguns pacotes npm. Tentando instalar individualmente..." "AVISO"
            for pkg in "${pacotes_para_instalar[@]}"; do
                npm install -g "$pkg" || log "Falha ao instalar $pkg" "ERRO"
            done
        fi
    else
        log "Todos os pacotes npm necessários já estão instalados" "SUCESSO"
    fi
    
    if ! comando_existe code; then
        log "Visual Studio Code não está instalado. Pulando instalação de extensões." "AVISO"
        return 1
    fi
    
    log "Instalando extensões do VSCode recomendadas..."
    
    local extensoes_react=("dsznajder.es7-react-js-snippets" "esbenp.prettier-vscode" "dbaeumer.vscode-eslint")
    local extensoes_node=("christian-kohler.npm-intellisense" "mikestead.dotenv")
    local extensoes_db=("mongodb.mongodb-vscode" "cweijan.vscode-postgresql-client2")
    local extensoes_test=("ms-playwright.playwright")
    local extensoes_drawio=("hediet.vscode-drawio")
    local extensoes_git=("eamodio.gitlens" "github.vscode-pull-request-github")
    local extensoes_tema=("github.github-vscode-theme" "pkief.material-icon-theme" "formulahendry.auto-rename-tag")
    
    instalar_extensoes() {
        local categoria="$1"
        shift
        local extensoes=("$@")
        
        log "Instalando extensões para $categoria..."
        for ext in "${extensoes[@]}"; do
            code --install-extension "$ext" --force
        done
    }
    
    instalar_extensoes "React" "${extensoes_react[@]}"
    instalar_extensoes "Node.js" "${extensoes_node[@]}"
    instalar_extensoes "Bancos de dados" "${extensoes_db[@]}"
    instalar_extensoes "Testes" "${extensoes_test[@]}"
    instalar_extensoes "Draw.io" "${extensoes_drawio[@]}"
    instalar_extensoes "Git" "${extensoes_git[@]}"
    instalar_extensoes "Tema e produtividade" "${extensoes_tema[@]}"
    
    log "Extensões do VSCode instaladas com sucesso!" "SUCESSO"
}

criar_estrutura_projeto() {
    local criar_projeto="n"
    local nome_projeto="mern_project"
    
    if $MODO_INTERATIVO; then
        read -p "Deseja criar uma estrutura básica de projeto? (s/n): " criar_projeto
    else
        log "Modo não interativo: pulando criação de estrutura de projeto" "INFO"
        return 0
    fi
    
    if [[ "$criar_projeto" == "s" || "$criar_projeto" == "S" ]]; then
        if $MODO_INTERATIVO; then
            read -p "Digite o nome do seu projeto: " nome_projeto
        fi
        
        log "Criando estrutura básica para o projeto '$nome_projeto'..."
        
        mkdir -p "$nome_projeto"
        cd "$nome_projeto" || { log "Falha ao entrar no diretório do projeto" "ERRO"; return 1; }
        
        git init
        
        mkdir -p frontend backend docs
        
        log "Inicializando projeto React no frontend..."
        cd frontend || { log "Falha ao entrar no diretório frontend" "ERRO"; return 1; }
        if ! npx create-react-app . --quiet; then
            log "Falha ao criar projeto React. Verifique o Node.js e o NPM." "ERRO"
            return 1
        fi
        cd .. || { log "Falha ao voltar ao diretório do projeto" "ERRO"; return 1; }
        
        log "Inicializando projeto Express no backend..."
        cd backend || { log "Falha ao entrar no diretório backend" "ERRO"; return 1; }
        if ! npx express-generator --no-view --quiet; then
            log "Falha ao criar projeto Express. Verificando se o pacote está instalado..." "AVISO"
            npm install -g express-generator
            npx express-generator --no-view
        fi
        
        log "Instalando dependências no backend..."
        npm install
        
        log "Adicionando Mocha e Chai para testes no backend..."
        npm install mocha chai --save-dev
        
        # Criar diretório para testes
        mkdir -p test
        
        # Criar arquivo de exemplo de teste com Mocha e Chai
        cat << EOF > test/example.test.js
const chai = require('chai');
const expect = chai.expect;

describe('Exemplo de teste', function() {
  it('deve retornar verdadeiro', function() {
    expect(true).to.equal(true);
  });
  
  it('deve realizar operações matemáticas corretamente', function() {
    expect(2 + 2).to.equal(4);
    expect(8 / 2).to.equal(4);
  });
});
EOF

        # Adicionar script de teste no package.json
        sed -i.bak 's/"scripts": {/"scripts": {\n    "test": "mocha",/g' package.json && rm package.json.bak
        
        cd .. || { log "Falha ao voltar ao diretório do projeto" "ERRO"; return 1; }
        
        log "Criando arquivos de configuração..."
        echo "# $nome_projeto" > README.md
        
        cat << EOF > .gitignore
# Node
node_modules/
npm-debug.log
yarn-error.log
yarn-debug.log
.pnpm-debug.log
package-lock.json
.npm

# Ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build
build/
dist/
out/
coverage/
.next/

# IDE
.idea/
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# OS
.DS_Store
Thumbs.db
EOF
        
        log "Criando arquivo Docker Compose..."
        cat << EOF > docker-compose.yml
version: '3'
services:
  mongodb:
    image: mongo:latest
    container_name: ${nome_projeto}_mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
  
  postgres:
    image: postgres:latest
    container_name: ${nome_projeto}_postgres
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: ${nome_projeto}_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  mongodb_data:
  postgres_data:
EOF
        
        mkdir -p .vscode
        cat << EOF > .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.rulers": [80, 120],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}
EOF
        
        log "Estrutura básica criada com sucesso em: $(pwd)" "SUCESSO"
        log "Para começar a desenvolver:" "INFO"
        log "  1. cd $nome_projeto" "INFO"
        log "  2. cd frontend && npm start  # para o frontend" "INFO"
        log "  3. cd backend && npm install && npm start  # para o backend" "INFO"
    fi
}

limpar_ambiente() {
    log "Limpando arquivos temporários..."
    
    local arquivos_temp=("microsoft.gpg" "*.deb" "*.tmp")
    
    for padrao in "${arquivos_temp[@]}"; do
        find . -maxdepth 1 -name "$padrao" -type f -delete 2>/dev/null
    done
    
    if [[ "$(detectar_so)" == "linux" ]]; then
        if $MODO_INTERATIVO; then
            read -p "Deseja limpar o cache de pacotes APT? (s/n): " limpar_apt
            if [[ "$limpar_apt" == "s" || "$limpar_apt" == "S" ]]; then
                sudo apt clean
                sudo apt autoclean
            fi
        fi
    fi
    
    log "Limpeza concluída" "SUCESSO"
}

main() {
    local inicio=$(date +%s)
    
    log "Iniciando configuração do ambiente de desenvolvimento para projeto React/Node.js..." "INÍCIO"
    log "Sistema operacional detectado: $(detectar_so)"
    log "Data: $(date)"
    log "Modo interativo: $MODO_INTERATIVO"
    log "Instalar interfaces gráficas: $INSTALAR_GUI"
    log "Instalar ferramentas extras: $INSTALAR_EXTRAS"
    
    trap 'echo "Erro na linha ${LINENO}: comando \\"${BASH_COMMAND}\\" falhou com status $?"; exit 1' ERR
    
    so=$(detectar_so)
    case "$so" in
        "linux")
            instalar_linux
            ;;
        "macos")
            instalar_macos
            ;;
        *)
            log "Sistema operacional não suportado: $OSTYPE" "ERRO"
            exit 1
            ;;
    esac
    
    configurar_git
    configurar_aliases
    
    if $INSTALAR_EXTRAS; then
        instalar_ferramentas_extras
    fi
    
    criar_estrutura_projeto
    
    limpar_ambiente
    
    local fim=$(date +%s)
    local tempo_total=$((fim - inicio))
    local minutos=$((tempo_total / 60))
    local segundos=$((tempo_total % 60))
    
    log "Configuração do ambiente de desenvolvimento concluída com sucesso!" "SUCESSO"
    log "Tempo total de execução: ${minutos}m ${segundos}s" "INFO"
    log "Por favor, reinicie seu terminal para aplicar todas as alterações."
    log "Execute 'source ~/.bashrc' ou 'source ~/.zshrc' para aplicar as alterações imediatamente."
}

main