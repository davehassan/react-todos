class Step < ActiveRecord::Base
  validates :words, :todo_id, presence: true
  validates :done, inclusion: { in: [true, false] }

  belongs_to :todo
end
