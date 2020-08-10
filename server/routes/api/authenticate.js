const checkUser = require('../../functions/checkUser')

const yup = require('yup');

const schema = yup.object().shape({
	Token: yup.string().length(64).required()
});

module.exports = app => {
	app.get('/authenticate', async (req, res, next) => {
		const Token = req.headers['authentication']
		try {
			await schema.validate({
				Token
			})
			await checkUser(Token)
		 	return res.send({
		 		success : true,
		 		message : 'Authentication is valid'
		 	})
		} catch (err)
		{
			return next(new Error('Authentication has failed'))
		}
	})
}