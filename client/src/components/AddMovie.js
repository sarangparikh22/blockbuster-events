import React, { Component } from 'react'
import { Row, InputGroup, Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container, Col, BreadcrumbItem } from 'react-bootstrap';
import Footer from './Footer'
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

export class AddMovie extends Component {
    state = {show: false, movieCancellation: false, date: new Date()}

    handleChange = (e) => {
        if(e.target.name == "movieCancellation"){
            if(e.target.value == "0"){
                this.setState({movieCancellation: false})
            }else{
                this.setState({movieCancellation: true})
            }
        }else if(e.target.name == "movieTime"){
            this.setState({movieTime: Math.floor(new Date(e.target.value).getTime() / 1000)})
        }else{
            this.setState({ [e.target.name]: e.target.value });
        }
    };
    addMovie = async () => {
        const {web3, accounts, MoviesBlockbusterEventsContract } = this.props;

        this.setState({loading: true})
        try{
          await MoviesBlockbusterEventsContract.methods.addMovie(
              this.state.movieName,
              this.state.movieIMDB,
              this.state.movieTrailer,
              this.state.movieFormat,
              this.state.movieTime,
              this.state.movieSeats,
              this.state.moviePrice,
              this.state.movieCancellation
              ).send({from: accounts[0]})
        }catch(e) {
          if(e.code == 4001){
            alert(`User denied Signing the Transaction`);
          }else{
            alert(`Failed to do the Transaction`);
          }
        }
        this.setState({show: true, loading: false})
    }

    render() {
        return (
            <div>
                <SweetAlert
                  show={this.state.show}
                  title="Success"
                  type="success"
                  text="Movie Added Successfully"
                  onConfirm={() => window.location.reload()}
                />
            <Container fluid>
                <h3>Host Movie</h3>
                <hr />
                <Form.Label>Movie Name</Form.Label> <Form.Control type="text" name="movieName" onChange={this.handleChange.bind(this)}/><br />
                <Form.Label>Movie IMDB</Form.Label><Form.Control type="text" name="movieIMDB" onChange={this.handleChange.bind(this)}/><br />
                <Form.Label>Movie Trailer</Form.Label> <Form.Control type="text" name="movieTrailer" onChange={this.handleChange.bind(this)}/><br />
                <Form.Label>Format (0-2D | 1-3D)</Form.Label> <Form.Control type="text" name="movieFormat" onChange={this.handleChange.bind(this)}/><br />
                <Form.Label>Time</Form.Label><Form.Control type="datetime-local" name="movieTime" onChange={this.handleChange.bind(this)}/><br />
                <Form.Label>Total Seats</Form.Label><Form.Control type="number" min={0} name="movieSeats" onChange={this.handleChange.bind(this)}/><br />
                <Form.Label>Price</Form.Label> <Form.Control type="number" min={0} name="moviePrice" onChange={this.handleChange.bind(this)}/><br />
                <Form.Label>Cancellation (0-False | 1-True)</Form.Label><Form.Control type="text" name="movieCancellation" onChange={this.handleChange.bind(this)}/><br />
                <Button block variant="success" onClick={this.addMovie.bind(this)}><i className="fa fa-video-camera" /> Host Movie</Button>
                <br />
            </Container>
            <Footer />
            </div>
        )
    }
}

export default AddMovie
