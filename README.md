# Image Alter!
A chrome extension that allows direct editing of ALT attribute on image tags.
- Click on an image to edit the ALT attribute
- Displays RED outline around images that have no ALT defined
- Displays BLUE outline around images that have ALT defined

## Installing the Chrome Extension
Download the most recent code from github
```bash
git clone https://github.com/riv-dev/image_alter.git
```

Make sure to check for updates ocassionally by running within the image_alter folder:
```bash
git pull origin master
```
Start chrome browser and enter chrome://extensions in URL.
Drag the "img_alt.crx" file into your browser to install the extension.

![alt text](/extension_install.png "Install Extension")

## Setting up file saving
Set the file save dialog to open so you can easily replace existing HTML files with the edited version.
![alt text](/download.png "Download dialog")

## Usage
1. Click on top right icon to view interface.
2. Click on "Turn ON" to turn on the extension.
3. RED outlines will appear around all images that have no ALT defined.
4. BLUE outlines will appear around images that have ALT defined.
![alt text](/usage.png "Usage")

## Edit ALT
1. Click on an image to edit the ALT attribute
![alt text](/enter_alt.png "Enter ALT")

## Export to HTML
1. Click Export button in the interface to save the html.
![alt text](/export.png "Export")
