define(['react', 'jquery'], 

    function (React, $) {

        // left: 37, up: 38, right: 39, down: 40,
        // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
        var keys = {37: 1, 38: 1, 39: 1, 40: 1};

        function preventDefault(e) {
          e = e || window.event;
          if (e.preventDefault)
              e.preventDefault();
          e.returnValue = false;  
        }

        function preventDefaultForScrollKeys(e) {
            if (keys[e.keyCode]) {
                preventDefault(e);
                return false;
            }
        }

        function disableScroll() {
          if (window.addEventListener) // older FF
              window.addEventListener('DOMMouseScroll', preventDefault, false);
          window.onwheel = preventDefault; // modern standard
          window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
          window.ontouchmove  = preventDefault; // mobile
          document.onkeydown  = preventDefaultForScrollKeys;
        }

        function enableScroll() {
            if (window.removeEventListener)
                window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.onmousewheel = document.onmousewheel = null; 
            window.onwheel = null; 
            window.ontouchmove = null;  
            document.onkeydown = null;  
        }

        var ModalController = React.createClass({
            hide: function(){
                this.props.hideModal();
                enableScroll();
            },
            doNothing: function(e){
                e.stopPropagation();
            },
            render: function(){
                if(!this.props.isOpen){
                    return null;
                }else{
                    if(this.props.isOpen){
                        classes = "modali open";
                        disableScroll();
                    }else{
                        classes = "modali";
                    }
                    return (
                        <div className={classes} onClick={this.hide} id={this.props.id}>
                            <div className="center--all modali-contents" style={this.props.styles} onClick={this.doNothing}>
                                <a className="modali-close" onClick={this.hide}>&#10005;</a>
                                {this.props.children}
                            </div>
                        </div>
                    );
                }
            }
        });
        return ModalController;

    }
);
