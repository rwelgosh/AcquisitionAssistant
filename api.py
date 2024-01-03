from flask import Flask, request
from yahooquery import Ticker
import yfinance as yahooFinance

app = Flask(__name__, static_folder='./build', static_url_path='/')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/route')
def predict():
    return {'val': "Hello There!"}

@app.route('/api/data', methods=["POST"])
def getData():
    acquirer = request.json['acquirer']
    acquired = request.json['acquired']

    dfprice_acquirer = Ticker(acquirer)

    incs = dfprice_acquirer.income_statement()
    incs.reset_index(inplace=True)
    incs_acquirer_js = incs.to_json()

    bs = dfprice_acquirer.balance_sheet()
    bs.reset_index(inplace=True)
    bs__acquirer_js = bs.to_json()

    cf = dfprice_acquirer.cash_flow()
    cf.reset_index(inplace=True)
    cf__acquirer_js = cf.to_json()

    acquirer_history = dfprice_acquirer.history()
    acquirer_history.reset_index(inplace=True)
    acquirer_history_js = acquirer_history.to_json()

    acquirer_beta = yahooFinance.Ticker(acquirer).info['beta']

    dfprice_acquired = Ticker(acquired)
    incs = dfprice_acquired.income_statement()
    incs.reset_index(inplace=True)
    incs_acquired_js = incs.to_json()

    bs = dfprice_acquired.balance_sheet()
    bs.reset_index(inplace=True)
    bs__acquired_js = bs.to_json()

    cf = dfprice_acquired.cash_flow()
    cf.reset_index(inplace=True)
    cf__acquired_js = cf.to_json()

    acquired_history = dfprice_acquired.history()
    acquired_history.reset_index(inplace=True)
    acquired_history_js = acquired_history.to_json()

    acquired_beta = yahooFinance.Ticker(acquired).info['beta']

    ten_year_treasury_rate = yahooFinance.Ticker("^TNX").info['open']

    return {"acquirer balance sheet" : bs__acquirer_js, "acquirer income statement" : incs_acquirer_js, 
            "acquirer cash flow" : cf__acquirer_js, "acquirer history" : acquirer_history_js,
            "acquirer beta" : acquirer_beta,
            "acquired balance sheet" : bs__acquired_js, "acquired income statement" : incs_acquired_js, 
            "acquired cash flow" : cf__acquired_js, "acquired history" : acquired_history_js,
            "acquired beta" : acquired_beta,
            "TYTR" : ten_year_treasury_rate,
            'success' : "YES"}

if __name__ == "__main__":
    app.run(debug=False)