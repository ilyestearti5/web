import { KeyboardShortcut } from "./lib/keyboard-shortcuts.js";
import { Notification } from "./lib/notifay.js"

Notification.start();

var notifay = new Notification("window operation", ["ok", "cancel"]);

notifay.doc = "the operation will be close directly window without save anything!";

var not2 = new Notification("show location", ["cancel"]);

KeyboardShortcut.create("close window", "Ctrl+Q", null).ondown(async () => {
  var info = await notifay.open();
  if (info == "ok") {
    console.log("window should be closed");
    window.close();
  }
})

KeyboardShortcut.create("cancel notification", "Escape", null).ondown(() => {
  notifay.close();
})


KeyboardShortcut.create("show location", "Ctrl+D", null).ondown(async (combinition, keyboard) => {
  keyboard && keyboard.preventDefault();
  not2.doc = `location is <a href="${window.location.href}">${window.location.href}</a>`;
  var cancel = await not2.open()
  cancel == "cancel" && not2.close();
})