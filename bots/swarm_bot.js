/*
For each owned planet, pick a random enemy planet and attack it.
Each turn only send 20% of ships per planet to attack.
*/

class SwarmBot {
  action(your_state, world_state, helper) {
    var actions = new Set();
    var otherPlanets = helper.getOtherPlayer(your_state, "Planet");

    // Do nothing
    if (otherPlanets.size == 0) return actions;

    your_state.get("Planet").forEach((item, id) => {
      if (item.get("Health") > 0) {
        let action = new Map();
        action.set("Health", Math.round(item.get("Health") / 5));
        action.set("Type", "Attack");
        action.set("Source ID", id);
        action.set("Source Type", "Planet");

        let targetId = randChoice(Array.from(otherPlanets));
        action.set("Target", targetId);

        actions.add(action);
      }
    });

    return actions;
  }
}
