React = require('react');

var DisplayBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  postRequest: function(api) {
    
  },
  handleQuerySubmit: function(query) {
    $.ajax({
      url: 'general-query',
      dataType: 'json',
      type: 'POST',
      data: query,
      success: function(data) {
        this.setState({data: data});
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
        <RelatedResultsDisplay data={this.state.data} />
      </div>
    );
  }
});

var RelatedResultsDisplay = React.createClass({
  render: function() {
    var resultNodes = this.props.data.map(function(result, index) {
      console.log(result);
      return (
        result
      );
    });
    return (
      <div>
        <h2>Related Results</h2>
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