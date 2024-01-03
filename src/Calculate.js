import React from "react"

export default function Calculate(props) {
    const data = props.data
    const inputData = props.inputData
    var output = <p></p>
    if (data["success"] === "YES" && inputData["render"]) {
        const acquirer_income_statement = JSON.parse(data["acquirer income statement"])
        const acquirer_balance_sheet = JSON.parse(data["acquirer balance sheet"])
        const acquirer_cash_flow = JSON.parse(data["acquirer cash flow"])
        const acquirer_history = JSON.parse(data["acquirer history"])
        const acquired_income_statement = JSON.parse(data["acquired income statement"])
        const acquired_balance_sheet = JSON.parse(data["acquired balance sheet"])
        const acquired_cash_flow = JSON.parse(data["acquired cash flow"])
        const acquired_history = JSON.parse(data["acquired history"])

        // Net Operating Profit After Tax
        var EBIT_CompanyB_values = acquired_income_statement["EBIT"]
        var EBIT_CompanyB = EBIT_CompanyB_values[4]
        var NOPAT = EBIT_CompanyB * (1-inputData['effectivetaxrate'])
        
        // Free Cash Flow Margin Average - 5 Years
        var FCFM_sum = 0

        var FCF_5yr = acquired_cash_flow["FreeCashFlow"]

        for(let i = 0; i < 5; i++) {
            // Free Cash Flow
            var FCF = FCF_5yr[i]

            // Average Ratio
            var netRevenue_CompanyB = acquired_income_statement["TotalRevenue"][i]
            var FCFM = FCF / netRevenue_CompanyB

            if (!isNaN(FCFM)) {
                FCFM_sum += FCFM
            }
        }
        // console.log(FCFM_sum)

        // Average Ratio
        var Avg_Ratio = FCFM_sum / 5

        // Projected Net Revenue
        let index = Object.keys(acquired_income_statement["TotalRevenue"]).length - 1
        var PNR = acquired_income_statement["TotalRevenue"][index] * (1+inputData['netrevenuegrowthrate'])

        // Project Free Cash Flow - 5 Year
        var PFCF_5Year = PNR * Avg_Ratio

        // Gross Profit Margins - 5 Years
        var GPM_array = []
        var GPM_sum = 0
        
        for (let i = 0; i < 5; i++) {
            // Gross Profit Margin
            var GPM = acquired_income_statement["GrossProfit"][i] / acquired_income_statement["TotalRevenue"][i]
            
            if (!isNaN(GPM)) {
                GPM_sum += GPM
                GPM_array.push(GPM)
            }
        }

        // Average Gross Profit Margin
        var Avg_GPM = GPM_sum / 5

        // Projected Cost of Goods Sold
        var PCoGS = (1-Avg_GPM) * PNR

        // Projected Gross Profit
        var PGP = PNR - PCoGS

        // Projected Selling General and Administrative
        index = Object.keys(acquired_income_statement["SellingGeneralAndAdministration"]).length - 1
        var PSGnA = acquired_income_statement["SellingGeneralAndAdministration"][index] * (1+inputData['netrevenuegrowthrate'])

        // Projected Operating Income / EBIT
        var POI = PGP - PSGnA

        // Projected NOPAT
        var PNOPAT = POI * inputData['effectivetaxrate']

        // Synergies Post Tax
        var SPT = inputData['synergies'] - inputData['marginaltaxrate']

        // NOPAT Adjusted for Synergies
        var NOPAT_AFS = PNOPAT + SPT 

        // Aquisition Price Per Share 
        index = Object.keys(acquired_history['close']).length - 1
        var APPS = acquired_history['close'][index] * inputData['aquisitionfees']

        // Market Cap
        let index_1 = Object.keys(acquired_history['close']).length - 1
        let index_2 = Object.keys(acquired_income_statement['DilutedAverageShares']).length - 1
        var MC = acquired_income_statement['DilutedAverageShares'][index_2] * acquired_history['close'][index_1]

        // Aquisition Equity Value 
        index = Object.keys(acquired_income_statement['DilutedAverageShares']).length - 1
        var AEV = APPS * acquired_income_statement['DilutedAverageShares'][index]

        // Aquisition Enterprise Value
        index = Object.keys(acquired_balance_sheet['NetDebt']).length - 1
        var AquisitionEnterpriseValue = AEV + acquired_balance_sheet['NetDebt'][index]

        // Return On Invested Capital
        var ROIV = NOPAT_AFS / AquisitionEnterpriseValue

        let index_IE = Object.keys(acquired_income_statement['InterestExpense']).length - 1
        let index_TD = Object.keys(acquired_balance_sheet['TotalDebt']).length - 1
        var KD = acquired_income_statement['InterestExpense'][index_IE] / acquired_balance_sheet['TotalDebt'][index_TD]
        var KE = data['TYTR'] + (data['acquired beta'] * (0.1 - data['TYTR']))

        // Weighted Average Cost of Capital
        index = Object.keys(acquired_balance_sheet['StockholdersEquity']).length - 1
        var WACC = (
            (
                (acquired_balance_sheet['TotalDebt'][index_TD] / (acquired_balance_sheet['TotalDebt'][index_TD] + acquired_balance_sheet['StockholdersEquity'][index])) * KD * (1-inputData['effectivetaxrate'])
            ) 
            + 
            (
                (acquired_balance_sheet['TotalDebt'][index_TD] / (acquired_balance_sheet['TotalDebt'][index_TD] + acquired_balance_sheet['StockholdersEquity'][index])) * KE
            )
        )

        output = (
            <div>
                <div>
                    <p><b>Average Ratio: </b></p>
                    <p>{Avg_Ratio}</p>
                </div>
                <div>
                    <p><b>Projected Net Revenue: </b></p>
                    <p>{PNR}</p>
                </div>
                <div>
                    <p><b>Project Free Cash Flow - 5 Year (NOT USED):</b></p>
                    <p>{PFCF_5Year}</p>
                </div>
                <div>
                    <p><b>Gross Profit Margins - 5 Years</b></p>
                    <p>{GPM_array[0]}, {GPM_array[1]}, {GPM_array[2]}, {GPM_array[3]}, {GPM_array[4]}</p>
                </div>
                <div>
                    <p><b>Average Gross Profit Margin: </b></p>
                    <p>{Avg_GPM}</p>
                </div>
                <div>
                    <p><b>Projected Cost of Goods Sold: </b></p>
                    <p>{PCoGS}</p>
                </div>
                <div>
                    <p><b>Projected Gross Profit: </b></p>
                    <p>{PGP}</p>
                </div>
                <div>
                    <p><b>Projected Selling General and Administrative: </b></p>
                    <p>{PSGnA}</p>
                </div>
                <div>
                    <p><b>Projected Operating Income / EBIT: </b></p>
                    <p>{POI}</p>
                </div>
                <div>
                    <p><b>Projected NOPAT:</b></p>
                    <p>{PNOPAT}</p>
                </div>
                <div>
                    <p><b>Synergies Post Tax: </b></p>
                    <p>{SPT}</p>
                </div>
                <div>
                    <p><b>NOPAT Adjusted for Synergies: </b></p>
                    <p>{NOPAT_AFS}</p>
                </div>
                <div>
                    <p><b>Aquisition Price Per Share: </b></p>
                    <p>{APPS}</p>
                </div>
                <div>
                    <p><b>Aquisition Equity Value: </b></p>
                    <p>{AEV}</p>
                </div>
                <div>
                    <p><b>Aquisition Enterprise Value: </b></p>
                    <p>{AquisitionEnterpriseValue}</p>
                </div>
                <div>
                    <p><b>Return On Invested Capital: </b></p>
                    <p>{ROIV}</p>
                </div>
                <div>
                    <p><b>Weighted Average Cost of Capital: </b></p>
                    <p>{WACC}</p>
                </div>
            </div>
            
        )
        if (ROIV < WACC) {
            // Deal Not Advised
            output = (
                <div>
                    {output}
                    <h2>Output - Deal Not Advised</h2>
                </div>
            )
        } else {
            // Deal Advised
            output = (
                <div>
                    {output}
                    <h2>Output - Deal Advised</h2>
                </div>
            )
        }
    }

    return (
        <div className="content-container">
            {output}
        </div>
    )
}