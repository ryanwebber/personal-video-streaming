requirejs.config({
    paths: {
      'react': '/bower_components/react/react-with-addons',
      'reactdom': '/bower_components/react/react-dom',
      'jquery': '/bower_components/jquery/dist/jquery',
      'app': '/js'
    },
});

require(['jquery', 'react', 'reactdom', 'app/controllers/upload/UploadShowForm'], 
    function ($, React, ReactDOM, UploadShowForm) {
        $(document).ready(function(){
            ReactDOM.render(
                <UploadShowForm url='/upload/show'/>,
                document.getElementById('uploadShow')
            );
        });
    }
);
