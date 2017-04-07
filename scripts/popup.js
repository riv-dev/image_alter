function setStatusOn() {
    $('#server-status').html("Online");
    $('#server-status').addClass("status--on");
    $('#server-status').removeClass("status--off");
}

function setStatusOff() {
    $('#server-status').html("Offline");
    $('#server-status').addClass("status--off");
    $('#server-status').removeClass("status--on");
}

function setStatusSynced(status) {
    $('#sync-status').html(status);
    $('#sync-status').addClass("status--on");
    $('#sync-status').removeClass("status--off");
}

function setStatusNotSynced(status) {
    $('#sync-status').html(status);
    $('#sync-status').addClass("status--off");
    $('#sync-status').removeClass("status--on");
}


function resync(rootpath) {
    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "get_url"}, function (response) {
            var host = response.host;
            var relative_uri = response.relative_uri;

            $.ajax({
                type: "GET",
                url: "http://localhost:9255?host="+encodeURIComponent(host)+"&relative_uri="+encodeURIComponent(relative_uri)+"&rootpath=" + encodeURIComponent(rootpath),
                error: function () {
                    setStatusOff();
                    setStatusNotSynced("N/A");
                },
                success: function (response) {
                    if(response.status == "online") { 
                        setStatusOn();
                    } else {
                        setStatusOff();
                    }

                    if(response.synced == "success") {
                        setStatusSynced(response.rootpath);
                    } else {
                        setStatusNotSynced(response.rootpath);
                    }
                },
                dataType: 'json',
                timeout: 1000
            });

        });
    });

}

$(document).ready(function () {

    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "clicked_browser_action"}, function (response) {
            if (response.status == "active") {
                $('#on_off_btn').html("Turn OFF");
                $('#on_off_btn').addClass('button--active');
            } else {
                $('#on_off_btn').html("Turn ON");
                $('#on_off_btn').removeClass('button--active');
            }
        });

        chrome.storage.sync.get('rootpath', function (result) {
            resync(result.rootpath);
        });

    });

    $('#on_off_btn').click(function () {
        chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"message": "clicked_button_action"}, function (response) {
                if (response.status == "active") {
                    $('#on_off_btn').html("Turn OFF");
                    $('#on_off_btn').addClass('button--active');
                    chrome.storage.sync.get('rootpath', function (result) {
                        resync(result.rootpath);
                    });
                } else {
                    $('#on_off_btn').html("Turn ON");
                    $('#on_off_btn').removeClass('button--active');
                }
            });
        });

    });

    var inst = $('[data-remodal-id=options-modal]').remodal();

    $('#options_btn').click(function () {
        $('#popup').addClass('popup-window--remodal');
        //chrome extension adds padding right, remove
        $('#popup').css('padding-right', '15px');

        chrome.storage.sync.get('rootpath', function (result) {
            console.log("Setting retrieved: " + result.rootpath);
            $('#rootpath-input').val(result.rootpath);
        });

        inst.open();
    });

    $(document).on('confirmation', '#options-remodal', function () {
        console.log('Confirmation button is clicked');
        var rootpath_value = $('#rootpath-input').val();

        if (rootpath_value && rootpath_value.length > 0) {
            chrome.storage.sync.set({'rootpath': rootpath_value}, function () {
                resync(rootpath_value);
            });
        }
    });

    $(document).on('closed', '#options-remodal', function (e) {
        // Reason: 'confirmation', 'cancellation'
        console.log('Modal is closed' + (e.reason ? ', reason: ' + e.reason : ''));

        $('#popup').removeClass('popup-window--remodal');
        //chrome extension adds padding right, remove
        $('#popup').css('padding-right', '15px');
    });

});