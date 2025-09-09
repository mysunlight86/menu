export class PubSubBus {
  static on(eventType, handler) {
    document.addEventListener(eventType, handler);
  }

  static off(eventType, handler) {
    document.removeEventListener(eventType, handler);
  }

  static publish(eventType, detail) {
    document.dispatchEvent(new CustomEvent(eventType, { detail }))
  }
}
