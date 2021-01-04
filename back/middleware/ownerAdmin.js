module.exports = function (req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send("ownderAdmin_m: Access denied."); //403 if forbidden
    next();
  };
  