var assert = require("assert");
var should = require('should');
require("../model/wallet.js");

/**
 * Erkenntnisse: 
 * Design evolves during testing. It is not created during testing!
 * If refactoring breaks a test, you can directly see it!
 */

describe("Wallet", function(){
	var wallet;
	
	beforeEach(function() {
		wallet = new Wallet();
	});
	
	it("should be represented by a prototype", function() {
		// "should"- style
		wallet.should.be.an.instanceof(Wallet);
		
		// "assert"-style
		assert(wallet instanceof Wallet);
	});
	
	it("should be possible to retrieve the wallets value", function() {
		assert.equal(wallet.getValue(), 0);
	});
	
	it("should be possible to add money", function() {
		wallet.add(20);
		assert.equal(wallet.getValue(), 20);
	});
	
	it("should be possible to remove money", function() {
		wallet.add(20);
		wallet.remove(10);
		assert.equal(wallet.getValue(), 10);
	});
	
	it("should throw an error if trying to remove more money than there is inside", function() {
		wallet.add(20);
		assert.throws(function(){wallet.remove(30)}, Error);	
	});
	
	it("should be possible to define the wallet value", function() {
		wallet.setValue(40);
		assert.equal(wallet.getValue(), 40);
	});
	
	it("should have transactions, which protocol adding and removal of money", function() {
		assert(wallet.getTransactions() instanceof Array);
	});
	
	describe("Transaction", function() {
		it("should be represented by a prototype", function() {
			assert(new Transaction() instanceof Transaction);
		});
		
		it("should have a constructor which takes an amount and is retrievable by getValue", function() {
			var transaction = new Transaction(20);
			assert(transaction.getValue() == 20);
		});
		
		it("should keep track of added money", function() {
			wallet.add(20);
			assert(wallet.getTransactions().length == 1);
			assert(wallet.getTransactions()[0].getValue() === 20);
			// add another value
			wallet.add(10);
			assert(wallet.getTransactions().length == 2);
			// newer transaction should appear first in transactions array
			assert(wallet.getTransactions()[0].getValue() === 10);
			assert(wallet.getTransactions()[1].getValue() === 20);
		});
		
		it("should keep track of removed money", function() {
			wallet.setValue(40);
			wallet.remove(10);
			assert(wallet.getTransactions()[0].getValue() === -10);
		});
		
		it("should keep track of added and removed money", function() {
			wallet.add(40);
			wallet.remove(20);
			assert(wallet.getTransactions()[0].getValue() === -20);
			assert(wallet.getTransactions()[1].getValue() === 40);
			assert(wallet.getValue() == 20);
		});
		
		it ("should have a date which can be assigned manually optionally", function() {
			// auto date
			wallet.add(20);
			assert(wallet.getTransactions()[0].getDate());
			
			// manual date
			var now = new Date();
			wallet.add(30, now);
			assert(wallet.getTransactions()[0].getDate() == now);
		});
		
		it("should keep track of a redefined wallet value, which is higher than current value", function() {
			wallet.add(20);
			wallet.setValue(50);
			// 30 should be the first transaction (50-20)
			assert(wallet.getTransactions()[0].getValue() === 30);
		});
		
		it("should keep track of a redefined wallet value, which is lower than current value", function() {
			wallet.add(50);
			wallet.setValue(40);
			// -10 should be the first transaction (40-50)
			assert(wallet.getTransactions()[0].getValue() === -10);
		});
		
		it("should not create a transaction if wallet value is set same value", function() {
			wallet.setValue(50);
			// this should not create a transaction
			wallet.setValue(50);
			
			assert(wallet.getTransactions().length == 1);
		});
		
		it("should have a check method, which returns the sum of all transactions, this value should be equal to the current wallet value", function() {
			wallet.setValue(100); // 100
			wallet.remove(20); // 80
			wallet.add(50); // 130
			wallet.add(20); // 150
			wallet.remove(100); // 50
			wallet.setValue(300);
			wallet.setValue(100);
			wallet.setValue(600);
			wallet.remove(400);
			wallet.add(10000);
			
			assert(wallet.getValue() === wallet.sumTransactions());
			
			// shit, this works, I now can remove :)
		});
		
	});
	
});