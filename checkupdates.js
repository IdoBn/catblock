//Check for updates
function checkupdates(page) {
    var AdBlockVersion;
    $.ajax({
        url: chrome.extension.getURL('manifest.json'),
        dataType: "json",
        success: function(json) {
            AdBlockVersion = json.version;
            var checkURL = "https://github.com/CatBlock/catblock/releases";

            //fetch the version check file
            $.ajax({
                cache: false,
                dataType: "html",
                url: checkURL,
                error: function() {
                    if (page === "help") {
                        $("#checkupdate").html(translate("somethingwentwrong")).show();
                    } else {
                        $("#checkupdate").html(translate("checkinternetconnection")).show();
                    }
                },
                success: function(response) {
                    var parser = new DOMParser();
                    var document = parser.parseFromString(response, "text/html")
                    var version = document.querySelector(".release-timeline > .label-latest > " +
                                                         ".release-meta > .tag-references >li > .css-truncate > .css-truncate-target").textContent;
                    if (isNewerVersion(version)) {
                        $("#checkupdate").html(translate("update_available"));
                        var updateURL = $("key:contains(URL) + string", response).text();
                        $("#here").html(translate("here")).attr("href", updateURL);
                        $(".step").hide();
                    } else {
                        if (page === "help") {
                            // TODO: Change string for translation
                            $("#checkupdate").html(translate("latest_version")).show();
                        }
                    }
                }
            });
        }
    });

    // Hide ad-reporting wizard, when user is offline
    if (page === "adreport" && $('#checkupdate').is(':visible')) {
        $('.section').hide();
    }

    // Check if newVersion is newer than AdBlockVersion
    function isNewerVersion(newVersion) {
        var versionRegex = /^(\*|\d+(\.\d+){0,2}(\.\*)?)$/;
        var current = AdBlockVersion.match(versionRegex);
        var notCurrent = newVersion.match(versionRegex);
        if (!current || !notCurrent)
            return false;
        for (var i=1; i<4; i++) {
            if (current[i] < notCurrent[i])
                return true;
            if (current[i] > notCurrent[i])
                return false;
        }
        return false;
    }
};
