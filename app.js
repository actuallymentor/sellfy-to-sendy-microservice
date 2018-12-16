const https = require( 'https' )
const querystring = require( 'querystring' )

const post = ( url, data ) => new Promise( ( resolve, reject ) => {

	// Set up request parameters
	const options = {
	  hostname: `${ process.env.sendyHost }`,
	  port: 443,
	  path: url,
	  method: 'POST',
	  headers: {
	  	'Content-Type': 'application/x-www-form-urlencoded',
	  	'Content-Length': data.length
	  }
	}

	// Make the request, reject if status is not 200
	const request = https.request( options, response => response.statusCode != 200 && reject(  ) )

	// On error reject
	request.on( 'error', reject )

	// Send json data
	request.write( data )

	// End request
	request.end( resolve )

} )

const subscribe = ( email, list, country ) => new Promise( ( resolve, reject ) => {

	// Reject without proper data
	if( !email || !list ) return reject(  )

	// Data to send
	const data = querystring.stringify( { email: email, list: list, country: country } )

	// Do the subscribe
	post( '/subscribe', data ).then( resolve ).catch( reject )

} )

const unsubscribe = ( email, list ) => new Promise( ( resolve, reject ) => {

	// Reject without proper data
	if( !email || !list ) return reject(  )

	// Data to send
	const data = querystring.stringify( { email: email, list: list } )

	// Do the subscribe
	post( '/unsubscribe', data ).then( resolve ).catch( reject )

} )

// Check if project matches
const isMatchedProduct = sellfyData => sellfyData.products.some( product => process.env.sellfyProducts.indexOf( product.key ) != -1 )

// Env has all required variables
const validateEnv = env => env.sendyHost != undefined && env.subscribeList != undefined && env.sellfyProducts != undefined

// Webhook data has everything
const validateWebhook = data => data.customer && data.customer.email

const hookHandler = webhookData => new Promise( ( resolve, reject ) => {

	// Reject if webhook sends bad data
	if( !validateWebhook( webhookData ) ) return reject( `Webhook data bad: ${ JSON.stringify( webhookData ) }` )

	// Reject if environment validation fails
	if( !validateEnv( process.env ) ) return reject( `Environment variables incomplete: ${ JSON.stringify( process.env ) }` )

	// Check for product match
	if( !isMatchedProduct( webhookData ) ) return resolve( 'No matched product, exiting' )

	// (Un)-Subscribe
	return unsubscribe( webhookData.customer.email, process.env.unSubscribeList )
	.then( f => subscribe( webhookData.customer.email, process.env.subscribeList, webhookData.customer.country ) )
	.then( resolve )

} )

const lambda = webhookData => hookHandler( webhookData )

// Export functions if in test env
if( process.env.test ) module.exports = {
	subscribe: subscribe,
	unsubscribe: unsubscribe,
	isMatchedProduct: isMatchedProduct,
	validateEnv: validateEnv,
	validateWebhook: validateWebhook,
	handler: hookHandler
}

// If not testing, export handler only
if( !process.env.test == true ) exports.handler = lambda