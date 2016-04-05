requirejs.config({
    paths: {
      'react': '/bower_components/react/react-with-addons',
      'reactdom': '/bower_components/react/react-dom',
      'jquery': '/bower_components/jquery/dist/jquery',
      'app': '/js'
    },
});

require(['jquery', 'react', 'reactdom', 'app/controllers/upload//movie/UploadMovieForm', 'app/controllers/ShowBackdrop'], 
    function ($, React, ReactDOM, UploadMovieForm, ShowBackdrop) {
        $(document).ready(function(){
            ReactDOM.render(
                <ShowBackdrop type="cover" />,
                document.getElementById('backdrop')
            );

            ReactDOM.render(
                <UploadMovieForm url='/upload/movie'/>,
                document.getElementById('uploadMovie')
            );
        });
    }
);
