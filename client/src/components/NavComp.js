import React, { Component } from 'react'
import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';

export class NavComp extends Component {
    render() {
        return (
            <div>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/">Blockbuster.Events</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            
            </Nav>
            </Navbar.Collapse>
            {/* <Form inline>
            <FormControl type="text" placeholder="Movies, Events and More....." className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
            </Form> */}
            <NavDropdown title={`Welcome! ${(this.props.accounts == null || this.props.accounts.length == 0) ? "Metamask Please" : this.props.accounts[0].substr(0,9)}...`} id="basic-nav-dropdown">
                <NavDropdown.Item href="/mytickets">My Tickets</NavDropdown.Item>
                {this.props.accounts == null ? "" : this.props.isHall  ? <NavDropdown.Item href="/mymovies">My Movies</NavDropdown.Item> : ""}
                <NavDropdown.Item href="/hostevent">Host Event</NavDropdown.Item>
                <NavDropdown.Item href="/myevents">My Events</NavDropdown.Item>

                {this.props.accounts == null ? "" : this.props.isHall  ? <NavDropdown.Item href="/hostMovie">Host Movie</NavDropdown.Item> : ""}
                {this.props.accounts == null ? "" : this.props.owner == this.props.accounts[0] ? <NavDropdown.Item href="/registerHall">Register Hall</NavDropdown.Item> : ""} 
                {this.props.accounts == null ? "" : this.props.owner == this.props.accounts[0] ? <NavDropdown.Item href="/unregisterHall">Unregister Hall</NavDropdown.Item> : ""} 
            
            </NavDropdown>
        </Navbar>
        <Navbar bg="dark" variant="dark">
            <Nav className="mr-auto">
                <Nav.Link href="/">Movies</Nav.Link>
                <Nav.Link href="/events">Events</Nav.Link>
                <Nav.Link href="/meta">Meta Movies</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
            <OverlayTrigger delay={{ show: 250, hide: 400 }} placement="bottom" overlay={
                    <Popover id="popover-basic">
                    <Popover.Title as="h3">Account Address</Popover.Title>
                    <Popover.Content>
                        {this.props.accounts == null ? "Metamask Please" : this.props.accounts[0]}
                    </Popover.Content>
                </Popover>
            }>
                <Nav.Link href="#">Welcome! {(this.props.accounts == null || this.props.accounts.length == 0) ? "Metamask Please" : this.props.accounts[0].substr(0,9)}...</Nav.Link>
            </OverlayTrigger>
            </Nav>
      </Navbar>
      </div>
        )
    }
}

export default NavComp
