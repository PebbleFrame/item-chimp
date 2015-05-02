var React = require('react');

var D3Chart = React.createClass({
  render: function() {
    return (
      <div className="d3-container">
        <svg className="chart"></svg>
      </div>
    );
  }
});

module.exports.D3Chart = D3Chart;