Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :high_scores, only: [:index, :create]
    end
  end
end
