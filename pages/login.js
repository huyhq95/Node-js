
import React from 'react'
require('isomorphic-fetch');
import Router from 'next/router'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: '',
        password: '',
        error:''
      }
    }
  }

  onChangeInput = (e, type) => {
    const { form } = this.state;
    form[type] = e.target.value;
    this.setState({ form })
  };

  onSubmit = async () => {
    const { form } = this.state;
    await fetch('http://127.0.0.1:3000/api/login', {
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
      }),
    })
      .then(async res => {
        const rs = await res.json();
        if(rs.status){
          Router.push('/employees')
        }else{
          this.setState({ error: 'Unauthorized' })
        }
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