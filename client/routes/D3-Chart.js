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

    // no way to get products array from Home.js right now
    // so here is a dummy data setup that just duplicates
    // the current item twice.
    if (this.props.walmartName) {
      var product = {
        name: this.props.walmartName,
        source: 'Walmart',
        reviews: this.props.walmartData.Reviews
      };
    } else if (this.props.bestbuyName) {
      var product = {
        name: this.props.bestbuyName,
        source: 'Best Buy',
        reviews: this.props.bestbuyData.Reviews
      };
    }
    var products = [product, product];

    d3Engine.create(el, width, height, products);
  },
  render: function() {
    return (
      <div className="d3-container">
        <hr />
        <svg className="chart"></svg>
        <hr />
      </div>
    );
  }
});

module.exports.D3Chart = D3Chart;