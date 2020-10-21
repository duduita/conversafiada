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

module.exports = router;