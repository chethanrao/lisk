'use strict';

var test = require('../../functional.js');

var lisk = require('lisk-js');
var expect = require('chai').expect;

var phases = require('../../common/phases');
var Scenarios = require('../../common/scenarios');
var localCommon = require('./common');

var sendTransactionPromise = require('../../../common/helpers/api').sendTransactionPromise;

describe('POST /api/transactions (unconfirmed type 6 on top of type 4)', function () {

	var scenarios = {
		'regular': new Scenarios.Multisig(),
	};

	var transaction;
	var badTransactions = [];
	var goodTransactions = [];

	localCommon.beforeValidationPhaseWithDapp(scenarios);

	describe.skip('sending inTransfer', function () {

		it('regular scenario should be ok', function () {
			transaction = lisk.transfer.createInTransfer(scenarios.regular.dapp.id, 1, scenarios.regular.account.password);

			return sendTransactionPromise(transaction).then(function (res) {
				expect(res).to.have.property('status').to.equal(200);
				expect(res).to.have.nested.property('body.status').to.equal('Transaction(s) accepted');
				goodTransactions.push(transaction);
			});
		});
	});

	describe('check inTransfer DOES NOT process', function () {

		it('regular scenario should be ok', function () {
			transaction = lisk.transfer.createInTransfer(scenarios.regular.dapp.id, 1, scenarios.regular.account.password);

			return sendTransactionPromise(transaction).then(function (res) {
				expect(res).to.have.property('status').to.equal(400);
				expect(res).to.have.nested.property('body.message').to.equal('Invalid transaction body - Frozen transaction type ' + transaction.type);
				badTransactions.push(transaction);
			});
		});
	});

	describe('confirmation', function () {

		phases.confirmation(goodTransactions, badTransactions);
	});
});
