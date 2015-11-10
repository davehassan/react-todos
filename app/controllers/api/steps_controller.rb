class Api::StepsController < ApplicationController
  def index
    @steps = Todo.find(params[:todo_id]).steps
    render json: @steps
  end

  def create
    @step = Todo.find(params[:todo_id]).steps.new(step_params)
    @step.save!
    render json: @step
  end

  def update
    @step = Step.find(params[:id])
    @step.update!(step_params)
    render json: @step
  end

  def destroy
    @step = Step.find(params[:id])
    @step.destroy!
    render json: @step
  end

  private
    def step_params
      params.require(:step).permit(:words, :todo_id, :done)
    end
end
