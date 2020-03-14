/*
For each planet owned, target the nearest planet aggressively.
*/

class ClassBot {
  action(your_state, world_state, helper) {
    var actions = new Set();
    var other_planets = helper.getOtherPlayer(your_state, "Planet");

    // Do nothing
    if (other_planets.size == 0) return actions;

    for (var type of ["Planet", "Ship"]) {
      your_state.get(type).forEach((item, id) => {
        if (item.get("Health") > 10) {
          let action = new Map();
          let pop = item.get("Health") - 10;

          action.set("Health", pop);
          action.set("Type", "Attack");
          action.set("Source ID", id);
          action.set("Source Type", type);

          let targetID = ClassBot.closestPlanet(helper, other_planets, id);
          action.set("Target", targetID);

          let target = world_state.get("Planet").get(targetID);
          let targetHealth = target.get("Health");

          if (pop > targetHealth) {
            actions.add(action);
          }
        }
      });
    };

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
