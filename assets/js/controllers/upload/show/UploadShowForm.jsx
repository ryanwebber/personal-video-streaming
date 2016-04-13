
define(['react', 'jquery', 'app/controllers/upload/QueuedUploader'],
    function (React, $, QueuedUploader) {

        var UploadShowForm = React.createClass({
            mixins: [React.addons.LinkedStateMixin],
            getInitialState: function() {
                return {
                    files: [],
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
            makeValueLinkForFilename: function(key, filename){
                return {
                    value: this.state.data.episodes[filename][key],
                    requestChange: function(newValue) {
                        newState = this.state.data;
                        newState.episodes[filename][key] = newValue;
                        this.setState({data: newState});
                    }.bind(this)
                }
            },
            setLoading: function(val){
                var state = this.state;
                state.loading = val;
                this.setState(state);
            },
            onFileChanged: function(files){
                obj = $(files.target)[0].files;

                if(obj.length < 1){
                    return;
                }

                files = []
                for(var i=0; i<obj.length;i++){
                    files.push(obj[i]);
                }

                this.setLoading(true);
                $.get("/upload/show/autofill", {
                    "filenames[]": files.map(function(file){return file.name;})
                }).done(function(result){
                    this.setState({
                        data: result,
                        files: files
                    });
                }.bind(this)).fail(function(err){
                    // Not much to do
                }).always(function(){
                    this.setLoading(false);
                }.bind(this));
            },
            submit: function(){

                $.post("/show/prepare", {
                    cover: this.state.data.cover,
                    description: this.state.data.description,
                    name: this.state.data.name,
                    poster: this.state.data.poster,
                    trakt_id: this.state.data.trakt_id,
                }).done(function(show){
                    $.post("/season/prepare", {
                        seasonNumber: this.state.data.season,
                        show: show.id
                    }).done(function(season){
                        var uploader = new QueuedUploader(this.state.files, {
                            url: this.props.url,
                            fileData: function(file){
                                var episode = this.state.data.episodes[file.name];
                                return {
                                    season: this.state.data.season,

                                    show_id: show.id,
                                    show_cover: this.state.data.cover,
                                    show_description: this.state.data.description,
                                    show_name: this.state.data.name,
                                    show_poster: this.state.data.poster,
                                    show_trakt_id: this.state.data.trakt_id,

                                    episode_name: episode.name,
                                    episode_description: episode.description,
                                    episode_trakt_id: episode.trakt_id,
                                    episode_screenshot: episode.screenshot,
                                    episode_number: episode.episode

                                };
                            }.bind(this),
                            onFileComplete: function(file){
                                console.log("Completed:", file.name);
                            },
                            onFileComplete: function(file){
                                console.log("Completed:", file.name);
                                var updates = this.state.upload;
                                updates[file.name] = {
                                    progress: 100,
                                    complete: true
                                };
                                this.setState({upload: updates});
                            }.bind(this),
                            onSuccess: function(){
                                // Nothing
                            }.bind(this),
                            onProgress: function(prog){
                                var updates = this.state.upload;
                                updates = updates || {};

                                updates[prog.file.name] = {
                                    progress: prog.percent,
                                    complete: false
                                }
                                this.setState({
                                    upload: updates
                                });
                            }.bind(this)
                        });

                        var updates = {};
                        this.state.files.forEach(function(file){
                            updates[file.name] = {
                                progress: 0,
                                complete: false
                            };
                        });
                        this.setState({upload: updates});
                        uploader.submit();
                    }.bind(this)).fail(function(){
                        //nothing yet for fail
                    }.bind(this));
                }.bind(this)).fail(function(){
                    // error :(
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
                        <div className="spinner center--all"></div>
                    );
                }else if(this.state.upload){

                    var bars = [];
                    for(var filename in this.state.upload){

                        var prog = this.state.upload[filename];

                        var style = {
                            width: prog.progress + "%"
                        };

                        var size = {
                            width: "400px",
                            maxWidth: "90%"
                        };
                        if(prog.complete){
                            var text = "Done";
                            var cl = "progress center--all";
                        }else{
                            var text = style.width;
                            var cl = "progress progress--striped center--all progress--animate";
                        }

                        bars.push(
                            <div style={{marginTop: 20, textAlign: 'center'}} key={filename}>
                                <p><small>{filename}</small></p>
                                <div className={cl} style={size}>
                                    <span style={style}>{text}</span>
                                </div>
                            </div>
                        );
                    }

                    return(
                        <div className="upload-form">
                            <div className="page-block">
                                {bars}
                            </div>
                        </div>
                    );
                }else if(this.state.files.length){

                    var episodeForms = [];
                    for(var filename in this.state.data.episodes){
                        var episodeData = this.state.data.episodes[filename];
                        episodeForms.push(
                            <fieldset key={filename}>
                                <legend>{filename}</legend>
                                <p>
                                    <label>Episode Title:</label>
                                    <input type="text" valueLink={this.makeValueLinkForFilename('name', filename)} placeholder="Episode Title" />
                                </p>
                                <p>
                                    <label>Episode Number:</label>
                                    <input type="text" valueLink={this.makeValueLinkForFilename('episode', filename)} placeholder="Episode Number" />
                                </p>
                                <p>
                                    <label>Episode Trakt ID:</label>
                                    <input type="text" valueLink={this.makeValueLinkForFilename('trakt_id', filename)} placeholder="Episode Trakt ID" />
                                </p>
                                <p>
                                    <label>Episode Screenshot:</label>
                                    <input type="text" valueLink={this.makeValueLinkForFilename('screenshot', filename)} placeholder="Episode Screenshot" />
                                </p>
                                <p>
                                    <label>Episode Description:</label>
                                    <textarea type="text" valueLink={this.makeValueLinkForFilename('description', filename)} placeholder="Episode Description" rows="4"/>
                                </p>
                            </fieldset>
                        );
                    }

                    return(
                        <div className="upload-form">
                            <div className="page-block">
                                <h1>Season Meta Data</h1>
                                <form>
                                    <p>
                                        <label>Show Title:</label>
                                        <input type="text" valueLink={this.makeValueLink('name')} placeholder="Movie Title" />
                                    </p>
                                    <p>
                                        <label>Season:</label>
                                        <input type="text" valueLink={this.makeValueLink('season')} placeholder="Season" />
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
                                    <h1>Episode Meta Data</h1>
                                    {episodeForms}
                                </form>
                                <button onClick={this.submit}>Upload</button>
                            </div>
                        </div>
                    );
                }else{
                    return(
                        <div className="center--all">
                            <input id="file" type="file" className="inputfile" onChange={this.onFileChanged} multiple="multiple"/>
                            <label htmlFor="file"><i className="fa fa-upload"></i> Upload Show Episodes...</label>
                        </div>
                    );
                }
            }
        });
        return UploadShowForm;

    }
);
