define(['react', 'jquery'],
    function (React, $) {

        var ShowBackdrop = React.createClass({
		images: [
			"3c810f5c41.jpg",
			"60a0adba2f.jpg",
			"8063601bfc.jpg",
			"de1291076f.jpg",
			"f04803f6e6.jpg",
			"3e24c4deec.jpg",
			"669c3480ff.jpg",
			"85ed955486.jpg",
			"e5836d06e6.jpg",
			"fc68b3b649.jpg",
			"49caad0936.jpg",
			"76d5df8aed.jpg",
			"a526847f48.jpg",
			"eb3a126015.jpg"
		],
            getInitialState: function() {
                return {
			picture: this.randomPicture()
                };
            },
            randomPicture: function(){
                return this.images[Math.floor(Math.random()*this.images.length)];
            },
            linkForPicture: function(imageName){
		return "/images/covers/" + imageName;
            },
            render: function(){
		var style = {
			backgroundImage: "url("+this.linkForPicture(this.state.picture)+")",
			backgroundSize: "cover",
			backgroundPosition: "center center"
		};

                return(
			<div className="full">
				<div className="full" style={style}></div>
				<div className="overlay-layer"></div>
			</div>
                );
            }
        });
        return ShowBackdrop;

    }
);
