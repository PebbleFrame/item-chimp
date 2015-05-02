var React = require('react');
var d3Engine = require('../../public/d3_reviews.js');

var D3Chart = React.createClass({
  startEngine: function() {
    var el = this.getDOMNode();
    d3Engine.create(el, this.props.walmartData.walmartReviews);
  },
  render: function() {
    return (
      <div className="d3-container hidden">
        <svg className="chart"></svg>
      </div>
    );
  }
});

module.exports.D3Chart = D3Chart;