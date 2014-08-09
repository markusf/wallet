var assert = require("assert");
var should = require('should');
var sinon = require("sinon");
var walletService = require('../service/walletService.js');
var fs = require('fs');
var path = require("path");
var fileService = require('../service/fileService.js');
var loadWalletRepository = require('../task/loadWalletRepositoryTask.js');

describe("LoadWalletRepository", function() {
	
	var walletRepository;
	var fileServiceInstance;
	var filePath = "mypath";
	
	beforeEach(function() {
		walletRepository = getWalletRepository();
		fileServiceInstance = fileService.create(JSON.stringify, JSON.parse);
	});
	
	it("should take walletService and fileService and create a new task instance", function() {
		var loadWalletTask = loadWalletRepository.newTask(walletService, fileServiceInstance, filePath);
		assert(loadWalletTask);
	});
	
	it("should retrieve wallet Repository from disk and set it in walletService when run()", function() {
		var fileServiceInstanceMock = sinon.mock(fileServiceInstance);
		var walletServiceMock = sinon.mock(walletService);
		
		// fileServiceInstanceMock.expects('read').once().calledWith(filePath).returns(walletRepository);
		fileServiceInstanceMock.expects('read').once().returns(walletRepository);
		walletServiceMock.expects('setWalletRepository').once().calledWith(walletRepository);
		
		var loadWalletTask = loadWalletRepository.newTask(walletService, fileServiceInstance, filePath);
		
		loadWalletTask.run();
		
		fileServiceInstanceMock.verify();
		walletServiceMock.verify();
	});
	
	function getWalletRepository() {
		var newWallet = walletService.getWallet();
		
		var newWalletRepository = {};
		
		newWalletRepository[newWallet.id] = newWallet;
		
		return newWalletRepository;
	}
	
	
});
