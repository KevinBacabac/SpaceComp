/*
Pick only one planet at a time and send all ships to attack it.
*/

class AggressiveBot {
  action(your_state, world_state, helper) {
    var actions = new Set();
    var other_planets = helper.getOtherPlayer(your_state, "Planet");

    // Do nothing
    if (other_planets.size == 0) return actions;

    var targetId = Array.from(other_planets)[0];

    for (var type of ["Planet", "Ship"]) {
      your_state.get(type).forEach((item, id) => {
        if (item.get("Health") > 0) {
          let action = new Map();
          action.set("Health", item.get("Health"));
          action.set("Type", "Attack");
          action.set("Source ID", id);
          action.set("Source Type", type);

          let targetID = AggressiveBot.closestPlanet(helper, other_planets, id, type);
          action.set("Target", targetID);

          actions.add(action);
        }
      });
    }

    return actions;
  }

  static closestPlanet(helper, other_planets, sourceID, sourceType) {
    var dist = false;
    var closest = null;

    for (var otherID of other_planets) {
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
