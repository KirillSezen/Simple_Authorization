const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
require('dotenv').config();
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    };
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "1h"});
}

class authController{
    async getUsers(req, res){
        try{
            const users = await User.find();
            return res.json({message: "Пользователи", users});
        } catch(e){
            console.log(e);
            res.status(400).json({message: "Server error users"});
        }
    }

    async login(req, res){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()) return res.status(400).json({message: "Ошибки валидации", errors});

            const {nickName, password} = req.body;
            
            const user = await User.findOne({nickName});
            if (!user) return res.status(404).json({message: "Данный пользователь отсутствует"});

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) return res.status(400).json({message: "Неверный пароль"});

            const token = generateAccessToken(user._id, user.role);
            return res.json({token});
        } catch(e){
            console.log(e);
            res.status(400).json({message: "Server error log"}); 
        }
    }

    async register(req, res){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()) return res.status(400).json({message: "Ошибки валидации", errors});

            const {nickName, password} = req.body;

            const candidate = await User.findOne({nickName})
            if(candidate) return res.status(400).json({message: "Данный пользователь уже зарегистрирован"});

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            const user = new User({nickName, password: hashPassword, role: userRole.value});

            await user.save();

            return res.status(200).json({message: "Пользователь успешно зарегистрирован"});
        } catch(e){
            console.log(e);
            res.status(400).json({message: "Server error reg"});
        }
    }
}

module.exports = new authController();