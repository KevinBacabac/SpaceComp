/*
For each planet owned, target the nearest planet aggressively.
*/

class CautiousBot {
  action(your_state, world_state, helper) {
    var actions = new Set();
    var otherPlanets = helper.getOtherPlayer(your_state, "Planet");

    // Do nothing
    if (otherPlanets.size == 0) return actions;

    your_state.get("Planet").forEach((item, id) => {
      if (item.get("Health") > 20) {
        let action = new Map();
        let pop = item.get("Health") - 10;

        action.set("Health", pop);
        action.set("Type", "Attack");
        action.set("Source ID", id);
        action.set("Source Type", "Planet");


        let targetID = CautiousBot.closestPlanet(helper, otherPlanets, id);
        action.set("Target", targetID);

        actions.add(action);
      }
    });

    return actions;
  }

  static closestPlanet(helper, otherPlanets, sourceID) {
    var dist = false;
    var closest = null;

    for (var otherID of otherPlanets) {
      let newDist = helper.getDistance("Planet", sourceID, otherID);
      if (dist === false || newDist < dist) {
        closest = otherID;
        dist = newDist;
      }
    }

    return closest;
  }
}
