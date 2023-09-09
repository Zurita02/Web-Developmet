const express = require('express');
const mysql = require('mysql');
const port = 8080;
const ipAddr = '44.205.168.19';


const app = express();
app.use(express.static(__dirname + '/backend'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db = mysql.createConnection({
  host: 'localhost',
  database: 'basedatos',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});

db.connect(err => {
  if (err) {
    console.error('Unable to connect to the database.');
    throw err;
  } else {
    console.log('Connected to the database.');
  }
});

db.query('SET time_zone = "-06:00";', (err) => {
  if(err){
    console.error('Zona no establecida');
  } else {
    console.log('Zona establecida');
  }
});

app.post('/login', (req,res) => {
  console.log(req.body);
  console.log(req.body.JSONlogin);
  const datos = JSON.parse(req.body.JSONlogin);
  //let {usuario, cont} = req.body.JSONlogin;

  let usuario = datos.usuario;
  let cont = datos.cont;
  console.log('usuario', usuario);
  console.log('cont', cont);
  //console.log(req.body.login);
  db.query('Select usuario, cont FROM Jugador WHERE usuario = ? AND cont= ?',
    [usuario, cont],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        console.log('result', result);
        if (result.length === 0) {
          //res.type('text').status(404).send('Not found');
          res.json({codigo: 'Error', mensaje: 'El usuario o contraseña no son correctos'});
        } else {
          //res.type('text').status(200).send('Informacion correcta');
          res.json({codigo: 'Correcto', mensaje: 'Bienvenido al juego'});
        }
      }
    });
});

app.post('/fechaInicio/:usuario', (req, res) => {
  let usuario = req.params.usuario;
  console.log(usuario);
  db.query('INSERT INTO Partida (idJugador, nivel, puntuacion, estado, horaInicio, horaFinal) VALUES ((Select idJugador From Jugador where usuario = ?), 0, 0, "En progreso", now(), now())',
  [usuario],
  (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({idPartida: result.insertId});
    }
  });
});

app.put('/nivel/:nivel/:idPartida', (req, res) => {
  let nivel = req.params.nivel;
  console.log(nivel);
  let idPartida = req.params.idPartida;
  console.log(idPartida);
  db.query('UPDATE Partida SET nivel=? WHERE idPartida = ? ',
  [nivel, idPartida],
  (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result.affectedRows === 1) {
        res.type('text').send(
          `Resource with idPartida = ${idPartida} updated.\n`);
      } else {
        res.type('text').status(400).send(
          `Unable to update resource with idPartida = ${idPartida}.\n`);
      }
    }
  });
});

app.put('/niveldos/:nivel/:idPartida', (req, res) => {
  let nivel = req.params.nivel;
  console.log(nivel);
  let idPartida = req.params.idPartida;
  console.log(idPartida);
  db.query('UPDATE Partida SET nivel=? WHERE idPartida = ? ',
  [nivel, idPartida],
  (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result.affectedRows === 1) {
        res.type('text').send(
          `Resource with idPartida = ${idPartida} updated.\n`);
      } else {
        res.type('text').status(400).send(
          `Unable to update resource with idPartida = ${idPartida}.\n`);
      }
    }
  });
});

app.put('/puntuacion/:puntuacion/:idPartida', (req, res) => {
  let puntuacion = req.params.puntuacion;
  console.log(puntuacion);
  let idPartida = req.params.idPartida;
  console.log(idPartida);
  db.query('UPDATE Partida SET puntuacion =? WHERE idPartida = ? ',
  [puntuacion, idPartida],
  (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result.affectedRows === 1) {
        res.json({codigo: 'Correcto', mensaje: 'Listo'});
      } else {
        res.json({codigo: 'Error', mensaje: 'No termino'});
      }
    }
  });
});

app.put('/estado/:estado/:idPartida', (req, res) => {
  let estado = req.params.estado;
  console.log(estado);
  let idPartida = req.params.idPartida;
  console.log(idPartida);
  db.query('UPDATE Partida SET estado = ? WHERE idPartida = ? ',
  [estado, idPartida],
  (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result.affectedRows === 1) {
        res.json({codigo: 'Correcto', mensaje: 'Listo'});
      } else {
        res.json({codigo: 'Error', mensaje: 'No termino'});
      }
    }
  });
});

app.put('/horaFinal/:idPartida', (req, res) => {
  let idPartida = req.params.idPartida;
  console.log(idPartida);
  db.query('UPDATE Partida SET horaFinal = NOW() WHERE idPartida = ? ',
  [idPartida],
  (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (result.affectedRows === 1) {
        res.type('text').send(
          `horaFinal con idPartida = ${idPartida} updated.\n`);
      } else {
        res.type('text').status(400).send(
          `No se puedo cambiar la horaFinal con idPartida = ${idPartida}.\n`);
      }
    }
  });
});

// custom 404 page
app.use((req, res) => {
  res.type('text/plain').status(404).send('404 - Not Found');
});

app.listen(port, () => console.log(
  `Express started on http://${ipAddr}:${port}`
  + '\nPress Ctrl-C to terminate.'));