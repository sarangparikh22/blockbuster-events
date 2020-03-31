import React, { Component } from 'react'
import Movie from './MetaMovie';
import '../MovieCard.css'
import Footer from './Footer'

export class MetaMovies extends Component {
    render() {
        return (
            <div>
                <div className="row flex-column-reverse flex-md-row">
                        {this.props.mov.map((m,index) => {
                            return <Movie
                                web3={this.props.web3}
                                key={index}
                                movieName = {m[2]}
                                movieIMDB = {m[3]}
                                movieCID = {m[1] + '#' + m[0]}
                                accounts = {this.props.accounts} 
                                MoviesBlockbusterEventsContract = {this.props.MoviesBlockbusterEventsContract} 
                            />
                        })}
                        
                </div>
                <Footer />
            </div>
        )
    }
}

export default MetaMovies
