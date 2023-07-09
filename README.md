# Projeto com socket.io dividido entre cliente e servidor (dois projetos separados)

## Pre-requisitos no Windows, Mac ou Linux
* Node.js
* Git

## Quickstart

### Obter o projeto com o git
```bash
git clone git@github.com:isaacfranco/socket_io_client_server.git
```

Será criada a pasta **socket_io_client_server** com as pastas **server** e **client** dentro dela.

## Inicializar o servidor
```bash
cd server
npm install
npm start
```

Isso fará o servidor Socket.IO iniciar na porta 3000

## Inicializar o cliente
```bash
cd client
npm install
npm start
```

Isso fará iniciar o serviço do nosso cliente Socket.IO na porta 3010. Esse serviço pode ser acessado pelo navegador na URL:

http://localhost:3010/game.html