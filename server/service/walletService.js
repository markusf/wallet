var uuid = require('node-uuid');


var walletRepository = {};

/** private methods **/
var createAndStoreWallet = function() {
	var wallet = {};
	
	var id = uuid.v1();
	wallet.id = id;
	wallet.transactions = [];
	
	walletRepository[id] = wallet;
	
	return id;
};

var setValue = function(wallet, value) {
	var currentValue = getValue(wallet);
	
	if (value > currentValue || value < currentValue) {
		addTransaction(wallet, createTransaction(value - currentValue));
	}
};

var createTransaction = function(value, date) {
	var date = date || new Date().getTime();
	
	return {value: value, date: date};
};

var addTransaction = function(wallet, transaction) {
	wallet.transactions.unshift(transaction);
};

var sumTransactions = function(wallet) {
	var sum = 0;
	
	for (var i = 0; i < wallet.transactions.length; i++) {
		sum = sum + wallet.transactions[i].value;
	}
	
	return sum;
};

var getValue = function(wallet) {
	return sumTransactions(wallet);
};

var getWalletOrBreak = function(id) {
	var wallet = walletRepository[id];
	if (!wallet) {
		throw new Error("wallet does not exist");
	}
	
	return wallet;
};

var service = {
	
	getWallet: function(id) {
		var wallet;
		
		if (!id) {
			id = createAndStoreWallet();
		}
		
		return getWalletOrBreak(id);
	},
	
	add: function(id, amount, date) {
		var wallet = getWalletOrBreak(id);
		addTransaction(wallet, createTransaction(amount, date));
	},
	
	remove: function(id, amount, date) {
		var wallet = getWalletOrBreak(id);
		if (amount > getValue(wallet)) {
			throw new Error("amount is bigger than wallet value");
		}
		addTransaction(wallet, createTransaction(amount * - 1, date));
	},
	
	setValue: function(id, amount) {
		var wallet = getWalletOrBreak(id);
		setValue(wallet, amount);
	},
	
	getValue: function(id) {
		var wallet = getWalletOrBreak(id);
		return getValue(wallet);
	},
	
	getTransactions: function(id, page, size) {
		var wallet = getWalletOrBreak(id);
		var transactions = wallet.transactions;
		
		// check if page exists
		var pageStart = page * size - size;
		// check if page exists
		if (pageStart > transactions.length) {
			// page does not exist
			throw new Error("page does not exist");
		}
		return transactions.slice(pageStart, Math.min(pageStart + size, transactions.length));
	},
	
	getWalletRepository: function() {
		return walletRepository;
	},
	
	setWalletRepository: function(repository) {
		walletRepository = repository;
	}

};

module.exports = service;