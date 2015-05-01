var React = require('react');

// Component that displays related results from Best Buy API
var BestbuyRelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.bestbuy.map(function(result, index) {
      
      result.shortDescription = result.shortDescription || 'n/a';
      result.customerReviewAverage = result.customerReviewAverage || 'n/a';
      result.customerReviewCount = result.customerReviewCount || 'No';      

      return (
        <BestbuyIndividualResultDisplay 
          name={result.name}
          salePrice={result.salePrice}
          upc={result.upc}
          customerReviewAverage={result.customerReviewAverage}
          customerReviewCount={result.customerReviewCount}
          shortDescription={result.shortDescription}
          image={result.image} />
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
      <div className="individual-display">
        <h5 className="product-name">
          {this.props.name}
        </h5>
        <img src={this.props.image} />
        <div>
          ${this.props.salePrice}
        </div>
        <div>
          UPC: ${this.props.upc}
        </div>
        <div>
          Description: {this.props.shortDescription}
        </div>
        <div>
          Rating: {this.props.customerReviewAverage}
        </div>
        <div>
          {this.props.customerReviewCount} reviews
        </div>
      </div>
    );
  }
});

module.exports.BestbuyRelatedResultsDisplay = BestbuyRelatedResultsDisplay;

module.exports.BestbuyIndividualResultDisplay = BestbuyIndividualResultDisplay;