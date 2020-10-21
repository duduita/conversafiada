const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User_chat = require("../models/User_chat");
const test = require("../models/test");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    Message.find({ user_id: req.user._id }).then((message) => {
        //console.log(message);

        Chat.find({}).then((chat) => {
            //console.log(chat);

            User_chat.find({ user_id: req.user._id }).then((user_chat) => {
                //console.log(user_chat);

                res.render("dashboard", {
                    user: req.user,
                    message: message,
                    chat: chat,
                    User_chat: user_chat,
                });
            });
        });
    });
});

module.exports = router;