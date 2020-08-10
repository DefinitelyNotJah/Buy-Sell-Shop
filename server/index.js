// Loading up dependancies
const express = require('express');

const helmet = require('helmet');

const { connect } = require('mongoose');

const bodyParser = require('body-parser');

const path = require('path');

// Starting our app
const app = express()

// Configuration
const config = require('./config.json')

// Port
const port = process.env.PORT || 5000

// Middlewares
app.use(helmet())

app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authentication');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	next();
});

// Bodyparser equivilant 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Loading our routes
require('./routes')(app);

// Disabling ETAG
app.disable('etag');

// Making the public folder public
app.use('/public', express.static(path.join(__dirname, 'public')))

// Error Handing for next()
app.use((error, req, res, next) => {
	console.log(error)
	if(error.message === 'Token invalid')
		res.status(401)
	res.send({
		success: false,
		message: error.message
	});
});

// Initializing the App
( async () => {
	await connect(config.mongodbURL, {
		useFindAndModify : false,
		useUnifiedTopology : true,
		useNewUrlParser : true
	})
	app.listen(port, (err) => {
		if(err)
			return console.log(`[ERROR] An error has occurred : ${err}`)
		console.log(`[INFO] Listening on port ${port}`)
	})
} ) () ;