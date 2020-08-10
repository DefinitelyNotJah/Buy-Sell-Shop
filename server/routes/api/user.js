const checkUser = require('../../functions/checkUser')
const offerSchema = require('../../models/offer')

const Settings = require('../../config.json')

const yup = require('yup');

const schema = yup.object().shape({
	Token: yup.string().length(64).required()
});

module.exports = app => {
	app.get('/user', async (req, res, next) => {
		const Token = req.headers['authentication']
		try {
			await schema.validate({
				Token
			})
			const userInfo = await checkUser(Token)
			const offers = await offerSchema.find( { owner : userInfo.email })
			let newOffers = []
			offers.forEach( (e) => {
				newOffers.push({
					id : e._id,
					title : e.title,
					price : e.price,
					images : e.images.map( (el) => Settings.backendURL+el),
					bought : e.bought,
					slug : e.title.replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-]/g, '')
				})
			})
		 	return res.send({
		 		success : true,
		 		message : {
		 			user : {
		 				id : userInfo._id,
		 				pfp : 'https://source.unsplash.com/random',
		 				name : userInfo.username,
		 				date : userInfo.date
		 			},
		 			offers : newOffers
		 		}
		 	})
		} catch (err)
		{
			return next(err)
		}
	})
}