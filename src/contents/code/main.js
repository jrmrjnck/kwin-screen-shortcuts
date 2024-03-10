function debug (...args) {
   if (false) {
      print(...args);
   }
}

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
  for (var i = 0; i < workspace.screens.length; ++i) {
    var screen = workspace.screens[i];
    var screenArea =
        workspace.clientArea(KWin.ScreenArea, screen, workspace.currentDesktop);
    debug("Screen area of", screen.name, screenArea);
    screens.push([ i, screenArea ]);
  }
  screens.sort(screenSort);
  debug(screens);
  return workspace.screens[screens[logicalScreen][0]];
}

// Return the topmost client window on the given screen.
function topClientOnScreen(physicalScreen) {
  const allClients = workspace.windowList();
  var topClient = null;
  for (var i = 0; i < allClients.length; ++i) {
    var c = allClients[i];
    var onCurrentDesktop = (c.desktops.length == 0)
        || c.desktops.includes(workspace.currentDesktop);
    if (c.specialWindow || c.output != physicalScreen
        || !onCurrentDesktop) {
      continue;
    }

    if (!topClient || c.stackingOrder > topClient.stackingOrder) {
      topClient = c;
    }
  }
  return topClient;
}

function setupShortcuts() {
  debug("setting up shortcuts");
  const scriptName = "screen-shortcuts";
  for (let i = 0; i < 3; ++i) {
    let title = `_Switch to Screen ${i}_`;
    let text = `Switch to Screen ${i} (${scriptName})`;
    let shortcut = "Alt+" + [ "Q", "W", "E" ][i];
    registerShortcut(title, text, shortcut, function() {
      debug(" -- in focus handler -- ");
      var newClient = topClientOnScreen(logicalToPhysicalScreen(i));
      if (newClient !== null) {
        workspace.activeWindow = newClient;
      }
    });

    title = `_Window to Screen ${i}_`;
    text = `Window to Screen ${i} (${scriptName})`;
    shortcut = "Alt+Shift+" + [ "Q", "W", "E" ][i];
    registerShortcut(title, text, shortcut, function() {
      debug(" -- in move handler -- ");
      workspace.sendClientToScreen(workspace.activeWindow,
                                   logicalToPhysicalScreen(i));
    });
  }
}

debug("starting kwin-screen-shortcuts");

setupShortcuts();
