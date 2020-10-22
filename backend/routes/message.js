const express = require("express");
const router = express.Router();
const passport = require("passport");
const { forwardAuthenticated } = require("../config/auth");
const Message = require("../models/Message");

router.post("/send", (req, res) => {
    const newMsg = new Message({
        user_id: req.user._id,
        chat_id: req.body.chat_id,
        message: req.body.message
    });
    newMsg.save()
});

router.get("/get", (req, res) => {
    var chat_id = req.url.substring(req.url.indexOf('=') + 1)
    Message.find({ chat_id: chat_id }).sort({date: "asc"}).then((messages) => {
        var html = ''
        for (var i=0; i<messages.length; i++){
            if (req.user._id.toString() == messages[i].user_id.toString()){
                html += '<div class="message-row you-message"><div class="message-content"><div class="message-text">' + messages[i].message + '</div><div class="message-time">' + messages[i].date.toLocaleString() + '</div></div></div>'
            }else{
                html += '<div class="message-row other-message"><div class="message-content"><span>pegarnome</span><img src="./images/rodrigo.jpg"/><div class="message-text">' + messages[i].message + '</div><div class="message-time">' + messages[i].date.toLocaleString() + '</div></div></div>'
            }
        }
        res.end(html)

    })
})

module.exports = router;