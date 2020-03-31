import React, { Component } from 'react'
import axios from 'axios';
import { InputGroup, Modal, Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import Web3 from 'web3';

export class MetaMovie extends Component {
    state = {alertshow: false, tics: 0, movieDesc: "", movieImg: "", movieCID: "", show: false, avail: false}
    componentDidMount() {
        axios.get(`https://www.omdbapi.com/?i=${this.props.movieIMDB}&apikey=20c0f047`)
            .then(res => {
                this.setState({
                    movieGenre: res.data.Genre,
                    movieImg: res.data.Poster, 
                    movieDesc: res.data.Plot,
                    movieRating: res.data.imdbRating,
                    movieRuntime: res.data.Runtime
                });
            })
            const {accounts, MoviesBlockbusterEventsContract } = this.props;
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

    buyTicket = () => {
        const { web3, accounts, MoviesBlockbusterEventsContract } = this.props;
        let cid = this.state.movieCID.split('#');
        MoviesBlockbusterEventsContract.methods.hallMovieCollectionMapping(cid[0], cid[1]).call({from: accounts[0]})
            .then(res => {
                console.log(`1${cid[0].toLocaleLowerCase()}${cid[1]}${this.state.ticketQt}`)
                console.log(web3.eth.accounts.hashMessage(`1${cid[0].toLocaleLowerCase()}${cid[1]}${this.state.ticketQt}`))
                web3.eth.personal.sign(`1${cid[0].toLocaleLowerCase()}${cid[1]}${this.state.ticketQt}`, accounts[0])
                .then(sig => {
                    axios.get(`http://localhost:1337/tx?sig=${sig}&nonce=1&hall=${cid[0]}&movieID=${cid[1]}&ticket=${this.state.ticketQt}`)
                    .then(b => {
                        this.handleClose();
                        this.setState({alertshow: true})
                    })
                })
                console.log(res)
            })
    }

    handleChange = (e) => {
        if(e.target.name == "movieCancellation"){
            if(e.target.value == "0"){
                this.setState({movieCancellation: false})
            }else{
                this.setState({movieCancellation: true})
            }
        }else{
            this.setState({ [e.target.name]: e.target.value });
        }
    };
    checkfuncCall = () => {
        const {accounts, MoviesBlockbusterEventsContract } = this.props;
        let cid = this.props.movieCID.split('#');
        MoviesBlockbusterEventsContract.methods.hallMovieCollectionMapping(cid[0], cid[1]).call({from: accounts[0]})
            .then(res => {
                let d = new Date(res[6] * 1000);
                this.setState({cal: d.toLocaleString(), trailer: res[4]});
            })
    }
    render() {
        return (
                <div className="col-md-6">
                    <SweetAlert
                        show={this.state.alertshow}
                        title="Success"
                        type="success"
                        text="Tickets Booked Successfully"
                        onConfirm={() => this.setState({ alertshow: false })}
                    />
                    <div className="card">   
                    <div className="card-header">
                        <img className="card-img" src={this.state.movieImg} alt="Card image" />
                    </div>  
                    <div className="card-body">
                        <h1 className="card-title">{this.props.movieName}</h1>
                        <div className="container">
                            <div className="row">
                                <div className="col-3 metadata">
                                    <i className="fa fa-star" aria-hidden="true" /> {' '}
                                    {this.state.movieRating}/10
                                </div>
                                <div className="col-3 metadata">
                                    <i className="fa fa-clock-o" aria-hidden="true"></i>{' '}
                                    {this.state.movieRuntime}
                                </div>
                                <div className="col-6 metadata">
                                    <i className="fa fa-user-o" aria-hidden="true"></i>{' '}
                                    {this.state.movieGenre}
                                </div>
                            </div>
                        </div>      
                        <p className="card-text">{this.state.movieDesc}</p>
                        <a className="trailer-preview" href={this.state.trailer} target="new">
                            <i className="fa fa-play" aria-hidden="true"></i>
                        </a>
                        <p>{this.checkfuncCall()}</p>
                        <p>
                            <i className="fa fa-calendar" aria-hidden="true"></i>{' '}
                            {this.state.cal}
                        </p>
                        {/* <button id={this.props.movieCID} onClick={this.showModal.bind(this)}> Buy Tickets </button> */}
                        <Button variant="primary" id={this.props.movieCID} onClick={this.handleShow.bind(this)}>
                            <i className="fa fa-ticket" aria-hidden="true"></i>{' '}
                            Book Tickets
                        </Button>

                        <Modal show={this.state.show} onHide={this.handleClose.bind(this)} animation={false}>
                            <Modal.Header closeButton>
                            <Modal.Title>Book Tickets</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    this.state.avail ? 
                            <div>
                                 <p>Tickets Available: {this.state.tics}</p>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">No.of Tickets</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl  name="ticketQt" onChange={this.handleChange.bind(this)} aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                </InputGroup>
                            </div>
                            : "Sorry! All Tickets Sold!!"}
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose.bind(this)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.buyTicket.bind(this)}>
                                Book Tickets
                            </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    </div>

                </div>
        )
    }
}

export default MetaMovie
