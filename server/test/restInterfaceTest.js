//var request = require('supertest')
var express = require('express');
var app = require('../app.js');
var assert = require("assert");
var should = require('should');
var request = require('supertest-as-promised');

describe("Index Route", function() {
	
	it("should respond with redirect, if no id is provided", function(done) {
		request(app)
			.get('/')
			.expect(302)
			.end(function(err, res) {
				if (err) return done(err);			
				done();
			});
	});
	
	describe("Wallet REST Service", function() {
		
		var wallet;
		
		beforeEach(function(done) {
			request(app)
			.get('/service/wallet')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				
				res.body.should.have.property('id');
				res.body.should.have.property('transactions');
				
				wallet = res.body;
				
				done();
			});
		});
		
		it("should respond with 404 if wallet does not exist", function(done) {
			request(app)
				.get('/service/wallet/282882')
				.expect(404)
				.end(function() {
					done();
				});
		});
		
		it("should respond with a new json wallet, if no id is provided", function() {
			// implicit test body: see beforeEach
			assert(wallet);
		});
		
		it("should be able to add money to a specific wallet", function(done) {
			request(app)
				.get("/service/wallet/add/" + wallet.id + "/200")
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);
					done();
				});
		});
		
		it("should be able to remove money from a specific wallet", function(done) {
			// First add 200, after remove 200
			// supertest with promises
			request(app)
				.get("/service/wallet/add/" + wallet.id + "/200")
				.expect(200)
				.then(function() {
							return 	request(app)
							.get("/service/wallet/remove/" + wallet.id + "/200")
							.expect(200);
				}).then(function() {
					done();
				});
			
		});
		
		it("should be possible to set a new value of specific wallet", function(done) {
			request(app)
				.get("/service/wallet/value/" + wallet.id + "/200")
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);
					done();
				});
		});
		
		it("should be able to paginate wallet transactions", function(done) {
			// First add 200, after remove 200
			request(app)
				.get("/service/wallet/add/" + wallet.id + "/200")
				.expect(200)
				.then(function() {
					return request(app)
						.get("/service/wallet/remove/" + wallet.id + "/200")
						.expect(200);
				})
				.then(function() {
					return request(app)
						.get("/service/wallet/transactions/" + wallet.id + "/1/10") // page 1, max 10 entries
						.expect(200)
						.then(function(res) {
							assert(res.body.length === 2);
							done();
						});
				});
		});
		
	});
	
});


