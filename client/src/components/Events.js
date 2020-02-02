import React, { Component } from 'react'
import Event from './Event'
import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';

export class Events extends Component {
   
    render() {
        return (
            <Container fluid>
                <h3>Events</h3>
                <hr />
                <main className="grid-container">
                {this.props.events.map((event, index) => {
                    return <Event 
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

export default Events
