require 'test_helper'

class HighScoresControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get high_scores_index_url
    assert_response :success
  end

  test "should get new" do
    get high_scores_new_url
    assert_response :success
  end

  test "should get create" do
    get high_scores_create_url
    assert_response :success
  end

end
