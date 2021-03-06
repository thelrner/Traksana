Trak.Views.AssignedUsers = Backbone.View.extend({
  template: JST['feature/task_assigned_users'],
  tagName: 'ul',
  className: 'task-assignment-items group',
  events: {
    'click li.task-assignment-item, a.add-new-assignments': 'assignTask',
  },

  initialize: function() {
    this.listenTo(this.model.assignedUsers(), 'sync change add remove', this.render);
  },

  render: function() {
    var content = this.template({ users: this.model.assignedUsers() })
    this.$el.html(content);

    return this;
  },

  assignTask: function(e) {
    var assignmentModal = new Trak.Views.Assignment({ model: this.model });
    Trak.masterView.swapModal(assignmentModal);
  },
})
