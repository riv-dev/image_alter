var bool = false;

var htmlStr = "";
htmlStr += '<div class="remodal" data-remodal-id="modal">'
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

$('body').append(htmlStr);

var inst = $('[data-remodal-id=modal]').remodal();

var active = false;
var selectedImage = null;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      //send back status
      if (active) {
        sendResponse({ status: "active" });
      } else {
        sendResponse({ status: "inactive" });
      }
    }
    else if (request.message === "clicked_button_action") {
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
          $('#alt-input').val($(this).attr('alt'));
          selectedImage = $(this);
          inst.open();
        });

        sendResponse({ status: "active" });
      } else {
        $('body img').css('border', 'none');

        active = false;

        $('a').unbind("click");

        $('body img').unbind("click");

        sendResponse({ status: "inactive" });
      }
    }
    else if (request.message === "clicked_export_button_action") { 
        sendResponse({ status: "success", html: $('html').html() });
    }
  }
);

$(document).on('confirmation', '.remodal', function () {
  console.log('Confirmation button is clicked');
  var alt_value = $('#alt-input').val();
  if (alt_value && alt_value.length > 0) {
    selectedImage.attr('alt', alt_value);
    selectedImage.css('border', '3px dotted blue');
  }
});

$(document).on('closed', '.remodal', function (e) {
  console.log('Modal is closed' + (e.reason ? ', reason: ' + e.reason : ''));
  $('#alt-input').val('');
});