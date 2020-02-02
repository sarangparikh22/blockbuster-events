import React, { Component } from 'react'
import Slider from './Slider'
import Movies from './Movies'

import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';

export class Home extends Component {
    render() {
        return (
            <div>
                <Container fluid>
                    <Slider />
                </Container>
                <div style={{backgroundColor: "#DCDCDC", paddingBlockStart: "20px"}}>
                    <Container fluid>
                        <h3>Movies - {this.props.movies.length == 0 ? "No Upcoming Show" : ""}</h3>
                        <hr />
                        <Movies 
                            mov={this.props.movies}
                            web3 = {this.props.web3} 
                            accounts = {this.props.accounts} 
                            MoviesBlockbusterEventsContract = {this.props.MoviesBlockbusterEventsContract} 
                        />
                    </Container>
                </div>
            </div>
        )
    }
}

export default Home
