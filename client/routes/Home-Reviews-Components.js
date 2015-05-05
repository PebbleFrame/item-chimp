var React = require('react');

var ReviewsDisplay = React.createClass ({
  render: function() {
    var resultNodes;

    if (this.props.source === 'Walmart') {
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
      resultNodes = this.props.data.map(function(result, index) {
        return (
          <BestbuyIndividualReviewDisplay
            key={'bestbuyResult' + index}
            title={result.title}
            reviewer={result.reviewer[0].name}
            comment={result.comment}
            rating={result.rating} 
            sku={result.sku} />
        );
      });
    }

    return (
      <div className="reviews-display">
          <h4>{this.props.source} Reviews</h4>
        <div className="row">
          <div className="product-image-review"><img src={this.props.image} /></div>
          <div className="product-name-review">
            <div><strong>Product: </strong>{this.props.name}</div>
            <div><strong>Average Rating: </strong>{this.props.AverageRating}</div>
            <div><strong>Total Reviews: </strong>{this.props.ReviewCount}</div>
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

module.exports.WalmartIndividualReviewDisplay = WalmartIndividualReviewDisplay;

module.exports.BestbuyIndividualReviewDisplay = BestbuyIndividualReviewDisplay;