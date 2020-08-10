const offerSchema = require('../../models/offer')
const checkUser = require('../../functions/checkUser')

const yup = require('yup');

const schema = yup.object().shape({
	Token: yup.string().length(64).required(),
	title: yup.string().min(8).max(32).required(),
	description: yup.string().min(8).max(2048),
	price: yup.number().min(1).max(9999999999).required(),
	address: yup.string().max(124),
	fixed: yup.boolean(),
	category: yup.number().min(1).max(15).required(),
	subCategory: yup.number()
});

module.exports = app => {
	app.post('/offer', async (req, res, next) => {
		const Token = req.headers['authentication']
		let {
			title,
			description,
			price,
			address,
			fixed,
			category,
			subCategory
		} = req.body;
		try {
			await schema.validate({
				Token,
				title,
				description,
				price,
				address,
				fixed,
				category,
				subCategory
			})
			const userInfo = await checkUser(Token)

			const newOffer = new offerSchema()
			newOffer.title = title
			newOffer.description = description
			newOffer.price = price
			newOffer.owner = userInfo.email
			newOffer.address = address
			newOffer.cateId = category
			newOffer.subCateId = subCategory
			await newOffer.save()

		 	return res.send({
		 		success : true,
		 		message : newOffer._id
		 	})
		} catch (err)
		{
			return next(err)
		}
	})
}