const {Router} = require("express");
const router = new Router();
const controller = require("./authController");
const {check} = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware");

router.get("/users", roleMiddleware("ADMIN"), controller.getUsers);

router.post("/login",
[
    check("nickName", "неверное имя пользователя").notEmpty().escape().blacklist(" ").blacklist("/t"),
    check("password", "неверный пароль").notEmpty().isLength({min: 6}).isStrongPassword().escape().blacklist(" ").blacklist("/t")
    
],
controller.login);

router.post("/register",
[
    check("nickName", "Имя пользователя не соотвествует").notEmpty().escape().blacklist(" ").blacklist("/t"),
    check("password", "Пароль слабый или короче 6 символов").notEmpty().isLength({min: 6}).isStrongPassword().escape().blacklist(" ").blacklist("/t")
    
],
 controller.register);

module.exports = router;