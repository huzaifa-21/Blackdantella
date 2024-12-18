const checkRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole !== role) {
      console.log(userRole)
      return res.status(403).send({ success: false, message: "Forbidden" });
    }
    next();
  };
};

export default checkRole;
