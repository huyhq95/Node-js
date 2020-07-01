import React from 'react'
require('isomorphic-fetch');
import Router from 'next/router'

export default class Employees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listEmployees: {}
        }
    }
    componentDidMount() {
        const { session } = this.props.data;
        if (!session) Router.push('/login')
        this.getListEmployees()
    }

    getListEmployees = async () => {
        await fetch('http://127.0.0.1:3000/api/employees', {
            method: 'POST',
        })
            .then(async res => {
                const listEmployees = await res.json();
                this.setState({ listEmployees })
            })

    }

    onCrawlEmployees = async () => {
        await fetch('http://127.0.0.1:3000/api/employees/crawl', {
            method: 'POST',
        })
            .then(async res => {
                const listEmployees = await res.json();
                this.setState({ listEmployees })
            })
    }

    render() {
        const { listEmployees } = this.state;
        return (
            <div>
                <table >
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Salary</th>
                    </tr>
                    {listEmployees.length > 0 ? (
                        listEmployees.map((v, k) => {
                            return (
                                <tr>
                                    <td>{v.employee_name}</td>
                                    <td>{v.employee_age}</td>
                                    <td>{v.employee_salary}</td>
                                </tr>
                            );
                        })
                    ) : null}

                </table>
                <button type="button" onClick={() => this.onCrawlEmployees()}>Crawl</button>
            </div>
        )
    }
}

export async function getServerSideProps() {
    const res = await fetch('http://127.0.0.1:3000/api/getSession')
    const data = await res.json()
    return { props: { data } }
}