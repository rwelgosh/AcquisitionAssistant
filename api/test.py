from yahooquery import Ticker
import yfinance as yahooFinance

ten_year_treasury_rate = yahooFinance.Ticker("^TNX").info
print(ten_year_treasury_rate['open'])
