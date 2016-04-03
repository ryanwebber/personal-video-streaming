define(['react', 'jquery', 'app/controllers/home/ModalController'], 
    function (React, $, ModalController) {

        var MovieItem = React.createClass({
            getInitialState: function(){
                return {
                    modalOpen: false,
                    progress: null
                };
            },
            componentDidMount: function() {
                io.socket.on('upload.progress', this.updateProgress);
            },
            componentWillUnmount: function(){
                io.socket.off('upload.progress', this.updateProgress);
            },
            linkForMovie: function(movie){
                var base = "/watch/";
                return base + movie.video.id;
            },
            openModal: function(){
                this.setState({modalOpen: true});
            },
            closeModal: function(){
                this.setState({modalOpen: false});
            },
            updateProgress: function(obj){
                var id = obj.id;
                var progress = obj.progress;
                if(id == this.props.movie.id){
                    this.setState({progress: progress});
                }
            },
            render: function(){
                var movie = this.props.movie;

                if(movie.video){
                    var styles = {
                        backgroundImage: "url("+movie.cover+")",
                        backgroundSize: "cover"
                    };

                    return(
                        <div className="movie-item">
                            <a onClick={this.openModal}>
                                <img className="movie-poster" src={movie.poster} />
                            </a>
                            <ModalController isOpen={this.state.modalOpen} hideModal={this.closeModal} styles={styles}>
                                <div className="movie-modal">
                                    <img className="inline-poster" src={movie.poster} />
                                    <h2 className="movie-name">{movie.name}</h2>
                                    <h3 className="movie-year">({movie.year})</h3>
                                    <hr/><br/>
                                    <span>Description:</span>
                                    <p className="movie-description text--justify">
                                        {movie.description}
                                    </p>
                                    <br/><br/>
                                    <div className="center">
                                        <a href={this.linkForMovie(movie)} className="watch-button center">
                                            Watch  <i className="fa fa-play-circle"></i>
                                        </a>
                                    </div>
                                </div>
                            </ModalController>
                        </div>
                    );
                }else{

                    if(this.state.progress != null){
                        var contents = (
                            <div className="center--all">
                                <div className="spinner"></div>
                                <br/>
                                <span>{this.state.progress}%</span>
                            </div>
                        );
                    }else{
                        var contents = (
                            <div className="center--all">
                                <div className="spinner"></div>
                            </div>
                        );
                    }

                    return(
                        <div className="movie-item">
                            <img className="movie-poster" src={movie.poster} />
                            <div className="movie-placeholder overlay-layer">
                                {contents}
                            </div>
                        </div>
                    );
                }
            }
        });
        return MovieItem;

    }
);
