# Script de configuração de ambiente de desenvolvimento - Oficina Integração

# Definir versões centralizadas
$nodeVersion = "18.17.1"
$mongodbVersion = "6.0"
$postgresqlVersion = "15"
$drawioVersion = "21.8.2"
$mongodbCompassVersion = "1.40.2"

# Opções padrão
$ModoInterativo = $true
$InstalarGUI = $true
$InstalarExtras = $true
$ModoSilencioso = $false

param (
    [switch]$n # Modo não-interativo
    [switch]$g # Não instalar interfaces gráficas
    [switch]$e # Não instalar ferramentas extras
    [switch]$s # Modo silencioso
    [switch]$h # Exibir ajuda
)

if ($n) { $ModoInterativo = $false }
if ($g) { $InstalarGUI = $false }
if ($e) { $InstalarExtras = $false }
if ($s) { $ModoSilencioso = $false }

if ($h) {
    Write-Host "Uso: .\setup.ps1 [opções]"
    Write-Host "Opções:"
    Write-Host "  -n      Modo não-interativo (usa todas as opções padrão)"
    Write-Host "  -g      Não instalar interfaces gráficas (MongoDB Compass, pgAdmin)"
    Write-Host "  -e      Não instalar ferramentas extras"
    Write-Host "  -s      Modo silencioso (menos saídas)"
    Write-Host "  -h      Exibir esta ajuda"
    exit 0
}

function Log {
    param (
        [string]$Mensagem,
        [string]$Tipo = "INFO"
    )
    
    if (!$ModoSilencioso -or $Tipo -eq "ERRO") {
        if ($Tipo -eq "SUCESSO") {
            $corDestaque = "Green"
        } elseif ($Tipo -eq "AVISO") {
            $corDestaque = "Yellow"
        } elseif ($Tipo -eq "ERRO") {
            $corDestaque = "Red"
        } else {
            $corDestaque = "Cyan"
        }
        
        Write-Host "[$Tipo] " -ForegroundColor $corDestaque -NoNewline
        Write-Host $Mensagem
    }
}

function ComandoExiste {
    param (
        [string]$cmd
    )
    
    return [bool](Get-Command -Name $cmd -ErrorAction SilentlyContinue)
}

function VerificarAdministrador {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    $isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if (-not $isAdmin) {
        Log "Este script precisa ser executado como Administrador." "ERRO"
        Log "Por favor, feche o PowerShell e execute-o novamente como Administrador." "ERRO"
        exit 1
    }
}

function InstalarChocolatey {
    if (-not (ComandoExiste choco)) {
        Log "Instalando Chocolatey..."
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        
        Log "Chocolatey instalado com sucesso!" "SUCESSO"
    } else {
        Log "Chocolatey já está instalado" "SUCESSO"
    }
}

function InstalarFerramentasBasicas {
    Log "Instalando ferramentas básicas de desenvolvimento..."
    
    $pacotesBasicos = @("git", "curl", "wget", "unzip", "7zip")
    
    foreach ($pacote in $pacotesBasicos) {
        if (-not (ComandoExiste $pacote)) {
            Log "Instalando $pacote..."
            choco install $pacote -y --no-progress
        } else {
            Log "$pacote já está instalado" "SUCESSO"
        }
    }
    
    Log "Ferramentas básicas instaladas com sucesso!" "SUCESSO"
}

function InstalarNodeJs {
    if (-not (ComandoExiste node) -or (node -v) -notlike "*$nodeVersion*") {
        Log "Instalando Node.js $nodeVersion..."
        
        if (-not (ComandoExiste nvm)) {
            Log "Instalando NVM para Windows..."
            choco install nvm -y --no-progress
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        }
        
        nvm install $nodeVersion
        nvm use $nodeVersion
        
        Log "Versão do Node.js instalada: $(node -v)"
        Log "Versão do NPM instalada: $(npm -v)"
    } else {
        Log "Node.js $nodeVersion já está instalado" "SUCESSO"
    }
}

