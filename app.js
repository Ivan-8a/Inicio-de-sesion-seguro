const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  // Configuración de conexión
});

//1.-Invoco express
const express = require('express');
const app = express();

//2.-seteo urlencoded para capturar datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3.-invoco dotenv
const dotenv = require('dotenv')

dotenv.config({path:'./env/.env'})

//4.-directorio public
app.use('/resources', express.static('public'))
app.use('/resources', express.static(__dirname + '/public'))

//5.-Establecer motor de plantillas
app.set('view engine', 'ejs')

//6.-Invoco bcryptjs
const bcryptjs = require('bcryptjs')

//7.-Var. de session
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}))

//8.-Invoco al modulo de conexion de la bd
const connection = require('./database/db')

//9.-Estableciendo las rutas
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})
 
app.get('/register', (req, res) => {
    res.render('register')
})

//10.- Registro
app.post('/register', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, pass: passwordHaash}, async(error, results) => {
      if(error){
        console.log(error);
      }else{
        res.send('Registro existoso')
      }
    })
  });

//11.-Login
app.post('/auth', async(req,res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8)
    if(user && pass){
      connection.query('SELECT * FROM users WHERE user = ?', [user], async(error, results)=>{
        if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
          res.send('Usuario y/o password incorrectas');
        }else{
          res.send('Login correcto');
        }
      })
    }

})

app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})

