import React, { Component } from 'react'
import ipfs from '../ipfs'
import { Row, InputGroup, Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container, Col, BreadcrumbItem } from 'react-bootstrap';
import Footer from './Footer'
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

export class AddEvents extends Component {
    state = {show: false, ipfsURL: ""}
    handleChange = (e) => {
        if(e.target.name == "eventDate"){
            this.setState({eventDate: Math.floor(new Date(e.target.value).getTime() / 1000)})
        }else{
            this.setState({ [e.target.name]: e.target.value });
        }
    };

    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
      };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer to prepare for uploading to IPFS
      const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
      this.setState({buffer});
      ipfs.add(this.state.buffer)
      .then( (hash) => {
          console.log(hash);
          this.setState({ipfsURL: hash[0].hash})
      })
    };

    createEvent = () => {
        const {accounts, EventsBlockbusterEventsContract } = this.props;
        EventsBlockbusterEventsContract.methods.createEvent(
            this.state.eventName,
            this.state.ipfsURL,
            this.state.eventDesc,
            this.state.eventLocation,
            this.state.eventDate,
            this.state.eventSeats,
            this.state.eventStake,
            this.state.eventPrice
        ).send({from: accounts[0]})
        .then(tx => {
            this.setState({show: true})
            console.log(tx);
        })
        .catch(console.log)
    }

    render() {
        return (
            <div>
                <SweetAlert
                  show={this.state.show}
                  title="Success"
                  type="success"
                  text="Event Created"
                  onConfirm={() => window.location.reload()}
                />
            <Container fluid className="align-self-center">
                <h3>Host Event</h3>
                <hr />
                <Form.Label>Event Name </Form.Label><Form.Control type="text" onChange={this.handleChange.bind(this)} name="eventName" /><br />
                <Form.Label>Event Description </Form.Label><Form.Control as="textarea" row="5" type="text" onChange={this.handleChange.bind(this)} name="eventDesc" /><br />
                <Form.Label>Event Address</Form.Label><Form.Control as="textarea" row="5" type="text" onChange={this.handleChange.bind(this)} name="eventLocation" /><br />
                <Form.Label>Date and Time </Form.Label><Form.Control type="datetime-local" name="eventDate" onChange={this.handleChange.bind(this)}/><br />
                <Form.Label>Total Seats</Form.Label><Form.Control type="number" min={0} onChange={this.handleChange.bind(this)} name="eventSeats" /><br />
                <Form.Label>Event Banner Image</Form.Label><Form.Control type="file" onChange={this.captureFile.bind(this)}/><br />
                <Form.Label>Uploaded Image Hash: {this.state.ipfsURL}</Form.Label> <br />
                <Form.Label>Event Staking</Form.Label> <Form.Control min={0} type="number" onChange={this.handleChange.bind(this)} name="eventStake" /><br />
                <Form.Label>Event Price</Form.Label> <Form.Control min={0} type="number" onChange={this.handleChange.bind(this)} name="eventPrice" /><br />
                <Button block style={{marginBottom: "15px"}} size="lg" variant="success" onClick={this.createEvent.bind(this)}><i className="fa fa-pencil" /> Create Event</Button>
            </Container>
            <Footer />
            </div>
        )
    }
}

export default AddEvents
