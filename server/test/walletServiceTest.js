var assert = require("assert");
var should = require('should');
var walletService = require('../service/walletService.js');
var fs = require('fs');

describe("WalletService", function() {
	
	var wallet;
	var walletId;
	
	beforeEach(function() {
		wallet = walletService.getWallet();
		assert(wallet.id);
		walletId = wallet.id;
	});
	
	it("should provide access to a specific wallet and create a new wallet with a random if none is found", function() {
		// assert no id wallet call
		assert(wallet);
		assert(walletId);
		
		// id wallet call
		wallet = walletService.getWallet(walletId);
		
		assert(walletId === wallet.id);
	});
	
	it("should fail when trying to access a wallet, which is unknown", function() {
		assert.throws(function(){walletService.getWallet("13371337");}, Error);
	});
	
	it("should be able to add money to a specific wallet", function() {
		walletService.add(walletId, 20);
		walletService.add(walletId, 20);
		assert(walletService.getValue(walletId) === 40);
	});
	
	it("should be able to remove money from a specific wallet", function() {
		walletService.add(walletId, 30);
		walletService.remove(walletId, 20);
		assert(walletService.getValue(walletId) === 10);
	});
	
	it("should throw an exception if wallet is not found during add or remove", function() {
		var nonExistingWalletId = "19191919";
		assert.throws(function(){walletService.add(nonExistingWalletId, 20)}, Error);
		assert.throws(function(){walletService.remove(nonExistingWalletId, 20)}, Error);	
	});
	
	it("should be able to set a new value for a specific wallet", function() {
		walletService.setValue(walletId, 3000);
		assert(walletService.getValue(walletId) === 3000);
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
	
	it("should be able to get the wallets current value", function() {
		walletService.add(walletId, 50);
		assert(walletService.getValue(walletId) === 50);
	});
	
	it("should throw an error if trying to remove more money than there is inside", function() {
		walletService.add(walletId, 20);
		assert.throws(function(){walletService.remove(walletId, 30)}, Error);	
	});
	
	it("should have transactions, which protocol adding and removal of money", function() {
		assert(wallet.transactions instanceof Array);
	});
	
	it("should be possible to assign an id to make it identifiable", function() {
		var id = "fooWallet";
		wallet.id = id;
		assert(wallet.id === id);
	});
	
	it("should create a transaction when adding money", function() {
		walletService.add(walletId, 20);
		assert(wallet.transactions.length == 1);
		assert(wallet.transactions[0].value === 20);
		walletService.add(walletId, 10);
		assert(wallet.transactions.length == 2);
		// newer transaction should appear first in transactions array
		assert(wallet.transactions[0].value === 10);
		assert(wallet.transactions[1].value === 20);
	});
	
	it("should create a transaction when removing money", function() {
		walletService.setValue(walletId, 40);
		walletService.remove(walletId, 10);
		assert(wallet.transactions.length == 2);
		assert(wallet.transactions[0].value === -10);
		assert(wallet.transactions[1].value === 40);
		assert(walletService.getValue(walletId) == 30);
		
	});
	
	it("should create a transaction when adding and removing money", function() {
		walletService.add(walletId, 100);
		walletService.remove(walletId, 20);
		assert(wallet.transactions.length == 2);
		assert(wallet.transactions[0].value === -20);
		assert(wallet.transactions[1].value === 100);
		assert(walletService.getValue(walletId) == 80);
	});
	
	it("should add a date to transaction if none is provided", function() {
		walletService.add(walletId, 100);
		walletService.remove(walletId, 50);
		wallet.transactions[0].should.be.a.number;
		wallet.transactions[1].should.be.a.number;
	});
	
	it("should add a provided date to transactions", function() {
		var datetime = new Date().getTime();
		walletService.add(walletId, 100, datetime);
		walletService.remove(walletId, 50, datetime);
		assert(wallet.transactions[0].date === datetime);
		assert(wallet.transactions[1].date === datetime);
	});
	
	it("should keep track (create transaction) of a redefined wallet value, which is higher than current value", function() {
		walletService.add(walletId, 20);
		walletService.setValue(walletId, 50);
		// 30 should be the first transaction (50-20)
		assert(wallet.transactions[0].value === 30);
	});
	
	it("should keep track (create transaction) of a redefined wallet value, which is lower than current value", function() {
		walletService.add(walletId, 50);
		walletService.setValue(walletId, 40);
		// -10 should be the first transaction (40-50)
		assert(wallet.transactions[0].value === -10);
	});
	
	it("should not create a transaction if wallet value is set same value", function() {
		walletService.setValue(walletId, 50);
		// this should not create a transaction
		walletService.setValue(walletId, 50);
		
		assert(wallet.transactions.length === 1);
	});
	
	/*
	describe("WalletFs", function() {
		
		var fileName = "message.txt";
		
		it("should be able to write and read from file", function(done) {
			var content = "Hello!";
			
			fs.writeFile(fileName, content, function(err) {
				if (err) done(err);
				fs.readFile(fileName, function(err, data) {
					if (err) done(err);
					assert(data == content);
					done();
				});
			});

		});
		
		it("should be to write a wallet to fileystem", function() {
			assert(wallet);
			
			wallet.setValue(500);
			wallet.setValue(400);
			
			var jsonString = JSON.stringify(wallet);
			
			fs.writeFileSync(fileName, jsonString);
		});
		
		it("should be able to read a wallet from filesystem", function() {
			
			wallet.setValue(500);
			wallet.setValue(400);
			//console.log(wallet);
			
			var jsonString = JSON.stringify(wallet);
			
			fs.writeFileSync(fileName, jsonString);
			
			var fileContent = fs.readFileSync(fileName, {encoding: 'UTF-8'});
			
			assert(jsonString == fileContent);
			
			var walletFromFile = JSON.parse(fileContent);
			
			//console.log(walletFromFile);
			
			assert(walletFromFile.transactions.length == 2);
			// of course not ;) assert(walletFromFile.transactions[0] instanceof Date);
		});
		
		afterEach(function() {
			try {
				fs.unlinkSync(fileName);
			} catch (e) {
				// ignore
			}
			assert(fs.existsSync(fileName) == false);
		});
		
	});
	*/
	
	
});