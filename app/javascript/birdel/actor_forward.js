import { createConsumer } from "@rails/actioncable";
export class ActorForward {
  constructor() {
    this.actors = {};
    this.queueBumps = [];
  }

  pushBump(bump){
    this.queueBumps.push(bump);
  }

  removeActor(actor) {
    const index = this.actors[actor.constructor.name].indexOf(actor);
    if (index > -1) {
      this.actors[actor.constructor.name].splice(index, 1);
    }
  }

  addActor(actor) {
    // const controllerName = controllerIdentifyer.split('--').pop().split("-").map(word => {return word.toUpperCase()[0] + word.slice(1)}).join("")
    if(!this.actors[actor.constructor.name]) this.actors[actor.constructor.name] = [];
    this.actors[actor.constructor.name].push(actor);
  }

  getActor(componentCssClass, actorName, resourceId){
    const actorDashed = actorName;
    const actorCamelized = actorDashed.split('-').map(word => {return word.toUpperCase()[0] + word.slice(1)}).join("");
    if (resourceId){
      return this.actors[actorCamelized].find(actor => (actor.name == componentCssClass) && (actor.resourceId == resourceId));
    } else {
      return this.actors[actorCamelized].find(actor => actor.name == componentCssClass);
    }
  }

  forward(componentCssClass, actorAndMethod, resourceId, e){
    console.log("forward", componentCssClass, actorAndMethod, resourceId, e);
    //example: ui--ad-meta--attachments-component, attachments-component-actor#uploadByChunks
    const parts = actorAndMethod.split('#');
    const actorDashed = parts[0];
    const methodName = parts[1];
    const actorCamelized = actorDashed.split('-').map(word => {return word.toUpperCase()[0] + word.slice(1)}).join("");
    if (resourceId){
      const actor = this.actors[actorCamelized].find(actor => (actor.name == componentCssClass) && (actor.resourceId == resourceId));
      actor[methodName].call(actor, e);
    } else {
      const actor = this.actors[actorCamelized].find(actor => actor.name == componentCssClass);
      actor[methodName].call(actor, e);
    }
  }

  subscribe({channel, id} = {}) {
    const consumer = createConsumer();
    this.channel = consumer.subscriptions.create(
      {
        channel: channel,
        id: id
      },
      {
        connected: () => {
          console.log("connected");
          this.queueBumps.sort((a, b) => {
            if (a.bumpIndex > b.bumpIndex) return 1;
            if (a.bumpIndex < b.bumpIndex) return -1;
            return 0;
          });
          console.log(this.queueBumps)
          this.queueBumps.forEach(bump => {
            console.log("index", bump.bumpIndex)
            this.forward(bump.componentCssClass, bump.actorAndMethod, bump.resourceId, bump.e);
          });
        },
        received: (res) => {
          console.log(res);
          const callback = res.callback;
          const componentCssClass = callback.component;
          const actorName = callback.actor.split('--').pop().split('-').map(word => {return word.toUpperCase()[0] + word.slice(1)}).join("");
          if (callback.resourceId){
            const actor = this.actors[actorName].find(actor => actor.name == componentCssClass && actor.resourceId == callback.resourceId);
            actor[callback.method].call(actor, res.data);
          } else {
            const actor = this.actors[actorName].find(actor => actor.name == componentCssClass);
            actor[callback.method].call(actor, res.data);
          }
        },
        disconnected: () => console.log("disconnected")
      }
    );
  }

  send(birdelRequest) {
    this.channel.perform("actorDirect", birdelRequest);
  }
}