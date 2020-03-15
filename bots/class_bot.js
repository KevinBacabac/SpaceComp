/*
For each planet owned, target the nearest planet aggressively.
*/

class ClassBot {
  action(your_state, world_state, helper) {
    var actions = new Set();
    var otherPlanets = helper.getOtherPlayer(your_state, "Planet");

    // Do nothing
    if (otherPlanets.size == 0) return actions;

    for (var type of ["Planet", "Ship"]) {
      your_state.get(type).forEach((item, id) => {
        if (item.get("Health") > 10) {
          let action = new Map();
          let pop = item.get("Health") - 10;

          action.set("Health", pop);
          action.set("Type", "Attack");
          action.set("Source ID", id);
          action.set("Source Type", type);

          let targetID = ClassBot.closestPlanet(helper, otherPlanets, type, id);
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

  static closestPlanet(helper, otherPlanets, type, sourceID) {
    var dist = false;
    var closest = null;

    for (var otherID of otherPlanets) {
      let newDist;
      if (type == "Planet") {
         newDist = helper.getDistance("Planet", sourceID, otherID);
      } else {
        newDist = helper.getPlanetShipDistance(otherID, sourceID);
      }
      if (dist === false || newDist < dist) {
        closest = otherID;
        dist = newDist;
      }
    }

    return closest;
  }
}
