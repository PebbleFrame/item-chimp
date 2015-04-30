React = require('react');

// Centralized display for all components
var DisplayBox = React.createClass({
  // Sets initial state properties to empty arrays to avoid undefined errors
  getInitialState: function() {
    return {
      amazon: {amazon: []},
      walmart: {walmart: []},
      bestbuy: {bestBuy: []},      
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
          amazon: data[0],
          walmart: data[1],
          bestbuy: data[2]
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('general-query', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="displayBox">
        
        <SearchForm onQuerySubmit={this.handleQuerySubmit} />

        <AmazonRelatedResultsDisplay data={this.state.amazon} />
        <WalmartRelatedResultsDisplay data={this.state.walmart} />
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
      </div>
    );
  }
});

// Component that displays related results from Amazon API
var AmazonRelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.amazon.map(function(result, index) {
      return (
        result
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

// Component that displays related results from Walmart API
var WalmartRelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.walmart.map(function(result, index) {
      return (
        <WalmartIndividualResultDisplay name={result.name} />
      );
    });
    return (
      <div className="related-results-display hidden">
        <h3>Walmart Related Results</h3>
        {resultNodes}
      </div>
    );
  }
});

var WalmartIndividualResultDisplay = React.createClass({
  render: function() {
    return (
      <div className="walmart-individual-display">
        <h3 className="product-name">this.props.name</h3>
      </div>
    );
  }
});

// Component that displays related results from Best Buy API
var BestbuyRelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.bestBuy.map(function(result, index) {
      return (
        result
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