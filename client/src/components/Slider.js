import React, { Component } from 'react'
import { Carousel, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';

export class Slider extends Component {
    render() {
        return (
        <Carousel>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src="https://in.bmscdn.com/showcaseimage/eventimage/street-dancer-3-3d-16-01-2020-01-12-30-896.jpg"
            alt="First slide"
            />
        </Carousel.Item>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src="https://in.bmscdn.com/showcaseimage/eventimage/darbar-23-01-2020-02-33-51-490.jpg"
            alt="Third slide"
            />
        </Carousel.Item>
        <Carousel.Item>
            <img
            className="d-block w-100"
            src="https://in.bmscdn.com/showcaseimage/eventimage/panga-25-01-2020-06-42-53-893.jpg"
            alt="Third slide"
            />
        </Carousel.Item>
        </Carousel>
        )
    }
}

export default Slider
