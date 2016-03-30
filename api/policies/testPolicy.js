module.exports = function (req, res, next) {
	console.log("installed customMiddleware is used")
	next()
}