#!/bin/bash

# Install the package
PKGTOOL="kpackagetool6 --type KWin/Script"
PKGNAME=screen-shortcuts
if $PKGTOOL --show $PKGNAME >/dev/null 2>&1
then
   $PKGTOOL --upgrade src
else
   $PKGTOOL --install src
fi

# In case it was already loaded, disable it here so that it will restart when we
# enable it
sleep 0.5
kwriteconfig6 --file kwinrc --group Plugins --key ${PKGNAME}Enabled false
sleep 0.5
qdbus org.kde.KWin /KWin reconfigure

# Clean any stale shortcuts
sleep 0.5
qdbus org.kde.kglobalaccel /component/kwin org.kde.kglobalaccel.Component.cleanUp > /dev/null

# Enable it
sleep 0.5
kwriteconfig6 --file kwinrc --group Plugins --key ${PKGNAME}Enabled true
sleep 0.5
qdbus org.kde.KWin /KWin reconfigure
