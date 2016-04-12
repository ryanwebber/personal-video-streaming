define(['react', 'jquery', 'app/controllers/home/ModalController', 'app/dependencies/react-slick'], 
    function (React, $, ModalController, Carousel) {

        var LeftCarouselButton = React.createClass({
            render: function() {
                return(
                    <button {...this.props} className="carousel-button left">
                        <i className="fa fa-chevron-circle-left center--all"></i>
                    </button>
                );
            }
        });

        var RightCarouselButton = React.createClass({
            render: function() {
                return(
                    <button {...this.props} className="carousel-button right">
                        <i className="fa fa-chevron-circle-right center--all"></i>
                    </button>
                );  
            }
        });

        var ShowItem = React.createClass({
            getInitialState: function(){
                return {
                    modalOpen: false,
                    progress: null,
                    activeSeason: 0,
                    loadingSeasons: true,
                    seasons: []
                };
            },
            componentDidMount: function() {
                io.socket.on('upload.progress', this.updateProgress);
                $.get("/season", {
                    show: this.props.show.id
                }).done(function(seasons){
                    this.setState({
                        seasons: seasons
                    });
                }.bind(this)).always(function(){
                    this.setState({
                        loadingSeasons: false
                    });
                }.bind(this));
            },
            componentWillUnmount: function(){
                io.socket.off('upload.progress', this.updateProgress);
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
                if(id == this.props.show.id){
                    this.setState({progress: progress});
                }
            },
            linkForEpisode: function(episode){
                var base = "/watch/";
                return base + episode.video;
            },
            render: function(){
                var show = this.props.show;

                var styles = {
                    backgroundImage: "url("+show.cover+")",
                    backgroundSize: "cover"
                };

                var str = show.seasons.length + " Season";
                if(show.seasons.length != 1){
                	str += "s";
                }

                if(this.state.loadingSeasons){
                    var episodeElem = (
                        <div className="spinner center--all"></div>
                    );
                }else if(show.seasons.length > 0){

                	var settings = {
						dots: false,
						infinite: false,
						speed: 500,
						slidesToShow: 5,
						slidesToScroll: 3,
						draggable: false,
                        nextArrow: RightCarouselButton,
                        prevArrow: LeftCarouselButton,
				    };

                    var episodes_unsorted = this.state.seasons[this.state.activeSeason].episodes;
                    episodes_unsorted.sort(function(ea, eb){
                        return ea.episodeNumber - eb.episodeNumber;
                    });

                    var episodeItems = episodes_unsorted.map(function(episode){
                        var style = {
                            backgroundImage: "url("+episode.screenshot+")",
                            backgroundSize: "cover"
                        };

                        return (
                            <div className="episode-item" key={episode.id}>
                                <a href={this.linkForEpisode(episode)}>
                                    <div style={style}>
                                        <div className="inner-episode">
                                            <i className="fa fa-2x fa-play-circle center--all"></i>
                                            <span className="episode-text">Episode {episode.episodeNumber}</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        );
                    }.bind(this));

                	var episodeElem = (
                		<Carousel {...settings}>
							{episodeItems}
						</Carousel>
                	);
                }else{
                	var episodeElem = (
                		<span className="no-seasons center--all">
                			No Seasons Available Yet :(	
                		</span>
                	);
                }

                return(
                    <div className="media-item">
                        <a onClick={this.openModal}>
                            <img className="media-poster" src={show.poster} />
                        </a>
                        <ModalController isOpen={this.state.modalOpen} hideModal={this.closeModal} styles={styles}>
                            <div className="media-modal show-modal">
                                <div className="padded-content">
                                    <img className="inline-poster" src={show.poster} />
                                    <h2 className="show-name">{show.name}</h2>
                                    <h3 className="show-year">{str}</h3>
                                    <hr/><br/>
                                    <span>Description:</span>
                                    <p className="show-description text--justify">
                                        {show.description}
                                    </p>
                                </div>
                                <div className="show-row center">
                                    {episodeElem}
                                </div>
                            </div>
                        </ModalController>
                    </div>
                );
            }
        });
        return ShowItem;

    }
);
