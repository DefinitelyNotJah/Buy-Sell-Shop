const { model, Schema } = require('mongoose')
const bcrypt = require('bcrypt')

const users = Schema({
	email : {
		type : String,
		default : ''
	},
	username : {
		type : String,
		default : ''
	},
	password : {
		type : String,
		default : ''
	},
	admin : {
		type : Boolean,
		default : false
	},
	date : {
		type : Date,
		default : Date()
	}
})

users.methods.generateHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

users.methods.validPassword = (password, password2) => {
	return bcrypt.compareSync(password, password2);
};

module.exports = model('users', users)