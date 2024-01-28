# kwin-screen-shortcuts
KWin provides shortcuts to send windows to specific screens ("Window to Screen
N") and to set focus on specific screens when "Separate screen focus" is enabled
("Switch to Screen N"). However, the ordering of the screens is not predictable
or consistent across different screen configurations.

This KWin script adds shortcuts with the same name and functionality, but with
predictable screen ordering from left to right. So no matter what your screen
configuration is, triggering "Window to Screen 0" will always send to window to
the leftmost screen.

Ultimately, I think this should be fixed in KWin, but for now a script does the
trick.
