# Google Image Downloader

Command line image downloader from Google based on `images-scraper` (https://github.com/pevers/images-scraper).

## Requirements

This app requires Nodejs version 12 or higher. Also it requires Google Chrome browser installed.

## How to install

`npm install -g @ahmetcetin/image-downloader`

WARNING for Ubuntu or other Linux distros: If you're on linux, you may get access denied error. If you haven't done it yet, it's better to tell npm to install global packages in your home directory, so that it won't require sudo. In fact, for GoogleDL, as it installs Chromium, even installation with sudo won't help. Please follow the steps described in this page to install it on Linux: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

## How to use

Just run `googledl` in terminal, and follow the instructions.

After entering parameters, it will launch Chrome browser and make the search in Google Images, then will download the required number of images to the selected `basefolder/subfolder`. The number of images downloaded might be less than required, as app will download only jpg files.

Remember that there is a hard limit of 400 images in google image search results.

![](images/googledownloader.png)

## How to uninstall

`npm uninstall -g @ahmetcetin/image-downloader`

# Important - Copyright notice!

You can freely use this tool for any purpose but please respect the copyright owners of the images you downloaded using this tool. Downloading image from Internet does not mean that you can use it freely.
