// Abstract class
class PlayerCollection extends Collection {
  listOwner(owner) {
    var result = new Set();

    this.all.forEach((item, i) => {
      if (item.owner == owner) {
        result.add(i);
      }
    });

    return result;
  }

  exportOwner(owner) {
    const ids = this.listOwner(owner);
    return this.export(ids);
  }

  export(ids) {
    var out = new Map();

    for (var id of ids) {
      out.set(id, this.find(id).serialize());
    }

    return out;
  }

  exportAll() {
    const ids = new Set(this.all.keys());
    return this.export(ids);
  }
}
