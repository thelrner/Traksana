class TeamsController < ApplicationController
  def index
    @teams = current_user.teams
    render json: @teams
  end

  def create
    begin
      ActiveRecord::Base.transaction do
        @team = current_user.managed_teams.create!(team_params)
        @team.members.create!(current_user)
      end
      # PH - transaction only catches exceptions -- itself will raise an exception
      render json: @team
    rescue
      render json: @team.errors.full_messages,
             status: :unprocessable_entity
    end
  end

  def show
    @team = Team.find(params[:id])

    if @team
      render 'show'
      #PH** have show send down all associated projects, tasks, comments, etc.
    else
      render json: @team.errors.full_messages,
             status: :unprocessable_entity
    end
  end

  private

  def team_params
    params.require(:team).permit(:leader_id, :moniker)
  end
end
