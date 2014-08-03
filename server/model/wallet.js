Wallet = function() {
	this.transactions = [];
};

Wallet.prototype.setValue = function(value) {
	var currentValue = this.getValue();
	
	if (value > currentValue) {
		this.addTransaction(new Transaction(value - currentValue));
	} else if (value < currentValue) {
		this.addTransaction(new Transaction(value - currentValue));
	}
};

Wallet.prototype.getValue = function() {
	return this.sumTransactions();
};

Wallet.prototype.add = function(amount, date) {
	this.addTransaction(new Transaction(amount, date));
};

Wallet.prototype.remove = function(amount, date) {
	if (amount > this.getValue()) {
		throw new Error("amount is bigger than wallet value");
	}
	this.addTransaction(new Transaction(amount * -1, date));
};

Wallet.prototype.getTransactions = function() {
	return this.transactions;
};

Wallet.prototype.addTransaction = function(transaction) {
	this.transactions.unshift(transaction);
};

Wallet.prototype.sumTransactions = function() {
	var sum = 0;
	
	for (var i = 0; i < this.transactions.length; i++) {
		sum = sum + this.transactions[i].getValue();
	}
	
	return sum;
};

Wallet.prototype.setId = function(id) {
	this.id = id;
};

Wallet.prototype.getId = function() {
	return this.id;
};

Transaction = function(value, date) {
	this.value = value;
	// if date is undefined, set date to now
	this.date = date || new Date();
};

Transaction.prototype.getDate = function() {
	return this.date;
};

Transaction.prototype.getValue = function() {
	return this.value;
};