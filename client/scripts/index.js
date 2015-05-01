var React = require('react');
var Router = require('react-router');

// Component for the bootstrap navbar
// React Router routes are included in here
var Navbar = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
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
                <Router.Link to="home">Home</Router.Link>
              </li>
              <li className="dashboard">
                <Router.Link to="dashboard">Dashboard</Router.Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});
  
// Component for the header area underneath the navbar
var LogoArea = React.createClass({
  render: function() {
    return (
      <div className="logo-container">
        <h1 className="logo-title"><img src="images/chimp.png" className="logo-image" />ShopChimp</h1>
        <h3 className="logo-tagline">A Data Visualization Tool for Shoppers</h3>
      </div>
    );
  }
});

// Basic structure of the app
// This is implemented by the React Router, which recognizes the "App" variable
var App = React.createClass({
  render: function() {
    return (
      <div>
        <header>
          <Navbar />
        </header>

        <LogoArea />

        <div className="container">
          <Router.RouteHandler />
        </div>
      </div>
    );
  }
});

// Routes for the React Router
// Identifies the files that each route refers to
var routes = {
  Home: require('../routes/Home'),
  Dashboard: require('../routes/Dashboard')
};

// Identifies "App" variable as the handler
// Sets up the app for routing
var routes = (
  <Router.Route name="app" path="/" handler={App}>
    <Router.Route name="home" path="/" handler={routes.Home}/>
    <Router.Route name="dashboard" path="/dashboard" handler={routes.Dashboard}/>
    <Router.DefaultRoute handler={routes.Home}/>
  </Router.Route>
);

// Runs the router with proper parameters
Router.run(routes, Router.HistoryLocation, function (Handler) {
  // Route exists in the DOM element with ID "content"
  React.render(<Handler/>, document.getElementById('content'));
});
