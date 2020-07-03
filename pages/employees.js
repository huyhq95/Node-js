import React from 'react'
require('isomorphic-fetch');
import { gql } from 'apollo-boost';

export default class Employees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listEmployees: {}
        }
    }

    componentDidMount() {
        this.props.client
            .query({
                query: gql`
                {
                    employees{
                      _id
                      employee_name
                      employee_salary
                    }
                  }`
            })
            .then(({ data }) => {
                this.setState({ listEmployees: data.employees })
            })
    }

    onCrawlEmployees = async () => {
        await this.props.client.mutate({
            mutation: gql`
            mutation {
                crawlEmployees{
                  _id
                  employee_name
                }
              }
                    `,
            forceFetch: false,
        }).then(({ data }) => {
            this.setState({ listEmployees: data.crawlEmployees })
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
            </div >
        )
    }
}