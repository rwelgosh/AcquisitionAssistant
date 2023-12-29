from flask import Flask, request
from yahooquery import Ticker
import yfinance as yahooFinance

app = Flask(__name__)

@app.route('/api/route')
def predict():
    return {'val': "Hello There!"}

@app.route('/api/data', methods=["POST"])
def getData():
    aquirer = request.json['aquirer']
    aquired = request.json['aquired']

    dfprice_aquirer = Ticker(aquirer)

    incs = dfprice_aquirer.income_statement()
    incs.reset_index(inplace=True)
    incs_aquirer_js = incs.to_json()

    bs = dfprice_aquirer.balance_sheet()
    bs.reset_index(inplace=True)
    bs__aquirer_js = bs.to_json()

    cf = dfprice_aquirer.cash_flow()
    cf.reset_index(inplace=True)
    cf__aquirer_js = cf.to_json()

    aquirer_history = dfprice_aquirer.history()
    aquirer_history.reset_index(inplace=True)
    aquirer_history_js = aquirer_history.to_json()

    aquirer_beta = yahooFinance.Ticker(aquirer).info['beta']

    dfprice_aquired = Ticker(aquired)
    incs = dfprice_aquired.income_statement()
    incs.reset_index(inplace=True)
    incs_aquired_js = incs.to_json()

    bs = dfprice_aquired.balance_sheet()
    bs.reset_index(inplace=True)
    bs__aquired_js = bs.to_json()

    cf = dfprice_aquired.cash_flow()
    cf.reset_index(inplace=True)
    cf__aquired_js = cf.to_json()

    aquired_history = dfprice_aquired.history()
    aquired_history.reset_index(inplace=True)
    aquired_history_js = aquired_history.to_json()

    aquired_beta = yahooFinance.Ticker(aquired).info['beta']

    ten_year_treasury_rate = yahooFinance.Ticker("^TNX").info['open']

    return {"aquirer balance sheet" : bs__aquirer_js, "aquirer income statement" : incs_aquirer_js, 
            "aquirer cash flow" : cf__aquirer_js, "aquirer history" : aquirer_history_js,
            "aquirer beta" : aquirer_beta,
            "aquired balance sheet" : bs__aquired_js, "aquired income statement" : incs_aquired_js, 
            "aquired cash flow" : cf__aquired_js, "aquired history" : aquired_history_js,
            "aquired beta" : aquired_beta,
            "TYTR" : ten_year_treasury_rate,
            'success' : "YES"}