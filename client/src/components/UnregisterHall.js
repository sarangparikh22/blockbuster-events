import React, { Component } from 'react'
import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import Footer from './Footer'
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
export class UnregisterHall extends Component {
        
    state = {show: false, status: false, loading: false}

    handleRegHallText(e) {
        this.setState({regHallText: e.target.value})
    }

    unregHall = async () => {
        const {accounts, MoviesBlockbusterEventsContract } = this.props;
        this.setState({loading: true})
        try{
          await MoviesBlockbusterEventsContract.methods.unregisterHall(this.state.regHallText).send({from: accounts[0]})
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
                  text="Hall Unregistered"
                  onConfirm={() => this.setState({ show: false })}
                />
              <Container fluid>
                <h3>Unregister Hall</h3>
                <hr />
                <Form.Label>Enter Hall Address</Form.Label><Form.Control type="text" onChange={this.handleRegHallText.bind(this)}/>
                <br />
                <Button block variant="danger" onClick={this.unregHall.bind(this)}>{this.state.loading ?  "Doing Transaction...." : "Unregister Hall"}</Button>
                <br />
              </Container>
              <Footer />
            </div>
        )
    }
}

export default UnregisterHall
