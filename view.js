// setup
const Gdax = require('gdax');
const config = require('./config.json');

const key = config.sync.gdax.key;
const b64secret = config.sync.gdax.b64secret;
const passphrase = config.sync.gdax.passphrase;

const apiURI = 'https://api.gdax.com';
const sandboxURI = 'https://api-public.sandbox.gdax.com';

// get the client
const authedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);

// get the accounts
authedClient.getAccounts((error, response, data) => {
	if (error) {
		// handle the error
		console.log(error);
	} else {
		// work with data
		console.log(data);
		for (let i = 0; i < data.length; i++) {
			// loop through all accounts, get their info
			var account = data[i];
			authedClient.getAccountHistory(account.id, (error, response, data) => {
				console.log(data);
			});
		}
	}
});