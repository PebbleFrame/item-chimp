React = require('react');

var DisplayBox = React.createClass({
  getInitialState: function() {
    return {
      amazon: {amazon: []},
      walmart: {walmart: []},
      bestbuy: {bestbuy: []},      
    };
  },
  postRequest: function(api, query) {
    
    var url = 'general-query-' + api;

    $.ajax({
      url: url,
      dataType: 'json',
      type: 'POST',
      data: query,
      success: function(data) {

      }
    });
  },
  handleQuerySubmit: function(query) {
    $.ajax({
      url: 'general-query',
      dataType: 'json',
      type: 'POST',
      data: query,
      success: function(data) {
        $('.related-results-display').removeClass('hidden');

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
      </div>
    );
  }
});

var AmazonRelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.amazon.map(function(result, index) {
      return (
        result
      );
    });
    return (
      <div className="related-results-display hidden">
        <h2>Amazon Related Results</h2>
        {resultNodes}
      </div>
    );
  }
});

var WalmartRelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.walmart.map(function(result, index) {
      return (
        result
      );
    });
    return (
      <div className="related-results-display hidden">
        <h2>Walmart Related Results</h2>
        {resultNodes}
      </div>
    );
  }
});

var SearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var query = React.findDOMNode(this.refs.query).value.trim();

    this.props.onQuerySubmit({query: query});

    React.findDOMNode(this.refs.query).value = '';
  },
  render: function() {
    return (
      <div>
        <h4 className="form-title">ShopChimp, at your service.</h4>

        <form className="query-form" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Enter a product" className="form-control" ref="query" />

          <center><button className="btn btn-primary">Submit</button></center>
        </form>
      </div>
    );
  }
});

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