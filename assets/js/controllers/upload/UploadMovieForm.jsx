
define(['react', 'jquery'],
    function (React, $) {

        var UploadMovieForm = React.createClass({
            getInitialState: function() {
                return {
                    file: null,
                    data: null,
                    loading: false
                };
            },
            setLoading: function(val){
                var state = this.state;
                state.loading = val;
                this.setState(state);
            },
            parseFileName: function(fname){

            },
            onFileChanged: function(file){
                this.setLoading(true);
                $.get("/upload/movie/autofill", {
                    filename: "Captain America The Winter Soldier (2014) 1080p BrRip x264 - YIFY"
                }).done(function(result){
                    var state = this.state;
                    var data = {};

                    data.name = result.name || null;
                    data.year = result.year || null;
                    data.trakt_id = result.trakt_id || null;
                    data.poster = result.poster || null;
                    data.cover = result.cover || null;
                    data.description = result.description || null;

                    state.data = data;
                    state.file = file;
                    this.setState(state);

                }.bind(this)).fail(function(){
                    // Not much to do
                }).always(function(){
                    this.setLoading(false);
                }.bind(this));
            },
            componentDidMount: function() {
                // TODO stuff
            },
            componentWillUnmount: function(){
                // TODO stuff
            },
            render: function(){
                var data = this.state.data;

                if(this.state.loading === true){
                    return(
                        <p>Loading...</p>
                    );
                }else if(data){
                    return(
                        <form>
                            <input type="text" name="name" value={data["name"]} placeholder="Name" />
                            <input type="text" name="year" value={data["year"]} placeholder="Year" />
                            <input type="text" name="trakt_id" value={data["trakt_id"]} placeholder="Trakt ID" />
                            <input type="text" name="poster" value={data["poster"]} placeholder="Poster URL" />
                            <input type="text" name="cover" value={data["cover"]} placeholder="Poster URL" />
                            <input type="text" name="description" value={data["description"]} placeholder="Description" />
                        </form>
                    );
                }else{
                    return(
                        <button onClick={this.onFileChanged}>Test</button>
                    );
                }
            }
        });
        return UploadMovieForm;

    }
);
