class Bots {
  constructor() {
    this.bots = new Map();

    // Add your bot here
    const IMPORTS = [SwarmBot, AggressiveBot, CautiousBot, ClassBot, YourBot];

    for (var Class of IMPORTS) {
      this.bots.set(Class.name, new Class());
    }
  }

  getActions(helper) {
    var final_actions = new Set();

    this.bots.forEach((bot, name) => {
      let your_state = helper.getYourState(name);

      try {
        var actions = bot.action(your_state, helper.getWorldState(), helper);
      } catch (e) {
        console.error(e);
        return;
      }

      // Verify output
      let player_state = helper.getYourState(name);

      actions.forEach((action, actionSame) => {
        // Verify correctness
        if (action.get("Type") == "Attack") {
          let srcType = action.get("Source Type");

          // Invalid type, not Planet or Ship
          if (!player_state.has(srcType)) return;

          // Cannot fire from same planet to same planet
          if (srcType == "Planet"
              && action.get("Source ID") == action.get("Target")) return;

          // Cannot control other player owned planets / ships
          let srcID = action.get("Source ID");
          if (!player_state.get(srcType).has(srcID)) return;
        }

        // Add to final_actions if correct
        final_actions.add(action);
      });
    });

    return final_actions;
  }

  listPlayers() {
    return new Set(this.bots.keys());
  }
}
