var React = require('react');

// Component that displays related results from Best Buy API
var BestbuyRelatedResultsDisplay = React.createClass({
  handleBestbuyReviewRequest: function(sku, name, image) {
    this.props.onBestbuyReviewRequest(sku, name, image);
  },
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
          image={result.image}
          sku={result.sku}
          onBestbuyReviewRequest={this.handleBestbuyReviewRequest} />
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
  handleBestbuyReviewRequest: function() {
    $('.walmart-reviews-display').removeClass('hidden');

    this.props.onBestbuyReviewRequest({sku: this.props.sku}, this.props.name, this.props.image);
  },
  render: function() {
    return (
      <div className="individual-display" onClick={this.handleBestbuyReviewRequest}>
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
    var resultNodes = this.props.data.bestbuyReviews.map(function(result, index) {
      console.log(result);
      return (
        <BestbuyIndividualReviewDisplay
          title={result.title}
          reviewer={result.reviewer}
          comment={result.comment}
          rating={result.rating} 
          sku={result.sku} />
      );
    });

    return (
      <div className="bestbuy-reviews-display">
        <h4>Best Buy Reviews</h4>
        <h4>{this.props.name}</h4>
        <img src={this.props.image} />
        {resultNodes}
      </div>
    );
  }
});

var BestbuyIndividualReviewDisplay = React.createClass({
  render: function() {
    return (
      <div>
        <h5>
          {this.props.title}
        </h5>
        <div>
          Reviewer: {this.props.reviewer}
        </div>
        <div>
          Review: {this.props.comment}
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