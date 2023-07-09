var express = require ('express')
var http = require('http')
var Server = require('socket.io').Server
var cors = require('cors');

const fs = require('fs');

var Game = require('./game');

//const { randomUUID } = require('crypto');

var app = express();

app.use(cors());

app.get('/', (request, response) => {
  response.send('RAIZ do servidor web')
});

var httpServer = http.createServer(app);
var io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

let players = [];
let rooms = [];
let games = [];

function findBySocketId(socketId) {
  return players.find((e) =>  e.socketId === socketId);
}

function addPlayer(user, socketId) {
  const existingPlayer = players.filter((e) => e.nome === user.nome);
  if (existingPlayer.length > 0) {
    // já existe usuário logado
    io.to(socketId).emit('erro', 'Esse jogador já está logado');
  } else {
    try {
      let data = fs.readFileSync('./src/users.txt', 'utf8').split('\n');
      data.pop();

      let users = [];
      if(data.length > 0) for (d = 0; d < data.length; d++) users.push(JSON.parse(data[d]));

      if (users.length > 0) {
        const existingUser = users.filter((e) => e.nome === user.nome);

        if (existingUser.length > 0 && existingUser[0].senha != user.senha) {
          io.to(socketId).emit('erro', 'Senha incorreta');
        } else if (existingUser.length > 0 && existingUser[0].senha === user.senha) {
          const player = {
            nome: user.nome,
            socketId: socketId
          }
          players.push(player);
          console.log(user.nome + ' logou com sucesso');
        } else {
          fs.appendFileSync('./src/users.txt', JSON.stringify(user) + '\n');
          const player = {
            nome: user.nome,
            socketId: socketId
          }
          players.push(player);
          console.log('Conta ' + user.nome + ' criada com sucesso');
        }
      } else {
        fs.appendFileSync('./src/users.txt', JSON.stringify(user) + '\n');
        const player = {
          nome: user.nome,
          socketId: socketId
        }
        players.push(player);
        console.log('Conta ' + user.nome + ' criada com sucesso');
      }
    } catch (err) {
      console.error(err);
    }

    io.emit('players', players);
    io.emit('salas', rooms);
  }
}

io.on('connection', (clientSocket) => {
  console.log('usuario conectado')

  setTimeout(() => {
    clientSocket.emit('mensagem', 'conectado');
  }, 2000)

  clientSocket.emit('players', players);
  
  //setInterval(() => {}, 1000)


  clientSocket.on('entrar', (user) => {
    addPlayer(user, clientSocket.id);
    console.log("Novo login: " + user.nome);
    
    // mandar players para todos
    // io.emit('players', players);
  });

  clientSocket.on('enviarMensagemPara', (dados) => {
    //console.log(dados)
    const remetente = findBySocketId(clientSocket.id);
    if (remetente != null && dados.socketId != 'global') {
      // Mensagem privada
      const msg = `${remetente.nome}: ${dados.texto}`;
      io.to(dados.socketId).emit('mensagem', msg);
    } else if (remetente != null && dados.socketId === 'global') {
      // Mensagem global
      const msg = `[Global] ${remetente.nome}: ${dados.texto}`;
      io.emit('mensagem', msg);
    } else io.to(clientSocket.id).emit('erro', "Apenas usuários logados podem enviar mensagens.");
  })

  clientSocket.on('criarlobby', (lname) => {
    let lobby = {
      nome: lname,
      p1: findBySocketId(clientSocket.id).nome,
      colorp1: '',
      p2: '',
      colorp2: ''
    }
    rooms.push(lobby);

    clientSocket.join(lname);
    io.in(lname).emit('entrarSala', lobby);
    io.emit('salas', rooms);
  })

  clientSocket.on('atualizarSala', (data) => {
    const lobby = rooms.find((e) => e.nome === data.nome);
    
    lobby.nome = data.nome;
    lobby.colorp1 = data.colorp1;
    lobby.p2 = data.p2;
    lobby.colorp2 = data.colorp2;
    if (!clientSocket.rooms.has(lobby.nome)) clientSocket.join(lobby.nome); 
    io.in(lobby.nome).emit('atualizar', lobby);
  })

  clientSocket.on('startgame', (lname) => {
    const lobby = rooms.find((e) => e.nome === lname);

    let game = {
      nome: lobby.nome,
      p1: {
        name: lobby.p1,
        health: 3,
        posX: 100,
        posY: 0,
        shotCD: 0,
        facing: "down"
      },
      p2: {
        name: lobby.p2,
        health: 3,
        posX: 650,
        posY: 550,
        shotCD: 0,
        facing: "up"
      },
      objects: []
    };

    games.push(game);
    io.in(lname).emit('start', game);
  })

  clientSocket.on('updategame', (data) => {
    const game = games.find((e) => e.nome === data.nome);
    const sala = rooms.find((e) => e.nome === data.nome);

    if (sala.p1 === data.player) game.p1 = data.stats;
    if (sala.p2 === data.player) game.p2 = data.stats;
    game.objects = data.objects;

    const p1ref = players.find((e) => e.nome === sala.p1);
    const p2ref = players.find((e) => e.nome === sala.p2);

    io.to(data.nome).emit('update', game);
  })

  clientSocket.on('disconnect', () => {
    const player = players.find((e) => e.socketId === clientSocket.id);
    if (player != null) {
      console.log(player.nome + " desconectado");
      players.splice(players.indexOf(player), 1);
    }
    io.emit('players', players);
  })
}
)

// ficar mandando a lista de player para todo mundo a cada 1 segundo
setInterval(() => {
  
}, 1000)



httpServer.listen(3000, () => {
  console.log('servidor iniciou na porta 3000')
}
)

