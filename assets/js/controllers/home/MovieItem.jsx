define(['react', 'jquery'], 
    function (React, $) {

        var MovieItem = React.createClass({
            linkForMovie: function(movie){
                var base = "/watch/";
                return base + movie.video.id;
            },
            render: function(){
                var movie = this.props.movie;
                var styles = {
                    backgroundImage: "url("+movie.cover+")",
                    backgroundSize: "cover",
                    border: "1px solid white",
                    position: "relative",
                    width: "800px"
                };

                var trans = {
                    backgroundColor: "rgba(0,0,0,0.7)"
                };

                return(
                    <div className="movie-item">
                        <div id={movie.id} className="modal modal--flat">
                            <div className="modal-container" style={styles}>
                                <div className="modal-header" style={trans}>
                                    <a href="#close" className="modal-close">
                                        <span className="badge bg--muted">&times;</span>
                                    </a>
                                </div>
                                <div className="modal-body" style={trans}>
                                    <h2 className="movie-name">{movie.name}</h2>
                                    <h3 className="movie-year">({movie.year})</h3>
                                    <p className="movie-description">
                                        <img className="inline-poster" src={movie.poster} />
                                        {movie.description}
                                    </p>
                                    <br/><br/>
                                    <div className="center">
                                        <a href={this.linkForMovie(movie)} className="watch-button center">Watch</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a href={"#" + movie.id}>
                            <img className="movie-poster" src={movie.poster} />
                        </a>
                    </div>
                );

            }
        });
        return MovieItem;

    }
);
