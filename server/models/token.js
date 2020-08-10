const { model, Schema } = require('mongoose')
const generateString = require('../functions/generateString')

const tokens = Schema({
	id : {
		type : String,
		default : generateString(32)
	},
	value : {
		type : String,
		default : ''	
	},
	valid : {
		type : Boolean,
		default : true
	},
	email : {
		type : String,
		default : ''
	},
	date : {
		type : Date,
		default : Date()
	}
})

module.exports = model('tokens', tokens)