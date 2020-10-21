const express = require("express");
const router = express.Router();
const passport = require("passport");
const { forwardAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
    res.send("Página principal do painel ADM");
});

router.get("/message", forwardAuthenticated, (req, res) =>
    res.render("message")
);

router.get("/posts", (req, res) => {
    res.send("Página");
});



module.exports = router;