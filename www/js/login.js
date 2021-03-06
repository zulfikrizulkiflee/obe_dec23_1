// Login Form
$(function () {
    if (localStorage.getItem('obe_sessionID') != "0") {
        $("#preloader").show();
        $.get(api + 'GO_USER_PROFILE.php?action=user_detail', {
            obe_id: localStorage.getItem('obe_sessionID')
        }, function (response) {
            if (response != "") {
                response = JSON.parse(response);
                $('.profile-name').html(response[0].user_name);
                if (response[0].user_img != null) {
                    $('.profile-img').attr('src', "http://www.zfikri.tk/obe_api/upload/" + response[0].user_img);
                    $('.preview-img').attr('src', "http://www.zfikri.tk/obe_api/upload/" + response[0].user_img);
                }
                $('.profile-callsign').html(response[0].user_callsign)
                $("#preloader").delay(1000).fadeOut("slow").hide();
                $.mobile.navigate('#profile');
            }
            else {
                $("#preloader").delay(1000).fadeOut("slow").hide();
                alert("Invalid login");
            }
        });
    }
    var button = $('#loginButton');
    var box = $('#loginBox');
    var form = $('#loginForm');
    button.removeAttr('href');
    button.mouseup(function (login) {
        box.toggle();
        button.toggleClass('active');
    });
    form.mouseup(function () {
        return false;
    });
    $(this).mouseup(function (login) {
        if (!($(login.target).parent('#loginButton').length > 0)) {
            button.removeClass('active');
            box.hide();
        }
    });
});
$('#login-submit').on('click', function () {
    $("#preloader").show();
    $.get(api + 'GO_USER_PROFILE.php?action=login', $('#login-form').serialize(), function (response) {
        if (response != "") {
            document.getElementById("login-form").reset();
            response = JSON.parse(response);
            console.log(response);
            $.get(api + 'GO_USER_PROFILE.php?action=registerToken', {
                token: localStorage.getItem('obe_pushToken')
                , obe_id: response[0].obe_id
            }, function (data) {}, function (error) {
                console.error(error);
            });
            localStorage.setItem("obe_sessionID", response[0].obe_id);
            localStorage.setItem("obe_sessionNAME", response[0].user_name);
            localStorage.setItem("obe_sessionROLE", response[0].user_role);
            localStorage.setItem("obe_sessionSTOCKISTID", response[0].stockist_id);
            localStorage.setItem("obe_sessionSTATUS", response[0].status);
            $('.profile-name').html(response[0].user_name);
            if (response[0].user_img != null) {
                $('.profile-img').attr('src', "http://www.zfikri.tk/obe_api/upload/" + response[0].user_img);
                $('.preview-img').attr('src', "http://www.zfikri.tk/obe_api/upload/" + response[0].user_img);
            }
            $('.profile-callsign').html(response[0].user_callsign)
            $("#preloader").delay(1000).fadeOut("slow").hide();
            $.mobile.navigate('#profile');
        }
        else {
            $("#preloader").delay(1000).fadeOut("slow").hide();
            alert("Invalid login");
        }
    });
});
$('#logout-submit').on('click', function () {
    if (confirm("Are you sure?") == true) {
        $("#preloader").show();
        $.get(api + 'GO_USER_PROFILE.php?action=destroyToken', {
            obe_id: localStorage.getItem("obe_sessionID")
        }, function (data) {
            //            alert(data);
            //            if(data > 0){
            //                localStorage.setItem("obe_sessionID", "0");
            //                $("#preloader").delay(1000).fadeOut("slow").hide();
            //                $.mobile.navigate("#login");
            //            }else{
            //                alert("Oops, something went wrong!");
            //                $("#preloader").delay(1000).fadeOut("slow").hide();
            //            }
        }, function (error) {
            console.error(error);
        });
        localStorage.setItem("obe_sessionID", "0");
        $("#preloader").delay(1000).fadeOut("slow").hide();
        $.mobile.navigate("#login");
    }
});