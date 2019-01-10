# Sellfy to sendy microservice

Linking the [ Sellfy ]( https://sellfy.com ) webhook to the [ sendy ]( https://sendy.co/ ) API through an [ AWS lambda ]( https://aws.amazon.com/lambda/ ) function.

Intention:

- Receive webhook data
- Filter based on criteria
- Make sendy API request

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

## Manual

Environment variables:

```shell
sendyHosts='["mail.immortalmillionaire.com"]' # Sendy domains array
instructions='[ { "sellfyProducts": "1,2,3", "subscribeList": "LIST", "unSubscribeList": "LIST" }, { "sellfyProducts": "1,2,3", "subscribeList": "LIST", "unSubscribeList": "LIST" } ]' # A json array WITHOUT NEWLINES where every object lists what products to match and what lists to ( un )subscribe to
```
