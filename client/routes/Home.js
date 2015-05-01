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

// Centralized display for all components
var DisplayBox = React.createClass({
  // Sets initial state properties to empty arrays to avoid undefined errors
  getInitialState: function() {
    return {
      amazon: {amazon: []},
      walmart: {walmart: []},
      bestbuy: {bestbuy: []},
      walmartReviews: {walmartReviews: []}     
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
        this.setState({
          walmart: data[0],
          amazon: data[1],
          bestbuy: data[2]
        });

        $('.query-form-container img').addClass('hidden');
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('general-query', status, err.toString());
      }.bind(this)
    });
  },
  handleWalmartReviewRequest: function(itemId) {
    $.ajax({
      url: 'get-walmart-reviews',
      dataType: 'json',
      type: 'POST',
      data: itemId,
      success: function(data) {
        $('.walmart-reviews-display').removeClass('hidden');

        console.log(data);
        this.setState({walmartReviews: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('get-walmart-reviews', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="displayBox">
        
        <SearchForm onQuerySubmit={this.handleQuerySubmit} />

        <D3Chart />
        <WalmartReviewsDisplay data={this.state.walmartReviews} />

        <AmazonRelatedResultsDisplay data={this.state.amazon} />
        <WalmartRelatedResultsDisplay 
          data={this.state.walmart}
          onWalmartReviewRequest={this.handleWalmartReviewRequest} />
        <BestbuyRelatedResultsDisplay data={this.state.bestbuy} />

      </div>
    );
  }
});

// Component for the query-submit form
var SearchForm = React.createClass({
  handleSubmit: function(e) {
    // Prevent page from reloading on submit
    e.preventDefault();

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

var D3Chart = React.createClass({
  render: function() {
    return (
      <div className="d3-container">
        <svg className="chart"></svg>
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