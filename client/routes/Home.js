var React = require('react');

var WalmartComponents = require('./Home-Walmart-Components');
var WalmartRelatedResultsDisplay = WalmartComponents.WalmartRelatedResultsDisplay;
var WalmartIndividualResultDisplay = WalmartComponents.WalmartIndividualResultDisplay;
var WalmartReviewsDisplay = WalmartComponents.WalmartReviewsDisplay;

var AmazonComponents = require('./Home-Amazon-Components');
var AmazonRelatedResultsDisplay = AmazonComponents.AmazonRelatedResultsDisplay;
var AmazonIndividualResultDisplay = AmazonComponents.AmazonIndividualResultDisplay;

var BestbuyComponents = require('./Home-Bestbuy-Components');
var BestbuyRelatedResultsDisplay = BestbuyComponents.BestbuyRelatedResultsDisplay;
var BestbuyIndividualResultDisplay = BestbuyComponents.BestbuyIndividualResultDisplay;
var BestbuyReviewsDisplay = BestbuyComponents.BestbuyReviewsDisplay;

var D3Components = require('./D3-Chart.js');
var D3Chart = D3Components.D3Chart;

// Centralized display for all components on the Home page
var DisplayBox = React.createClass({
  // Sets initial state properties to empty arrays to avoid undefined errors
  getInitialState: function() {
    return {
      // We set the initial state to the format {'API name': [Array of results]}
      // to help organize the results we get back from the server, since the
      // general-query request returns results from three different APIs
      amazon: {amazon: []},
      walmart: {walmart: []},
      bestbuy: {bestbuy: []},
      walmartReviews: {walmartReviews: []},
      bestbuyReviews: {bestbuyReviews: []}  
    };
  },

  // Called when user submits a query
  handleQuerySubmit: function(query) {
    $.ajax({
      url: 'general-query',
      dataType: 'json',
      type: 'POST',
      data: query,
      success: function(data) {
        // Show Related Results after user submits query
        $('.related-results-display').removeClass('hidden');

        // Set the state to contain data for each separate API
        // data[0] --> {walmart: [Array of Walmart results]}
        // data[1] --> {amazon: [Array of Amazon results]}
        // data[2] --> {bestbuy: [Array of Best Buy results]}
        this.setState({
          walmart: data[0],
          amazon: data[1],
          bestbuy: data[2]
        });

        // Hide the spinner after all API requests have been completed
        $('.query-form-container img').addClass('hidden');

      }.bind(this),
      error: function(xhr, status, err) {
        console.error('general-query', status, err.toString());
      }.bind(this)
    });
  },

  // Final handler for Walmart review request
  // This call is the result of calls bubbling up from the individual Walmart results
  handleWalmartReviewRequest: function(itemId, name, image) {

    // Sets the product name and image for the product clicked on (Revews Display)
    // These are passed up from WalmartIndividualResultDisplay
    this.setState({
      walmartReviewedItemName: name,
      walmartReviewedItemImage: image
    });

    // Makes a specific API call to get reviews for the product clicked on
    $.ajax({
      url: 'get-walmart-reviews',
      dataType: 'json',
      type: 'POST',
      // itemId is used to make a request for Walmart reviews
      data: itemId,
      success: function(data) {
        // Remove the general results display to display reviews
        $('.related-results-display-container').fadeOut();

        // Display the reviews-display only after an item is clicked on
        $('.reviews-display-container').removeClass('hidden');
        $('.d3-container').removeClass('hidden');

        // Get the reviews array from the response data
        var walmartReviewsFromData = JSON.parse(data[0].walmartReviews).reviews;

        // Set the walmartReviews state in the same format as the 'general-query' states
        this.setState({
          walmartReviews: {walmartReviews: walmartReviewsFromData}
        });
        
        this.refs.d3chart.startEngine();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('get-walmart-reviews', status, err.toString());
      }.bind(this)
    });
  },

  // Final handler for Best Buy review request
  // This call is the result of calls bubbling up from the individual Best Buy results
  handleBestbuyReviewRequest: function(sku, name, image) {

    // Final handler for Walmart review request
    // This call is the result of calls bubbling up from the individual Walmart results
    this.setState({
      bestbuyReviewedItemName: name,
      bestbuyReviewedItemImage: image
    });

    // Makes a specific API call to get reviews for the product clicked on
    $.ajax({
      url: 'get-bestbuy-reviews',
      dataType: 'json',
      type: 'POST',
      // sku is used to make a request for Best Buy reviews
      data: sku,
      success: function(data) {
        // Display the reviews-display only after an item is clicked on
        $('.bestbuy-reviews-display').removeClass('hidden');

        // Get the reviews array from the response data
        var bestbuyReviewsFromData = JSON.parse(data[0].bestbuyReviews).reviews;

        // Set the walmartReviews state in the same format as the 'general-query' states
        this.setState({
          bestbuyReviews: {bestbuyReviews: bestbuyReviewsFromData}
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('get-bestbuy-reviews', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    // Attributes are "props" which can be accessed by the component
    // Many "props" are set as the "state", which is set based on data received from API calls
    return (
      <div className="displayBox">
        
        <SearchForm onQuerySubmit={this.handleQuerySubmit} />

        <D3Chart
          walmartData={this.state.walmartReviews}
          walmartName={this.state.walmartReviewedItemName}
          bestbuyData={this.state.bestbuyReviews}
          bestbuyName={this.state.bestbuyReviewedItemName}
          ref="d3chart" />

        <div className="reviews-display-container hidden">

          <ReviewsDisplaySection
            walmartReviews={this.state.walmartReviews}
            walmartReviewedItemName={this.state.walmartReviewedItemName}
            walmartReviewedItemImage={this.state.walmartReviewedItemImage}

            bestbuyReviews={this.state.bestbuyReviews}
            bestbuyReviewedItemName={this.state.bestbuyReviewedItemName}
            bestbuyReviewedItemImage={this.state.bestbuyReviewedItemImage} />

            <ChooseAnotherProductSection
              walmartData={this.state.walmart}
              bestbuyData={this.state.bestbuy} />

        </div>

        <div className="related-results-display-container">
          <WalmartRelatedResultsDisplay 
            data={this.state.walmart}
            onWalmartReviewRequest={this.handleWalmartReviewRequest} />
          <BestbuyRelatedResultsDisplay 
            data={this.state.bestbuy}
            onBestbuyReviewRequest={this.handleBestbuyReviewRequest} />
          <AmazonRelatedResultsDisplay data={this.state.amazon} />
        </div>

      </div>
    );
  }
});

// Component for the query-submit form (general, not reviews)
var SearchForm = React.createClass({
  handleSubmit: function(e) {
    // Prevent page from reloading on submit
    e.preventDefault();

    // Show the spinner when a query is submitted
    $('.query-form-container img').removeClass('hidden');

    // Grab query content from "ref" in input box
    var query = React.findDOMNode(this.refs.query).value.trim();

    // Passes the query to the central DisplayBox component
    // DisplayBox will make AJAX call and display results
    this.props.onQuerySubmit({query: query});

    // Clear the input box after submit
    React.findDOMNode(this.refs.query).value = '';
  },
  render: function() {
    return (
      <div className="query-form-container">
        <h4 className="query-form-title">ShopChimp, at your service.</h4>

        <form className="query-form" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Enter a product" className="form-control" ref="query" />

          <center><button className="btn btn-primary">Submit</button></center>
        </form>
        <img src="images/spiffygif_46x46.gif" className="hidden" />
      </div>
    );
  }
});

var ReviewsDisplaySection = React.createClass({
  render: function() {
    return (
      <div className="reviews-display-section">
        <WalmartReviewsDisplay 
          data={this.props.walmartReviews}
          name={this.props.walmartReviewedItemName}
          image={this.props.walmartReviewedItemImage} />
        <BestbuyReviewsDisplay 
          data={this.props.bestbuyReviews}
          name={this.props.bestbuyReviewedItemName}
          image={this.props.bestbuyReviewedItemImage} />
      </div>
    );
  }
});

var ChooseAnotherProductSection = React.createClass({
  render: function() {
    var resultNodes = this.props.walmartData.walmart.map(function(result, index) {
      return (
        <div className="choose-another-product-individual-display">
          <img src={result.thumbnailImage} />
          <strong>Product: </strong>{result.name}
        </div>
      );
    });
    return (
      <div className="choose-another-product-section">
        <h5>Choose another product to compare</h5>
        {resultNodes}
      </div>
    );
  }
});

// Home page container for the DisplayBox component
var Home = React.createClass({
	render: function() {
		return (
      <div className="home-page">
        <DisplayBox />
      </div>
		);
	}
});

module.exports = Home;