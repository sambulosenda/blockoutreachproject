import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import _ from 'lodash'
import $ from 'jquery'

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var municipalBallotContractABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"projects","outputs":[{"name":"name","type":"bytes32"},{"name":"cost","type":"uint256"},{"name":"balance","type":"uint256"},{"name":"initiater","type":"address"},{"name":"projectId","type":"uint256"},{"name":"projectState","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"projectId","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"contributer","type":"address"}],"name":"contributeToProject","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_cost","type":"uint256"}],"name":"addProject","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"chairperson","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numProjects","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"projectId","type":"uint256"}],"name":"payProject","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getProjects","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"backer","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"isContribution","type":"bool"}],"name":"FundTransfer","type":"event"}]
var municipalBallotContractAddress = '0x5920ebca6b87e2abf2f326c1eb0a14f15fc09955'


var municipalBallotContract = ETHEREUM_CLIENT.eth.contract(municipalBallotContractABI).at(municipalBallotContractAddress)

ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.accounts[0]

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      names: [],
      costs: [],
      projectIds: [],
      balances: []
    }
    this.addProjectButton = this.addProjectButton.bind(this);
    this.contributeButton = this.contributeButton.bind(this);

  }

  componentWillMount() {
    var data = municipalBallotContract.getProjects()
    this.setState({
      names: String(data[0]).split(','),
      costs: String(data[1]).split(','),
      balances: String(data[2]).split(','),
      projectIds: String(data[3]).split(','),
    })
  }

  contributeButton(event) {
    console.log("Contribute")
    var data = municipalBallotContract.getProjects()
    var elements = document.getElementsByClassName("test");
    var names = '';
    for(var i=0; i<elements.length; i++) {
        if (elements[i].value!=0) {
        console.log("Value of Contribution" + elements[i].value);
        var txId = municipalBallotContract.payProject(i, {from: ETHEREUM_CLIENT.eth.defaultAccount, value: elements[i].value})
        console.log(txId) 
      }
    }
    var data = municipalBallotContract.getProjects()
    this.setState({
      names: String(data[0]).split(','),
      costs: String(data[1]).split(','),
      balances: String(data[2]).split(','),
      projectIds: String(data[3]).split(','),
    })
  }


  addProjectButton(event) {
    var projectNameVal = $("#projectName").val()
    var projectCostVal = $("#projectCost").val()
    console.log(projectNameVal + projectCostVal)
    municipalBallotContract.addProject(projectNameVal, projectCostVal, {from: ETHEREUM_CLIENT.eth.defaultAccount, gas: 300000})
    console.log("Call back after completing add Project")
        var data = municipalBallotContract.getProjects()
        this.setState({
           names: String(data[0]).split(','),
           costs: String(data[1]).split(','),
           balances: String(data[2]).split(','),
           projectIds: String(data[3]).split(','),
        })
    console.log("Calling addProject")
    console.log("Default account" + ETHEREUM_CLIENT.eth.defaultAccount)

  }


  render() {

    var TableRows = []

    _.each(this.state.names, (value, index) => {
      TableRows.push(
        <tr>
          <td>{ETHEREUM_CLIENT.toAscii(this.state.names[index])}</td>
          <td>{this.state.costs[index]}</td>
          <td>{this.state.balances[index]}</td>
          <td>{<input className="test" type="text" id={'Contribution' + this.state.projectIds[index]} />}</td>
        </tr>
      )
    })

    return (
      <div className="App">
        <div className="App-Content">
          <h1>OLD Street Problems</h1>
          <table className="gridtable">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Cost</th>
                <th>Balance</th>
                <th>Contribution</th>
              </tr>
            </thead>
            <tbody>
              {TableRows}
            </tbody>
          </table>
        </div>
        <div>
        </div>
              <h3>Contribute</h3> 
              {/* Contributers Address: <input type="text" id="contributerAddress" value =""/> */}
           
              <button onClick={this.contributeButton}>Contribute</button>
        <div>
          <h3>Add Project</h3>
            Project Name: <input type="text" id="projectName" />
            Project Cost: <input type="text" id="projectCost" />
            <button onClick={this.addProjectButton}>Add Project</button>
        </div>
      </div>
    );
  }
}

export default App;
