const offerSchema = require('../../models/offer')
const checkUser = require('../../functions/checkUser')

const yup = require('yup');

const schema = yup.object().shape({
	id: yup.string().length(24).required(),
	Token: yup.string().length(64).required()
});

module.exports = (app) => {
	app.post('/remove/:id', async (req, res, next) => {
		const {
			id: id
		} = req.params;
		const Token = req.headers['authentication']
		try {
			await schema.validate({
				id,
				Token
			})
			const userInfo = await checkUser(Token)
			const markBought = await offerSchema.findOne({
				_id: id,
				owner: userInfo.email
			})
			if(!markBought)
				return next(new Error('You do not own this offer'))
			markBought.bought = true
			await markBought.save()
			return res.send({
				success : true,
				message : 'Operation successful'
			})
		} catch (err) {
			next(err)
		}
	})
}