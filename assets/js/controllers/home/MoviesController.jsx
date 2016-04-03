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
            update: function(event){
                if(event.verb == "created"){
                    var newMovie = event.data;
                    newMovie.id = event.id;
                    var movies = this.state.movies;
                    movies.push(newMovie);
                    this.setState({movies: movies});
                }else if(event.verb == "updated"){
                    var id = event.id;
                    var movies = this.state.movies;
                    for(m in movies){
                        if(movies[m].id == id){
                            var movie = movies[m];
                            for(key in event.data){
                                movie[key] = event.data[key];
                            }
                            movies[m] = movie;
                        }
                    }
                    this.setState({movies: movies});
                }
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

                io.socket.get("/movie/updates", function(){
                    io.socket.on('movie', this.update);
                }.bind(this));
            },
            componentWillUnmount: function(){
                io.socket.off('movie', this.update);
            },
            render: function(){
                var movies = this.state.movies;

                if(this.state.loading === true){
                    return(
                        <div>
                            <h1 className="page-block">Movies</h1>
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
                            <h1 className="page-block">Movies  <small>{movies.length} Titles</small></h1>
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
