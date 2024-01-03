import React from "react"
import './App.css';
import Calculate from "./Calculate"


function App() {
  const [data, setData] = React.useState(
    {"acquirer balance sheet" : "{}", "acquirer income statement" : "{}", 
    "acquirer cash flow" : "{}", "acquirer history" : "{}",
    "acquirer beta" : 0,
    "acquired balance sheet" : "{}", "acquired income statement" : "{}", 
    "acquired cash flow" : "{}", "acquired history" : "{}",
    "acquired beta" : 0,
    "TYTR" : 0,
    'success' : "NO"}
  )
  const [inputData, setInputData] = React.useState(
    {"acquirer" : "", "acquired" : "",
    "percentdebt" : "0.5", "percentequity" : "0.5",
    "aquisitionfees" : "0.5", "synergies" : "0.5",
    "marginaltaxrate" : "0.5", "effectivetaxrate" : "0.5", 
    "newsharesissued" : "0.5", "interestonaquisitiondebt" : "0.5",
    "render" : false
    }
  )

  // const [PD_val, setPD_val] = React.useState(1)

  function handleRequest(e) {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)

    const formJson = Object.fromEntries(formData.entries())
    console.log(formJson)

    setInputData({
      ...formJson,
      "render" : true
    })

    return fetch(`/api/data`,{
            'method':'POST',
             headers : {
            'Content-Type':'application/json'
      },
      body:JSON.stringify(formJson)
    })
    .then(response => response.json())
    .then(
      function(data) {
        console.log("acquirer Income Statement")
        console.log(JSON.parse(data["acquirer income statement"]))
        console.log("acquirer Balance Sheet")
        console.log(JSON.parse(data["acquirer balance sheet"]))
        console.log("acquirer Cash Flow")
        console.log(JSON.parse(data["acquirer cash flow"]))
        console.log("acquirer History")
        console.log(JSON.parse(data["acquirer history"]))
        console.log("acquirer Beta")
        console.log(data["acquirer beta"])
        console.log("acquired Income Statement")
        console.log(JSON.parse(data["acquired income statement"]))
        console.log("acquired Balance Sheet")
        console.log(JSON.parse(data["acquired balance sheet"]))
        console.log("acquired Cash Flow")
        console.log(JSON.parse(data["acquired cash flow"]))
        console.log("acquired History")
        console.log(JSON.parse(data["acquired history"]))
        console.log("acquired Beta")
        console.log(data["acquired beta"])
        console.log("TYTR")
        console.log(data["TYTR"])
        return setData({
          ...data,
          "success" : "YES"
        })
      }
    )
    .catch(error => console.log(error))

  }

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Aquisition Assistant</h1>
      </header>
      <section className="content">
        <div className="content-body">
          <form method='post' onSubmit={handleRequest} className="content-container">
            <h2>Input</h2>
            <div className="acquirer-container container">
              <input 
                className='app--acquirer'
                name='acquirer'
                type='text'
                placeholder='acquirer'
              />
            </div>

            <div className="acquired-container container">
              <input 
                className='app--acquired'
                name="acquired"
                type='text'
                placeholder='acquired'
              />
            </div>

            <div className="percent-debt-container container">
              <label>Precent Debt: </label>
              <input 
                className='app--percent-debt'
                name="percentdebt"
                // type='range'
                type="number"
                min='0'
                max='1'
                step='0.01'
                // onChange={setPD_val(3)}
              />
              <output id="value--percent-debt"></output>
            </div>

            <div className="percent-equity-container container">
              <label>Percent Equity: </label>
              <input 
                className='app--percent-equity'
                name="percentequity"
                // type='range'
                type="number"
                min='0'
                max='1'
                step='0.01'
              />
              <output id="value--percent-equity"></output>
            </div>

            <div className="aquisition-fees-container container">
              <label>Aquisition Fees: </label>
              <input 
                className='app--aquisition-fees'
                name="aquisitionfees"
                // type='range'
                type="number"
                min='0'
                max='1'
                step='0.01'
              />
              <output id="value--aquisition-fees"></output>
            </div>
            
            <div className="synergies-container container">
              <label>Synergies: </label>
              <input 
                className="app--synergies"
                name="synergies"
                // type='range'
                type="number"
                step='0.01'
                min="0.01"
                placeholder="1"
              />
            </div>

            <div className="marginal-tax-rate-container container">
              <label>Marginal Tax Rate: </label>
              <input
                className="app--marginal-tax-rate"
                name="marginaltaxrate"
                // type='range'
                type="number"
                min='0'
                max='1'
                step='0.01'
              />
              <output id="value--marginal-tax-rate"></output>
            </div>
            
            <div className="effective-tax-rate-container container">
              <label>Effective Tax Rate: </label>
              <input 
                className="app--effective-tax-rate"
                name="effectivetaxrate"
                // type='range'
                type="number"
                min='0'
                max='1'
                step='0.01'
              />
              <output id="value--effective-tax-rate"></output>
            </div>
          
            <div className="new-shares-issued-container container">
              <label>New Shares Issues: </label>
              <input 
                className="app--new-shares-issued"
                name='newsharesissued'
                type='number'
                step='0.01'
                min="0.01"
                placeholder="1"
              />
            </div>

            <div className="interest-on-aquisition-debt-container container">
              <label>Interest on Aquisition Debt: </label>
              <input 
                className="app--interest-on-aquisition-debt"
                name="interestonaquisitiondebt"
                // type='range'
                type="number"
                min="0"
                max="1"
                step='0.01'
              />
              <output id="value--interest-on-aquisition-debt"></output>
            </div>
            
            <div className="net-revenue-growth-rate-container container">
              <label>Net Revenue Growth Rate: </label>
              <input 
                className="app--net-revenue-growth-rate"
                name="netrevenuegrowthrate"
                // type='range'
                type="number"
                min="0"
                max="1"
                step='0.01'
              />
              <output id="value--net-revenue-growth-rate"></output>
            </div>
            
            <button className="button-64" type="submit"><span className="text"><p>Calculate</p></span></button>
          </form>

          <Calculate
            data={data}
            inputData={inputData}
          />
        </div>
      </section>
    </div>
  );
}

export default App;
