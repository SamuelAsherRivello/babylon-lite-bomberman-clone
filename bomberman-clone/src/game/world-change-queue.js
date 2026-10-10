export function createWorldChangeQueue() {
  let nextId = 0;
  let pending = null;

  return {
    request(change) {
      pending = { id: ++nextId, ...change };
      return pending.id;
    },

    peek() {
      return pending;
    },

    consume(id) {
      if (!pending || pending.id !== id) return null;
      const change = pending;
      pending = null;
      return change;
    },
  };
}
