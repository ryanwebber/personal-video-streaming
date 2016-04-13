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
                console.log(event);
                if(event.verb == "created"){
                    var newShow = event.data;
                    newShow.id = event.id;
                    var shows = this.state.shows;
                    shows.push(newShow);
                    this.setState({shows: shows});
                }
            },
            componentDidMount: function() {
                // TODO stuff

                io.socket.on('show', this.update);
                io.socket.get("/show", function(data, jwr){
                    if (jwr.statusCode == 200){
                        this.setState({shows: data});
                    }else {
                        this.setState({error: "Couldn't Load Shows"});
                    }
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
