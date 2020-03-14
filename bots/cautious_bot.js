/*
For each planet owned, target the nearest planet aggressively.
*/

class CautiousBot {
  action(your_state, world_state, helper) {
    var actions = new Set();
    var other_planets = helper.getOtherPlayer(your_state, "Planet");

    // Do nothing
    if (other_planets.size == 0) return actions;

    your_state.get("Planet").forEach((item, id) => {
      if (item.get("Health") > 20) {
        let action = new Map();
        let pop = item.get("Health") - 10;

        action.set("Health", pop);
        action.set("Type", "Attack");
        action.set("Source ID", id);
        action.set("Source Type", "Planet");


        let targetID = CautiousBot.closestPlanet(helper, other_planets, id);
        action.set("Target", targetID);

        actions.add(action);
      }
    });

    return actions;
  }

  static closestPlanet(helper, other_planets, sourceID) {
    var dist = false;
    var closest = null;

    for (var otherID of other_planets) {
      let newDist = helper.getDistance("Planet", sourceID, otherID);
      if (dist === false || newDist < dist) {
        closest = otherID;
        dist = newDist;
      }
    }

    return closest;
  }
}
