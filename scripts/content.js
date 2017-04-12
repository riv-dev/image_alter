var bool = false;

var htmlStr = "";
htmlStr += '<div id="alt-remodal" class="remodal" data-remodal-id="alt-modal" data-remodal-options="hashTracking: false">';
htmlStr += '<button data-remodal-action="close" class="remodal-close"></button>';
htmlStr += '<h1>Enter an ALT for the image</h1>';
htmlStr += '<p>';
htmlStr += "<input id='alt-input' type='text' />";
htmlStr += '</p>';
htmlStr += '<br>';
htmlStr += '<button data-remodal-action="cancel" class="remodal-cancel">Cancel</button>';
htmlStr += '<button data-remodal-action="confirm" class="remodal-confirm">OK</button>';
htmlStr += '</div>';

var cssStr = "";
cssStr += '.remove-pointer-events, .remove-pointer-events:before, .remove-pointer-events:after {';
cssStr += '   pointer-events: none;';
cssStr += '}';


//$('a').on('click.myDisable', function(e) { e.preventDefault(); });

var inst = null;

var diffMatchPatch = new diff_match_patch();
var injectedScript;
var injectedCSS;

function removeLinkBehavior() {
  $('a').addClass('remove-pointer-events');
  $('a > *').css('pointer-events','none');
  $('a img').css('pointer-events','auto');
  $('a').off();
  $('a').click(function(e) {
    e.preventDefault();
  });
}

function addBackLinkBehavior() {
  $('a').removeClass('remove-pointer-events');
  $('a > *').css('pointer-events','');
  $('a img').css('pointer-events','');
  $('a').unbind('click');
}

function turnOnExtension() {
  active = true;

  injectedCSS = document.createElement('style');
  injectedCSS.appendChild(document.createTextNode(cssStr));
  document.head.appendChild(injectedCSS);

  injectedScript = document.createElement('script');
  injectedScript.appendChild(document.createTextNode('('+ removeLinkBehavior +')();'));
  document.body.appendChild(injectedScript);

  $('body').append(htmlStr);
  inst = $('[data-remodal-id=alt-modal]').remodal({
    'hashTracking': false
  });

  $('body img').click(function (e) {
    e.preventDefault();
    currentImageAlt = $(this).attr('alt');
    $('#alt-input').val(currentImageAlt);
    selectedImage = $(this);
    inst.open();
  });

  $('body img').each(function () {
    $(this).removeClass('remove-pointer-events');

    if ($(this).attr('alt') && $(this).attr('alt').length > 0) {
      $(this).css('border', '3px dotted blue');
    } else {
      $(this).css('border', '3px dotted red');
    }
  });

}

function turnOffExtension() {
  active = false;

  document.head.removeChild(injectedCSS);
  document.body.removeChild(injectedScript);
  addBackLinkBehavior();
  inst.destroy();
  $('body img').css('border', '');
  $('body img').unbind("click");
}



var active = false;
var selectedImage = null;
var currentImageAlt;


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
        turnOnExtension();

        sendResponse({
          status: "active"
        });
      } else {

        turnOffExtension();


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

//Extension is ON
$(document).on('confirmation', '.remodal', function () {
  console.log('Confirmation button is clicked');
  var alt_value = $('#alt-input').val();

  if (alt_value == currentImageAlt) {
    return;
  }

  if (alt_value && alt_value.length > 0) {
    selectedImage.css('border', '');
    selectedImage.css('pointer-events','');
    var draggable = selectedImage.attr('draggable');
    var style = selectedImage.attr('style');
    selectedImage.removeAttr('draggable');
    selectedImage.removeAttr('style');

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

    if(style) {
      selectedImage.attr('style',style);
    }
    selectedImage.css('border', '3px dotted blue');
    selectedImage.css('pointer-events','auto');
    if(draggable) {
      selectedImage.attr('draggable',draggable);
    }
  }
});

$(document).on('closed', '.remodal', function (e) {
  console.log('Modal is closed' + (e.reason ? ', reason: ' + e.reason : ''));
  $('#alt-input').val('');
});