React = require('react');

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      username: 'username',
      email: 'email@email.com'  
    };
  },
	render: function() {
		return (
      <div>
  			<h3>Dashboard</h3>
        <h4>Welcome, {this.state.username}!</h4>
        <TopControlRow email={this.props.email} />
        <div className="row">
          <YouAreFollowingBox />
          <FollowingYouBox />
        </div>
      </div>
		);
	}
});

var TopControlRow = React.createClass({
  render: function() {
    return (
      <div className="row">
        <ChangePasswordBox />
        <EditContactInfoBox email={this.props.email} />
      </div>
    );
  }
});

var ChangePasswordBox = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    $('.password-change-field').toggleClass('hidden');
  },
  render: function() {
    return (
      <div className="dashboard-option">
        <p><a href="#" onClick={this.handleClick}>Change password</a></p>
        <input type="password" placeholder="old password" className="form-control password-change-field hidden" ref="oldPassword1" />
        <input type="password" placeholder="new password" className="form-control password-change-field hidden" ref="newPassword" />
        <input type="password" placeholder="confirm new password" className="form-control password-change-field hidden" ref="newPassword2" />
      </div>
    );
  }
});

var EditContactInfoBox = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    $('.contact-change').toggleClass('hidden');
  },
  render: function() {
    return (
      <div className="dashboard-option">
        <p><a href="#" onClick={this.handleClick}>Edit contact info</a></p>
        <div className="contact-change hidden">Email: {this.props.email}</div>
        <input type="text" placeholder="new email" className="form-control contact-change hidden" ref="newEmail" />
      </div>
    );
  }
});

var YouAreFollowingBox = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    $('.user-following').toggleClass('hidden');
  },
  render: function() {
    return (
      <div className="dashboard-option">
        <p><a href="#" onClick={this.handleClick}>Users You Are Following</a></p>
        <FavoriteUsersDisplay user="user1"/>
        <FavoriteUsersDisplay user="user2"/>
      </div>
    );
  }
});

var FollowingYouBox = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    $('.following-you').toggleClass('hidden');
  },
  render: function() {
    return (
      <div className="dashboard-option">
        <p><a href="#" onClick={this.handleClick}>Users Following You</a></p>
        <FollowersDisplay user="user1"/>
        <FollowersDisplay user="user2"/>
      </div>
    );
  }
});

var FavoriteUsersDisplay = React.createClass({
  handleUnfollow: function(e) {
    e.preventDefault();
    console.log('requested to unfollow ' + this.props.user);
  },
  render: function() {
    return (
        <div className="user-following hidden">
          {this.props.user}
          <a className="unfollow" data-user={this.props.user} onClick={this.handleUnfollow} href="#">unfollow</a>
        </div>
    );
  }
});

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
        <div className="following-you hidden">
          {this.props.user}
          <a className="follow" data-user={this.props.user} onClick={this.handleFollow} href="#">follow</a>
          <a className="unfollow" data-user={this.props.user} onClick={this.handleUnfollow} href="#">unfollow</a>
        </div>
    );
  }
});



module.exports = Dashboard;
