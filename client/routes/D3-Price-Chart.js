var React = require('react');
var d3PriceEngine = require('../scripts/d3PriceEngine');

module.exports = React.createClass({
  startEngine: function(width, height) {
    console.log('engine reached!')
  },

  render: function() {
    return (
      <div className="d3-container">
        <hr />
        <svg className="price-chart"></svg>
        <hr />
      </div>
    );
  }

});