var LoadWalletRepositoryTask = function(walletService, fileService, filePath) {
	this.walletService = walletService;
	this.fileService = fileService;
	this.filePath = filePath;
}

LoadWalletRepositoryTask.prototype.run = function() {
	var walletRepository = this.fileService.read(this.filePath);
	this.walletService.setWalletRepository(walletRepository);
};

var LoadWalletRepository = {
	
	newTask: function(walletService, fileService, filePath) {
		return new LoadWalletRepositoryTask(walletService, fileService, filePath);
	}

};

module.exports = LoadWalletRepository;