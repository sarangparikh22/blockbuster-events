import React, { Component } from 'react'
import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import MyEventsEvent from './MyEventsEvent'
export class MyEvents extends Component {
    render() {
        return (
            <Container fluid>
                <h3>My Events</h3>
                <hr />
                <main className="grid-container">

                {this.props.events.map((event, index) => {
                    if(event[1] == this.props.accounts[0])
                    return <MyEventsEvent 
                    key={index}
                    event={event}
                    accounts = {this.props.accounts} 
                    EventsBlockbusterEventsContract = {this.props.EventsBlockbusterEventsContract}
                />
                })}
                </main>
            </Container>
        )
    }
}

export default MyEvents
