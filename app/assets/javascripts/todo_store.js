(function (root) {
  "use strict";

  var TodoStore = root.TodoStore = {};
  var _todos = [];
  var _callbacks = [];

  TodoStore.changed = function () {
    _callbacks.forEach(function (callback) {
      callback();
    });
  };

  TodoStore.addChangeHandler = function (callback) {
    _callbacks.push(callback);
  };

  TodoStore.removeChangeHandler = function (callback) {
    _callbacks = _callbacks.filter(function (otherCallback) {
      return (callback !== otherCallback);
    });
  };

  TodoStore.all = function () {
    return _todos;
  };

  TodoStore.fetch = function () {
    $.ajax({
      url: '/api/todos',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
          _todos = data;
          TodoStore.changed();
      }
    });
  };

  TodoStore.create = function (todo) {
    $.ajax({
      url: '/api/todos',
      type: 'POST',
      dataType: 'json',
      data: {todo: todo},
      success: function (data) {
        _todos.push(data);
        TodoStore.changed();
      }
    });
  };

  TodoStore.destroy = function (id) {
    var todo = TodoStore.find(id);
    if (todo) {
      $.ajax({
        url: '/api/todos/' + id,
        type: "DELETE",
        dataType: 'json',
        success: function () {
          _todos = _todos.filter(function (otherTodo) {
            return (todo !== otherTodo);
          });
          TodoStore.changed();
        }
      });
    }
  };

  TodoStore.find = function (id) {
    var match;
    _todos.forEach(function (todo) {
      if (!match) {
      match = (todo.id === id ? todo : null);
      }
    });
    return match;
  };

  TodoStore.toggleDone = function (id) {
    var todo = TodoStore.find(id);
    if (todo) {
      todo.done = !(todo.done);
      $.ajax({
        url: '/api/todos/' + id,
        type: 'PATCH',
        dataType: 'json',
        data: { todo: todo },
        success: function (data) {
          TodoStore.changed();
        },
        error: function () {
          todo.done = !(todo.done);
        }
      });
    }
  };






















})(this);
