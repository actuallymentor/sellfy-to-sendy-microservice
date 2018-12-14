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
sendyHost='sendy.domain.com' # Sendy domain
subscribeList='kdjh7G34ghj' # list id of sendy list to be subscribed to
subscribeList='kdjh7G34ghj' # list id of sendy list o be unsubscribed from ( optional )
sellfyProducts='uy68,987Jd' # Comma separated list of product keys
```
