class Api::V1::HighScoresController < ApplicationController
  def index
    @high_scores = HighScore.all
    render json: @high_scores
  end

  def create
    @high_score = HighScore.new(user_params)
    if @high_score.save
      render json: @high_score, status: :accepted
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def user_params
    params.require(:high_score).permit(:name, :distance, :average_speed, :time_lasted, :longest_streak, :shortest_streak, :direction_changes, :direction_changes_per_second)
  end
end
