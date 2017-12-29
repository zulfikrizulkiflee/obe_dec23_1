$('#add-agent .add_agent').on('click', function () {
    if(confirm("Add this agent?")){
        $("#preloader").show();
        if ($(this).val() != "Agent Username" || $(this).val() != "") {
            $.get(api + 'GO_USER_PROFILE.php?action=network', {
                agent_username: $('#add-agent form input[name=agent_username]').val()
                , obe_id: localStorage.getItem('obe_sessionID')
            }, function (response) {
                if (response == 1) {
                    $("#preloader").delay(1000).fadeOut("slow").hide();
                    if(confirm("Agent added, add more?")==false){
                        $.mobile.navigate("#profile");
                        location.reload();
                    }
                }
                else {
                    $("#preloader").delay(1000).fadeOut("slow").hide();
                    alert(response);
                }
            });
        }
    }
});