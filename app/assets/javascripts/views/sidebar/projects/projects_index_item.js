Trak.Views.ProjectsIndexItem = Backbone.View.extend({
  template: JST['sidebar/projects/projects_index_item'],
  tagName: 'li',

  events: {
    "click": "displayProject"
  },

  initialize: function(options) {
    this.$el.data('project-id', this.model.id)
    this.teamId = options.teamId
    this.listenTo(this.model, "sync", this.render);
  },

  render: function() {
    var content = this.template({
      project: this.model,
      teamId: this.teamId
    });
    this.$el.html(content);       //PH NOTE #html doesn't wipe jQuery data

    return this;
  },

  displayProject: function() {
    var projectShow = new Trak.Views.ProjectShow({
      model: this.model
    });

    // this.$el.find(".centerpiece").html(projectShow.render().$el);
  }
})
