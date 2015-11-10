(function (root) {
  var StepStore = root.StepStore = {};
  var _steps = {};
  var _stepCallbacks = [];

  StepStore.all = function (todoId) {
    _steps[todoId] = (_steps[todoId] ? _steps[todoId] : []);
    return _steps[todoId];
  };

  StepStore.changed = function (todoId) {
    _stepCallbacks.forEach(function (callback) {
      callback();
    });
  };

  StepStore.addChangeHandler = function (callback) {
    _stepCallbacks.push(callback);
  };

  StepStore.removeChangeHandler = function (callback) {
    _stepCallbacks = _callbacks.filter(function (otherCallback) {
      return (callback !== otherCallback);
    });
  };

  StepStore.fetch = function (todoId) {
    $.ajax({
      url: '/api/todos/' + todoId + '/steps',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        _steps[todoId] = data;
        StepStore.changed();
      }
    });
  };

  StepStore.create = function (step) {
    $.ajax({
      url: '/api/todos/' + step.todoId + '/steps',
      type: "POST",
      dataType: 'json',
      data: {step: step},
      success: function (data) {
        // debugger;
        _steps[todoId] = (_steps[todoId] ? _steps[todoId] : []);
        _steps[step.todoId].push(data);
        StepStore.changed();
      },
      // error: function () { debugger; }
    });
  };

  StepStore.destroy = function (id) {
    debugger;
    var step = StepStore.find(id);
    var todoId = step.todo_id;
    if (step) {
      $.ajax({
        url: '/api/steps/' + id,
        type: "DELETE",
        dataType: 'json',
        success: function () {
          _steps[todoId] = _steps[todoId].filter(function (otherStep) {
            return (step !== otherStep);
          });
          StepStore.changed();
        }
      });
    }
  };

  StepStore.find = function (id) {
    var allSteps = [];
    var match;
    for (var key in _steps) {
      allSteps = allSteps.concat(_steps[key]);
    }
    allSteps.forEach(function (step) {
      if (!match) {
        match = (step.id === id ? step : null);
      }
    });
    return match;
  };













})(this);
