import React, { Component } from 'react'
import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import Ticket from './Ticket'

export class MyTickets extends Component {
    withdraw = () => {
        const {accounts, EventsBlockbusterEventsContract } = this.props;
        EventsBlockbusterEventsContract.methods.withdraw().send({from: accounts[0]})
        .then(tx => {
            console.log(tx);
            window.location.reload();
        })
    }
    render() {
        return (
            <div>
                <Container fluid>
                    <Breadcrumb>
                        <Breadcrumb.Item><h4>Past Tickets {(this.props.myTickets.length == 0) && (this.props.myEventTickets.length == 0) ? " - No Tickets! Go Book Some!" : <div>Balance: {this.props.balance} <Button onClick={this.withdraw.bind(this)}>Withdraw</Button></div>} </h4></Breadcrumb.Item>
                    </Breadcrumb>
                    {
                        this.props.myTickets.map((ticket, index) => {
                        return  <Ticket 
                                    key={index}
                                    type = "Movie"
                                    title = {ticket.movieName}
                                    qty =  {ticket[3]}
                                    buyer = {ticket[0]}
                                    hall = {ticket[1]}
                                    movieID = {ticket[2]}
                                    refundID = {ticket[1] + '#' + ticket[2]}
                                    accounts = {this.props.accounts} 
                                    MoviesBlockbusterEventsContract = {this.props.MoviesBlockbusterEventsContract}
                                    cancel = {ticket.cancel}
                                />
                        })
                    }
                    {
                        this.props.myEventTickets.map((ticket, index) => {
                            return <Ticket 
                                        key={index}
                                        type="Event"
                                        eventName={ticket[1]}
                                        eventID={ticket[0]}
                                        eventLoc={ticket[3]}
                                        eventBuyer={ticket[2]}
                                    />
                        })
                    }

                </Container>
            </div>
        )
    }
}

export default MyTickets
