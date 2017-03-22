$(document).ready(function () {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { "message": "clicked_browser_action" }, function (response) {
            if (response.status == "active") {
                $('#on_off_btn').html("Turn OFF");
                $('#on_off_btn').addClass('button--active');
            } else {
                $('#on_off_btn').html("Turn ON");
                $('#on_off_btn').removeClass('button--active');
            }
        });
    });

    $('#on_off_btn').click(function () {

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { "message": "clicked_button_action" }, function (response) {
                if (response.status == "active") {
                    $('#on_off_btn').html("Turn OFF");
                    $('#on_off_btn').addClass('button--active');
                } else {
                    $('#on_off_btn').html("Turn ON");
                    $('#on_off_btn').removeClass('button--active');
                }
            });
        });

    });

    var inst = $('[data-remodal-id=modal]').remodal();

    $('#export_btn').click(function () {
        $('#popup').addClass('popup-window--saving');
        //chrome extension adds padding right, remove
        $('#popup').css('padding-right', '15px');
        inst.open();
    });

    $(document).on('confirmation', '.remodal', function () {
        console.log('Confirmation button is clicked');
        var filename_value = $('#filename-input').val();

        if (filename_value && filename_value.length > 0) {
            var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
            saveAs(blob, filename_value);
        }
    });


    $(document).on('closed', '.remodal', function (e) {
        // Reason: 'confirmation', 'cancellation'
        console.log('Modal is closed' + (e.reason ? ', reason: ' + e.reason : ''));
        $('#filename-input').val('');
        $('#popup').removeClass('popup-window--saving');
        //chrome extension adds padding right, remove
        $('#popup').css('padding-right', '15px');        
    });
});

