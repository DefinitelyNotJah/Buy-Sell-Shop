const offerSchema = require('../../models/offer')

const Settings = require('../../config.json')

const yup = require('yup');

const schema = yup.object().shape({
	id: yup.string().length(24).required()
});

module.exports = app => {
	app.get('/offer/:id', async (req, res, next) => {
		const {
			id: id
		} = req.params
		try {
			await schema.validate({
				id
			})
			const form = await offerSchema.findOne({ _id : id})
			if(!form)
				return next(new Error('Offer does not exist'))
			
			let oneOffer = {
				id : form._id, 
				title : form.title,
				description : form.description,
				owner : form.owner,
				address : form.address,
				phone : form.phone,
				address : form.address,
				images : form.images.map( (e) => Settings.backendURL+e),
				fixed : form.fixed,
				price : form.price,
				bought : form.bought,
				date : form.date,
				cateId : form.cateId,
				subCateId : form.subCateId,
				slug : form.title.replace(/\s/g, '-').replace(/[^a-zA-Z0-9\-]/g, '')
			}
		 	return res.send({
		 		success : true,
		 		message : oneOffer
		 	})
		} catch (err)
		{
			return next(err)
		}
	})
}