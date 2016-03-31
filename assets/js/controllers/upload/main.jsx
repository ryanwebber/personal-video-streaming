requirejs.config({
    paths: {
      'react': '/bower_components/react/react-with-addons',
      'reactdom': '/bower_components/react/react-dom',
      'jquery': '/bower_components/jquery/dist/jquery',
      'app': '/js'
    },
});

require(['jquery', 'react', 'reactdom', 'app/controllers/upload/UploadMovieForm'], 
    function ($, React, ReactDOM, UploadMovieForm) {
        $(document).ready(function(){
            ReactDOM.render(
                <UploadMovieForm url='/upload/movie'/>,
                document.getElementById('uploadMovie')
            );
        });
    }
);
