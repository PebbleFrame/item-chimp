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
        <div>
          ${this.props.salePrice}
        </div>
        <div>
          UPC: {this.props.upc}
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

var BestbuyReviewsDisplay = React.createClass ({
  render: function() {
    var resultNodes = this.props.data.Reviews.map(function(result, index) {
      return (
        <BestbuyIndividualReviewDisplay
          key={'bestbuyResult' + index}
          title={result.title}
          reviewer={result.reviewer}
          comment={result.comment}
          rating={result.rating} 
          sku={result.sku} />
      );
    });

    return (
      <div className="bestbuy-reviews-display hidden">
        <h4>Best Buy Reviews</h4>
        <div className="row">
          <div className="product-image-review"><img src={this.props.image} /></div>
          <div className="product-name-review">
            <div><strong>Product: </strong>{this.props.name}</div>
            <div><strong>Average Rating: </strong>{this.props.data.AverageRating}</div>
            <div><strong>Total Reviews: </strong>{this.props.data.ReviewCount}</div>
          </div>
        </div>
        <hr />
        {resultNodes}
      </div>
    );
  }
});

var BestbuyIndividualReviewDisplay = React.createClass({
  render: function() {
    return (
      <div className="individual-review-display">
        <h5>
          {this.props.title}
        </h5>
        <div>
          <strong>Reviewer:</strong> {this.props.reviewer}
        </div>
        <div>
          <strong>Review:</strong> {this.props.comment}
        </div>
        <div>
          Rating: {this.props.rating}
        </div>
      </div>
    );
  }
});

module.exports.BestbuyRelatedResultsDisplay = BestbuyRelatedResultsDisplay;

module.exports.BestbuyIndividualResultDisplay = BestbuyIndividualResultDisplay;

module.exports.BestbuyReviewsDisplay = BestbuyReviewsDisplay;