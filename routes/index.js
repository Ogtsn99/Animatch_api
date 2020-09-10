const express = require('express');
const router = express.Router();
/*
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated:/"
    });
  } else {
    res.json({message: "いけてるぽ"})
  }
};*/

router.get("/", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated:/"
    });
  } else {
    res.json({message: "いけてるぽ"})
  }
})

module.exports = router;
