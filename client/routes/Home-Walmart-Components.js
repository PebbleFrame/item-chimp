var React = require('react');

// Component that displays related results from Walmart API
var WalmartRelatedResultsDisplay = React.createClass({
  handleReviewRequest: function(itemId, name, image) {
    this.props.onReviewRequest(itemId, name, image);
  },
  render: function() {
    var resultNodes = this.props.data.results.map(function(result, index) {

      result.shortDescription = result.shortDescription || '';

      return (
        <WalmartIndividualResultDisplay 
          key={'walmartResult' + index}
          name={result.name} 
          salePrice={result.salePrice}
          upc={result.upc} 
          shortDescription={result.shortDescription}
          thumbnailImage={result.thumbnailImage}
          customerRating={result.customerRating}
          numReviews={result.numReviews}
          customerRatingImage={result.customerRatingImage}
          itemId={result.itemId} 
          onReviewRequest={this.handleReviewRequest} />
      );
    }.bind(this));
    return (
      <div className="related-results-display">
        <h3>Walmart Related Results</h3>
        {resultNodes}
      </div>
    );
  }
});

// Component that displays individual results for Walmart
var WalmartIndividualResultDisplay = React.createClass({
  handleReviewRequest: function() {
    $('.walmart-reviews-display').removeClass('hidden');
    this.props.onReviewRequest({itemId: this.props.itemId}, this.props.name, this.props.thumbnailImage);
  },  
  render: function() {
    return (
      <div className="individual-display" onClick={this.handleReviewRequest}>
        <h5 className="product-name">
          {this.props.name}
        </h5>
        <img src={this.props.thumbnailImage} />
        <div>
          ${this.props.salePrice}
        </div>
        <div>
          UPC: {this.props.upc}
        </div>
        <div>
          Description: {this.props.description}
        </div>
        <div>
          Rating: {this.props.customerRating}
        </div>
        <div>
          {this.props.numReviews} reviews
        </div>
        <img src={this.props.customerRatingImage} />
      </div>
    );
  }
});

var ReviewsDisplay = React.createClass ({
  render: function() {
    var resultNodes;

    if (this.props.source === 'Walmart') {
      console.log('Walmart results');
      resultNodes = this.props.data.map(function(result, index) {
        return (
          <WalmartIndividualReviewDisplay
            key={'walmartReview' + index}
            title={result.title}
            overallRating={result.overallRating}
            reviewer={result.reviewer}
            reviewText={result.reviewText}
            upVotes={result.upVotes}
            downVotes={result.downVotes} />
        );
      });
    } else if (this.props.source === 'Best Buy') {
      console.log('BB results');
      resultNodes = this.props.data.map(function(result, index) {
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
    }

    return (
      <div className="walmart-reviews-display">
          <h4>{this.props.source} Reviews</h4>
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

var WalmartReviewsDisplay = React.createClass ({
  render: function() {
    var resultNodes = this.props.data.Reviews.map(function(result, index) {
      return (
        <WalmartIndividualReviewDisplay
          key={'walmartReview' + index}
          title={result.title}
          overallRating={result.overallRating}
          reviewer={result.reviewer}
          reviewText={result.reviewText}
          upVotes={result.upVotes}
          downVotes={result.downVotes} />
      );
    });

    return (
      <div className="walmart-reviews-display hidden">
          <h4>Walmart Reviews</h4>
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

var WalmartIndividualReviewDisplay = React.createClass({
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
          <strong>Review:</strong> {this.props.reviewText}
        </div>
        <div>
          <span className="upvotes">+{this.props.upVotes}</span> | <span className="downvotes">-{this.props.downVotes}</span>
        </div>
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

module.exports.ReviewsDisplay = ReviewsDisplay;

module.exports.WalmartRelatedResultsDisplay = WalmartRelatedResultsDisplay;

module.exports.WalmartIndividualResultDisplay = WalmartIndividualResultDisplay;

module.exports.WalmartReviewsDisplay = WalmartReviewsDisplay;
