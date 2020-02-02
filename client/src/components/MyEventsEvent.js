import React, { Component } from 'react'
import { Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import "../EventCard.css"

export class MyEventsEvent extends Component {
    state = {flip: false, eIncome: 0, finished: false, active: true}
    
    flip = (e) => {
        if(this.state.flip){
            this.setState({flip: false});
        }else {
            this.setState({flip: true})
        }
    }

    getEventIncome = (id) => {
        const {accounts, EventsBlockbusterEventsContract } = this.props;
        // let id = e.target.id;
        EventsBlockbusterEventsContract.methods.getEventIncome(id).call({from: accounts[0]})
        .then(res => {
            EventsBlockbusterEventsContract.methods.isEventFinished(id).call({from: accounts[0]})
            .then(r => {
                EventsBlockbusterEventsContract.methods.isEventActive(id).call({from: accounts[0]})
                .then(re => {
                    // console.log(r)
                    this.setState({active: re, eIncome: res, finish: r})
                })
            })
        })

    }

    returnStake = (e) => {
        const {accounts, EventsBlockbusterEventsContract } = this.props;
        let id = e.target.id;
        EventsBlockbusterEventsContract.methods.retStake(id).send({from: accounts[0]})
        .then(tx => console.log(tx));
    }

    toggleEventActive = (e) => {
        const {accounts, EventsBlockbusterEventsContract } = this.props;
        let id = e.target.id;
        EventsBlockbusterEventsContract.methods.isEventActive(id).call({from: accounts[0]})
        .then(res => {
            console.log(res)
            if(res){
                EventsBlockbusterEventsContract.methods.deactivateEvent(id).send({from: accounts[0]})
                .then(tx => {
                    window.location.reload();
                    console.log(tx)
                    this.forceUpdate()
                })
            }else{
                console.log(this.props.event[0])
                EventsBlockbusterEventsContract.methods.activateEvent(this.props.event[0]).send({from: accounts[0]})
                .then(tx => {
                    window.location.reload();
                    this.forceUpdate()
                    console.log(tx)
                })
            }  
        })
    }

    finishEvent = (e) => {
        const {accounts, EventsBlockbusterEventsContract } = this.props;
        let id = e.target.id;
        EventsBlockbusterEventsContract.methods.finishEvent(this.props.event[0]).send({from: accounts[0]})
        .then(res => console.log(res))
        .catch(console.log)
    }
    withdraw = (e) => {
        const {accounts, EventsBlockbusterEventsContract } = this.props;
        let id = e.target.id;
        EventsBlockbusterEventsContract.methods.withdrawFromEvent(id).send({from: accounts[0]})
        .then(res => console.log(res))
        .catch(console.log)
    }
    addAttendee = (e) => {
        const {accounts, EventsBlockbusterEventsContract } = this.props;
        let id = e.target.id;
        EventsBlockbusterEventsContract.methods.eventAttendance(id, this.state.attendee).send({from: accounts[0]})
        .then(res => console.log(res))
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    render() {
        let flipClass = "card-container";
        if(this.state.flip){
            flipClass += " addFlip"
        }else{
            flipClass = "card-container"
        }
        return (
            <div className="grid-item">

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
                            <button className="btn-details grey" onClick={this.flip.bind(this)} aria-label="Learn more about the band and venue"> Manage</button>
                            {this.props.event[8] == 0 ? 
                            <button id={this.props.event[0]} onClick={this.withdraw.bind(this)} className="btn-tickets blue on-back" aria-label="Purchase tickets for this event" href="#">Withdraw</button>
                            :
                            <button id={this.props.event[0]} onClick={this.returnStake.bind(this)} className="btn-tickets blue on-back" aria-label="Purchase tickets for this event" href="#">Return Stake</button>
                            }                            
                            </div>
                        </section>

                        <section className="item-card-details">
                        <div className="bio-block">
                        <h2 className="bio-band">{this.props.event[2]}</h2>
                        <h3 className="bio-title">Event Management</h3>
                        </div>

                        <div className="more-info">
                        <button id={this.props.event[0]} onClick={this.toggleEventActive.bind(this)} className="btn-details grey" disabled={this.state.finish}>{this.state.active ? "Deactivate Event" : <div>Activate <br /> Event</div>}</button>
                        <button className="btn-details grey" id={this.props.event[0]} onClick={this.finishEvent.bind(this)} disabled={this.state.finish}>{this.state.finish ? "Event Finished" : <div>Finish<br />Event</div>}</button>
                        <p>
                            <a className="info" aria-label="Seats" href="#">Seats: {this.props.event[7]}</a>
                        </p>
                        <p>
                            {this.getEventIncome(this.props.event[0])}
                        {this.props.event[8] == 0 ? <a className="info">Total Income: {this.state.eIncome} wei</a>: <a className="info">Stake: {this.props.event[8]}</a>}<a className="info" aria-label="Stake or Price" href="#"></a>
                        </p>
                        {this.props.event[8] == 0 ? "" : 
                            <p style={{marginTop: "5px"}}>
                            <input type="text" name="attendee" onChange={this.handleChange.bind(this)} />
                            {' '}<Button onClick={this.addAttendee.bind(this)} id={this.props.event[0]}>Add Attendee</Button>
                            </p>
                        }
                        </div>
                        <div className="item-buttons back">
                        <button className="btn-details grey back-arrow" onClick={this.flip.bind(this)} aria-label="Learn more about the band and venue" href="#"></button>
                        {this.props.event[8] == 0 ? 
                        <button id={this.props.event[0]} onClick={this.withdraw.bind(this)} className="btn-tickets blue on-back" aria-label="Purchase tickets for this event" href="#">Withdraw</button>
                        :
                        <button id={this.props.event[0]} onClick={this.returnStake.bind(this)} className="btn-tickets blue on-back" aria-label="Purchase tickets for this event" href="#">Return Stake</button>
                        }
                        </div>
                        </section>
                        </div>
                        </div>
                        </div>
                        </div>

        )
    }
}

export default MyEventsEvent
