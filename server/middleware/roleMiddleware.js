const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = function (role) {
    return function (req, res, next) {
        if(req.method === "OPTIONS") {
            next();
        }
    
        try{
            const token = req.headers.authorization.split(' ')[1];
            if(!token) return res.status(403).json({message: "Пользователь на авторизирован"});
    
            const {role: userRole} = jwt.verify(token, process.env.SECRET_KEY);
            let hasRole = false;
            if (role == userRole) hasRole = true;
            if(!hasRole) {
                return res.status(403).json({message: "Доступ ограничен"});
            }
            next();
        }catch(e){
            console.log(e);
            res.status(403).json({message: "Доступ ограничен"});
    }
}
}