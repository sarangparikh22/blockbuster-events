import React, { Component } from 'react'
import Movie from './Movie';
import '../MovieCard.css'

export class ShowMovies extends Component {
    state = {movies: []}
    componentWillMount = async () => {
        const {accounts, MoviesBlockbusterEventsContract } = this.props;
        let movieCount = await MoviesBlockbusterEventsContract.methods.hallMovieCountMapping(accounts[0]).call({from: accounts[0]});
        let movie;
        let movies = [];
        for(let i = 1; i <= movieCount; i++){
            movie = await MoviesBlockbusterEventsContract.methods.hallMovieCollectionMapping(accounts[0], i).call({from: accounts[0]})
            movies.push(movie);
        }
        this.setState({movies});
        console.log(this.state.movies)
    }

    render() {
        return (
            <div>
                <h3>Showing Movies - {this.state.movies.length}</h3>
                {this.state.movies.map(m => {
                    return (<p key={m[0]}>Name: {m[2]} <br/> Price: {m[6]} </p>);
                })}

                <div>
                    <div className="row flex-column-reverse flex-md-row">
                        {this.props.movies}
                    </div>
                </div>
            </div>
        )
    }
}

export default ShowMovies
