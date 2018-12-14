const chai = require( 'chai' )
const chaiAsPromised = require( 'chai-as-promised' )
const expect = chai.expect

chai.use( chaiAsPromised )

const sellfyData = require( `${__dirname}/demodata.json` )
const app = require( `${__dirname}/../app.js` )

describe( 'Environment validation', f => {

	it( 'Rejects if host is missing', function() {
		return Promise.resolve( {
			subscribeList: 'list',
			sellfyProducts: 'products'
		} )
		.then( app.validateEnv )
		.then( result => {
			expect( result ).to.equal( false )
		} )
	} )

	it( 'Rejects if list is missing', function() {
		return Promise.resolve( {
			sendyHost: 'host',
			sellfyProducts: 'products'
		} )
		.then( app.validateEnv )
		.then( result => {
			expect( result ).to.equal( false )
		} )
	} )

	it( 'Rejects if products is missing', function() {
		return Promise.resolve( {
			sendyHost: 'host',
			subscribeList: 'list',
		} )
		.then( app.validateEnv )
		.then( result => {
			expect( result ).to.equal( false )
		} )
	} )

	it( 'Resolves if nothing is missing', function() {
		return Promise.resolve( {
			sendyHost: 'host',
			subscribeList: 'list',
			sellfyProducts: 'products'
		} )
		.then( app.validateEnv )
		.then( result => {
			expect( result ).to.equal( true )
		} )
	} )


	it( 'Resolve if all attributes exist', function() {

		const withMatch = JSON.parse( JSON.stringify( sellfyData ) )
		withMatch.products.push( { key: process.env.sellfyProducts.split( ',' )[0] } )

		return Promise.resolve( withMatch )
		.then( app.isMatchedProduct )
		.then( result => {
			expect( result ).to.equal( true )
		} )
	} )

} )

describe( 'Webhook validation', f => {


	it( 'Fails with missing customer', function() {

		expect( app.validateWebhook( { irrelevant: true } ) )

	} )

	it( 'Fails with missing email', function() {

		expect( app.validateWebhook( { customer: { irrelevant: true } } ) )

	} )

	it( 'Passes with customer email', function() {

		expect( app.validateWebhook( { customer: { email: true } } ) )

	} )

} )

describe( 'Data filtering', f => {

	it( 'Rejects if there is no match', function() {
		return Promise.resolve( sellfyData )
		.then( app.isMatchedProduct )
		.then( result => {
			expect( result ).to.equal( false )
		} )
	} )

	it( 'Resolves if there is a match', function() {

		const withMatch = JSON.parse( JSON.stringify( sellfyData ) )
		withMatch.products.push( { key: process.env.sellfyProducts.split( ',' )[0] } )

		return Promise.resolve( withMatch )
		.then( app.isMatchedProduct )
		.then( result => {
			expect( result ).to.equal( true )
		} )
	} )

} )

describe( 'Subscription', f => {

	it( 'Fails without an email', function() {

		return expect( app.subscribe( process.env.subscribeList ) ).to.be.rejected

	} )

	it( 'Fails without a list', function() {

		return expect( app.subscribe( 'demo@user.com' ) ).to.be.rejected

	} )

	it( 'Subscribed a user', function() {
		// NOTE: This test only checks for status code 200, check your sendy interface for the email to be sure.
		return app.subscribe( 'demo@user.com', process.env.subscribeList )
	} )

} )

describe( 'Un-Subscription', f => {

	it( 'Fails without an email', function() {

		return expect( app.unsubscribe( process.env.subscribeList ) ).to.be.rejected

	} )

	it( 'Fails without a list', function() {

		return expect( app.unsubscribe( 'demo@user.com' ) ).to.be.rejected

	} )

	it( 'Subscribed a user', function() {
		// NOTE: This test only checks for status code 200, check your sendy interface for the email to be sure.
		return app.unsubscribe( 'demo@user.com', process.env.subscribeList )
	} )

} )

describe( 'Handler', f => {

	it( 'Fails without data', function( ) {
		expect( app.handler( {  } ) ).to.be.rejected
	} )

} )