function InstalarMongoDB {
    if (-not (ComandoExiste mongod)) {
        Log "Instalando MongoDB $mongodbVersion..."
        choco install mongodb -y --no-progress
        
        if (-not (Test-Path "C:\data\db")) {
            New-Item -ItemType Directory -Path "C:\data\db" -Force | Out-Null
        }
        
        try {
            Start-Service MongoDB
            Set-Service MongoDB -StartupType Automatic
            Log "MongoDB instalado e serviço iniciado!" "SUCESSO"
        } catch {
            Log "MongoDB instalado, mas o serviço não pôde ser iniciado. Verifique manualmente." "AVISO"
        }
    } else {
        Log "MongoDB já está instalado" "SUCESSO"
    }
    
    if ($InstalarGUI) {
        if (-not (Test-Path "C:\Program Files\MongoDB Compass\MongoDBCompass.exe")) {
            Log "Instalando MongoDB Compass..."
            choco install mongodb-compass -y --no-progress
        } else {
            Log "MongoDB Compass já está instalado" "SUCESSO"
        }
    }
}

function InstalarPostgreSQL {
    if (-not (ComandoExiste psql)) {
        Log "Instalando PostgreSQL $postgresqlVersion..."
        
        choco install postgresql --params "/Password:postgres" -y --no-progress
        
        try {
            $service = Get-Service -Name postgresql*
            if ($service.Status -ne 'Running') {
                Start-Service $service.Name
            }
            Log "PostgreSQL instalado e serviço iniciado!" "SUCESSO"
        } catch {
            Log "PostgreSQL instalado, mas o serviço não pôde ser verificado. Verifique manualmente." "AVISO"
        }
    } else {
        Log "PostgreSQL já está instalado" "SUCESSO"
    }
    
    if ($InstalarGUI) {
        if (-not (Test-Path "C:\Program Files\pgAdmin 4\bin\pgAdmin4.exe")) {
            Log "Instalando pgAdmin 4..."
            choco install pgadmin4 -y --no-progress
        } else {
            Log "pgAdmin 4 já está instalado" "SUCESSO"
        }
    }
}

function EscolherBancoDados {
    if ($ModoInterativo) {
        Log "Qual banco de dados você deseja instalar?"
        Log "1. MongoDB"
        Log "2. PostgreSQL"
        Log "3. Ambos"
        
        $escolha = Read-Host "Escolha (1-3)"
        
        switch ($escolha) {
            "1" {
                InstalarMongoDB
            }
            "2" {
                InstalarPostgreSQL
            }
            "3" {
                InstalarMongoDB
                InstalarPostgreSQL
            }
            default {
                Log "Opção inválida. Instalando MongoDB por padrão." "AVISO"
                InstalarMongoDB
            }
        }
    } else {
        InstalarMongoDB
    }
}

