module.exports = {
  	path: 'upload/',

  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./movie'),
        require('./show'),
      ])
    })
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, null)
    })
  }
}