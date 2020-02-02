import React, { Component } from 'react'
import axios from 'axios';
import { InputGroup, Modal, Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';


export class MyMoviesMovie extends Component {
    state = {tics: 0, movieDesc: "", movieImg: "", movieCID: "", show: false, avail: false}
    componentDidMount() {
        axios.get(`https://www.omdbapi.com/?i=${this.props.movieIMDB}&apikey=20c0f047`)
            .then(res => {
                this.setState({movieImg: res.data.Poster, movieDesc: res.data.Plot});
            })
    }

    handleShow = (e) => {
        const {accounts, MoviesBlockbusterEventsContract } = this.props;
        let cidP = e.target.id;
        let cid = e.target.id.split('#');
        MoviesBlockbusterEventsContract.methods.hallMovieCollectionMapping(cid[0], cid[1]).call({from: accounts[0]})
        .then(res => {
            if(res[7] > 0){
                this.setState({show: true, movieCID: cidP, avail: true,  tics: res[7]});
            }else{
                this.setState({show: true, movieCID: cidP, avail: false});
            }
        })
    }

    handleClose = () => {
        this.setState({show: false, movieCID: ""})
    }

    toggleStatus = (e) => {
        const {accounts, MoviesBlockbusterEventsContract } = this.props;
        let cidP = e.target.id;
        let cid = e.target.id.split('#');
        MoviesBlockbusterEventsContract.methods.hallMovieCollectionMapping(cid[0], cid[1]).call({from: accounts[0]})
        .then(res => {
            if(res[9] == true){
                MoviesBlockbusterEventsContract.methods.stopBooking(cid[1]).send({from: accounts[0]})
                .then(res => window.location.reload())
            }else{
                MoviesBlockbusterEventsContract.methods.startBooking(cid[1]).send({from: accounts[0]})
                .then(res => window.location.reload())
            }
        })    
    }

    setTickets = (e) => {
        const {accounts, MoviesBlockbusterEventsContract } = this.props;
        let cidP = e.target.id;
        let cid = e.target.id.split('#');
        MoviesBlockbusterEventsContract.methods.setSeats(cid[1], this.state.ticketQt).send({from: accounts[0]})
        .then(res => window.location.reload())
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
                <div className="col-md-6">
                    <div className="card">   
                    <div className="card-header">
                        <img className="card-img" src={this.state.movieImg} alt="Card image" />
                    </div>  
                    <div className="card-body">
                        <h1 className="card-title">{this.props.movieName}</h1>
                        <div className="container">
                            <div className="row">
                                <div className="col-2 metadata">
                                <i className="fa fa-star" aria-hidden="true"></i> 
                                <p>9.5/10</p>
                                </div>
                                <div className="col-2 metadata">Adventure. Sci-Fi</div>
                                <div className="col-2 metadata">Adventure. Sci-Fi</div>

                            </div>
                        </div>      
                        <p className="card-text">{this.state.movieDesc}</p>
                        <a className="trailer-preview" href="https://youtu.be/ePbKGoIGAXY" target="new">
                            <i className="fa fa-play" aria-hidden="true"></i>
                        </a>
                        {/* <button id={this.props.movieCID} onClick={this.showModal.bind(this)}> Buy Tickets </button> */}
                        <Button variant="primary" id={this.props.movieCID} onClick={this.handleShow.bind(this)}>
                            Set Tickets
                        </Button>
                        {' '}
                        <Button variant={this.props.active == true ? "danger" : "success"} id={this.props.movieCID} onClick={this.toggleStatus.bind(this)}>
                            {this.props.active == true ? "Stop Booking" : "Start Booking"}
                        </Button>

                        <Modal show={this.state.show} onHide={this.handleClose.bind(this)} animation={false}>
                            <Modal.Header closeButton>
                            <Modal.Title>Set Tickets</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <p>Tickets Available: {this.state.tics}</p>
                                    <InputGroup size="sm" className="mb-3">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">No.of Tickets</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl  name="ticketQt" onChange={this.handleChange.bind(this)} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                    </InputGroup>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose.bind(this)}>
                                Close
                            </Button>
                            <Button id={this.props.movieCID} variant="primary" onClick={this.setTickets.bind(this)}>
                                Set Tickets
                            </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    </div>
                </div>
        )
    }
}

export default MyMoviesMovie
