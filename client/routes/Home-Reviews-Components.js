var React = require('react');


var ReviewsDisplaySection = React.createClass({
  dismissColumn: function(name, site) {
    this.props.onDismissColumn(name, site);
  },

  render: function() {
    var reviewColumns = this.props.allReviews.reviewSets.map(function (set, index) {
      return (
        <ReviewsDisplay 
          key={'ReviewColumn'+index}
          source={set.source}
          data={set.Reviews}
          name={set.name}
          image={set.image}
          AverageRating={set.AverageRating}
          ReviewCount={set.ReviewCount}
          onDismissColumn={this.dismissColumn} />
        );
    }.bind(this));
    return (
      <div className="reviews-display-section">
        {reviewColumns}
      </div>
    );
  }
});

var ReviewsDisplay = React.createClass ({
  dismissColumn: function(name, site) {
    this.props.onDismissColumn(this.props.name, this.props.source);
  },

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
        <div className="reviews-display-header">
          <h4>{this.props.source} Reviews
            <button className="btn btn-default button-dismiss" onClick={this.dismissColumn}><span className="glyphicon glyphicon-remove"></span></button></h4>
          <div>for <strong>{this.props.name}</strong></div>
        </div>
        <div className="row">
          <div className="product-image-review"><img src={this.props.image} /></div>
          <div className="product-name-review">
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
        <div className="review-rating-display">
          <span className="upvotes"><strong>+{this.props.upVotes}</strong></span> | <span className="downvotes"><strong>-{this.props.downVotes}</strong></span>
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
        <div className="review-rating-display">
          <strong>Rating:</strong> {this.props.rating}
        </div>
      </div>
    );
  }
});

module.exports.ReviewsDisplaySection = ReviewsDisplaySection;