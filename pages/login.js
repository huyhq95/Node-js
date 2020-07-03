import React from 'react'
import Router from 'next/router'
import { gql } from 'apollo-boost';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: '', 
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
        const { username, password } = this.state.form;

        await this.props.client.mutate({
            mutation: gql`
               mutation login($username: String!, $password: String){
                login(username: $username, password: $password)
               }
            `,
            variables: {
                username: username,
                password: password
            },
            forceFetch: false,
        }).then(({ data }) => {
            if (data.login.status) {
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