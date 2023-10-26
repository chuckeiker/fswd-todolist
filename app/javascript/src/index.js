import {
  indexTasks,
  postTask,
  updateTask,
  markTaskComplete,
  markTaskActive,
  deleteTask,
} from "./requests.js";

function renderTasks(tasks) {
  var htmlString = tasks.map(function (task) {
    var taskStatus = task.complete ? "Complete" : "Active";
    var markButtonLabel = task.complete ? "Mark Active" : "Mark Complete";
    var markButtonClass = task.complete ? "btn-warning" : "btn-success";
    return `<div class='col-12 mb-3 p-2 border rounded task' data-id='${task.id}'>
      <div class="d-flex justify-content-between align-items-center">
        <div>
          ${task.content}
        </div>
        <div>
          <button class='btn btn-danger remove-task'>Remove</button>
          <button class='btn ${markButtonClass} mark-task'>${markButtonLabel}</button>
        </div>
      </div>
    </div>`;
  });
  $("#tasks").html(htmlString.join(""));
}

$(document).ready(function () {
  // Function to create a new user account and obtain the api_key
  function createUserAccount(successCB, errorCB) {
    var request = {
      type: "POST",
      url: "/users",
      success: successCB,
      error: errorCB,
    };
    $.ajax(request);
  }

  // Call createUserAccount to create a user account and get the api_key
  createUserAccount(function (response) {
    var apiKey = response.id; // Extract the api_key
    console.log("API Key:", apiKey);
    // Now you have the api_key and can use it for other tasks endpoints

    // Fetch and render tasks based on the obtained api_key
    indexTasks(apiKey, function (response) {
      renderTasks(response.tasks);
    });
  }, function (error) {
    console.error("Error creating a user account:", error);
  });

  $("#addTask").on("click", function () {
    var taskDescription = $("#taskDescription").val();
    if (taskDescription) {
      // Use the obtained apiKey for creating a task
      postTask(apiKey, taskDescription, function (response) {
        renderTasks(response.tasks);
        $("#taskDescription").val("");
      });
    }
  });

  $("#tasks").on("click", ".mark-task", function() {
    var taskId = $(this).closest(".task").data("id");
    var taskData = {
      complete: !$(this).hasClass("btn-success"), // Toggle the complete status
    };
    updateTask(taskId, taskData, function(response) {
      renderTasks(response.tasks);
    });
  });

  $("#tasks").on("click", ".remove-task", function() {
    var taskId = $(this).closest(".task").data("id");
    deleteTask(taskId, function(response) {
      renderTasks(response.tasks);
    });
  });

  $("#allTasks").on("click", function() {
    indexTasks(function(response) {
      renderTasks(response.tasks);
    });
  });

  $("#activeTasks").on("click", function() {
    indexTasks(function(response) {
      var activeTasks = response.tasks.filter(function(task) {
        return !task.complete;
      });
      renderTasks(activeTasks);
    });
  });

  $("#completeTasks").on("click", function() {
    indexTasks(function(response) {
      var completeTasks = response.tasks.filter(function(task) {
        return task.complete;
      });
      renderTasks(completeTasks);
    });
  });
});
