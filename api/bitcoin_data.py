import requests
import json

API_BASE_URL = "https://api.coingecko.com/api/v3"
BTC_USD_ID = "bitcoin"
CURRENCIES = ["usd", "eur", "gbp"]

def get_price(symbol):
    url = f"{API_BASE_URL}/simple/price?ids={symbol}&vs_currencies={','.join(CURRENCIES)}"
    response = requests.get(url)
    data = response.json()
    return {currency: data[symbol.lower()].get(currency) for currency in CURRENCIES}

def handler(event, context):
    bitcoin_prices = get_price(BTC_USD_ID)
    result = {
        "status": "success",
        "bitcoin_prices": bitcoin_prices
    }
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(result)
    }

main = handler
