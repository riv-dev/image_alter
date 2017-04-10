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

![alt text](/doc_images/extension_install.png =300x)

## Updating the installation

Make sure to check for updates ocassionally by running within the image_alter folder:
```bash
git pull origin master
```

Then drag the new "img_alt.crx" into the browser like above.

## Install the Chrome Extension Server
Install and start the server before continuing on to the next steps. Visit the link below for installation directions.
```
https://github.com/riv-dev/image_alter_server
```

# Image Alter Setup
1. Click on the Chrome Extension icon in the top right.
2. If the server was installed and started properly, you should see green "Online" status.
![alt text](/doc_images/setup1.png "Setup 1")
3. Click "Options" button in the Chrome Extension.
4. Enter the root directory where all your HTML files sit.
![alt text](/doc_images/setup2.png "Setup 2")
5. Visit any of you pages in the web browser. For example:
![alt text](/doc_images/setup3.png "Setup 3")
6. If everything is right, the Sync status should be green and point to your HTML file on your file disk. 
![alt text](/doc_images/setup4.png "Setup 4")

# Image Alter Usage
1. Click on "Turn ON" to turn on the extension.
2. RED outlines will appear around all images that have no ALT defined.
3. BLUE outlines will appear around images that have ALT defined.
![alt text](/doc_images/usage.png "Usage")

## Edit ALT
1. Click on an image to edit the ALT attribute.  Press OK when done.
2. Your HTML file should be updated automatically.  You may check your HTML code to confirm.
![alt text](/doc_images/enter_alt.png "Enter ALT")
