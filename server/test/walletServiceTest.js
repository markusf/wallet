var assert = require("assert");
var should = require('should')
require('../model/wallet.js');
var walletService = require('../service/walletService.js');

describe("WalletService", function() {
	
	var wallet;
	var walletId;
	
	beforeEach(function() {
		wallet = walletService.getWallet();
		walletId = wallet.getId();
	});
	
	it("should provide access to a specific wallet and create a new wallet with a random if none is found", function() {
		// assert no id wallet call
		assert(wallet);
		assert(walletId);
		
		// id wallet call
		wallet = walletService.getWallet(walletId);
		
		assert(walletId === wallet.getId());
	});
	
	it("should be able to add money to a specific wallet", function() {
		walletService.add(walletId, 20);
		assert(walletService.getWallet(walletId).getValue() === 20);
	});
	
	it("should be able to remove money from a specific wallet", function() {
		walletService.add(walletId, 30);
		walletService.remove(walletId, 20);
		assert(walletService.getWallet(walletId).getValue() === 10);
	});
	
	it("should throw an exception if wallet is not found during add or remove", function() {
		var nonExistingWalletId = "19191919";
		assert.throws(function(){walletService.add(nonExistingWalletId, 20)}, Error);
		assert.throws(function(){walletService.remove(nonExistingWalletId, 20)}, Error);	
	});
	
	it("should be able to set a new value for a specific wallet", function() {
		walletService.setValue(walletId, 3000);
		assert(walletService.getWallet(walletId).getValue() === 3000);
	});
	
	it("should be able to paginate through transactions of a given wallet", function() {
		// create 10 sample transactions
		walletService.add(walletId, 500);
		walletService.remove(walletId, 200);
		walletService.remove(walletId, 150);
		walletService.remove(walletId, 100);
		walletService.add(walletId, 200);

		walletService.add(walletId, 500);
		walletService.add(walletId, 300);
		walletService.remove(walletId, 500);
		walletService.remove(walletId, 100);
		
		// page 1, page size 5
		var transactions = walletService.getTransactions(walletId, 1, 5);
		assert(transactions.length == 5);
		assert(transactions[0].value == -100);
		assert(transactions[1].value == -500);
		assert(transactions[2].value == 300);
		assert(transactions[3].value == 500);
		assert(transactions[4].value == 200);
		
		// page 2, page size 5
		transactions = walletService.getTransactions(walletId, 2, 5);
		assert(transactions.length == 4);
		assert(transactions[0].value == -100);
		assert(transactions[1].value == -150);
		assert(transactions[2].value == -200);
		assert(transactions[3].value == 500);
		
		// page 3, page size 5: page 3 size 5 does not exist!
		assert.throws(function(){walletServicegetTransactions(walletId, 3, 5)}, Error);
	});
	
	
	
});