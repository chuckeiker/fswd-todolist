class Api::TasksController < ApplicationController
  before_action :authenticate_user, only: %i[create update destroy]
  before_action :set_task, only: %i[update destroy mark_complete mark_active]

  def index
    @tasks = current_user.tasks
    render json: { tasks: @tasks }
  end

  def create
    @task = current_user.tasks.build(task_params)
    if @task.save
      render json: { tasks: current_user.tasks }
    else
      render json: { error: "Failed to create task" }, status: 400
    end
  end

  def update
    if @task.update(task_params)
      render json: { tasks: current_user.tasks }
    else
      render json: { error: "Failed to update task" }, status: 400
    end
  end

  def mark_complete
    @task.update(complete: true)
    render json: { tasks: current_user.tasks }
  end

  def mark_active
    @task.update(complete: false)
    render json: { tasks: current_user.tasks }
  end

  def destroy
    @task.destroy
    render json: { tasks: current_user.tasks }
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:content, :due)
  end
end
