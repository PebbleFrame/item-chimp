React = require('react');

var Dashboard = React.createClass({
  //only an empty div is rendered to the page until this function is callled 
  //and either a username is set or login is set to true
  //this function checks if the client has a token and if it does
  //it retrieves the user data from server and sets the state
  //for username and email
  loadUserFromServer: function(){
    if(this.state.token){
      $.ajax({
       type: 'GET',
       url: '/auth/users',
       headers: {'x-access-token': this.state.token},
       success: function (data) {
         this.setState({
           username : data.username,
           email : data.email});
       }.bind(this),
       error: function(xhr,status,err){
        console.error('/auth/users', status, err.toString());
       }.bind(this)
      });
    }
    else{
      this.setState({login:true})
    }
  },
  //Here the components initial state is set
  //If the client has a token, then it is set
  getInitialState: function() {
    if(!localStorage.getItem('tokenChimp')){
      return {
        token: false,
        username : false,
        email  : false,
      };
    }
    else {
      console.log("Getting Token")
      var token = localStorage.getItem('tokenChimp');
      }
      return {
        token: token,
        username: false,
        email: false,
        login: false
      };
    },
  //this is called after the component is initially rendered
  //which on any new visit to the page, will be right after the empty
  //div is rendered
  componentDidMount: function(){
    this.loadUserFromServer();
  },
  //If a new user is successfully added to database
  //they are passed onto the login submit, where they are logged in
  handleSignupSubmit: function(user){
    $.ajax({
      url: '/auth/signup',
      dataType: 'json',
      type: 'POST',
      data: user,
      success: function(data) {
        if(data) {
          console.log("Added new User; Logging in")
          this.handleLoginSubmit({username: user.username, password: user.password});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('/auth/login', status, err.toString());
      }.bind(this)
    });
  },
  //if user is in database and password is valid
  //user is given token and state is set
  handleLoginSubmit: function(user) {
    $.ajax({
      url: '/auth/login',
      dataType: 'json',
      type: 'POST',
      data: user,
      success: function(data) {
        if(data) {
          console.log("setting login state")
          this.setState({
            username: data.username,
            email: data.email
          });
          localStorage.setItem('tokenChimp', data.token);
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('/auth/login', status, err.toString());
      }.bind(this)
    });
  },
  //users token is destroyed, state changed to reflect
  handleLogout: function(){
    this.setState({
      username: false,
      email: false,
    });
    localStorage.removeItem('tokenChimp');
    this.setState({login: true});
  },

  //Component is rendered depenending on state; if a user is logged in
  //then dashboard is rendered; if user is not logged in login portal is rendered
  //it renders an empty div initially so that user information can be checked before
  //significant rendering and also prevents visual glitch when entering dashboard
  //with a token--prevents the signup page from showing before switch to dashboard
  render: function() {
    if(this.state.username) {
      return (
      <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className = "welcome">
            <h3>Welcome {this.state.username}!</h3>
          </div>
          <div className="text-center logButton">
            <button className="btn btn-success" onClick={this.handleLogout}>Logout</button>
          </div>
        </div>
        <div className="col-md-4">
          <div className = "panel-group welcomeGroup" id="accordion" role="tablist" aria-multiselectable="true">
          <WatchingPanel />
          <ContactPanel email={this.state.email} />
          <FollowingPanel />
          <FollowersPanel />
          <PasswordPanel/>
          </div>
        </div>
      </div>
      </div>
      );
    }
    else
    if(this.state.login)
    {
      return(
        <div className="row">
          <div className="container">
            <UserLoginPanel onLoginSubmit = {this.handleLoginSubmit} />
            <SignUpPanel onSignupSubmit = {this.handleSignupSubmit} />
          </div>
        </div>
      );
    }
    else{
      return(<div></div>);
    }
  }
});



//Is rendered when user needs to sign in or signup
var UserLoginPanel = React.createClass({
  handleSubmit:function(e){
    e.preventDefault();
    var username = React.findDOMNode(this.refs.username).value.trim();
    var password = React.findDOMNode(this.refs.password).value.trim();
    if (!username || !password) {
      return;
    }
    this.props.onLoginSubmit({username: username, password: password});
    React.findDOMNode(this.refs.username).value = '';
    React.findDOMNode(this.refs.password).value = '';
    return;
  },
  render: function(){
    return(
          <div className="col-md-4 col-md-offset-2 loginForm dashboardForm">
              <h1>Member Login</h1>
              <form name="login" onSubmit={this.handleSubmit}>
                  <input type='text'className="form-control" placeholder = "Username" ref="username"/>
                  <input type="password" className="form-control logButton" placeholder = "password" ref="password"/>
                  <button className="btn btn-primary logButton">Login</button>
              </form>
          </div>
    )
  }
});

//Is rendered when user needs to sign in or signup
var SignUpPanel = React.createClass({
  handleSubmit:function(e){
    e.preventDefault();
    var username = React.findDOMNode(this.refs.username).value.trim();
    var password = React.findDOMNode(this.refs.password).value.trim();
    var email = React.findDOMNode(this.refs.email).value.trim();
    if (!username || !password || !email) {
      return;
    }
    this.props.onSignupSubmit({username: username, password: password, email: email});
    React.findDOMNode(this.refs.username).value = '';
    React.findDOMNode(this.refs.password).value = '';
    React.findDOMNode(this.refs.email).value = '';
    return;
  },
  render: function(){
    return(
          <div className="col-md-4 dashboardForm signupForm">
              <h1>Sign Up</h1>
              <form name="signup" onSubmit={this.handleSubmit}>
                  <input type='text'className="form-control" placeholder = "Username" ref="username"/>
                  <input type="password" className="form-control logButton" placeholder = "Password" ref="password"/>
                  <input type="text" className="form-control logButton" placeholder = "Email" ref="email"/>
                  <button className="btn btn-primary logButton">Sign Up</button>
              </form>
          </div>
    )
  }
});

//Rendered after signing in
var WatchingPanel = React.createClass({
  render: function(){
    return(
      <div className="panel panel-primary">
          <div className="panel-heading" role="tab" id="headingFive">
            <h4 className="panel-title">
              <a data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
                Products you are watching
              </a>
            </h4>
          </div>
          <div id="collapseFive" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">
            <div className="panel-body">
            <WatchingBox /> 
            </div>
          </div>
     </div>
      );
  }
});

//Rendered after signing in
var PasswordPanel = React.createClass({
  render: function(){
    return(
      <div className="panel panel-primary">
          <div className="panel-heading" role="tab" id="headingOne">
            <h4 className="panel-title">
              <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Change Password
              </a>
            </h4>
          </div>
          <div id="collapseOne" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
            <div className="panel-body">
            <ChangePasswordBox />  
            </div>
          </div>
     </div>
      );
  }
});

//Rendered after signing in
var ContactPanel = React.createClass({
  render: function(){
    return(
      <div className="panel panel-primary">
          <div className="panel-heading" role="tab" id="headingTwo">
            <h4 className="panel-title">
              <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                Edit Contact Info
              </a>
            </h4>
          </div>
          <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
            <div className="panel-body">
            <EditContactInfoBox email={this.props.email} />
            </div>
          </div>
     </div>
      );
  }
})

//Rendered after signing in
var FollowingPanel = React.createClass({
  render: function(){
    return(
      <div className="panel panel-primary">
          <div className="panel-heading" role="tab" id="headingThree">
            <h4 className="panel-title">
              <a data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                Users You are Following
              </a>
            </h4>
          </div>
          <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
            <div className="panel-body">
            <YouAreFollowingBox />
            </div>
          </div>
     </div>
      );
  }
})

//Rendered after signing in
var FollowersPanel = React.createClass({
  render: function(){
    return(
      <div className="panel panel-primary">
          <div className="panel-heading" role="tab" id="headingFour">
            <h4 className="panel-title">
              <a data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
               Users Following You
              </a>
            </h4>
          </div>
          <div id="collapseFour" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
            <div className="panel-body">
            <FollowingYouBox />
            </div>
          </div>
     </div>
      );
  }
})

//Rendered after signing in
var WatchingBox = React.createClass({
  render: function() {
    return (
      <div className="dashboard-option">
      Hello
      </div>
    );
  }
});

//Rendered after signing in
var ChangePasswordBox = React.createClass({
  render: function() {
    return (
      <div className="dashboard-option">
        <input type="password" placeholder="old password" className="form-control password-change-field" ref="oldPassword1" />
        <input type="password" placeholder="new password" className="form-control password-change-field" ref="newPassword" />
        <input type="password" placeholder="confirm new password" className="form-control password-change-field" ref="newPassword2" />
      </div>
    );
  }
});

//Rendered after signing in
var EditContactInfoBox = React.createClass({
  render: function() {
    return (
      <div className="dashboard-option">
        <div className="contact-change">Email: {this.props.email}</div>
        <input type="text" placeholder="new email" className="form-control contact-change" ref="newEmail" />
      </div>
    );
  }
});

//Rendered after signing in
var YouAreFollowingBox = React.createClass({
  render: function() {
    return (
      <div className="dashboard-option">
        <FavoriteUsersDisplay user="user1"/>
        <FavoriteUsersDisplay user="user2"/>
      </div>
    );
  }
});

//Rendered after signing in
var FollowingYouBox = React.createClass({
  render: function() {
    return (
      <div className="dashboard-option">
        <FollowersDisplay user="user1"/>
        <FollowersDisplay user="user2"/>
      </div>
    );
  }
});

//Rendered after signing in
var FavoriteUsersDisplay = React.createClass({
  handleUnfollow: function(e) {
    e.preventDefault();
    console.log('requested to unfollow ' + this.props.user);
  },
  render: function() {
    return (
        <div className="user-following">
          {this.props.user}
          <a className="unfollow" data-user={this.props.user} onClick={this.handleUnfollow} href="#">unfollow</a>
        </div>
    );
  }
});

//Rendered after signing in
var FollowersDisplay = React.createClass({
  handleUnfollow: function(e) {
    e.preventDefault();
    console.log('requested to unfollow ' + this.props.user);
  },
  handleFollow: function(e) {
    e.preventDefault();
    console.log('requested to follow ' + this.props.user);
  },
  render: function() {
    return (
        <div className="following-you">
          {this.props.user}
          <a className="follow" data-user={this.props.user} onClick={this.handleFollow} href="#">follow</a>
          <a className="unfollow" data-user={this.props.user} onClick={this.handleUnfollow} href="#">unfollow</a>
        </div>
    );
  }
});


module.exports = Dashboard;
