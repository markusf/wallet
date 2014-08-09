var assert = require("assert");
var should = require('should');
var sinon = require("sinon");
var walletService = require('../service/walletService.js');
var fs = require('fs');
var path = require("path");
var fileService = require('../service/fileService.js');
var saveWalletRepository = require('../task/saveWalletRepositoryTask.js');

describe("SaveWalletRepository", function() {
	
	var walletRepository;
	var fileServiceInstance;
	var filePath = "mypath";
	
	beforeEach(function() {
		walletRepository = getWalletRepository();
		fileServiceInstance = fileService.create(JSON.stringify, JSON.parse);
	});
	
	it("should take walletService and fileService and create a new task instance", function() {
		var saveWalletTask = saveWalletRepository.newTask(walletService, fileServiceInstance, filePath);
		assert(saveWalletTask);
	});
	
	it("should retrieve walletrepository from walletService and save wallet repository to disk on run()", function() {
		var walletServiceMock = sinon.mock(walletService);
		var fileServiceInstanceMock = sinon.mock(fileServiceInstance);
		
		walletServiceMock.expects('getWalletRepository').once().returns(walletRepository);
		fileServiceInstanceMock.expects('write').once().calledWith(filePath, walletRepository);
		
		var saveWalletTask = saveWalletRepository.newTask(walletService, fileServiceInstance, filePath);

		saveWalletTask.run();
		
		walletServiceMock.verify();
		fileServiceInstanceMock.verify();
	});
	
	function getWalletRepository() {
		var newWallet = walletService.getWallet();
		
		var newWalletRepository = {};
		
		newWalletRepository[newWallet.id] = newWallet;
		
		return newWalletRepository;
	}
	
	
});
