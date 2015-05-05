var React = require('react');
var d3Engine = require('../scripts/d3Engine.js');

var D3Chart = React.createClass({
  startEngine: function(width, height, products) {
    // expected structure of products:
    // [
    //  {
    //    name: 'Apple iPhone...etc.',
    //    source: 'Best Buy',
    //    reviews: this.props.bestbuyData.bestbuyReviews
    //  },
    //  {
    //    name: 'Apple iPhone...etc.',
    //    source: 'Walmart',
    //    reviews: this.props.walmartData.walmartReviews
    //  },
    // ]
    var el = this.getDOMNode();

    d3Engine.create(el, width, height, products);
  },
  render: function() {
    return (
        <div className="d3-container">
          <svg className="chart"></svg>
        </div>
    );
  }
});

module.exports.D3Chart = D3Chart;