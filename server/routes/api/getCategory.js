const CategoryList = require('../../category.json')

module.exports = (app) => {
	app.get('/category', (req, res, next) => {
		try {
			res.send({
				success : true,
				message : CategoryList
			})
		} catch ( err ) {
			next(err)
		}
	})
}