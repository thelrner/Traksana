Trak.Routers.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.collection = options.collection;
    this.$rootEl = options.$rootEl;
    this.collection.fetch();
  },

  routes: {
    "": "teamIndex",
    "there": "landingPage",
    "_=_": "teamIndex",
    "teams/:id": "masterShow",
  },

  landingPage: function() {
    var landingPageView = new Trak.Views.LandingPage();
    this._swapView(landingPageView);
    $.rails.refreshCSRFTokens();
  },

  teamIndex: function() {
    if (!Trak.currentUser) {
      this.fetchCurrentUser( this.teamIndex.bind(this) );
      return;
    }
    var indexView = new Trak.Views.TeamsIndex({ collection: this.collection });
    this._swapView(indexView);
  },

  masterShow: function(id) {
    if (!Trak.currentUser) {
      this.fetchCurrentUser( this.masterShow.bind(this, id) );
      return;
    }
    var showTeam = this.collection.getOrFetch(id);
    Trak.currentTeam = showTeam;
    Trak.masterView = new Trak.Views.Master({ model: showTeam });

    this._swapView(Trak.masterView);
    $.rails.refreshCSRFTokens();
  },

  fetchCurrentUser: function(callback) {
    Trak.currentUser = new Trak.Models.User();
    $.ajax({
      method: 'get',
      url: '/api/users/current_user_info',
      dataType: 'json',
      success: function(response) {
        Trak.currentUser.set( Trak.currentUser.parse(response) );
        callback();
      }
    });
  },

  _swapView: function(view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(this._currentView.render().$el);
  },

});
