import React from 'react';
import axios from 'axios';
import '../style.css';
import Header from './Header';
import { Link } from 'react-router-dom';



// Use a simple toggle for Login / SignUp
// Where at bottom we say, if you already have an account, login here
// Form will then link to Login page

// Need to sanitize the inputs here
// If no user or password or confirmed password, error message

// Need to redirect to HomePage with User id after submit

// Add email field with email validation

class SignUpPage extends React.Component {

    onSubmit = (e) => {
        e.preventDefault();

        let user = e.target.elements.user.value;
        let password = e.target.elements.password.value;

        let data = {
            "user": user,
            "password": password
        }

        let self = this;

        if (password === e.target.elements.confirm.value) {
            axios.post('/createUser', data).then(function(response) {
                if (response.data.error === 1) {
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                    self.props.history.push('/dashboard');
                }
            }).catch(function(err) {
                console.log("error: " + err);
            })
        } else {
            alert('Passwords do not match');
        }

    }

    render() {
        return (
            <div>
                <Header />
                <div className="form_page_container">
                    <div className="form_container">
                        <h2>Sign Up Here</h2>
                        <form className="form" onSubmit={this.onSubmit}>
                            <div className="form_inputs_container">
                                <div>
                                    <input name="user" placeholder="name" autoComplete="off" required></input>
                                </div>
                                <div>
                                    <input name="password" type="password" placeholder="password" autoComplete="off" required></input>
                                </div>
                                <div>
                                    <input name="confirm" type="password" placeholder="confirm password" autoComplete="off" required></input>
                                </div>
                                <div className="form_button_container">
                                    <button>Sign Up</button>
                                </div>
                                <p>If you already have an account, log in <Link to="/login">here.</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUpPage;