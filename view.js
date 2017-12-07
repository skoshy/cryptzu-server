// setup
const Gdax = require('gdax');
const config = require('./config.json');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db.sqlite3');

var moment = require('moment');

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
				console.log(data, "===================================");

				var currentTimeInUtc = moment.utc().format();
				var dbParams = {
					$type: "trade",
					$fk_currency_from_id: 1,
					$fk_currency_to_id: 2,
					$amount_from: 100,
					$amount_to: 100,
					$fee_from: 100,
					$fee_to: 100,
					$fk_source_id: 1,
					$datetime_executed: currentTimeInUtc,
					$datetime_imported: currentTimeInUtc,
					$datetime_updated: currentTimeInUtc,
				};

				db.run(`
					INSERT INTO trades
					(type, fk_currency_from_id, fk_currency_to_id, amount_from, amount_to, fee_from, fee_to, fk_source_id, datetime_executed, datetime_imported, datetime_updated)
					VALUES
					($type, $fk_currency_from_id, $fk_currency_to_id, $amount_from, $amount_to, $fee_from, $fee_to, $fk_source_id, $datetime_executed, $datetime_imported, $datetime_updated)`
					, dbParams);
			});
		}
	}
});