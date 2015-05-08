var React = require('react');

// Component that displays related results from Best Buy API
var BestbuyRelatedResultsDisplay = React.createClass({
  handleReviewRequest: function(sku, name, image, reviewAverage, reviewCount) {
    this.props.onReviewRequest(sku, name, image, reviewAverage, reviewCount);
  },
  render: function() {
    var resultNodes = this.props.data.results.map(function(result, index) {
      
      result.shortDescription = result.shortDescription || 'n/a';
      result.customerReviewAverage = result.customerReviewAverage || 'n/a';
      result.customerReviewCount = result.customerReviewCount || 'No';      

      return (
        <BestbuyIndividualResultDisplay 
          key={'bestbuyReview' + index}
          name={result.name}
          salePrice={result.salePrice}
          upc={result.upc}
          customerReviewAverage={result.customerReviewAverage}
          customerReviewCount={result.customerReviewCount}
          shortDescription={result.shortDescription}
          image={result.image}
          sku={result.sku}
          onReviewRequest={this.handleReviewRequest} />
      );
    }.bind(this));
    return (
      <div className="related-results-display">
        <h3>Best Buy Related Results</h3>
        {resultNodes}
      </div>
    );
  }
});

// Component that displays individual results for Best Buy
var BestbuyIndividualResultDisplay = React.createClass({
  handleReviewRequest: function() {
    $('.bestbuy-reviews-display').removeClass('hidden');
    this.props.onReviewRequest({sku: this.props.sku}, 'Best Buy', this.props.name, this.props.image,
      this.props.customerReviewAverage, this.props.customerReviewCount);
  },
  render: function() {
    return (
      <div className="individual-display" onClick={this.handleReviewRequest}>
        <h5 className="product-name">
          {this.props.name}
        </h5>
        <img src={this.props.image} />
        <div className="sale-price-display">
          ${this.props.salePrice}
        </div>
        <div className="description-display">
          <strong>Description:</strong> {this.props.shortDescription}
        </div>
        <div>
          <strong>Rating:</strong> {this.props.customerReviewAverage} ({this.props.customerReviewCount} reviews)
        </div>
      </div>
    );
  }
});


module.exports.BestbuyRelatedResultsDisplay = BestbuyRelatedResultsDisplay;