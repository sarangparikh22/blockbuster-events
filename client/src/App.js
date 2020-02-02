import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import getContractInstance from './utils/getContractInstance'
import MoviesBlockbusterJSON from './contracts/MoviesBlockbusterEvents.json'
import EventsBlockbusterJSON from './contracts/EventsBlockbusterEvents.json'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';


import RegisterHall from './components/RegisterHall'
import UnregisterHall from './components/UnregisterHall'
import AddMovie from './components/AddMovie'
import ShowMovies from './components/ShowMovies'
import Slider from './components/Slider'
import Movies from './components/Movies'
import NavComp from './components/NavComp'
import Home from './components/Home'
import MyTickets from './components/MyTickets'
import MyMovies from './components/MyMovies'
import AddEvents from './components/AddEvents'
import Footer from './components/Footer'
import Events from './components/Events'
import MyEvents from './components/MyEvents'

let accountPopover; 

class App extends Component {
  state = { balance: 0, events: [], myEventTickets: [],  myMovies: [], myTickets: [], isHall: false, owner: "", movies: [], acctText: "Metamask Please", loading: false, storageValue: 0, web3: null, accounts: null, contract: null }

  
  componentWillMount = async () => {
    try {
      const web3 = await getWeb3()

      const accounts = await web3.eth.getAccounts()

      const MoviesBlockbusterEventsContract = await getContractInstance(web3, MoviesBlockbusterJSON);
      const EventsBlockbusterEventsContract = await getContractInstance(web3, EventsBlockbusterJSON);

      this.setState({ web3, accounts, MoviesBlockbusterEventsContract, EventsBlockbusterEventsContract })
      console.log(web3);
      console.log(this.state.MoviesBlockbusterEventsContract)
      console.log(this.state.EventsBlockbusterEventsContract)

      accountPopover = this.state.accounts[0];
      console.log(accountPopover)
      this.setState({acctText: accountPopover})
      
      MoviesBlockbusterEventsContract.events.AddMovie({
        fromBlock: 0
      }, (error, event) => { 
      MoviesBlockbusterEventsContract.methods.earning().call({from: accounts[0]})
      .then(res => this.setState({earning: res}))
      
          if(event.returnValues[1] == this.state.accounts[0]){
            MoviesBlockbusterEventsContract.methods.hallMovieCollectionMapping(event.returnValues[1], event.returnValues[0]).call({from: accounts[0]})
            .then(res => {
                if(res[9] == true){
                  event.returnValues.active = true;
                  this.setState((prevState)=>{myMovies: prevState.myMovies.push(event.returnValues)}) 
                }else{
                  event.returnValues.active = false;
                  this.setState((prevState)=>{myMovies: prevState.myMovies.push(event.returnValues)})                }
            })    
          }
          this.setState((prevState)=>{movies: prevState.movies.push(event.returnValues)})
       })
      .on('changed', function(event){
      })          

      .on('error', console.error);
      let mov;
      MoviesBlockbusterEventsContract.events.BuyTicket({
        fromBlock: 0
      }, (error, event) => { 
          if(event.returnValues[0] == this.state.accounts[0]){
            mov = this.state.movies.filter(m => {
              return (m[0] == event.returnValues[2] && m[1] && event.returnValues[1]);
            })
            event.returnValues.movieName = mov[0].movieName;
            MoviesBlockbusterEventsContract.methods.verifyViewer(event.returnValues[1], event.returnValues[2]).call({from: accounts[0]})
            .then(res => {
              if(res > 0) {
                this.setState((prevState)=>{myTickets: prevState.myTickets.push(event.returnValues)})
              }else{
                event.returnValues.cancel = true;
                this.setState((prevState)=>{myTickets: prevState.myTickets.push(event.returnValues)})
              }
            });
          }
       })
      .on('changed', function(event){
      })
      .on('error', console.error);
      

      EventsBlockbusterEventsContract.methods.balances(accounts[0]).call({from: accounts[0]})
      .then(bal => this.setState({balance: bal}))

      EventsBlockbusterEventsContract.methods.eventCount().call({from: accounts[0]})
      .then(eventCount => {
        for(let i = 1; i <= eventCount; i++){
          EventsBlockbusterEventsContract.methods.getEventDetails(i).call({from: accounts[0]})
          .then(ev => {
            this.setState((prevState) => {events: prevState.events.push(ev)})});
        }
      })

      EventsBlockbusterEventsContract.events.Registered({
        fromBlock: 0
      }, (error, event) => { 
          if(event.returnValues[2] == accounts[0]){
            this.setState((prevState) => {myEventTickets: prevState.myEventTickets.push(event.returnValues)})
          }
       })
      .on('changed', function(event){
      })
      .on('error', console.error);

      let contractOwner = await MoviesBlockbusterEventsContract.methods.owner().call({from: accounts[0]});
      this.setState({owner: contractOwner});
      let isHall = await MoviesBlockbusterEventsContract.methods.hallMapping(accounts[0]).call({from: accounts[0]})
      this.setState({isHall: isHall})
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`)
      console.log(error)
    }

  }

  render() {
    return (
      <div>
        <NavComp accounts={this.state.accounts} owner={this.state.owner} isHall={this.state.isHall}/>
        <Router>
          <Switch>
            <Route exact path="/" component={() => <Home 
              movies={this.state.movies}
              web3 = {this.state.web3} 
              accounts = {this.state.accounts} 
              MoviesBlockbusterEventsContract = {this.state.MoviesBlockbusterEventsContract}
              />} />
            <Route exact path="/registerHall" component={() => <RegisterHall 
              web3 = {this.state.web3} 
              accounts = {this.state.accounts} 
              MoviesBlockbusterEventsContract = {this.state.MoviesBlockbusterEventsContract}
              />} />
            <Route exact path="/unregisterHall" component={() => <UnregisterHall 
              web3 = {this.state.web3} 
              accounts = {this.state.accounts} 
              MoviesBlockbusterEventsContract = {this.state.MoviesBlockbusterEventsContract}
              />} />

            <Route path="/hostMovie" component={() => <AddMovie 
              web3 = {this.state.web3} 
              accounts = {this.state.accounts} 
              MoviesBlockbusterEventsContract = {this.state.MoviesBlockbusterEventsContract}
              />} />
            <Route  path="/mytickets" component = {() => <MyTickets
              myEventTickets = {this.state.myEventTickets} 
              myTickets={this.state.myTickets}
              web3 = {this.state.web3} 
              accounts = {this.state.accounts} 
              balance = {this.state.balance}
              EventsBlockbusterEventsContract = {this.state.EventsBlockbusterEventsContract}
              MoviesBlockbusterEventsContract = {this.state.MoviesBlockbusterEventsContract}
            />} />
            <Route path="/mymovies" component={() => <MyMovies 
              myMovies = {this.state.myMovies}
              earning = {this.state.earning}
              web3 = {this.state.web3} 
              accounts = {this.state.accounts} 
              MoviesBlockbusterEventsContract = {this.state.MoviesBlockbusterEventsContract}
            />} />
            <Route path="/hostevent" component = {() => <AddEvents 
              accounts = {this.state.accounts} 
              EventsBlockbusterEventsContract = {this.state.EventsBlockbusterEventsContract}
            />}/>
            <Route path="/events" component = {() => <Events 
              events = {this.state.events}
              accounts = {this.state.accounts} 
              EventsBlockbusterEventsContract = {this.state.EventsBlockbusterEventsContract}
            />}/>
            <Route path="/myevents" component = {() => <MyEvents 
             events = {this.state.events}
             accounts = {this.state.accounts} 
             EventsBlockbusterEventsContract = {this.state.EventsBlockbusterEventsContract}
            />} />
            
          </Switch>
        </Router>        
      </div>
    );
  }
}

export default App