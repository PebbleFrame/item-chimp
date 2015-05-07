var React = require('react');
var Router = require('react-router');

// Require Famo.us/react-famous components

var Transform = require('famous/core/Transform');
var Easing = require('famous/transitions/Easing');
var Transitionable = require('famous/transitions/Transitionable');
var Timer = require('famous/utilities/Timer');

var Context = require('react-famous/core/Context');
var Modifier = require('react-famous/core/Modifier');
var Surface = require('react-famous/core/Surface');
var FamousScheduler = require('react-famous/lib/FamousScheduler');
var StateModifier = require('react-famous/modifiers/StateModifier');

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
            <Router.Link to="home" className="navbar-brand home">ItemChimp</Router.Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li className="active home ">
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
  componentDidMount: function() {

    // react-famous code for logo image to bounce up and down
    var stateModifier = this.refs.stateModifier.getFamous();

    FamousScheduler.schedule(function() {
      var animate = function() {
        stateModifier.halt();
        // Code for chimp to bounce up
        stateModifier.setTransform(Transform.translate(0, -40), {
          curve: 'easeOut',
          duration: 250
        }, function() {
          // Code for chimp to fall back down
          stateModifier.setTransform(Transform.translate(0, 0), {
            curve: 'easeIn',
            duration: 125
          }, function() {
            // Repeat the animation infinitely
            Timer.setTimeout(animate, 625);
          });
        });
      };

      // Initialize the bouncing animation
      animate();
    });

    // react-famous code for chimp to spin
    var modifier = this.refs.modifier.getFamous();

    // Set the spinning speed
    var spinner = {
      speed: 15
    };

    // Create a transitionable that will rotate
    var rotateY = new Transitionable(0);

    // Timer causes rotation to last infinitely
    Timer.every(function() {
      var adjustedSpeed = parseFloat(spinner.speed) / 1000;
      rotateY.set(rotateY.get() + adjustedSpeed);
      // Start the rotating animation/transition
      modifier.setTransform(Transform.rotateY(rotateY.get()));
    }, 1);
    
  },
  render: function() {

    return (
      <div className="logo-container">
        <Context>
      {/* StateModifier is the bouncing modifier */}
          <StateModifier ref="stateModifier" options={{align: [0.5, 0.5], origin: [0.5, 0.5]}}>
        {/* Modifier is the spinning modifier */}
          <Modifier ref="modifier" options={{origin: [0.5, 0.5], align: [0.5, 0.5]}}>
            <Surface options={{size: [true, true], properties: {marginTop: '75px', marginBottom: '-60px'}}}>
              <img src="images/chimp.png" className="logo-image" />
            </Surface>
          </Modifier>
          </StateModifier>
        </Context>
        <h1 className="logo-title">ItemChimp</h1>
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
