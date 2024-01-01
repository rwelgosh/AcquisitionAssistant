import React from "react"

export default function Calculate(props) {
    const data = props.data
    const inputData = props.inputData
    var output = <p></p>
    if (data["success"] === "YES" && inputData["render"]) {
        const aquirer_income_statement = JSON.parse(data["aquirer income statement"])
        const aquirer_balance_sheet = JSON.parse(data["aquirer balance sheet"])
        const aquirer_cash_flow = JSON.parse(data["aquirer cash flow"])
        const aquirer_history = JSON.parse(data["aquirer history"])
        const aquired_income_statement = JSON.parse(data["aquired income statement"])
        const aquired_balance_sheet = JSON.parse(data["aquired balance sheet"])
        const aquired_cash_flow = JSON.parse(data["aquired cash flow"])
        const aquired_history = JSON.parse(data["aquired history"])

        // Net Operating Profit After Tax
        var EBIT_CompanyB_values = aquired_income_statement["EBIT"]
        var EBIT_CompanyB = EBIT_CompanyB_values[4]
        var NOPAT = EBIT_CompanyB * (1-inputData['effectivetaxrate'])
        
        // Free Cash Flow Margin Average - 5 Years
        var FCFM_sum = 0

        var FCF_5yr = aquired_cash_flow["FreeCashFlow"]

        for(let i = 0; i < 5; i++) {
            // Free Cash Flow
            var FCF = FCF_5yr[i]

            // Average Ratio
            var netRevenue_CompanyB = aquired_income_statement["TotalRevenue"][i]
            var FCFM = FCF / netRevenue_CompanyB

            if (!isNaN(FCFM)) {
                FCFM_sum += FCFM
            }
        }
        // console.log(FCFM_sum)

        // Average Ratio
        var Avg_Ratio = FCFM_sum / 5

        // Projected Net Revenue
        let index = Object.keys(aquired_income_statement["TotalRevenue"]).length - 1
        var PNR = aquired_income_statement["TotalRevenue"][index] * (1+inputData['netrevenuegrowthrate'])

        // Project Free Cash Flow - 5 Year
        var PFCF_5Year = PNR * Avg_Ratio

        // Gross Profit Margins - 5 Years
        var GPM_array = []
        var GPM_sum = 0
        
        for (let i = 0; i < 5; i++) {
            // Gross Profit Margin
            var GPM = aquired_income_statement["GrossProfit"][i] / aquired_income_statement["TotalRevenue"][i]
            
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
        index = Object.keys(aquired_income_statement["SellingGeneralAndAdministration"]).length - 1
        var PSGnA = aquired_income_statement["SellingGeneralAndAdministration"][index] * (1+inputData['netrevenuegrowthrate'])

        // Projected Operating Income / EBIT
        var POI = PGP - PSGnA

        // Projected NOPAT
        var PNOPAT = POI * inputData['effectivetaxrate']

        // Synergies Post Tax
        var SPT = inputData['synergies'] - inputData['marginaltaxrate']

        // NOPAT Adjusted for Synergies
        var NOPAT_AFS = PNOPAT + SPT 

        // Aquisition Price Per Share 
        index = Object.keys(aquired_history['close']).length - 1
        var APPS = aquired_history['close'][index] * inputData['aquisitionfees']

        // Market Cap
        let index_1 = Object.keys(aquired_history['close']).length - 1
        let index_2 = Object.keys(aquired_income_statement['DilutedAverageShares']).length - 1
        var MC = aquired_income_statement['DilutedAverageShares'][index_2] * aquired_history['close'][index_1]

        // Aquisition Equity Value 
        index = Object.keys(aquired_income_statement['DilutedAverageShares']).length - 1
        var AEV = APPS * aquired_income_statement['DilutedAverageShares'][index]

        // Aquisition Enterprise Value
        index = Object.keys(aquired_balance_sheet['NetDebt']).length - 1
        var AquisitionEnterpriseValue = AEV + aquired_balance_sheet['NetDebt'][index]

        // Return On Invested Capital
        var ROIV = NOPAT_AFS / AquisitionEnterpriseValue

        let index_IE = Object.keys(aquired_income_statement['InterestExpense']).length - 1
        let index_TD = Object.keys(aquired_balance_sheet['TotalDebt']).length - 1
        var KD = aquired_income_statement['InterestExpense'][index_IE] / aquired_balance_sheet['TotalDebt'][index_TD]
        var KE = data['TYTR'] + (data['aquired beta'] * (0.1 - data['TYTR']))

        // Weighted Average Cost of Capital
        index = Object.keys(aquired_balance_sheet['StockholdersEquity']).length - 1
        var WACC = (
            (
                (aquired_balance_sheet['TotalDebt'][index_TD] / (aquired_balance_sheet['TotalDebt'][index_TD] + aquired_balance_sheet['StockholdersEquity'][index])) * KD * (1-inputData['effectivetaxrate'])
            ) 
            + 
            (
                (aquired_balance_sheet['TotalDebt'][index_TD] / (aquired_balance_sheet['TotalDebt'][index_TD] + aquired_balance_sheet['StockholdersEquity'][index])) * KE
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