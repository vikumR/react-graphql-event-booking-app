import React, { Component } from "react";
import './Auth.css';
import AuthContext from "../ context/auth-context";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AuthPage extends Component {
    state = {
        isLogin: true
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return { isLogin: !prevState.isLogin };
        })
    }

    submitHandler = event => {
        event.preventDefault();

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!) {
                        createUser (userInput: {email: $email, password: $password}) {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    const errorMessage = this.state.isLogin ? 'Failed to Login!' : 'Failed to Sign Up!'
                    toast.error(errorMessage);
                    throw new Error('Failed');
                }

                return res.json();
            })
            .then(resData => {
                if (this.state.isLogin) {
                    const token = resData.data.login.token;
                    const userId = resData.data.login.userId;
                    const tokenExpiration = resData.data.login.tokenExpiration;

                    if (token) {
                        localStorage.setItem('token', token);
                        localStorage.setItem('userId', userId);

                        const tokenExpirationDuration = tokenExpiration * 3600 * 1000;
                        localStorage.setItem('tokenExpiration', tokenExpirationDuration);

                        this.context.login(token, userId, tokenExpirationDuration);
                    }
                } else {
                    toast.success('Signed up successfully!');

                    this.switchModeHandler();
                }

            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <React.Fragment>
                <form className="auth-form" onSubmit={this.submitHandler}>
                    <div className="form-control">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" ref={this.emailEl}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" ref={this.passwordEl}></input>
                    </div>
                    <div className="form-actions">
                        <button type="submit">{this.state.isLogin ? 'Login' : 'Sign Up'}</button>
                        <button type="button" onClick={this.switchModeHandler}>
                            Switch To {this.state.isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </div>
                </form>
                <ToastContainer />
            </React.Fragment>
        );
    }
}

export default AuthPage;