function InstalarFerramentasDesenvWeb {
    Log "Instalando ferramentas de desenvolvimento web..."
    
    if (-not (ComandoExiste code)) {
        Log "Instalando Visual Studio Code..."
        choco install vscode -y --no-progress
        
        $vscPath = "C:\Program Files\Microsoft VS Code\bin"
        if ($env:Path -notlike "*$vscPath*") {
            [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$vscPath", "Machine")
            $env:Path += ";$vscPath"
        }
    } else {
        Log "VS Code já está instalado" "SUCESSO"
    }
    
    if (-not (ComandoExiste playwright)) {
        Log "Instalando Playwright para testes..."
        npm install -g @playwright/test
        npx playwright install --with-deps chromium
    } else {
        Log "Playwright já está instalado" "SUCESSO"
    }
    
    if ($InstalarGUI) {
        if (-not (Test-Path "C:\Program Files\draw.io\draw.io.exe")) {
            Log "Instalando Draw.io Desktop..."
            choco install drawio -y --no-progress
        } else {
            Log "Draw.io Desktop já está instalado" "SUCESSO"
        }
        
        if (-not (Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe")) {
            Log "Instalando Google Chrome..."
            choco install googlechrome -y --no-progress
        } else {
            Log "Google Chrome já está instalado" "SUCESSO"
        }
    }
}

function ConfigurarGit {
    Log "Configurando Git..."
    
    if (-not (ComandoExiste git)) {
        Log "Git não está instalado. Instalando agora..." "AVISO"
        choco install git -y --no-progress
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    }
    
    $gitNome = git config --global user.name
    $gitEmail = git config --global user.email
    
    if ([string]::IsNullOrEmpty($gitNome)) {
        if ($ModoInterativo) {
            $gitNome = Read-Host "Digite seu nome para configuração do Git"
        } else {
            $gitNome = "Developer"
            Log "Modo não interativo: usando nome padrão '$gitNome' para o Git" "INFO"
        }
        git config --global user.name $gitNome
    } else {
        Log "Nome do Git já configurado: $gitNome" "INFO"
    }
    
    if ([string]::IsNullOrEmpty($gitEmail)) {
        if ($ModoInterativo) {
            $gitEmail = Read-Host "Digite seu email para configuração do Git"
        } else {
            $gitEmail = "dev@example.com"
            Log "Modo não interativo: usando email padrão '$gitEmail' para o Git" "INFO"
        }
        git config --global user.email $gitEmail
    } else {
        Log "Email do Git já configurado: $gitEmail" "INFO"
    }
    
    git config --global init.defaultBranch main
    git config --global core.editor "code --wait"
    git config --global push.default simple
    git config --global pull.rebase false
    git config --global color.ui true
    git config --global core.autocrlf true
    
    Log "Git configurado com sucesso!" "SUCESSO"
    
    if (ComandoExiste gh) {
        Log "GitHub CLI já está instalado" "INFO"
        return
    }
    
    if ($ModoInterativo) {
        $instalarGh = Read-Host "Deseja instalar e configurar GitHub CLI? (s/n)"
        if ($instalarGh -eq "s") {
            choco install gh -y --no-progress
            
            if ($ModoInterativo) {
                Log "Autenticando no GitHub..."
                gh auth login
            }
        }
    }
}

function InstalarFerramentasExtras {
    if (-not $InstalarExtras) {
        Log "Instalação de ferramentas extras desativada" "INFO"
        return
    }
    
    Log "Instalando ferramentas extras para o projeto..."
    
    Log "Verificando pacotes globais do Node.js..."
    $pacotesNpm = @("nodemon", "express-generator", "create-react-app", "yarn", "mocha", "chai")
    
    foreach ($pacote in $pacotesNpm) {
        if (-not (ComandoExiste $pacote)) {
            Log "Instalando $pacote..."
            npm install -g $pacote
        } else {
            Log "$pacote já está instalado" "SUCESSO"
        }
    }
    
    if (-not (ComandoExiste code)) {
        Log "Visual Studio Code não está instalado. Pulando instalação de extensões." "AVISO"
        return
    }
    
    Log "Instalando extensões do VSCode recomendadas..."
    
    $extensoesReact = @("dsznajder.es7-react-js-snippets", "esbenp.prettier-vscode", "dbaeumer.vscode-eslint")
    $extensoesNode = @("christian-kohler.npm-intellisense", "mikestead.dotenv")
    $extensoesDB = @("mongodb.mongodb-vscode", "cweijan.vscode-postgresql-client2")
    $extensoesTest = @("ms-playwright.playwright")
    $extensoesDrawio = @("hediet.vscode-drawio")
    $extensoesGit = @("eamodio.gitlens", "github.vscode-pull-request-github")
    $extensoesTema = @("github.github-vscode-theme", "pkief.material-icon-theme", "formulahendry.auto-rename-tag")
    
    function InstalarExtensoes {
        param (
            [string]$categoria,
            [array]$extensoes
        )
        
        Log "Instalando extensões para $categoria..."
        foreach ($extensao in $extensoes) {
            code --install-extension $extensao --force
        }
    }
    
    InstalarExtensoes "React" $extensoesReact
    InstalarExtensoes "Node.js" $extensoesNode
    InstalarExtensoes "Bancos de dados" $extensoesDB
    InstalarExtensoes "Testes" $extensoesTest
    InstalarExtensoes "Draw.io" $extensoesDrawio
    InstalarExtensoes "Git" $extensoesGit
    InstalarExtensoes "Tema e produtividade" $extensoesTema
    
    Log "Extensões do VSCode instaladas com sucesso!" "SUCESSO"
}

function CriarEstruturaProjeto {
    $criarProjeto = "n"
    $nomeProjeto = "mern_project"
    
    if ($ModoInterativo) {
        $criarProjeto = Read-Host "Deseja criar uma estrutura básica de projeto? (s/n)"
    } else {
        Log "Modo não interativo: pulando criação de estrutura de projeto" "INFO"
        return
    }
    
    if ($criarProjeto -eq "s") {
        if ($ModoInterativo) {
            $nomeProjeto = Read-Host "Digite o nome do seu projeto"
        }
        
        Log "Criando estrutura básica para o projeto '$nomeProjeto'..."
        
        # Criar diretório do projeto
        New-Item -ItemType Directory -Path $nomeProjeto -Force | Out-Null
        Set-Location $nomeProjeto
        
        git init
        
        # Criar estrutura de diretórios
        New-Item -ItemType Directory -Path "frontend" -Force | Out-Null
        New-Item -ItemType Directory -Path "backend" -Force | Out-Null
        New-Item -ItemType Directory -Path "docs" -Force | Out-Null
        
        # Inicializar projeto React no frontend
        Log "Inicializando projeto React no frontend..."
        Set-Location "frontend"
        npx create-react-app . --quiet
        Set-Location ".."
        
        # Inicializar projeto Express no backend
        Log "Inicializando projeto Express no backend..."
        Set-Location "backend"
        npx express-generator --no-view --quiet
        
        Log "Instalando dependências no backend..."
        npm install

        Log "Adicionando Mocha e Chai para testes no backend..."
        npm install mocha chai --save-dev
        
        # Criar diretório para testes
        New-Item -ItemType Directory -Path "test" -Force | Out-Null
        
        # Criar arquivo de exemplo de teste com Mocha e Chai
        $testExampleContent = @"
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
"@
        Set-Content -Path "test/example.test.js" -Value $testExampleContent
        
        # Adicionar script de teste no package.json
        $packageJson = Get-Content -Path "package.json" -Raw
        $packageJson = $packageJson -replace '"scripts": {', '"scripts": {
    "test": "mocha",'
        Set-Content -Path "package.json" -Value $packageJson
        
        Set-Location ".."
        
        # Criar arquivos de configuração
        Log "Criando arquivos de configuração..."
        Set-Content -Path "README.md" -Value "# $nomeProjeto"
        
        # Criar .gitignore mais completo
        $gitignoreContent = @"
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
"@
        Set-Content -Path ".gitignore" -Value $gitignoreContent
        
        # Criar arquivo docker-compose.yml
        $dockerComposeContent = @"
version: '3'
services:
  mongodb:
    image: mongo:latest
    container_name: ${nomeProjeto}_mongodb
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
    container_name: ${nomeProjeto}_postgres
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: ${nomeProjeto}_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  mongodb_data:
  postgres_data:
"@
        Set-Content -Path "docker-compose.yml" -Value $dockerComposeContent
        
        # Adicionar arquivo de configuração do VS Code
        New-Item -ItemType Directory -Path ".vscode" -Force | Out-Null
        $vscodeSettingsContent = @"
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.rulers": [80, 120],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}
"@
        Set-Content -Path ".vscode/settings.json" -Value $vscodeSettingsContent
        
        $localAtual = Get-Location
        Log "Estrutura básica criada com sucesso em: $localAtual" "SUCESSO"
        Log "Para começar a desenvolver:" "INFO"
        Log "  1. cd $nomeProjeto" "INFO"
        Log "  2. cd frontend && npm start  # para o frontend" "INFO"
        Log "  3. cd backend && npm install && npm start  # para o backend" "INFO"
        
        # Voltar ao diretório original
        Set-Location ..
    }
}

function Main {
    $inicio = Get-Date
    
    Log "Iniciando configuração do ambiente de desenvolvimento para projeto React/Node.js..." "INÍCIO"
    Log "Sistema operacional: Windows"
    Log "Data: $(Get-Date)"
    Log "Modo interativo: $ModoInterativo"
    Log "Instalar interfaces gráficas: $InstalarGUI"
    Log "Instalar ferramentas extras: $InstalarExtras"
    
    VerificarAdministrador
    
    InstalarChocolatey
    
    InstalarFerramentasBasicas
    
    InstalarNodeJs
    
    EscolherBancoDados
    
    InstalarFerramentasDesenvWeb
    
    ConfigurarGit
    
    InstalarFerramentasExtras
    
    CriarEstruturaProjeto
    
    $fim = Get-Date
    $tempoTotal = ($fim - $inicio).TotalSeconds
    $minutos = [math]::Floor($tempoTotal / 60)
    $segundos = [math]::Floor($tempoTotal % 60)
    
    Log "Configuração do ambiente de desenvolvimento concluída com sucesso!" "SUCESSO"
    Log "Tempo total de execução: ${minutos}m ${segundos}s" "INFO"
    Log "Por favor, reinicie o PowerShell para aplicar todas as alterações." "INFO"
}

Main