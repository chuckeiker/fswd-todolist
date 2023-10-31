class Api::TasksController < ApplicationController
  before_action :set_user
  before_action :set_task, only: %i[update destroy mark_complete mark_active]

  def index
    @tasks = @user.tasks
    render json: { tasks: @tasks }
  end

  def create
    @task = @user.tasks.build(task_params)
    if @task.save
      render json: { tasks: @user.tasks }
    else
      render json: { error: 'Failed to create task' }, status: 400
    end
  end

  def update
    if @task.update(task_params)
      render json: { tasks: @user.tasks }
    else
      render json: { error: 'Failed to update task' }, status: 400
    end
  end

  def mark_complete
    @task.update(complete: true)
    render json: { tasks: @user.tasks }
  end

  def mark_active
    @task.update(complete: false)
    render json: { tasks: @user.tasks }
  end

  def destroy
    @task.destroy
    render json: { tasks: @user.tasks }
  end

  private

  def set_task
    @task = @user.tasks.find(params[:id])
  end

  def set_user
    @user = User.find(params[:api_key])
  end

  def task_params
    params.require(:task).permit(:content, :due)
  end
end
