const { model, Schema } = require('mongoose')

const offers = Schema({
	title : {
		type : String,
		default : ''	
	},
	description : {
		type : String,
		default : ''
	},
	owner : {
		type : String,
		default : ''
	},
	address : {
		type : String,
		default : ''
	},
	phone : {
		type : Number,
		default : 0
	},
	fixed : {
		type : Boolean,
		default : true
	},
	price : {
		type : Number,
		default : 0
	},
	images : {
		type : Array,
		default : []
	},
	bought : {
		type : Boolean,
		default : false
	},
	cateId : {
		type : Number,
		default : 15
	},
	subCateId : {
		type : Number,
		default : 0
	},
	date : {
		type : Date,
		default : Date()
	}
})

module.exports = model('offers', offers)