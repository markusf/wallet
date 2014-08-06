var express = require('express');
var router = express.Router();
var walletService = require('../service/walletService');

router.get('/:id?', function(req, res) {
	if (!req.params.id) {
		// create wallet and send redirect
		console.log("create and redirect");
		var wallet = walletService.getWallet();
		res.redirect("/" + wallet.id);
	} else {
		try {
			console.log("send app.html");
			walletService.getWallet(req.params.id);
			// TODO: retrieve app.html from client/build
			res.status(200).sendfile('./public/app.html');
		} catch (e) {
			console.log(e);
			res.send(404);
		}
	}
});

/* GET WALLET */
router.get('/service/wallet/:id?', function(req, res) {
	try {
		var wallet = walletService.getWallet(req.params.id);
		res.json(wallet);
	} catch (e) {
		console.log(e);
		res.send(404);
	}
});

router.get('/service/wallet/add/:id/:amount/:date?', function(req, res) {
	try {
		console.log("Date: " + req.params.date);
		walletService.add(req.params.id, Number(req.params.amount), Number(req.params.date));
		res.send(200);
	} catch (e) {
		console.log(e);
		res.send(404);
	}
});

router.get('/service/wallet/remove/:id/:amount/:date?', function(req, res) {
	try {
		walletService.remove(req.params.id, Number(req.params.amount), Number(req.params.date));
		res.send(200);
	} catch (e) {
		console.log(e);
		res.send(404);
	}
});

router.get('/service/wallet/value/:id/:amount', function(req, res) {
	try {
		walletService.setValue(req.params.id, Number(req.params.amount));
		res.send(200);
	} catch (e) {
		console.log(e);
		res.send(404);
	}
});

router.get('/service/wallet/transactions/:id/:page/:pageSize', function(req, res) {
	try {
		var transactions = walletService.getTransactions(req.params.id, Number(req.params.page), Number(req.params.pageSize));
		res.json(transactions);
	} catch (e) {
		console.log(e);
		res.send(404);
	}
});

router.get('/service/wallet/value/:id', function(req, res) {
	try {
		res.json(walletService.getValue(req.params.id));
	} catch (e) {
		console.log(e);
		res.send(404);
	}
});

module.exports = router;
