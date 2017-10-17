#!/bin/bash

xrandr --newmode "2560x1440x54.97"  221.000000  2560 2608 2640 2720  1440 1443 1447 1478  +HSync -VSync
xrandr --addmode HDMI-1 "2560x1440x54.97"
xrandr --output HDMI-1 --mode "2560x1440x54.97" --primary --output LVDS-1 --pos 596x1440

