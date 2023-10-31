import $ from 'jquery';

import {
  indexTasks,
  postTask,
  markTaskActive,
  removeTask,
} from "./requests.js";

// Function to render tasks
function renderTasks() {
  indexTasks(function (response) {
    const tasksContainer = $("#tasks");
    const htmlString = response.tasks.map(function (task) {
      return `<div class='col-12 mb-3 p-2 border rounded task' data-id='${task.id}'>
        ${task.content}
        <div class="d-flex justify-content-between">
          <button class='btn btn-sm btn-primary mark-active'>Mark Active</button>
          <button class='btn btn-sm btn-danger remove-task'>Remove</button>
        </div>
      </div>`;
    });
    tasksContainer.html(htmlString);
  });
}

// Function to add a new task
const addNewTask = () => {
  const newTaskContent = $("#new-task").val();
  if (newTaskContent) {
    postTask(newTaskContent, function (response) {
      // Refresh the tasks after adding a new one
      renderTasks();
    });
    // Clear the input field after adding
    $("#new-task").val("");
  }
  // Reload the page to refresh the tasks
  renderTasks();
};

// Function to mark a task as active
const markTaskActiveHandler = (taskId) => {
  markTaskActive(taskId, 1, function () {
    // Refresh the tasks after marking as active
    renderTasks();
  });
};

// Function to remove a task
const removeTaskHandler = (taskId) => {
  removeTask(taskId, 1, function () {
    // Refresh the tasks after removing
    renderTasks();
  });
};

// Add a click event listener for the "Add Task" button
$(document).ready(function() {
$("#add-task").on("click", function() {
  const newTaskContent = $("#new-task").val();

  // Check if the input is not empty
  if (newTaskContent) {
    // Send a POST request to create a new task
    $.ajax({
      url: '/api/tasks?api_key=1',
      type: 'POST',
      data: JSON.stringify({
        task: {
          content: newTaskContent,
        },
      }),
      contentType: 'application/json',
      success: function(response) {
        // Handle the success response (e.g., add the new task to the display)
        console.log('New task added:', response);
        // Refresh the tasks after adding a new one
        renderTasks();
      },
      error: function(error) {
        // Handle errors if necessary
        console.error('Error adding a new task:', error);
      },
    });

    // Clear the input field after adding
    $("#new-task").val("");
  }
});
});

// Add a click event listener for the "Mark Active" buttons
$(document).on("click", ".mark-active", function() {
  // Get the task ID from the data attribute
  const taskId = $(this).closest('.task').data('id');

  // Send a PUT request to mark the task as active
  $.ajax({
    url: `/api/tasks/${taskId}/mark_active?api_key=1`,
    type: 'PUT',
    success: function(response) {
      // Handle the success response (e.g., update the task display)
      console.log('Task marked as active:', response);
    },
    error: function(error) {
      // Handle errors if necessary
      console.error('Error marking task as active:', error);
    }
  });
});

// Add a click event listener for the "Remove" buttons
$(document).on("click", ".remove-task", function() {
  // Get the task ID from the data attribute
  const taskId = $(this).closest('.task').data('id');

  // Send a DELETE request to remove the task
  $.ajax({
    url: `/api/tasks/${taskId}?api_key=1`,
    type: 'DELETE',
    success: function(response) {
        indexTasks(function (refreshedResponse) {
    const htmlString = refreshedResponse.tasks.map(function (task) {
      return `<div class='col-12 mb-3 p-2 border rounded task' data-id='${task.id}'>
        ${task.content}
        <div class="d-flex justify-content-between">
          <button class='btn btn-sm btn-primary mark-active'>Mark Active</button>
          <button class='btn btn-sm btn-danger remove-task'>Remove</button>
        </div>
      </div>`;
    });
    $("#tasks").html(htmlString);
  });
      console.log('Task removed:', response);
    },
    error: function(error) {
      // Handle errors if necessary
      console.error('Error removing task:', error);
    }
  });
});

// Function to create a new user account
function createNewUser() {
  $.ajax({
    type: 'POST',
    url: '/users', // The API endpoint for creating a user
    dataType: 'json',
    success: function(response) {
      // Check if the user was created successfully
      if (response.success === true) {
        const api_key = response.id; // Get the api_key for the new user
        console.log('User account created. Your API key is: ' + api_key);
      } else {
        console.error('Failed to create a user account.');
      }
    },
    error: function(err) {
      console.error('Error creating a user account:', err);
    }
  });
}

// Call the function to create a new user account
createNewUser();

// Initial rendering of tasks
renderTasks();