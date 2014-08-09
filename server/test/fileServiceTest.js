var assert = require("assert");
var should = require('should');
var sinon = require("sinon");
var walletService = require('../service/walletService.js');
var fs = require('fs');
var path = require("path");
var fileService = require('../service/fileService.js');

describe("FileService", function() {
	
	var fileServiceInstance;
	var fileName = "test.json";
	var testData = {"999-999": {transactions: [20, 50, 60]}, "999-1000": {transactions: [20, 50, 60]}};
	var mainPath = path.resolve('.');
	var filePath = mainPath + "\\" + fileName;
	var nonExistingFilePath = mainPath + "\\" + "doesnotexist.json";
	var encoder;
	var decoder;
	
	beforeEach(function() {
		encoder = sinon.spy(JSON.stringify);
		decoder = sinon.spy(JSON.parse);
		fileServiceInstance = fileService.create(encoder, decoder);
	});
	
	afterEach(function() {
		try {
			fs.unlinkSync(filePath);
		} catch (e) {
			
		}
		
		assert(!fs.existsSync(filePath));
		
		encoder.reset();
		decoder.reset();
	});
	
	it("should have a create-function, which takes an encoding and decoding function as a parameter and returns a new FileService instance", function() {
		assert(fileServiceInstance);
		assert(fileServiceInstance.encoder);
		assert(fileServiceInstance.decoder);
	});
	
	it("should take a filePath and data as parameter and write the data to the specified file", function() {
		fileServiceInstance.write(filePath, testData);
		assert(fs.existsSync(filePath));
		// make sure encoder has been called
		assert(encoder.calledWith(testData));
		assert(encoder.calledOnce);
	});
	
	it("should take a filePath as parameter and read the data from the specified file", function() {
		fileServiceInstance.write(filePath, testData);
		var data = fileServiceInstance.read(filePath);
		assert(data);
		// make sure decoder has been called
		assert(decoder.calledOnce);
		// compare JSON on string level
		assert(JSON.stringify(data) === JSON.stringify(testData));
	});
	
	it("throws an error when trying to read a non existing file", function() {	
		assert.throws(function(){
			fileServiceInstance.read(nonExistingFilePath);
		}, Error);
	});
	
	it("should take a filePath as argument to delete a file", function() {
		fileServiceInstance.write(filePath, testData);
		fileServiceInstance.deleteFile(filePath);
		assert(!fs.existsSync(filePath));
	});
	
	it("throws an error when trying to delete a non existing file", function() {
		assert.throws(function(){
			fileServiceInstance.deleteFile(nonExistingFilePath);
		}, Error);
	});
	
});