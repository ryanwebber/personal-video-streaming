define(['react', 'jquery', 'app/controllers/home/MovieItem'], 
    function (React, $, MovieItem) {

        var MoviesController = React.createClass({
            getInitialState: function() {
                return {
                    movies: [],
                    loading: true,
                    error: null
                };
            },
            setLoading: function(val){
                var state = this.state;
                state.loading = val;
                this.setState(state);
            },
            componentDidMount: function() {
                // TODO stuff
                $.get("/movie").done(function(movies){
                    this.setState({movies: movies});
                }.bind(this)).fail(function(err){
                    this.setState({error: "Couldn't Load Movies"});
                }.bind(this)).always(function(){
                    this.setState({loading: false});
                }.bind(this));
            },
            componentWillUnmount: function(){
                // TODO stuff
            },
            render: function(){
                var movies = this.state.movies;

                if(this.state.loading === true){
                    return(
                        <div>
                            <h1>Movies</h1>
                            <hr/>
                            <div className="movie-container">
                                <div className="spinner center--all"></div>
                            </div>
                        </div>
                    );
                }else{
                    var movies = movies.map(function(movie, i){
                        return(
                            <MovieItem movie={movie} key={movie.id + "-" + i}/>
                        );
                    }.bind(this));

                    return(
                        <div>
                            <h1>Movies  <small>{movies.length} Titles</small></h1>
                            <hr/>
                            <div className="movie-container">
                                {movies}
                            </div>
                        </div>
                    );
                }
            }
        });
        return MoviesController;

    }
);
