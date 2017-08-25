module.exports = function(app){

	var shorturl = require('./controllers/shorturl');
	app.post('/', shorturl.getShort);
	app.get('/:shorturl', shorturl.getLong);
}