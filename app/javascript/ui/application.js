// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import { Application } from "@hotwired/stimulus"
import { ActorForward } from "../birdel/actor_forward"

if (window.Birdel) {
  delete window.Birdel;
}
window.Birdel = new ActorForward();


const application = Application.start()
application.debug = false
window.Stimulus   = application

export { application }