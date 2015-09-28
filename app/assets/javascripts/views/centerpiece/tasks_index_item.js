Trak.Views.TasksIndexItem = Backbone.View.extend({
  template: JST['centerpiece/tasks_index_item'],
  tagName: 'li',
  className: 'task-item',

  events: {
    //PH** if you wanna go cowboy -- listen to clicks here and render outside the $el
    'blur': 'commitEdits',
    // 'blur input': 'commitEdits'     // PH - uncomment for CRAZYTOWN
    'click': 'showTask',
    'mouseenter': 'toggleIcons',
    'mouseleave': 'toggleIcons',
  },

  initialize: function() {
    this.$el.data('task-id', this.model.id);
    this.listenTo(this.model, "sync change", this.render);
  },

  render: function() {
    console.log("triggered task item render")
    var content = this.template({ task: this.model });
    this.$el.html(content);
    this.checkCompletion();
    this.checkClicked();
    this.checkAssignments();

    return this;
  },

  checkCompletion: function() {
    if (this.model.escape('completer_id')) {
      this.$('.completion-icon').text('✓');
      this.$('.completion-icon').addClass('completed');
    }
  },

  checkClicked: function() {
    if (this.$el.hasClass('clicked-task')) {
      this.$('input').caret(this._caretPosition);
      this.$('.icon').removeClass('transparent');
    }
  },

  checkAssignments: function() {
    var assignedUsers = this.model.assignedUsers();

    if (assignedUsers.models.length !== 0) {
      var icon = this.$('div.assignment-icon.icon');
      icon.text('');
      var userAvatar = Trak.Utils.userAvatar(assignedUsers.first())
      icon.append(userAvatar)
          .addClass('has-assigned')
          .removeClass('transparent');
    }
  },

  commitEdits: function(e) {
    e.preventDefault();

    var attributes = this.$('form').serializeJSON().task;
    this.model.set(attributes);

    this.model.save({}, {
      success: function() {
        alert('successful edit!');
      },
      error: function() {
        alert('ruh roh, something went wrong');
      }
    });
  },

  switchCompletion: function() {
    if (this.model.escape('completer_id')) {
      this.model.set({ completer_id: null });
    } else {
      this.model.set({ completer_id: Trak.currentUser.id });
    }
  },
  //PH**** NEED TO MOVE EDITS HERE!!!!

  showTask: function(e) {
    this._caretPosition = this.$('input').caret();
    this.model.fetch({
      success: function() {
        Trak.masterView.displayTask(this.model);
        this.$el.trigger('taskClicked');
        //check out dat CUSTOM TRIGGER DOH
      }.bind(this)
    });
  },

  toggleIcons: function(e) {
    var $ct = $(e.currentTarget);
    this.$('div.completion-icon').toggleClass('transparent');
    if (this.$('div.assignment-icon').hasClass('has-assigned')) {
      return;
    }
    this.$('div.assignment-icon').toggleClass('transparent');
  },

})
