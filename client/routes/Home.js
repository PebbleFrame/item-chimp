React = require('react');

var SearchForm = React.createClass({
  render: function() {
    return (
      <form>
        <input type="text" placeholder="Enter a product" className="form-control"/>
        <center><button className="btn btn-primary">Submit</button></center>
      </form>
    );
  }
});

var Home = React.createClass({
	render: function() {
		return (
      <div className="home-page">
  			<h4 className="form-title">ShopChimp, at your service.</h4>
        <SearchForm />
      </div>
		);
	}
});

module.exports = Home;
