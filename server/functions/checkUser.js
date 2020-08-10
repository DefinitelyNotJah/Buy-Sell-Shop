const userSchema = require('../models/user')
const tokenSchema = require('../models/token')

module.exports = (tokenValue) => {
	return new Promise( async (resolve, reject) => {
		if(!tokenValue)
			return reject(new Error('Token Value is invalid'))
		const tokenSearch = await tokenSchema.findOne({ value : tokenValue, valid : true })
		if(!tokenSearch)
			return reject(new Error('Token invalid'))
		const userSearch = await userSchema.findOne({ email : tokenSearch.email })
		if(!userSearch)
			return reject(new Error('Token invalid'))
		return resolve(userSearch)
	})
}