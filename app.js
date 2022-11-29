const express = require('express')
const app = express()
const passport = require('passport');
const session = require('express-session');
const port = 3000

app.use(express.static(__dirname + '/public'))

app.listen(port, console.log("Conectado!"))

app.set('view engine', 'ejs');

require('./auth')(passport);
app.use(session({  
  secret: '123',//configure um segredo seu aqui,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }//30min
}))

app.use(passport.initialize());
app.use(passport.session());

function authenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login?fail=true');
}

const loginRouter = require('./routes/login')
const usersRouter = require('./routes/users')
const indexRouter = require('./routes/index')

app.use('/login', loginRouter);
app.use('/users', authenticationMiddleware, usersRouter);
app.use('/', authenticationMiddleware,  indexRouter);

module.exports = app;