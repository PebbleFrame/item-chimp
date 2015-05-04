var React = require('react');
var d3PriceEngine = require('../scripts/d3PriceEngine');

module.exports = React.createClass({
  startEngine: function(width, height) {

    var el = this.getDOMNode();

    var prices = [];

    this.props.walmartRelatedResults.walmart.forEach(function(item) {
      var itemOrganized = {
        name: item.name,
        price: item.salePrice,
        source: 'Walmart'
      };
    });

    d3PriceEngine.create(el, width, height, prices);

  },

  render: function() {
    return (
      <div className="d3-price-container">
        <hr />
        <svg className="price-chart"></svg>
        <hr />
      </div>
    );
  }

});