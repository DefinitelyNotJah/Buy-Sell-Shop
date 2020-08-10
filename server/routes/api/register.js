const userSchema = require('../../models/user')

const trimLower = require('../../functions/trimLower')

const yup = require('yup')

const schema = yup.object().shape({
	email : yup.string().min(4).max(64).email().required(),
	username: yup.string().min(4).max(16).required(),
	password: yup.string().min(8).max(32).required(),
	confirmPassword: yup.string().min(8).max(32).required()
})
module.exports = (app) => {
	app.post('/register', async (req, res, next) => {
		let {
			email,
			username,
			password,
			confirmPassword
		} = req.body
		try {
			await schema.validate({
				email,
				username,
				password,
				confirmPassword
			})

			if(confirmPassword !== password)
				return next(new Error('Password does not match'))

			email = trimLower(email)
			username = trimLower(username)

			const isEmail = await userSchema.findOne({ email : email })
			if(isEmail)
				return next(new Error('Email already exists, please pick a new one'))
			
			const userAccount = new userSchema()
			userAccount.email = email;
			userAccount.username = username;
			userAccount.password = userAccount.generateHash(password);

			await userAccount.save()
			return res.send({
				success : true,
				message : 'User has been created successfuly'
			})
		} catch (err) {
			return next(err)
		}
	})
}