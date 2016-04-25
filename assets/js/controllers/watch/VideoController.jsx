define(['react', 'jquery'], 
    function (React, $) {

        var VideoController = React.createClass({
            getInitialState: function(){
                return {
                	position: 0,
                	loaded: false
                };
            },
            videoLoaded: function(){
            	this.setState({
            		loaded: true
            	});
            	console.log(("hi"));
            },
            componentDidMount: function() {
            	this.props.video.onloadeddata = this.videoLoaded;
            },
            componentWillUnmount: function(){
                
            },
            render: function(){
            	if(!this.state.loaded){
					return (
	            		<div className="center--all">
		            		<div className="spinner"></div>
	            		</div>
	            	);
            	}else{
            		return null;
            	}
            }
        });
        return VideoController;

    }
);
