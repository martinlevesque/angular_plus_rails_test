Rails.application.routes.draw do


  resources :main

  match '/posts/create' => 'posts#create', via: [:post]
  match '/comments/create' => 'comments#create', via: [:post]

  resources :posts, only: [:create, :index, :show] do
    resources :comments, only: [:show, :create] do
      member do
        put '/upvote' => 'comments#upvote'
      end
    end

    member do
      put '/upvote' => 'posts#upvote'
    end
  end
end
