const express = require("express");
const router = express.Router();
const passport = require("passport");
const { forwardAuthenticated } = require("../config/auth");
const test = require("../models/test");

router.get("/", (req, res) => {
    res.send("Página principal do painel ADM");
});

router.get("/message", forwardAuthenticated, (req, res) =>
    res.render("message")
);

router.get("/posts", (req, res) => {
    res.send("Página");
});

// Send
router.post("/send", (req, res) => {
    const { name, user_id, chat_id, message } = req.body;
    let errors = [];

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            user_id,
            chat_id,
            message,
        });
    } else {
        const newMessage = new test({
            name,
            user_id,
            chat_id,
            message,
        });
        newMessage.save().catch((err) => console.log(err));
    }
});
module.exports = router;