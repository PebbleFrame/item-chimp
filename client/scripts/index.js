var React = require('react'),
  Router = require('react-router');
  
var Header = React.createClass({
  render: function() {
    return (
      <div className="container logo-container">
        <h1>ShopChimp</h1>
        <h3>A Data Visualization Tool for Shoppers</h3>
      </div>
    );
  }
});

var PageNav = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Router.Link to="home" className="navbar-brand home">ShopChimp</Router.Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li className="active home">
                <Router.Link to="about">About</Router.Link>
              </li>
              <li className="about">
                <Router.Link to="about">About</Router.Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div>
        <header>
          <PageNav />
        </header>
        <Header />
        <Router.RouteHandler />
      </div>
    );
  }
});

var routes = {
  Home: require('../routes/Home'),
  About: require('../routes/About')
};

var routes = (
  <Router.Route name="app" path="/" handler={App}>
    <Router.Route name="home" path="/" handler={routes.Home}/>
    <Router.Route name="about" path="/about" handler={routes.About}/>
    <Router.DefaultRoute handler={routes.Home}/>
  </Router.Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});
