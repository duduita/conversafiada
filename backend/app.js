const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const socket = require("socket.io");
const http = require("http");

const fs = require("fs");
const app = express();
const server = http.createServer(app);
server.listen(5000);
const io = socket.listen(server);

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

io.on("connection", function(socket) {
    socket.join("home room");

    socket.on("enviar mensagem", function(mensagem, callback) {
        var sala = io.sockets.adapter.sids[socket.id];
        socket.broadcast.emit("atualizar mensagens", mensagem);
        callback();
        console.log("message '${mensagem}' emmited on: ${sala}");
    });

    socket.on("entrar sala", function(sala){
        var rooms = io.sockets.adapter.sids[socket.id];
        for (var room in rooms){
            socket.leave(room);
        }
        socket.join(sala);
        console.log('changed to room: ${sala}');
    });
});

/* const Chat = require("./models/Chat");
const UC = require("./models/User_chat");
var chats = []
var users = ['5f909449687b1e9571b1fde8']
const qry = Chat.find({})
qry.select('_id')
qry.exec(function(err, a){
    a.forEach(function(r){
        chats.push(r['_id'])
    })
    for(var i=0; i<chats.length; i++){
        for (var j=0; j<users.length; j++){
            console.log(chats[i] + ':' + users[j])
            const newUC = new UC({
                user_id: new mongoose.Types.ObjectId(users[j]),
                chat_id: new mongoose.Types.ObjectId(chats[i])
            });
            newUC.save().catch((error) => console.log(error))
        }
    }
})
console.log('ok') */