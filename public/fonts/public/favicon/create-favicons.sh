#!/bin/bash

# Script to create favicon sizes from alien.png
# Requires ImageMagick (install with: brew install imagemagick on macOS)

# Create different sizes
convert public/images/alien.png -resize 16x16 public/favicon/favicon-16x16.png
convert public/images/alien.png -resize 32x32 public/favicon/favicon-32x32.png
convert public/images/alien.png -resize 64x64 public/favicon/favicon-64x64.png
convert public/images/alien.png -resize 128x128 public/favicon/favicon-128x128.png
convert public/images/alien.png -resize 180x180 public/favicon/apple-touch-icon.png
convert public/images/alien.png -resize 192x192 public/favicon/android-chrome-192x192.png
convert public/images/alien.png -resize 512x512 public/favicon/android-chrome-512x512.png

# Create ICO file (Windows)
convert public/images/alien.png -resize 16x16 -resize 32x32 -resize 48x48 public/favicon/favicon.ico

echo "Favicon files created in public/favicon/"
