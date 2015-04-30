var React = require('react');

// Component that displays related results from Amazon API
var AmazonRelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.amazon.map(function(result, index) {
      console.log(result);
      var attributes = result.Items.Item.ItemAttributes;
      return (
        <AmazonIndividualResultDisplay name={attributes.Title} />
      );
    });
    return (
      <div className="related-results-display hidden">
        <h3>Amazon Related Results</h3>
        {resultNodes}
      </div>
    );
  }
});

// Component that displays individual results for Amazon
var AmazonIndividualResultDisplay = React.createClass({
  render: function() {
    return (
      <div className="amazon-individual-display">
        <h4 className="product-name">
          {this.props.name}
        </h4>
      </div>
    );
  }
});

module.exports.AmazonRelatedResultsDisplay = AmazonRelatedResultsDisplay;

module.exports.AmazonIndividualResultDisplay = AmazonIndividualResultDisplay;