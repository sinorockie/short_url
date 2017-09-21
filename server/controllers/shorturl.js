var util = require('util');

var mongoose = require('mongoose'),
	Mapping = mongoose.model('Mapping');
	OpenURL = mongoose.model('OpenURL');
	
exports.getShort = function(req, res) {
	Mapping.find({'longurl': req.body.longurl, 'urlstatus': 'ACTIVE'}, 'shorturl').exec(function(err, mappings) {
		if (err) {
			util.log("find short url: " + JSON.stringify(err));
			res.json({error: "err"});
		} else {
			if (mappings.length > 0) {
				res.json({shorturl: mappings[0].shorturl});
			} else {
				saveShort(req, res);
			}
		}
	});
};

var saveShort = function(req, res) {
	var shorturl = Math.random().toString(36).substr(2, 6);
	Mapping.find({'shorturl': shorturl, 'urlstatus': 'ACTIVE'}, 'shorturl').exec(function(err, mappings) {
		if (err) {
			util.log("verify short url: " + JSON.stringify(err));
			res.json({error: "err"});
		} else {
			if (mappings.length > 0) {
				util.log("existing short url: " + JSON.stringify(mappings));
				saveShort(req, res);
			} else {
				var newMapping = new Mapping({
					shorturl: shorturl,
					longurl: req.body.longurl
				});
				newMapping.save(function(err, results){
					if (err) {
						util.log("save short url: " + JSON.stringify(err));
						res.json({error: "err"});
					} else {
						res.json({shorturl: shorturl});
					}
				});
			}
		}
	});
}

exports.getLong = function(req, res) {
	Mapping.find({'shorturl': req.params.shorturl, 'urlstatus': 'ACTIVE'}, 'longurl').exec(function(err, mappings) {
		if (err) {
			util.log("find long url: " + JSON.stringify(err));
			res.json({error: "err"});
		} else {
			if (mappings.length == 0) {
				res.json({error: "invalid short url"});
			} else if (mappings.length == 1) {
				var longurl = mappings[0].longurl.toLowerCase();
				if (!longurl.startsWith("http://") && !longurl.startsWith("https://")) {
					longurl = "http://" + mappings[0].longurl;
				} else {
					longurl = mappings[0].longurl
				}
				var newOpen = new OpenURL({
					shorturl: req.params.shorturl,
					longurl: longurl,
					ipaddress: req.headers['x-real-ip'] || req.headers['x-forwarded-for']
				});
				newOpen.save(function(err, results){
					if (err) {
						util.log("open url: " + JSON.stringify(err));
						res.json({error: "err"});
					}
				});
				res.redirect(longurl);
			} else {
				res.json({error: "too many mappings"});
			}
		}
	});
};