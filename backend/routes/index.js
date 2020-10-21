const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User_chat = require("../models/User_chat");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    console.log(req.user)

    Message.find({ user_id: req.user._id }).then((message) => {
        //console.log(message);

        User_chat.find({ user_id: req.user._id }).then((user_chats) => {
            
            var chats_id = []
            user_chats.forEach((user_chat) => {
                chats_id.push(user_chat['chat_id'])
            })
            
            Chat.find({ _id: {$in: chats_id}}).then((chat) => {

                res.render("dashboard", {
                    user: req.user,
                    message: message,
                    chat: chat
                });

            })

        })

        Chat.find({}).then((chat) => {
            //console.log(chat);

            /* User_chat.find({ user_id: req.user._id }).then((user_chat) => {
                //console.log(user_chat);

                res.render("dashboard", {
                    user: req.user,
                    message: message,
                    chat: chat,
                    User_chat: user_chat,
                });
            }); */
        });
    });
});

module.exports = router;