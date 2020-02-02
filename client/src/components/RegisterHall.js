import React, { Component, useLayoutEffect } from 'react'
import firebase from '../firebase'
import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import Footer from './Footer'
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

export class RegisterHall extends Component {
    
    state = {show: false, status: false, loading: false}

    handleRegHallText(e) {
        this.setState({regHallText: e.target.value})
    }

    regHall = async () => {
        const {accounts, MoviesBlockbusterEventsContract } = this.props;
        this.setState({loading: true})
        try{
          await MoviesBlockbusterEventsContract.methods.registerHall(this.state.regHallText).send({from: accounts[0]})
          // const fb = firebase.database().ref('halls');
          // const hall = {
          //   name: this.state.regHallText,
          //   location: "blr"
          // }
          // fb.push(hall);
          this.setState({show: true})
        }catch(e) {
          if(e.code == 4001){
            alert(`User denied Signing the Transaction`);
          }else{
            alert(`Failed to do the Transaction`);
          }
        }
        this.setState({loading: false})
    
    }
    render() {
        return (
            <div>
              <SweetAlert
                  show={this.state.show}
                  title="Success"
                  type="success"
                  text="Hall Registered"
                  onConfirm={() => this.setState({ show: false })}
                />
              <Container fluid>
                <h3>Register Hall</h3>
                <hr />
                <Form.Label>Address of Hall</Form.Label><Form.Control type="text" onChange={this.handleRegHallText.bind(this)}/>
                <br />
                <Button block variant="success" onClick={this.regHall.bind(this)}>{this.state.loading ?  "Doing Transaction...." : "Register Hall"}</Button>
                <br />
              </Container>
              <Footer />

            </div>
        )
    }
}

export default RegisterHall
