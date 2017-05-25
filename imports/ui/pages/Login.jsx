import React from 'react';
import handleLogin from '/imports/ui/modules/login';

class Login extends React.Component {

	componentDidMount () {
		handleLogin({component: this});
	}

	handleSubmit (event) {
		event.preventDefault();
	}

	render () {
		return (
			<form
				ref={form => (this.loginForm = form)}
				className="Login"
				onSubmit={this.handleSubmit}
				>
				<input type="email" name="email" placeholder="Email Address" />
				<input type="password" name="password" placeholder="Password" />
				<input type="submit" value="login" />
			</form>
		)
	}
}

export default Login;