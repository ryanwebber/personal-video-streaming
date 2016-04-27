define(['react', 'jquery'], 
    function (React, $) {

        var VideoPlayer = React.createClass({
            getInitialState: function(){
                return {};
            },
            componentDidMount: function() {
                var video = this.refs.videoElement;

                video.onloadeddata = function(){
                     if(this.props.onloadeddata){
                        this.props.onloadeddata(video.duration);
                     }
                }.bind(this);

                video.addEventListener("timeupdate", function(event){
                    if(this.props.timeupdate){
                        var video = event.target;
                        this.props.timeupdate(video.currentTime);
                    }
                }.bind(this));

                video.addEventListener('progress', function() {
                    if(this.props.bufferupdate && video.buffered.length > 0){
                        var range = 0;
                        var bf = video.buffered;
                        var time = video.currentTime;

                        while(!(bf.start(range) <= time && time <= bf.end(range))) {
                            range += 1;
                        }
                        var loadStartPercentage = bf.start(range) / video.duration;
                        var loadEndPercentage = bf.end(range) / video.duration;
                        var loadPercentage = loadEndPercentage - loadStartPercentage;

                        this.props.bufferupdate(loadStartPercentage, loadEndPercentage, loadPercentage);
                    }
                }.bind(this));
            },
            componentWillUnmount: function(){
                
            },
            componentWillReceiveProps: function(nextProps) {
                var video = this.refs.videoElement;

                if(nextProps.playing === true){
                    video.play();
                }else if(nextProps.playing === false){
                    video.pause();
                }
            },
            seek: function(seconds){
                this.refs.videoElement.currentTime = seconds;
            },
            render: function(){
                return (
                    <video src={this.props.source} ref="videoElement"/>
                );
            }
        });

        var VideoController = React.createClass({
            getInitialState: function(){
                return {
                    position: 0,

                    bufferedStart: 0,
                    bufferedEnd: 0,

                    playing: false,
                    duration: null,
                    requestedFullScreen: false,

                    loaded: false
                };
            },
            linkForStream: function(videoId){
                return "/stream/" + videoId;
            },
            videoLoaded: function(length){
                this.setState({
                    loaded: true,
                    duration: length,
                    playing: true
                });
            },
            timeUpdated: function(seconds){
                this.setState({
                    position: seconds
                });
            },
            bufferUpdated: function(startPercentage, endPercentage){
                this.setState({
                    bufferedStart: startPercentage,
                    bufferedEnd: endPercentage
                });
            },
            togglePlaying: function(){
                this.setState({
                    playing: !this.state.playing
                });
            },
            toggleFullscreen: function(){
                var video = this.refs.videoContainer;

                if(this.isFullScreen() === false){
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.mozRequestFullScreen) {
                        video.mozRequestFullScreen();
                    } else if (video.webkitRequestFullscreen) {
                        video.webkitRequestFullscreen(); 
                    }
                }else if(this.isFullScreen() === true){
                    console.log("hi");
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen(); 
                    }
                }

                this.setState({
                    requestedFullScreen: !this.isFullScreen()
                });
            },
            isFullScreen: function(){
                return (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) ? true : false;
            },
            secondsToHms: function(d) {
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
                return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 
            },
            playbackClicked: function(event){
                var pos = event.nativeEvent.offsetX;
                var s = ((pos + 0.0) / this.refs.videoProgress.offsetWidth) * this.state.duration;
                this.refs.video.seek(s);
            },
            componentDidMount: function() {

            },
            componentWillUnmount: function(){
                
            },
            render: function(){

                var videoLoader = null;
                if(!this.state.loaded){
                    videoLoader = (
                        <div className="center--all">
                            <div className="spinner"></div>
                        </div>
                    );
                }

                var durationElem = null;
                var playbackPercentage = 0;
                var bufferPercentage = 0;
                if(this.state.duration !== null){
                    var playbackPercentage = 100 * ((this.state.position + 0.0) / this.state.duration);
                    var bufferPercentage = 100 * this.state.bufferedEnd;
                    durationElem = (
                        <span>
                            {this.secondsToHms(this.state.position)} / {this.secondsToHms(this.state.duration)}
                        </span>
                    );
                }

                return(
                    <div className={"video-container center--all" + (this.isFullScreen() ? " fullscreen" : "")} ref="videoContainer">
                        <div className="video-loader">
                            {videoLoader}
                        </div>
                        <VideoPlayer ref="video"
                            source={this.linkForStream(this.props.videoId)} 
                            onloadeddata={this.videoLoaded} 
                            timeupdate={this.timeUpdated}
                            bufferupdate={this.bufferUpdated}
                            playing={this.state.playing || !this.state.loaded}
                        />
                        <div className="video-controls">
                            <div className="video-progress" onClick={this.playbackClicked} ref="videoProgress">
                                <div className="video-buffer" style={{width: bufferPercentage + "%"}}></div>
                                <div className="video-playback" style={{width: playbackPercentage + "%"}}></div>
                            </div>
                            <a onClick={this.togglePlaying}>
                                <div className="video-control video-control-button float--left">
                                    <i className={this.state.playing ? "fa fa-pause" : "fa fa-play"}></i>
                                </div>
                            </a>
                            <div className="video-control video-control-button float--left">
                                <i className="fa fa-volume-up"></i>
                            </div>
                            <div className="video-control float--left">
                                {durationElem}
                            </div>
                            <a onClick={this.toggleFullscreen}>
                                <div className="video-control video-control-button float--right">
                                    <i className={!this.isFullScreen() ? "fa fa-expand" : "fa fa-compress"}></i>
                                </div>
                            </a>
                        </div>
                    </div>
                );
            }
        });
        return VideoController;

    }
);
