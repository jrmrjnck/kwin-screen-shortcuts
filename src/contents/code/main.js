// Given two screen bounds, a < b if a's left edge is left of b's. If left edges
// are equal, a < b if a's top edge is below b's.
function screenSort(a, b) {
  var x = a[1].x - b[1].x
  if (x != 0) {
    return x;
  }
  var y = a[1].y - b[1].y
  if (y != 0) {
    return -y;
  }
  return 0;
}

// Convert a logical screen number (based on above sorting) into its KWin
// internal index.
function logicalToPhysicalScreen(logicalScreen) {
  var screens = [];
  for (var i = 0; i < workspace.numScreens; ++i) {
    var screen =
        workspace.clientArea(KWin.ScreenArea, i, workspace.currentDesktop);
    screens.push([ i, screen ])
  }
  screens.sort(screenSort)
  return screens[logicalScreen][0]
}

// Return the topmost client window on the given screen.
function topClientOnScreen(physicalScreen) {
  const allClients = workspace.clientList();
  var topClient = null;
  for (var i = 0; i < allClients.length; ++i) {
    var c = allClients[i];
    if (c.specialWindow || c.screen != physicalScreen ||
        (c.desktop != workspace.currentDesktop && c.desktop != -1)) {
      continue;
    }

    if (!topClient || c.stackingOrder > topClient.stackingOrder) {
      topClient = c;
    }
  }
  return topClient;
}

function setupShortcuts() {
  const scriptName = "screen-shortcuts";
  for (let i = 0; i < 3; ++i) {
    let title = `_Switch to Screen ${i}_`;
    let text = `Switch to Screen ${i} (${scriptName})`;
    let shortcut = "Alt+" + [ "Q", "W", "E" ][i];
    registerShortcut(title, text, shortcut, function() {
      var newClient = topClientOnScreen(logicalToPhysicalScreen(i));
      if (newClient !== null) {
        workspace.activeClient = newClient;
      }
    });

    title = `_Window to Screen ${i}_`;
    text = `Window to Screen ${i} (${scriptName})`;
    shortcut = "Alt+Shift+" + [ "Q", "W", "E" ][i];
    registerShortcut(title, text, shortcut, function() {
      workspace.sendClientToScreen(workspace.activeClient,
                                   logicalToPhysicalScreen(i));
    });
  }
}

setupShortcuts();
