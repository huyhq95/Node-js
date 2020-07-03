import React from 'react'
import Router from 'next/router'
import { gql } from 'apollo-boost';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: '',
                email: '',
            },
            error: ''
        }
    }

    onChangeInput = (e, type) => {
        const { form } = this.state;
        form[type] = e.target.value;
        this.setState({ form })
    };

    onSubmit = async () => {
        const { username, password, email } = this.state.form;

        await this.props.client.mutate({
            mutation: gql`
               mutation signUp($email: String!, $username: String!, $password: String){
                signUp(email: $email, username: $username, password: $password)
               }
            `,
            variables: {
                email: email,
                username: username,
                password: password,
            },
            forceFetch: false,
        }).then(({ data }) => {
            if (data.signUp.status) {
                Router.push('/employees')
            } else {
                this.setState({ error: 'Unauthorized' })
            }
        }).catch((e) => {
            this.setState({ error: 'Unauthorized' })
        })
    }

    render() {
        const { form, error } = this.state;
        return (
            <div className="login">
                <form >
                    <input
                        type="text"
                        value={form.email}
                        onChange={(e) => this.onChangeInput(e, 'email')}
                    />
                    <input
                        type="text"
                        value={form.username}
                        onChange={(e) => this.onChangeInput(e, 'username')}
                    />

                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => this.onChangeInput(e, 'password')}
                    />
                    <button type="button" onClick={() => this.onSubmit()}>Login</button>
                    {error && <span>{error}</span>}
                </form>
            </div>
        )
    }
}