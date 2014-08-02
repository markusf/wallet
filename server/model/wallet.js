Wallet = function() {
	this.value = 0;
	this.transactions = [];
};

Wallet.prototype.setValue = function(value) {
	if (value > this.value) {
		this.addTransaction(new Transaction(value - this.value));
	} else if (value < this.value) {
		this.addTransaction(new Transaction(value - this.value));
	}
	this.value = value;
};

Wallet.prototype.getValue = function() {
	return this.value;
};

Wallet.prototype.add = function(amount, date) {
	this.value = this.value + amount;
	this.addTransaction(new Transaction(amount, date));
};

Wallet.prototype.remove = function(amount, date) {
	if (amount > this.value) {
		throw new Error("amount is bigger than wallet value");
	}
	this.value = this.value - amount;
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