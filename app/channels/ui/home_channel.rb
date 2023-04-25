module Ui
  class HomeChannel < ApplicationCable::Channel
    state_attr_accessor :first_stream
    include Birdel::Rona

    def subscribed
      self.first_stream = "#{params[:channel]}_#{params[:id]}"
      stream_from self.first_stream
    end
  end
end