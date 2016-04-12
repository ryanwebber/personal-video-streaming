requirejs.config({
    paths: {
      'react': '/bower_components/react/react-with-addons',
      'react-dom': '/bower_components/react/react-dom',
      'jquery': '/bower_components/jquery/dist/jquery',
      'app': '/js',
    },
});

require(['jquery', 'react', 'react-dom', 
    'app/controllers/home/MoviesController', 
    'app/controllers/home/ShowsController',
    'app/controllers/ShowBackdrop'], 
    function ($, React, ReactDOM, MoviesController, ShowsController, ShowBackdrop) {
        $(document).ready(function(){

            ReactDOM.render(
                <ShowBackdrop type="banner" />,
                document.getElementById('backdrop')
            );

            ReactDOM.render(
                <MoviesController />,
                document.getElementById('movies')
            );

            ReactDOM.render(
                <ShowsController />,
                document.getElementById('shows')
            );
        });
    }
);