const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Message = require("../models/Message");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    Message.find({ user_id: req.user._id }).then((message) => {
        console.log(message);
        res.render("dashboard", {
            user: req.user,
            message: message,
        });
    });
});

module.exports = router;