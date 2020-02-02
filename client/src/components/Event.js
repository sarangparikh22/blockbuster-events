import React, { Component } from 'react'
import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import "../EventCard.css"
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

export class Event extends Component {
    state = {flip: false}
    flip = (e) => {
        if(this.state.flip){
            this.setState({flip: false});
        }else {
            this.setState({flip: true})
        }
    }

    book = (e) => {
        const {accounts, EventsBlockbusterEventsContract } = this.props;
        let id = e.target.id;
        EventsBlockbusterEventsContract.methods.getEventDetails(id).call({from: accounts[0]})
        .then(res => {
            if(res[8] == 0){
                EventsBlockbusterEventsContract.methods.register(id).send({from: accounts[0], value: res[9]})
                .then(tx => {
                    this.setState({show: true})
                    console.log(tx)
                })               
            }else{
                EventsBlockbusterEventsContract.methods.stakeAndRegister(id).send({from: accounts[0], value: res[8]})
                .then(tx => {
                    this.setState({show: true})
                    console.log(tx)
                })
            }
            
        })
    }
    render() {
        let flipClass = "card-container";
        if(this.state.flip){
            flipClass += " addFlip"
        }else{
            flipClass = "card-container"
        }
        return (
            <div className="grid-item">
                <SweetAlert
                  show={this.state.show}
                  title="Success"
                  type="success"
                  text="Booked For the Event!"
                  onConfirm={() => window.location.reload()}
                />
                        <div className="wrapper frontback-cards">
                            <div className= {flipClass} >
                            <div className="flip-animation">

                        <section className="item-card">
                            <div className="item-summary">
                                <h2 className="title">{this.props.event[2]}</h2>
                                <p className="venue">{this.props.event[5]}</p>
                                <address className="address">
                                    {/* <p className="street-address">1233 Seventeenth St.</p> */}
                                        <p className="locality">Creator: {this.props.event[1]}</p>
                                </address>
                            </div>
                            <div className="image-wrapper">
                            <img className="featured-image" src={"https://gateway.ipfs.io/ipfs/"+this.props.event[4]} alt="The Paper Kites performing, overlooking a crowd" />
                            </div>
                            <div className="item-time-date">
                                <time className="date">{new Date(this.props.event[6] * 1000).toLocaleString()}</time>
                            {/* <time className="time" dateTime="19:00">7:00 PM</time> */}
                            </div>
                            <div className="item-buttons front-buttons">
                            <button className="btn-details grey" onClick={this.flip.bind(this)} aria-label="Learn more about the band and venue"> Details</button>
                            <button id={this.props.event[0]} onClick={this.book.bind(this)} className="btn-tickets blue" aria-label="Purchase tickets for this event" href="#">Book</button>
                            </div>
                        </section>

                        <section className="item-card-details">
                        <div className="bio-block">
                        <h2 className="bio-band">{this.props.event[2]}</h2>
                        <h3 className="bio-title">Event Details</h3>
                        </div>
                        <div className="scroll-block">
                        <p className="bio-text">{this.props.event[3]}</p>
                        </div>
                        <div className="more-info">
                        <p>
                            <a className="info" aria-label="Seats" href="#">Seats: {this.props.event[7]}</a>
                        </p>
                        <p>
                        {this.props.event[8] == 0 ? <a className="info">Price: {this.props.event[9]} wei</a>: <a className="info">Stake: {this.props.event[8]}</a>}<a className="info" aria-label="Stake or Price" href="#"></a>
                        </p>
                        </div>
                        <div className="item-buttons back">
                        <button className="btn-details grey back-arrow" onClick={this.flip.bind(this)} aria-label="Learn more about the band and venue" href="#"></button>
                        <button onClick={this.book.bind(this)} className="btn-tickets blue on-back" aria-label="Purchase tickets for this event" href="#">Book</button>
                        </div>
                        </section>
                        </div>
                        </div>
                        </div>
                        </div>

        )
    }
}

export default Event
