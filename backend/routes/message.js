const express = require("express");
const router = express.Router();
const passport = require("passport");
const { forwardAuthenticated } = require("../config/auth");

router.post("/send", (req, res) => {
    console.log('post recebido:')
    console.log(req.user)
    console.log('fim')
});

module.exports = router;