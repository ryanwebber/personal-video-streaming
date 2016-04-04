define(['react', 'jquery'], 
    function (React, $) {

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
            componentDidMount: function() {
                // TODO stuff
                $.get("/show").done(function(shows){
                    this.setState({shows: shows});
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
                    var shows = [];

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
