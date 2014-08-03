require('../model/wallet.js');
var uuid = require('node-uuid');


var walletRepository = {};

/** private methods **/
var createAndStoreWallet = function() {
	var wallet = new Wallet();
	
	var id = uuid.v1();
	wallet.setId(id);
	
	walletRepository[id] = wallet;
	
	return id;
};

var breakIfWalletDoesNotExist = function(id) {
	if (!walletRepository[id]) {
		throw new Error("wallet does not exist");
	}
}

var service = {
	
	getWallet: function(id) {
		var wallet;
		
		if (!id) {
			id = createAndStoreWallet();
		} else {
			breakIfWalletDoesNotExist(id);
		}
		
		return walletRepository[id];
	},
	
	add: function(id, amount) {
		breakIfWalletDoesNotExist(id);
		walletRepository[id].add(amount);
	},
	
	remove: function(id, amount) {
		breakIfWalletDoesNotExist(id);
		walletRepository[id].remove(amount);
	},
	
	setValue: function(id, amount) {
		breakIfWalletDoesNotExist(id);
		walletRepository[id].setValue(amount);
	},
	
	getTransactions: function(id, page, size) {
		breakIfWalletDoesNotExist(id);
		var wallet = walletRepository[id];
		var transactions = wallet.getTransactions();
		
		// check if page exists
		var pageStart = page * size - size;
		// check if page exists
		if (pageStart > transactions.length) {
			// page does not exist
			throw new Error("page does not exist");
		}
		return transactions.slice(pageStart, Math.min(pageStart + size, transactions.length));
	}

};



module.exports = service;