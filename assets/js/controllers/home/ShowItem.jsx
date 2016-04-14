define(['react', 'jquery', 'app/controllers/home/ModalController', 'app/dependencies/react-slick', 'app/controllers/Dropdown'],
    function (React, $, ModalController, Carousel, Dropdown) {

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

        var fmt2 = function(num){
            if(num >= 10) return "e" + num;
            else return "e0" + num;
        }

        var sXeX = function(season, episode){
            var x = fmt2(episode.episodeNumber);

            if(episode.episodeNumberAlt){
                x = x + " & " + fmt2(episode.episodeNumberAlt);
            }
            return x;
        }

        var ShowItem = React.createClass({
            getInitialState: function(){
                return {
                    modalOpen: false,
                    progress: {},
                    activeSeason: 0,
                    loadingSeasons: true,
                    seasons: []
                };
            },
            componentDidMount: function() {
                io.socket.on('upload.progress', this.updateProgress);
                io.socket.on('season', this.updateSeasons);
                io.socket.get("/season", {
                    show: this.props.show.id
                }, function(seasons, jwr){
                    if (jwr.statusCode == 200){
                        this.setState({
                            seasons: seasons
                        });
                    }
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
                var progresses = this.state.progress;
                progresses[id] = progress;
                this.setState({progress: progresses});
            },
            updateSeasons: function(event){
                if(event.verb == "updated"){
                    var seasonid = event.id;
                    var seasons = this.state.seasons;
                    seasons.forEach(function(season){
                        if(season.id === seasonid){
                            var eps = season.episodes;
                            event.data.episodes.forEach(function(episode){
                                var index = eps.findIndex(function(e2){
                                    return e2.id == episode.id;
                                });

                                episode.sXeX = sXeX(season, episode);

                                if(index != -1){
                                    eps[index] = episode;
                                }else{
                                    eps.push(episode);
                                }
                            });
                            season.episodes = eps;
                        }
                    });
                    console.log(seasons);
                    this.setState({seasons: seasons});
                }else if(event.verb == "created"){
                    var newSeason = event.data;
                    newSeason.id = event.id;
                    var seasons = this.state.seasons;
                    seasons.push(newSeason);
                    this.setState({seasons: seasons});
                }
            },
            linkForEpisode: function(episode){
                var base = "/watch/";
                return base + episode.video;
            },
            selectSeason: function(season){
                var index = this.state.seasons.findIndex(function(s){
                    return season.seasonNumber == s.seasonNumber;
                }, this);
                if(index >=0 && index < this.state.seasons.length){
                    this.setState({activeSeason: index});
                }

            },
            render: function(){
                var show = this.props.show;

                var styles = {
                    backgroundImage: "url("+show.cover+")",
                    backgroundSize: "cover"
                };

                var str = this.state.seasons.length + " Season";
                if(this.state.seasons.length != 1){
			str += "s";
                }

                if(this.state.loadingSeasons){
                    var episodeElem = (
                        <div className="show-row center">
                            <div className="spinner center--all"></div>
                        </div>
                    );
                }else if(this.state.seasons.length > 0){

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

                        if(episode.video){

                            return (
                                <div className="episode-item" key={episode.id}>
                                    <a href={this.linkForEpisode(episode)}>
                                        <div style={style}>
                                            <div className="inner-episode">
                                                <i className="fa fa-2x fa-play-circle center--all"></i>
                                                <span className="episode-text">{episode.sXeX}</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            );

                        }else{

                            if(this.state.progress[episode.id]){
                                var loader = (
                                    <div className="episode-item" key={episode.id}>
                                        <div style={style}>
                                            <div className="inner-episode partial">
                                                <div className="center--all">
                                                    <div className="spinner"></div>
                                                    <p>{this.state.progress[episode.id]}%</p>
                                                </div>
                                                <span className="episode-text">{episode.sXeX}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }else{
                                var loader = (
                                    <div className="episode-item" key={episode.id}>
                                        <div style={style}>
                                            <div className="inner-episode partial">
                                                <div className="center--all">
                                                    <div className="spinner"></div>
                                                </div>
                                                <span className="episode-text">{episode.sXeX}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return loader;
                        }
                    }.bind(this));

                    var seasonList = this.state.seasons.map(function(season, i){
                        return {
                            name: "Season " + season.seasonNumber,
                            seasonNumber: season.seasonNumber,
                            id: season.id + "-" + i
                        }
                    });

			var episodeElem = (
                        <div>
                            <div className="season-picker">
                                <Dropdown onSelect={this.selectSeason} list={seasonList} selected={seasonList[this.state.activeSeason]} />
                            </div>
                            <div className="show-row center">
					<Carousel {...settings}>
								{episodeItems}
							</Carousel>
                            </div>
                        </div>
			);
                }else{
			var episodeElem = (
                        <div className="show-row center">
                            <span className="no-seasons center--all">
                                No Seasons Available Yet :(
                            </span>
                        </div>
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
                                    <span>Overview:</span>
                                    <p className="show-description text--justify">
                                        {show.description}
                                    </p>
                                </div>
                                {episodeElem}
                            </div>
                        </ModalController>
                    </div>
                );
            }
        });
        return ShowItem;

    }
);
