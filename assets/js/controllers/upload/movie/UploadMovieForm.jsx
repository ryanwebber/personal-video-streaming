
define(['react', 'jquery', 'app/controllers/upload/QueuedUploader', 'app/controllers/home/ModalController'], 
    function (React, $, QueuedUploader, ModalController) {

        var UploadMovieForm = React.createClass({
            mixins: [React.addons.LinkedStateMixin],
            getInitialState: function() {
                return {
                    file: null,
                    data: {},
                    loading: false,
                    upload: null
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
                        this.setState({
                            upload: {
                                progress: 100,
                                complete: true
                            }
                        });
                    }.bind(this),
                    onProgress: function(prog){
                        this.setState({
                            upload: {
                                progress: prog.percent,
                                complete: false
                            }
                        });
                    }.bind(this)
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
                        <div className="spinner center--all"></div>
                    );
                }else if(this.state.upload){
                    var style = {
                        width: this.state.upload.progress + "%"
                    };
                    var size = {
                        width: "400px",
                        maxWidth: "90%"
                    };
                    if(this.state.upload.complete){
                        var text = "Done";
                        var cl = "progress center--all";
                    }else{
                        var text = style.width;
                        var cl = "progress progress--striped center--all progress--animate";
                    }
                    return(
                        <div className={cl} style={size}>
                            <span style={style}>{text}</span>
                        </div>
                    );
                }else if(this.state.file){
                    return(
                        <div className="upload-form">
                            <div className="page-block">
                                <h1>Movie Meta Data</h1>
                                <form>
                                    <p>
                                        <label>Movie Title:</label>
                                        <input type="text" valueLink={this.makeValueLink('name')} placeholder="Movie Title" />
                                    </p>
                                    <p>
                                        <label>Year:</label>
                                        <input type="text" valueLink={this.makeValueLink('year')} placeholder="Year" />
                                    </p>
                                    <p>
                                        <label>Trakt ID:</label>
                                        <input type="text" valueLink={this.makeValueLink('trakt_id')} placeholder="Trakt ID" />
                                    </p>
                                    <p>
                                        <label>Poster URL:</label>
                                        <input type="text" valueLink={this.makeValueLink('poster')} placeholder="Poster URL" />
                                    </p>
                                    <p>
                                        <label>Cover URL:</label>
                                        <input type="text" valueLink={this.makeValueLink('cover')} placeholder="Cover URL" />
                                    </p>
                                    <p>
                                        <label>Description:</label>
                                        <textarea type="text" valueLink={this.makeValueLink('description')} placeholder="Description" rows="7"/>
                                    </p>
                                </form>
                                <button onClick={this.submit}>Upload</button>
                            </div>
                        </div>
                    );
                }else{
                    return(
                        <div className="center--all">
                            <input id="file" type="file" className="inputfile" onChange={this.onFileChanged} />
                            <label htmlFor="file"><i className="fa fa-upload"></i> Upload Movie...</label>
                        </div>
                    );
                }
            }
        });
        return UploadMovieForm;

    }
);
