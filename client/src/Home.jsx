import React, { useState, useEffect } from "react";
import Papa from "papaparse"; // Install it using `npm install papaparse`

const UninePayment = () => {
  const [stocks, setStocks] = useState([]);

  const fetchStocks = async () => {
    const type = document.getElementById("type").value;
    const risk = document.getElementById("risk").value;
    
    if (type === "students" && risk === "low") {
      try {
        const response = await fetch("https://raw.githubusercontent.com/smeet7913/SmartInvest-Basket/main/Midcap.csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const sortedStocks = result.data.sort((a, b) => a.Rank - b.Rank);
            setStocks(sortedStocks);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV:", error);
      }
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold">Unine</h1>
          <nav className="space-x-6">
            <a href="#" className="hover:text-green-400">Learn</a>
            <a href="#" className="hover:text-green-400">App</a>
            <a href="#" className="hover:text-green-400">Community</a>
            <a href="#" className="hover:text-green-400">Unine at Work</a>
          </nav>
          <div className="space-x-4">
            <button className="text-green-400 hover:text-white">Sign Up</button>
            <button className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400">
              Get a Demo
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="lg:flex lg:items-center py-10">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              More Payment Options<br />Better than Cash
            </h2>
            <p className="text-gray-400 mb-6">
              With Unine, you can access more than 240 million customers, as well as
              management tools, options, and payment methods.
            </p>
            <div className="flex justify-center lg:justify-start space-x-4">
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center">
                <img
                  src="https://img.icons8.com/color/48/apple-app-store--v1.png"
                  alt="App Store"
                  className="w-5 h-5 mr-2"
                />
                App Store
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center">
                <img
                  src="https://img.icons8.com/fluency/48/google-play.png"
                  alt="Google Play"
                  className="w-5 h-5 mr-2"
                />
                Google Play
              </button>
            </div>
            <p className="text-green-400 mt-4">Excellent 4.9 out of 5 ★★★★★</p>
          </div>
        </section>

        {/* Stock Basket Generation Section */}
        <section className="py-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Generate Your Stock Basket</h2>
            <p className="text-gray-500">
              Customize your investment basket based on your preferences and needs.
            </p>
          </div>
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="amount" className="block font-bold mb-2">Investment Amount</label>
                <input type="number" id="amount" name="amount" placeholder="Enter amount" className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg" />
              </div>
              <div>
                <label htmlFor="type" className="block font-bold mb-2">Type</label>
                <select id="type" name="type" className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg">
                  <option value="students">Students</option>
                  <option value="job">Job</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div>
                <label htmlFor="risk" className="block font-bold mb-2">Risk Capacity</label>
                <select id="risk" name="risk" className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button type="button" className="bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-400 w-full" onClick={fetchStocks}>
                Generate Basket
              </button>
            </form>
          </div>
        </section>
        <UnineStockTable stocks={stocks} />
      </div>
    </div>
  );
};

const UnineStockTable = ({ stocks }) => {
  return (
    <section className="py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Available Stocks</h2>
        <p className="text-gray-500">
          Here are the latest stock recommendations for your portfolio.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 text-white rounded-lg">
          <thead>
            <tr className="bg-green-500 text-black">
              <th className="px-4 py-2">Stock Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Sector</th>
              <th className="px-4 py-2">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length > 0 ? (
              stocks.map((stock, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="px-4 py-2">{stock["Stock Symbol"]}</td>
                  <td className="px-4 py-2">{stock["Current Price"]}</td>
                  <td className="px-4 py-2">{stock["Theme"]}</td> 
                  <td className="px-4 py-2">{stock["Expert Recommendation"]}</td> 


                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center">
                  No stocks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export { UnineStockTable, UninePayment };
export default UninePayment;
