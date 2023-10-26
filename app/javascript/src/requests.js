import $ from 'jquery';

$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

export var indexTasks = function (successCB, errorCB) {
  var request = {
    type: 'GET',
    url: 'api/tasks?api_key=1',
    success: successCB,
    error: errorCB
  }
  $.ajax(request);
};

export var postTask = function (content, successCB, errorCB) {
  var request = {
    type: 'POST',
    url: 'api/tasks?api_key=1',
    data: {
      task: {
        content: content
      }
    },
    success: successCB,
    error: errorCB
  }
  $.ajax(request);
};

export var updateTask = function (taskId, taskData, successCB, errorCB) {
  var request = {
    type: 'PUT',
    url: `api/tasks/${taskId}?api_key=1`,
    data: {
      task: taskData
    },
    success: successCB,
    error: errorCB
  }
  $.ajax(request);
};

export var markTaskComplete = function (taskId, successCB, errorCB) {
  var request = {
    type: 'PUT',
    url: `api/tasks/${taskId}/mark_complete?api_key=1`,
    success: successCB,
    error: errorCB
  }
  $.ajax(request);
};

export var markTaskActive = function (taskId, successCB, errorCB) {
  var request = {
    type: 'PUT',
    url: `api/tasks/${taskId}/mark_active?api_key=1`,
    success: successCB,
    error: errorCB
  }
  $.ajax(request);
};

export var deleteTask = function (taskId, successCB, errorCB) {
  var request = {
    type: 'DELETE',
    url: `api/tasks/${taskId}?api_key=1`,
    success: successCB,
    error: errorCB
  }
  $.ajax(request);
};
