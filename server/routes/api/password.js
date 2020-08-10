const checkUser = require('../../functions/checkUser')

const yup = require('yup');

const schema = yup.object().shape({
	oldPassword: yup.string().min(8).max(32).required(),
	newPassword: yup.string().min(8).max(32).required()
});

module.exports = (app) => {
	app.post('/password', async (req, res, next) => {
		const {
			oldPassword,
			newPassword
		} = req.body;
		const Token = req.headers['authentication']
		try {
			await schema.validate({
				oldPassword,
				newPassword
			})
			const userInfo = await checkUser(Token)
			if(!userInfo.validPassword(oldPassword, userInfo.password))
				return next(new Error('Password does not match'))
			userInfo.password = userInfo.generateHash(newPassword);
			await userInfo.save()
			return res.send({
				success : true,
				message : 'Password has been changed successfuly'
			})
		} catch (err) {
			next(err)
		}
	})
}