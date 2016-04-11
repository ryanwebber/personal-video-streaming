define(['react', 'jquery', 'app/controllers/home/ShowItem'],
    function (React, $, ShowItem) {

        var ShowsController = React.createClass({
            getInitialState: function() {
                return {
                    shows: [],
                    loading: true,
                    error: null
                };
            },
            setLoading: function(val){
                var state = this.state;
                state.loading = val;
                this.setState(state);
            },
            linkForShow: function(show){
                return "#";
            },
            update: function(event){
                if(event.verb == "created"){
                    var newShow = event.data;
                    newShow.id = event.id;
                    var show = this.state.shows;
                    shows.push(newShow);
                    this.setState({shows: shows});
                }
            },
            componentDidMount: function() {
                // TODO stuff
                $.get("/show").done(function(shows){
                    this.setState({shows: shows});
                    var data = {
                        ids: shows.map(function(show){
                            return show.id
                        })
                    };
                    io.socket.get("/show/updates", data, function(){
                        io.socket.on('show', this.update);
                    }.bind(this));
                }.bind(this)).fail(function(err){
                    this.setState({error: "Couldn't Load Shows"});
                }.bind(this)).always(function(){
                    this.setState({loading: false});
                }.bind(this));
            },
            componentWillUnmount: function(){
                // TODO stuff
            },
            render: function(){
                var shows = this.state.shows;

                if(this.state.loading === true){
                    return(
                        <div>
                            <h1 className="page-block">Shows</h1>
                            <div className="media-container">
                                <div className="spinner center--all"></div>
                            </div>
                        </div>
                    );
                }else{
                    var shows = shows.map(function(show, i){
                        return(
                            <ShowItem show={show} key={show.id}/>
                        );
                    }.bind(this));

                    return(
                        <div>
                            <h1 className="page-block">Shows  <small>{shows.length} Titles</small></h1>
                            <div className="media-container">
                                {shows}
                            </div>
                        </div>
                    );
                }
            }
        });
        return ShowsController;
    }
);
