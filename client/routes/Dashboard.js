React = require('react');

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      username: 'username'    
    };
  },
	render: function() {
		return (
      <div>
  			<h3>Dashboard</h3>
        <h4>Welcome, {this.state.username}!</h4>
        <ChangePasswordBox />
        <div className="dashboard-option">
          <p>Edit contact info</p>
        </div>
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
})

module.exports = Dashboard;
