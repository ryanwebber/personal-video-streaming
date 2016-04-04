
define(['react', 'jquery', 'app/controllers/upload/QueuedUploader'], 
    function (React, $, QueuedUploader) {

        var UploadMovieForm = React.createClass({
            mixins: [React.addons.LinkedStateMixin],
            getInitialState: function() {
                return {
                    file: null,
                    data: {},
                    loading: false
                };
            },
            makeValueLink: function (key) {
                return {
                    value: this.state.data[key],
                    requestChange: function(newValue) {
                        newState = this.state.data;
                        newState[key] = newValue;
                        this.setState({data: newState});
                    }.bind(this)
                }
            },
            setLoading: function(val){
                var state = this.state;
                state.loading = val;
                this.setState(state);
            },
            onFileChanged: function(file){
                file = $(file.target)[0].files[0];

                this.setLoading(true);
                $.get("/upload/movie/autofill", {
                    filename: file.name
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
            submit: function(){
                var uploader = new QueuedUploader([this.state.file], {
                    url: this.props.url,
                    fileData: function(file){
                        return this.state.data;
                    }.bind(this),
                    onFileComplete: function(file){
                        console.log("Completed:", file.name);
                    },
                    onSuccess: function(){
                        console.log("SUCCESS!");
                    }.bind(this),
                    onProgress: function(prog){
                        console.log(prog.loaded + "/" + prog.total, prog.percent+"%");
                    }
                });

                uploader.submit();
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
                }else if(this.state.file){
                    return(
                        <div>
                            <form>
                                <input type="text" valueLink={this.makeValueLink('name')} placeholder="Name" />
                                <input type="text" valueLink={this.makeValueLink('year')} placeholder="Year" />
                                <input type="text" valueLink={this.makeValueLink('trakt_id')} placeholder="Trakt ID" />
                                <input type="text" valueLink={this.makeValueLink('poster')} placeholder="Poster URL" />
                                <input type="text" valueLink={this.makeValueLink('cover')} placeholder="Cover URL" />
                                <input type="text" valueLink={this.makeValueLink('description')} placeholder="Description" />
                            </form>
                            <button onClick={this.submit}>Upload</button>
                        </div>
                    );
                }else{
                    return(
                        <input type="file" onChange={this.onFileChanged} />
                    );
                }
            }
        });
        return UploadMovieForm;

    }
);
