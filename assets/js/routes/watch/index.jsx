requirejs.config({
    paths: {
      'react': '/bower_components/react/react-with-addons',
      'react-dom': '/bower_components/react/react-dom',
      'jquery': '/bower_components/jquery/dist/jquery',
      'app': '/js',
    },
});

require(['jquery', 'react', 'react-dom',
    'app/controllers/watch/VideoController'],
    function ($, React, ReactDOM, VideoController) {
        $(document).ready(function(){

		function getParameterByName(name, url) {
			    if (!url) url = window.location.href;
			    name = name.replace(/[\[\]]/g, "\\$&");
			    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			        results = regex.exec(url);
			    if (!results) return null;
			    if (!results[2]) return '';
			    return decodeURIComponent(results[2].replace(/\+/g, " "));
			}

			var video_id = window.location.href.split("/").pop();
			var session_id = getParameterByName("playbacksession", window.location.href);

            ReactDOM.render(
                <VideoController videoId={video_id} sessionId={session_id}/>,
                document.getElementById('video-page')
            );

        });
    }
);