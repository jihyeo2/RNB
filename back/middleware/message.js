module.exports = function (req, res, next) {
    if (req.body.recipient == "admin") {
        req.recipientId = "admin";
        req.body = req.body.message;
    } else {
        req.recipientId = req.body.recipient;
        req.body = req.body.message;
    }
    next();
  };
  