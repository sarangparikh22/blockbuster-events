import React, { Component } from 'react'
import { Badge, Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';

import "../TicketCard.css"

export class Ticket extends Component {

    reqRefund(e) {
        const {accounts, MoviesBlockbusterEventsContract } = this.props;
        let cid = e.target.id.split('#');
        MoviesBlockbusterEventsContract.methods.reqRefund(cid[0], cid[1]).send({from: accounts[0]})
        .then(res => {
            window.location.reload()
        });
    }
    render() {
        return (
            <div className="tcardWrap">
                <div className="tcard tcardLeft">
                    <h1>{this.props.type} - {this.props.eventID}{this.props.movieID} {this.props.cancel == true ? <div><Badge pill variant="warning">Cancelled</Badge> {' '}</div>: ""}</h1>
                    <div className="ttitle">
                    <h2>{this.props.eventName}{this.props.title}</h2>
                    <span>{this.props.type == "Event" ? "event" : "movie"}</span>
                    </div>
                    <div className="tname">
                    <h2>{this.props.eventBuyer}{this.props.buyer}</h2>
                    <span>name - address</span>
                    </div>
                    <div className="tseat">
                    <h2>{this.props.eventLoc}{this.props.hall}</h2>
                    <span>hall - address</span>
                    </div>                  
                </div>
                <div className="tcard tcardRight">
                    <div className="teye"></div>
                    <div className="tnumber">
                    <h3>{this.props.type == "Event" ? "1" : this.props.qty}</h3>
                    <span>Tickets</span>
                    </div>
                    {this.props.type == "Event" ? "" : <Button  onClick={this.reqRefund.bind(this)}id={this.props.refundID} variant="outline-success" size="sm">Request Refund</Button>}
                </div>

            </div>
        )
    }
}

export default Ticket
