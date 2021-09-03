const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
let app = express();

require('./src/helpers/blockchain-helper')(app)

let config
const configPath = './config.json'
const configExists = fs.existsSync(configPath, fs.F_OK)
if (configExists) {
	config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
} else {
	return console.log('There is no config.json file')
}
app.config = config

let web3
app.configureWeb3(config)
.then(web3 => {
	app.web3 = web3
	app.use(express.static(__dirname + '/public'))
	app.use(bodyParser.json({
		limit: '50mb',
	}))
	app.use(bodyParser.urlencoded({
		limit: '50mb',
		extended: true,
	}))

	require('./src/controllers/index')(app)

	app.get('/', function(request, response) {
	  response.send('Astar testnet Dusty Network faucet')
	});

	app.set('port', (process.env.PORT || 5000))

	app.listen(app.get('port'), function () {
	    console.log('Astar testnet Dusty Network faucet is running on port', app.get('port'))
	})
})
.catch(error => {
	return console.log(error)
})