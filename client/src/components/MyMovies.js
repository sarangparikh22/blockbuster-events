import React, { Component } from 'react'
import { Badge, InputGroup, Modal, Breadcrumb, Button, Navbar, Nav, NavDropdown, Form, FormControl, Popover, OverlayTrigger, Container } from 'react-bootstrap';
import MyMoviesMovie from './MyMoviesMovie'

export class MyMovies extends Component {
    withdrawBalance = () => {
        const {accounts, MoviesBlockbusterEventsContract } = this.props;
        MoviesBlockbusterEventsContract.methods.withdraw().send({from: accounts[0]})
        .then(res => window.location.reload())
    }
    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item><h4>My Movies {this.props.myMovies.length == 0 ? " - No Movies Hosted!" : <div style={{marginTop: "10px"}}><Button variant="primary"> Total Earning <Badge variant="light">{this.props.earning}</Badge><span className="sr-only">unread messages</span></Button>{' '}<Button onClick={this.withdrawBalance.bind(this)} variant="success">Withdraw</Button></div>}</h4></Breadcrumb.Item>
                </Breadcrumb>
            <div className="row flex-column-reverse flex-md-row">
                    {this.props.myMovies.map((m,index) => {
                        return <MyMoviesMovie
                            key={index}
                            active = {m.active}
                            movieName = {m[2]}
                            movieIMDB = {m[3]}
                            movieCID = {m[1] + '#' + m[0]}
                            accounts = {this.props.accounts} 
                            MoviesBlockbusterEventsContract = {this.props.MoviesBlockbusterEventsContract} 
                        />
                    })}
                    
            </div>
        </div>
        )
    }
}

export default MyMovies
