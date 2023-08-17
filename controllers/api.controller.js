const endpoints = require('../endpoints.json');

exports.getApiDocumentation = (req, res) => {
	res.send(endpoints);
}