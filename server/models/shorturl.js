var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MappingSchema = new Schema({
	shorturl: {type: String, index: true, required: true},
	longurl: {type: String, index: true, required: true},
	urlstatus: {type: String, enum:['ACTIVE', 'INACTIVE'], default: 'ACTIVE'},
	createtime: {type: Date, default: Date.now}
});
mongoose.model('Mapping', MappingSchema);

var OpenSchema = new Schema({
	shorturl: {type: String, index: true, required: true},
	longurl: {type: String, index: true, required: true},
	ipaddress: {type: String, required: true},
	createtime: {type: Date, default: Date.now}
});
mongoose.model('OpenURL', OpenSchema);