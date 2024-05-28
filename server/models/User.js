const {Schema, model} = require("mongoose");


const User = new Schema({
    nickName: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    role: {type: String, ref: "Role"}
});

module.exports = model("User", User);