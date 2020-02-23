# Sellfy to sendy microservice

Linking the [ Sellfy ]( https://sellfy.com ) webhook to the [ sendy ]( https://sendy.co/ ) API through an [ AWS lambda ]( https://aws.amazon.com/lambda/ ) function.

Intention:

- Receive webhook data
- Filter based on criteria
- Make sendy API request

## Manual

Environment variables:

```shell
sendyHosts='["mail.sendyinstallation.tld"]' # Sendy domains array
instructions='[ { "sellfyProducts": "1,2,3", "subscribeList": "LIST", "unSubscribeList": "LIST" }, { "sellfyProducts": "1,2,3", "subscribeList": "LIST", "unSubscribeList": "LIST" } ]' # A json array WITHOUT NEWLINES where every object lists what products to match and what lists to ( un )subscribe to, product ids are in the URL of your live product, list IDs are in sendy
apikey='' #if not specified it will not be included in the request, note that newer versions of sendy require it
```

Setup:

- Create lambda function (node 12.x LTS) with a role that gives it lambda access
- Add trigger: API gateway
  + Template: http api
  + Copy API endpoint (looks like https://xxxxx.execute-api.xxxx.amazonaws.com/default/xxxxx)
  + Add endpoint as webhook in sellfy (under 'Apps')
- Copy the code to the lambda function code (through web or cli)
- Set environment variables based on the above

## Testing

You can run local tests by running `npm test`. If you want verbose output run `debug=true npm test` or even set `debug=true` in the Lambda ive environment so you can see the output of manual testing.

You may do manual testing my using the 'test event' functionality in Lambda.


## Background

Sample data as provided by Sellfy:

```json
{
  "id": "dmnVQFUm",
  "status": "COMPLETED",
  "customer": {
    "ip": "85.169.155.202",
    "country": "US",
    "payment_type": "",
    "email": "customer@sellfy.com"
  },
  "currency": "USD",
  "tax": {
    "amount": 105,
    "percents": 21
  },
  "discount": {
    "amount": 200
  },
  "amount": 605,
  "products": [
    {
            "key": "QFUm",
            "amount": 505,
        "quantity": 1
    },
    {
            "key": "dmnV",
            "amount": 100,
            "quantity": 1
    }
  ],
  "date": "2018-01-17T12:28:00+00:00"
}
```

