import React from 'react';
import axios from 'axios';
import '../style.css';
import Header from './Header';
import { Link } from 'react-router-dom';



// Use a simple toggle for Login / SignUp
// Where at bottom we say, if you don't have an account, sign up here
// Form will then link to SignUp page

class LoginPage extends React.Component {

    onSubmit = (e) => {
        e.preventDefault();

        let user = e.target.elements.user.value;
        let password = e.target.elements.password.value;

        let data = {
            "user": user,
            "password": password
        }

        let self = this;

        axios.post('/loginUser', data).then(function(response) {
            if (response.data.error === 0) {
                alert(response.data.message);
                //self.props.history.push('/teacherDashboard');
                self.props.history.push('/dashboard');
            } else {
                alert(response.data.message);
            }
            console.log(response.data);
        }).catch(function(err) {
            console.log("error: " + err);
        });
    }

    render() {
        return (
            <div>
                <Header />
                <div className="form_page_container">
                    <div className="form_container">
                        <h2>Login</h2>
                        <form className="form" onSubmit={this.onSubmit}>
                            <div className="form_inputs_container">
                                <div className="row center">
                                    <input name="user" placeholder="name" autoComplete="off"></input>
                                </div>
                                <div>
                                    <input name="password" placeholder="password" autoComplete="off"></input>
                                </div>
                                <div className="form_button_container">
                                    <button>Login</button>
                                </div>
                                <p>If you don't have an account, sign up <Link to="/signUp">here.</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;