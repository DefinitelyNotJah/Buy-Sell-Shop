const offerSchema = require('../../models/offer')
const checkUser = require('../../functions/checkUser')

const multer = require('multer');
let dirname = process.cwd()
var upload = multer({ 
	dest: `${dirname}/public`,
	limits: {
	        fields: 5,
	        fieldNameSize: 50, // TODO: Check if this size is enough
	        fieldSize: 20000, //TODO: Check if this size is enough
	        // TODO: Change this line after compression
	        fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
	    },
	    fileFilter: function(_req, file, cb){
			if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/bmp" || file.mimetype == "image/jpeg") {
				cb(null, true);
			} else {
				cb(null, false);
				return cb(new Error('Only .png, .jpg, .jpeg and .bmp format allowed!'));
			}
		}
});
const fs = require('fs')
const yup = require('yup');

const schema = yup.object().shape({
	Token: yup.string().length(64).required(),
	id : yup.string().length(24).required()
});

module.exports = app => {
	app.post('/offer/upload/:id', upload.array('photos', 12), async (req, res, next) => {
		const Token = req.headers['authentication']
		let {
			id: id
		} = req.params;
		try {
			await schema.validate({
				Token,
				id
			})
 			dirname += '/public/'
			const userInfo = await checkUser(Token)

			const currentOffer = await offerSchema.findOne( { _id : id, owner : userInfo.email })
		    /*if (!req.file) {
		        return next(new Error('No file has been found'))
		    }*/
		    req.files.forEach( (file) => {
			    var filename = file.filename; 
				var mimetype = file.mimetype; 
				mimetype = mimetype.split("/"); 
				var filetype = mimetype[1]; 
				var new_file = file.path+'.'+filetype; 
				fs.renameSync(file.path,new_file);
				currentOffer.images.push(`${filename+'.'+filetype}`)	
		    })
		    await currentOffer.save()
	        return res.send({
	        	success: true, 
	        	message: `Operation is successful`
	        });
		} catch (err)
		{
			return next(err)
		}
	})
}