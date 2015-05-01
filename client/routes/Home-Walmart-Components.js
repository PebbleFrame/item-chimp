var React = require('react');

// Component that displays related results from Walmart API
var WalmartRelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.walmart.map(function(result, index) {
      return (
        <WalmartIndividualResultDisplay name={result.name} />
      );
    });
    return (
      <div className="related-results-display hidden">
        <h3>Walmart Related Results</h3>
        {resultNodes}
      </div>
    );
  }
});

// Component that displays individual results for Walmart
var WalmartIndividualResultDisplay = React.createClass({
  render: function() {
    return (
      <div className="individual-display">
        <h5 className="product-name">
          {this.props.name}
        </h5>
      </div>
    );
  }
});

module.exports.WalmartRelatedResultsDisplay = WalmartRelatedResultsDisplay;

module.exports.WalmartIndividualResultDisplay = WalmartIndividualResultDisplay;