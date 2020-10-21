const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
var socket = require("socket.io");

var fs = require("fs");
const app = express();

// Passport Config
require("./config/passport")(passport);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));
app.use("/message", require("./routes/message.js"));
app.use(express.static("public"));

app.get("/socket", function(req, res) {
    res.sendFile(__dirname + "/socket.io/socket.io.js");
});

const PORT = process.env.PORT || 5000;

//app.listen(PORT, console.log(`Server started on port ${PORT}`));

var http = require("http");

var server = http.createServer(app);
server.listen(5000);
var io = socket.listen(server);

io.on("connection", function(socket) {
    socket.on("enviar mensagem", function(mensagem, callback) {
        // var mensagem = dados.msg;
        // var usuario = dados.usr;
        var session = socket.handshake.session;

        // mensagem = "[ " + pegarDataAtual() + " ] " + socket.apelido + ": " + mensagem;
        console.log(mensagem);
        console.log(session.name);
        // var msgObj = {msg: mensagem, tipo: ''};

        // if (usuario == null || usuario == ''){
        //     io.sockets.emit("atualizar mensagens", msgObj);
        //     armazenarMensagem(msgObj);
        // } else {
        //     msgObj.tipo = 'privado';
        //     socket.emit("atualizar mensagens", msgObj);
        //     usuarios[usuario].emit("atualizar mensagens", msgObj);
        // }
        socket.broadcast.emit("atualizar mensagens", mensagem);
        callback();
    });
});