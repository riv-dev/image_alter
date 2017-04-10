var bool = false;

var htmlStr = "";
htmlStr += '<div id="alt-remodal" class="remodal" data-remodal-id="alt-modal" data-remodal-options="hashTracking: false">'
htmlStr += '<button data-remodal-action="close" class="remodal-close"></button>'
htmlStr += '<h1>Enter an ALT for the image</h1>'
htmlStr += '<p>'
htmlStr += "<input id='alt-input' type='text' />"
htmlStr += '</p>'
htmlStr += '<br>'
htmlStr += '<button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>'
htmlStr += '<button data-remodal-action="confirm" class="remodal-confirm">OK</button>'
htmlStr += '</div>'


//$('a').on('click.myDisable', function(e) { e.preventDefault(); });

var inst = null;

var diffMatchPatch = new diff_match_patch();

function addRemodalBox() {
  $('body').append(htmlStr);
  inst = $('[data-remodal-id=alt-modal]').remodal({
    'hashTracking': false
  });
}

function removeRemodalBox() {
  inst.destroy();
}

var active = false;
var selectedImage = null;
var currentImageAlt;

addRemodalBox();

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "get_url") {
      sendResponse({
        host: document.location.host,
        relative_uri: document.location.pathname
      });
    } else if (request.message === "clicked_browser_action") {
      //send back status
      if (active) {
        sendResponse({
          status: "active"
        });
      } else {
        sendResponse({
          status: "inactive"
        });
      }
    } else if (request.message === "clicked_button_action") {
      if (!active) {
        $('body img').each(function () {
          if ($(this).attr('alt') && $(this).attr('alt').length > 0) {
            $(this).css('border', '3px dotted blue');
          } else {
            $(this).css('border', '3px dotted red');
          }
        });

        active = true;

        $('a').click(function (e) {
          e.preventDefault();
        });

        $('body img').click(function (e) {
          e.preventDefault();
          currentImageAlt = $(this).attr('alt');
          $('#alt-input').val(currentImageAlt);
          selectedImage = $(this);
          inst.open();
        });

        sendResponse({
          status: "active"
        });
      } else {
        $('body img').css('border', 'none');

        active = false;

        $('a').unbind("click");

        $('body img').unbind("click");

        sendResponse({
          status: "inactive"
        });
      }
    } else if (request.message === "clicked_options_button_action") {
      //Export the html without the remodal and img border styles
      sendResponse({
        status: "success",
        html: $('html')[0].outerHTML
      });
    }
  }
);

$(document).on('confirmation', '.remodal', function () {
  console.log('Confirmation button is clicked');
  var alt_value = $('#alt-input').val();

  if (alt_value == currentImageAlt) {
    return;
  }

  if (alt_value && alt_value.length > 0) {
    selectedImage.css('border', '');

    //var oldHTML = $('html').html();
    var oldHTML = selectedImage[0].outerHTML;

    selectedImage.attr('alt', alt_value);

    //var newHTML = $('html').html();
    var newHTML = selectedImage[0].outerHTML;

    var host = document.location.host;
    var relative_uri = document.location.pathname;

    var patch = JSON.stringify(diffMatchPatch.patch_make(oldHTML, newHTML));

    chrome.storage.sync.get('rootpath', function (result) {
        $.ajax({
          type: "POST",
          url: "http://localhost:9255",
          data: {
            relative_uri: relative_uri,
            host: host,
            rootpath: result.rootpath,
            html: selectedImage[0].outerHTML,
            patch: patch
          },
          success: function (data) {
            if(data.status == "success") {
              console.log("Success");

            } else {
              console.log("Error");
            }
          },
          error: function () {
            console.log("Error");
          },
          timeout: 1000
        });
    });

    selectedImage.css('border', '3px dotted blue');
  }
});

$(document).on('closed', '.remodal', function (e) {
  console.log('Modal is closed' + (e.reason ? ', reason: ' + e.reason : ''));
  $('#alt-input').val('');
});