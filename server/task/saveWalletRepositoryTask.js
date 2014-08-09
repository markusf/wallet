var SaveWalletRepositoryTask = function(walletService, fileService, filePath) {
	this.walletService = walletService;
	this.fileService = fileService;
	this.filePath = filePath;
}

SaveWalletRepositoryTask.prototype.run = function() {
	var walletRepository = this.walletService.getWalletRepository();
	this.fileService.write(this.filePath, walletRepository);
};

var saveWalletRepository = {
	
	newTask: function(walletService, fileService, filePath) {
		return new SaveWalletRepositoryTask(walletService, fileService, filePath);
	}

};

module.exports = saveWalletRepository;