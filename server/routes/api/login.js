const userSchema = require('../../models/user')
const tokenSchema = require('../../models/token')

const trimLower = require('../../functions/trimLower')
const generateString = require('../../functions/generateString')

const yup = require('yup')

const schema = yup.object().shape({
	email : yup.string().min(4).max(64).email().required(),
	password: yup.string().min(8).max(32).required()
})

module.exports = (app) => {
	app.post('/login', async (req, res, next) => {
		let {
			email,
			password
		} = req.body;
		try {
			await schema.validate({
				email,
				password
			})
			email = trimLower(email)
			const userSearch = await userSchema.findOne({ email : email })
			if(!userSearch)
				return next(new Error('User does not exist'))
			if(!userSearch.validPassword(password, userSearch.password))
				return next(new Error('Password does not match'))
			const newToken = new tokenSchema()
			newToken.value = generateString(64)
			newToken.email = email
			const tokenRes = await newToken.save()
			return res.send({
				success : true,
				message : tokenRes.value
			})
		} catch (err) {
			return next(err)
		}
	})
}