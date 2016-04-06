requirejs.config({
    paths: {
      'react': '/bower_components/react/react-with-addons',
      'reactdom': '/bower_components/react/react-dom',
      'jquery': '/bower_components/jquery/dist/jquery',
      'app': '/js'
    },
});

require(['jquery', 'react', 'reactdom', 'app/controllers/upload/show/UploadShowForm', 'app/controllers/ShowBackdrop'], 
    function ($, React, ReactDOM, UploadShowForm, ShowBackdrop) {
        $(document).ready(function(){
            ReactDOM.render(
                <ShowBackdrop type="cover">
                    <UploadShowForm url='/upload/show'/>
                </ShowBackdrop>,
                document.getElementById('backdrop')
            );
        });
    }
);
