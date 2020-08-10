const offerSchema = require('../../models/offer')

const Settings = require('../../config.json')

const yup = require('yup');

const schema = yup.object().shape({
	cateId: yup.number().min(1).max(15),
	subCateId: yup.number()
});

module.exports = app => {
	app.get('/offer', async (req, res, next) => {
		const {
			cateId,
			subCateId
		} = req.query
		try {
			await schema.validate({
				cateId,
				subCateId
			})
			let forms
			if(subCateId)
				forms = await offerSchema.find({ subCateId : subCateId, bought : false })
			else if(cateId)
				forms = await offerSchema.find({ cateId : cateId, bought : false })
			else
			forms = await offerSchema.find({ bought : false })
			let allOffers = []
			if(forms.length > 0)
			{
				forms.forEach( (element) => {
					allOffers.push({
						id : element._id,
						title : element.title,
						images : element.images.map( (e) => Settings.backendURL+e),
						fixed : element.fixed,
						price : element.price,
						bought : element.bought,
						date : element.date,
						cateId : element.cateId,
						subCateId : element.subCateId,
						slug : element.title.replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-]/g, '')
					})
				})
			}
		 	return res.send({
		 		success : true,
		 		message : allOffers
		 	})
		} catch (err)
		{
			return next(err)
		}
	})
}