define(['react', 'jquery', 'app/controllers/home/ModalController'], 
    function (React, $, ModalController) {

        var ShowItem = React.createClass({
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

                if(show.seasons.length > 0){
                	var episodeElem = (
                		<div>
                			<span className="no-seasons">
                				Functionality Coming Soon
                			</span>
                		</div>
                	);
                }else{
                	var episodeElem = (
                		<span className="no-seasons">
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
                                <img className="inline-poster" src={show.poster} />
                                <h2 className="show-name">{show.name}</h2>
                                <h3 className="show-year">{str}</h3>
                                <hr/><br/>
                                <span>Description:</span>
                                <p className="show-description text--justify">
                                    {show.description}
                                </p>
                                <br/><br/>
                                <div className="center">
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
