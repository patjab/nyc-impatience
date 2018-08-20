class CreateHighScores < ActiveRecord::Migration[5.2]
  def change
    create_table :high_scores do |t|
      t.string :name
      t.integer :distance
      t.float :average_speed
      t.integer :time_lasted
      t.integer :longest_streak
      t.integer :shortest_streak
      t.integer :direction_changes
      t.integer :direction_changes_per_second

      t.timestamps
    end
  end
end
