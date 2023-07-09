let nome;

const nomeInput = document.getElementById('nomeInput');
const senhaInput = document.getElementById('senhaInput');
const serverSocket = io('ws://localhost:3000');

function entrar(event) {
  nome = nomeInput.value;
  let user = {
    nome: nome,
    senha: senhaInput.value
  }
  serverSocket.emit('entrar', user);

}

function getReady() {
  let colorp1 = document.getElementById('colorp1');
  let colorp2 = document.getElementById('colorp2');
  let startBtn = document.getElementById('startbtn');

  if (colorp1.value != '#000000' && colorp2.value != '#000000') startBtn.removeAttribute('disabled');
  else startBtn.disabled = 'true';

  let lobby = {
    nome: document.getElementById('rname').innerText,
     p1: document.getElementById('namep1').innerText,
     colorp1: (colorp1.value != "#000000") ? colorp1.value : "#000000",
     p2: (document.getElementById('namep2').innerText === 'Aguardando...') ? '' : document.getElementById('namep2').innerText,
     colorp2: (colorp2.value != "#000000") ? colorp2.value : "#000000"
  }

  serverSocket.emit('atualizarSala', lobby);
}

function startGame() {
  let lobbyname = document.getElementById('rname').innerText;
  serverSocket.emit('startgame', lobbyname);
}

function criarSala(event) {
  let lobbyname = document.getElementById('createlobby').value;

  serverSocket.emit('criarlobby', lobbyname);
}

function entrarSala(lname) {
  let lobby = {
    nome: lname,
    p1: '',
    colorp1: '',
    p2: nome,
    colorp2: ''
  }
  
  serverSocket.emit('atualizarSala', lobby);
}

function enviarMensagemPara(event) {
  const msgParaSocketId = document.getElementById('msgParaSocketId')
  const msgParaTexto = document.getElementById('msgParaTexto')

  const dados = {
    socketId: msgParaSocketId.value,
    texto: msgParaTexto.value
  }

  serverSocket.emit('enviarMensagemPara', dados)
  
}

function enviarMensagemGlobal(event) {
  const msgParaTexto = document.getElementById('msgParaTexto');

  const dados = {
    socketId: "global",
    texto: msgParaTexto.value
  };

  serverSocket.emit('enviarMensagemPara', dados);
}

serverSocket.on('mensagem', (msg) => {
  const mensagens = document.getElementById('mensagens')
  mensagens.innerHTML += `<p>${msg}</p>`
  console.log(msg)
})

serverSocket.on('players', (players) => {
  console.log('players', players)
  const playersDiv = document.getElementById('mundica');
  playersDiv.innerHTML = '';
  players.forEach(player => {
    playersDiv.innerHTML += `<p>${player.nome} - ${player.socketId}</p>`
  });

  const existingPlayer = players.filter((e) => e.nome === nome);
  if (existingPlayer.length > 0) {
    let login = document.getElementById('loginform');
    login.style.display = 'none';

    let conectado = document.getElementById('conectado');
    conectado.innerHTML = '<p>Conectado como ' + nome + '</p>';

    let lobbies = document.getElementById('lobbies');
    lobbies.style.display = 'inline';
  }
}
)

serverSocket.on('salas', (lobbies) => {
  const lobbiesDiv = document.getElementById('lobbylist');
  lobbiesDiv.innerHTML = '';
  lobbies.forEach(lobby => {
    lobbiesDiv.innerHTML += `<p>${lobby.nome} `;
    if (lobby.p2 === '') lobbiesDiv.innerHTML += `(1/2) <button onclick="entrarSala('${lobby.nome}')">Entrar</button>`;
    else lobbiesDiv.innerHTML += '(2/2)';
  });
})

serverSocket.on('entrarSala', (lobby) => {
  const room = document.getElementById('room');
  room.style.display = 'inline';

  let rname = document.getElementById('rname');
  rname.innerText = lobby.nome;
  
  let namep1 = document.getElementById('namep1');
  namep1.innerText = lobby.p1;
  let namep2 = document.getElementById('namep2');
  namep2.innerText = (lobby.p2 === '') ? 'Aguardando...' : lobby.p2;

  let exitBtn = document.createElement('button');
  let colorp1 = document.getElementById('colorp1');
  let colorp2 = document.getElementById('colorp2');
  exitBtn.onclick(sairSala(lobby));
  if (nome === lobby.p1) {
    colorp1.after(exitBtn);
    colorp2.style.disabled = 'true';
  } else if (nome === lobby.p2) {
    colorp2.after(exitBtn);
    colorp1.style.disabled = 'true';

    let data = {
      nome: rname.innerText,
      p1: namep1.innerText,
      colorp1: colorp1.value,
      p2: namep2.innerText,
      colorp2: colorp2.value
    }
    serverSocket.emit('atualizarSala', data);
  }
})

serverSocket.on('atualizar', (lobby) => {
  document.getElementById('room').style.display = 'inline';
  document.getElementById('rname').innerText = lobby.nome;
  let namep1 = document.getElementById('namep1');
  let namep2 = document.getElementById('namep2');
  namep1.innerText = lobby.p1;
  namep2.innerText = (lobby.p2 === '') ? 'Aguardando...' : lobby.p2;

  let colorp1 = document.getElementById('colorp1');
  let colorp2 = document.getElementById('colorp2');
  colorp1.value = (lobby.colorp1 != '') ? lobby.colorp1 : '#000000';
  colorp2.value = (lobby.colorp2 != '') ? lobby.colorp2 : '#000000';
})

serverSocket.on('start', (game) => {
  gameStart = true;
  p1 = game.p1;
  p2 = game.p2;
})

serverSocket.on('update', (game) => {
  p1 = game.p1;
  p2 = game.p2;
  objects = game.objects;
})

serverSocket.on('erro', (erroMensagem) => {
 alert(erroMensagem);

}
)


    
