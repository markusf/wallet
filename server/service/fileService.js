var fs = require('fs');

var FileService = function(encoder, decoder) {
	this.encoder = encoder;
	this.decoder = decoder;
};

FileService.prototype.write = function(filePath, data) {
	fs.writeFileSync(filePath, this.encoder(data));
};

FileService.prototype.read = function(filePath) {
	return this.decoder(fs.readFileSync(filePath, {encoding: 'UTF-8'}));
};

FileService.prototype.deleteFile = function(filePath) {
	fs.unlinkSync(filePath);
};

var fileService = {
		
		create: function(encoder, decoder) {
			return new FileService(encoder, decoder);
		}

};

module.exports = fileService;
