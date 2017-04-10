# Image Alter!
A chrome extension that allows direct editing of ALT attribute on image tags.
- Click on an image to edit the ALT attribute
- Displays RED outline around images that have no ALT defined
- Displays BLUE outline around images that have ALT defined

# Installation summary
Image Alter has two components, the Chrome Extension, and a local server.  The Chrome Extension allows you to interact directly with images in the web browser, in the background the Chrome Extension communicates with the local server to update HTML files directly on your file disk. In order for the app to work correctly, you need to install both components.

## Installing the Chrome Extension
Download the most recent code from github
```bash
git clone https://github.com/riv-dev/image_alter.git
```

Start chrome browser and enter chrome://extensions in URL.
Drag the "img_alt.crx" file into your browser to install the extension.
### **Note: Everytime you update the code you have to redo this step.

![alt text](/extension_install.png "Install Extension")

## Updating the installation

Make sure to check for updates ocassionally by running within the image_alter folder:
```bash
git pull origin master
```

Then drag the new "img_alt.crx" into the browser like above.

## Install the Chrome Extension Server
Image Alter chrome extension requires you to run the Image Alter Server.  To install the Image Alter Server visit:
```
https://github.com/riv-dev/image_alter_server
```

# Image Alter Extension Usage
1. Click on top right icon to view interface.
2. Click on "Turn ON" to turn on the extension.
3. RED outlines will appear around all images that have no ALT defined.
4. BLUE outlines will appear around images that have ALT defined.
![alt text](/usage.png "Usage")

## Edit ALT
1. Click on an image to edit the ALT attribute
![alt text](/enter_alt.png "Enter ALT")