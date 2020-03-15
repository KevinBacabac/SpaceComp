/*
Pick only one planet at a time and send all ships to attack it.
*/

class AggressiveBot {
  action(your_state, world_state, helper) {
    var actions = new Set();
    var otherPlanets = helper.getOtherPlayer(your_state, "Planet");

    // Do nothing
    if (otherPlanets.size == 0) return actions;

    var targetId = Array.from(otherPlanets)[0];

    for (var type of ["Planet", "Ship"]) {
      your_state.get(type).forEach((item, id) => {
        if (item.get("Health") > 0) {
          let action = new Map();
          action.set("Health", item.get("Health"));
          action.set("Type", "Attack");
          action.set("Source ID", id);
          action.set("Source Type", type);

          let targetID = AggressiveBot.closestPlanet(helper, otherPlanets, id, type);
          action.set("Target", targetID);

          actions.add(action);
        }
      });
    }

    return actions;
  }

  static closestPlanet(helper, otherPlanets, sourceID, sourceType) {
    var dist = false;
    var closest = null;

    for (var otherID of otherPlanets) {
      let newDist;
      if (sourceType == "Planet") {
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
