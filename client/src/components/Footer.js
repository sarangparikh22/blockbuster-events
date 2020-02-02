import React, { Component } from 'react'
import '../Footer.css'
import { Container } from 'react-bootstrap'
export class Footer extends Component {
    render() {
        return (
            <div>
                <footer className="site-footer">
                    <div className="container">
                        <div className="row">
                        <div className="col-sm-12 col-md-8">
                            <h6>About</h6>
                            <p className="text-justify">Blockbuster.Events is a decentralized Event and Movie Booking platform created on the Blockchain. The main goal is to democratized the Booking industry and increase revenue for the creators and reduce prices for the consumers. Blockbuster.Event allows anyone to host Event for Free and Movies can be hosted by the Theter Halls approved by the Blockbuster.Events team. There is no additional or hidden charge taken by Blockbuster.Events team.</p>
                        </div>



                        <div className="col-xs-12 col-md-3">
                            <h6>Quick Links</h6>
                            <ul className="footer-links">
                            <li><a href="/">Movies</a></li>
                            <li><a href="/events">Events</a></li>
                            </ul>
                        </div>
                        </div>
                        <hr />
                    </div>
                    <div className="container">
                        <div className="row">
                        <div className="col-md-8 col-sm-6 col-xs-12">
                            <p className="copyright-text">Copyright &copy; 2020 All Rights Reserved by {' '}
                         <a href="http://www.github.com/sarangparikh22">Blockbuster.Events</a>.
                            </p>
                        </div>

                        <div className="col-md-4 col-sm-6 col-xs-12">
                            <ul className="social-icons">
                            <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a></li>
                            <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a></li>
                            <li><a className="dribbble" href="#"><i className="fa fa-dribbble"></i></a></li>
                            <li><a className="linkedin" href="#"><i className="fa fa-linkedin"></i></a></li>   
                            </ul>
                        </div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Footer
