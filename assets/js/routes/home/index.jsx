var MoviesController = require('./MoviesController');
var MoviesController = require('./ShowsController');
var ShowBackdrop = require('/Components/ShowBackdrop');

var HomeViewController = React.createClass({
    render: function(){
        return(
            <div>
                <nav class="header">
                    <div id="backdrop">
                        <ShowBackdrop type="banner" />
                    </div>
                    <div class="nav-container">
                    <img src="/images/brand/logo_white.png">
                    </div>
                </nav>
                <div id="movies">
                    <MoviesController />
                </div>
                <br/><br/>
                <div id="shows">
                    <ShowsController />
                </div>
            </div>
        );
    }
});

module.exports = {
    path: 'home/',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, HomeViewController);
        })
    }
}
