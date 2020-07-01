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
        this.getListEmployees()
    }

    getListEmployees = async () => {
        await fetch('/api/employees', {
            method: 'POST',
        })
            .then(async res => {
                const listEmployees = await res.json();
                this.setState({ listEmployees })
            })

    }

    onCrawlEmployees = async () => {
        await fetch('/api/employees/crawl', {
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

export const getServerSideProps = async ({ res }) => {
    if (res.session.user == undefined) {
        res.statusCode = 302
        res.setHeader('Location', `/login`)
    }
    return { props: {} }
};
