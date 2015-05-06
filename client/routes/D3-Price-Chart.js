var React = require('react');
var d3PriceEngine = require('../scripts/d3PriceEngine');

module.exports = React.createClass({
  startEngine: function(width, height) {

    // Query will be displayed at the top of the D3 price chart
    var query = this.props.query;
    // This array will populate the D3 data
    var pricesArray = [];

    // Push the 10 walmart results (name and price) to pricesArray
    this.props.walmartRelatedResults.results.forEach(function(item) {
      var itemObject = {
        name: item.name,
        salePrice: item.salePrice,
        source: 'Walmart'
      };
      pricesArray.push(itemObject);
    });

    // Push the 10 best buy results (name and price) to pricesArray
    // Number of results for each store must be the same for the way the D3 price chart is currently set up
    this.props.bestbuyRelatedResults.results.forEach(function(item) {
      var itemObject = {
        name: item.name,
        salePrice: item.salePrice,
        source: 'Best Buy'
      };
      pricesArray.push(itemObject);
    });

    // Create the D3 price chart
    d3PriceEngine(pricesArray, query);

  },

  render: function() {
    return (
      <div className="d3-price-container">
      
        <div className="d3-price-chart-query">
        Results for <strong>{this.props.query}</strong>
        </div>

        <svg className="price-chart"></svg>

      </div>
    );
  }

});