const https = require( 'https' )
const querystring = require( 'querystring' )

const subscribe = ( email, list, country ) => new Promise( ( resolve, reject ) => {

	// Reject without proper data
	if( !email || !list ) return reject(  )

	// Data to send
	const data = querystring.stringify( { email: email, list: list, country: country } )

	// Set up request parameters
	const options = {
	  hostname: `${ process.env.sendyHost }`,
	  port: 443,
	  path: '/subscribe',
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

const isMatchedProduct = sellfyData => {

	// Make match list
	const matchWith = process.env.sellfyProducts.split( ',' )

	// For every sellfy product
	for (let i = sellfyData.products.length - 1; i >= 0; i--) {
		
		// For every prudyct we should match
		for (let j = matchWith.length - 1; j >= 0; j--) {
			// Return true if match
			if( sellfyData.products[i].key == matchWith[j] ) return true
		}

	}

	// Return false if no matches
	return false

}

// Env has all required variables
const validateEnv = env => env.sendyHost != undefined && env.sendyList != undefined && env.sellfyProducts != undefined

// Webhook data has everything
const validateWebhook = data => data.customer && data.customer.email

const handler = webhookData => new Promise( ( resolve ) => {

	// Reject if webhook sends bad data
	if( !validateWebhook( webhookData ) ) return reject( `Webhook data bad: ${ JSON.stringify( webhookData ) }` )

	// Reject if environment validation fails
	if( !validateEnv( process.env ) ) return reject( `Environment variables incomplete: ${ JSON.stringify( process.env ) }` )

	// Check for product match
	if( !isMatchedProduct( webhookData ) ) return resolve( 'No matched product, exiting' )

	// Subscribe
	return subscribe( webhookData.customer.data, process.env.sendyList, webhookData.customer.country ).then( resolve )

} )

// Export functions if in test env
if( process.env.test ) module.exports = {
	subscribe: subscribe,
	isMatchedProduct: isMatchedProduct,
	validateEnv: validateEnv,
	validateWebhook: validateWebhook,
	handler: handler
}

// If not testing, export handler only
if( !process.env.test == true ) module.handler = handler