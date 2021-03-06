Trak.Views.UserCorner = Backbone.View.extend({
  template: JST['navbar/user_corner'],
  className: 'user-corner',

  initialize: function() {
    this.listenTo(Trak.currentUser, 'sync', this.render);
  },

  render: function() {
    var content = this.template({
      currentUser: Trak.currentUser,
      currentSessionId: Trak.sessionId,
    });
    this.$el.html(content);

    return this;
  },
})
