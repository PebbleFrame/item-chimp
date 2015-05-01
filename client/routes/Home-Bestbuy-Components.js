var React = require('react');

// Component that displays related results from Best Buy API
var BestbuyRelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.bestbuy.map(function(result, index) {
      return (
        <BestbuyIndividualResultDisplay name={result.name} />
      );
    });
    return (
      <div className="related-results-display hidden">
        <h3>Best Buy Related Results</h3>
        {resultNodes}
      </div>
    );
  }
});

// Component that displays individual results for Best Buy
var BestbuyIndividualResultDisplay = React.createClass({
  render: function() {
    return (
      <div className="bestbuy-individual-display">
        <h4 className="product-name">
          {this.props.name}
        </h4>
      </div>
    );
  }
});

module.exports.BestbuyRelatedResultsDisplay = BestbuyRelatedResultsDisplay;

module.exports.BestbuyIndividualResultDisplay = BestbuyIndividualResultDisplay;