const userSchema = require('../../models/user')
const offerSchema = require('../../models/offer')

const Settings = require('../../config.json')

const yup = require('yup');

const schema = yup.object().shape({
	id: yup.string().length(24).required()
});

module.exports = app => {
	app.get('/user/:id', async (req, res, next) => {
		const {
			id: id
		} = req.params
		try {
			await schema.validate({
				id
			})
			const userInfo = await userSchema.findOne( { _id : id })
			if(!userInfo)
				return next(new Error('User does not exist'))
			const offers = await offerSchema.find( { owner : userInfo.email })
			let newOffers = []
			offers.forEach( (e) => {
				newOffers.push({
					id : e._id,
					title : e.title,
					price : e.price,
					images : e.images.map( (el) => Settings.backendURL+el),
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