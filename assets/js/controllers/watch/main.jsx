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

        	var video_id = window.location.href.split("/").pop();
            ReactDOM.render(
                <VideoController videoId={video_id} />,
                document.getElementById('video-page')
            );

        });
    }
);