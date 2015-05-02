var React = require('react');
var d3Engine = require('../../public/d3_reviews.js')

var D3Chart = React.createClass({
  componentDidMount: function() {
    var el = this.getDOMNode();
    console.log(this.getDOMNode());
    d3Engine.create(el);
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