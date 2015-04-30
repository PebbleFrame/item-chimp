var React = require('react'),
  Router = require('react-router');
  
var Header = React.createClass({
  render: function() {
    return (
      <div className="page-header">
        <h1>Shopagator</h1>
        <h3>A Data Visualization Tool for Shoppers</h3>
      </div>
    );
  }
});

var PageNav = React.createClass({
  render: function() {
    return (
      <nav className="nav navbar-default">
        <ul className="nav navbar-nav">
          <li className="active home">
            <Router.Link to="home">Home</Router.Link>
          </li>
          <li className="about">
            <Router.Link to="about">About</Router.Link>
          </li>
        </ul>
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
