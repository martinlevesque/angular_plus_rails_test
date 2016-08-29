class CommentsController < ApplicationController

  def create
    post = Post.find(params[:comment][:post_id]) rescue nil
    post.comments.create(comment_params)

    respond_to do |format|
      format.json { render :json => post.reload }
    end

  end

  def upvote
    post = Post.find(params[:post_id])
    comment = post.comments.find(params[:id])
    comment.increment!(:upvotes)

    respond_with post, comment
  end

  private
  def comment_params
    params.require(:comment).permit(:body, :upvotes)
  end

end
