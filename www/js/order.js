$('#add-order .product-list input').each(function () {
    $(this).on('blur', function () {
        var productTotal = 0;
        $('#add-order .product-list input').each(function () {
            if ($(this).val() != '') {
                productTotal += parseInt($(this).val());
            }
            $('#add-order input[name=total_product]').val(productTotal);
        });
    });
});
$('#add-order .marketing-list input').each(function () {
    $(this).on('blur', function () {
        var marketingTotal = 0;
        $('#add-order .marketing-list input').each(function () {
            if ($(this).val() != '') {
                marketingTotal += parseInt($(this).val());
            }
            $('#add-order input[name=total_marketing]').val(marketingTotal);
        });
    });
});
$('#add-order .order-now').on('click', function () {
    if ($('textarea[name=order_desc]').val() != "Name, address, phone number and note" && ($('#add-order input[name=total_product]').val() != 0 || $('#add-order input[name=total_marketing]').val() != 0)) {
        var method = "POST";
        if (confirm("Place order?") == true) {
            var jsonProduct = [];
            $('#add-order li a').each(function () {
                var id = $(this).attr("data-item");
                var type = $(this).attr("data-type");
                var quantity = $(this).find('input').val();
                item = {}
                item["product_id"] = id;
                item["type"] = type;
                item["quantity"] = quantity;
                if (quantity != 0) {
                    jsonProduct.push(item);
                }
            });
            localStorage.setItem('obe_sessionORDERITEMS', JSON.stringify(jsonProduct));
            $.get(api + 'GO_ORDER_CONTROLLER.php?action=order', {
                agent_id: localStorage.getItem('obe_sessionID')
                , stockist_id: localStorage.getItem('obe_sessionSTOCKISTID')
                , order_detail: jsonProduct
                , total_quantity: $('input[name=total_product]').val()
                , note: $('textarea[name=order_desc]').val()
            }, function (response) {
                if (method == "POST" && response > 0) {
                    localStorage.setItem('obe_sessionORDERID', response);
                    alert("Order sent");
                    $.mobile.navigate("#profile");
                    location.reload();
                }
                else {
                    alert("We are having difficulties processing your order.\nPlease try again.");
                }
            });
        }
    }
    else {
        alert("Please complete order form.");
    }
});
var new_count=0;
var complete_count=0;
$.get(api + 'GO_ORDER_CONTROLLER.php?action=agent_order_history' + '&obe_id=' + localStorage.getItem('obe_sessionID'), function (response) {
    $('#profile .outgoing-order').html("");
    $('#outgoing-order .outgoing-order').html("");
    response = JSON.parse(response);
    console.log(response);
    for (i = 0; i < response.length; i++) {
        if (response[i].order_status != null) {
            if(response[i].order_status == "New"){
                new_count++;
                $('.new-count').html(new_count);
                $('.total-count').html(new_count + complete_count);
            }
            if(response[i].order_status == "Completed"){
                complete_count++;
                $('.complete-count').html(complete_count);
                $('.total-count').html(new_count + complete_count);
            }
            var pquantity = 0;
            var mquantity = 0;
            var itemArr = JSON.parse(response[i].order_detail);
            $.each(itemArr, function (j, item) {
                if(item.type == "product"){
                    pquantity += parseInt(item.quantity);
                }else if(item.type == "marketing"){
                    mquantity += parseInt(item.quantity);
                }
            });
            var order_date = response[i].order_date.split("/");
            var year = order_date[2].split('');
            
            var str = '<li style="position:relative">'+checkOrder(response[i].status)+'<a href="#order-detail" data-order-id=' + response[i].order_id + '><span class="day_name">' + order_date[0] + '/' + order_date[1] + '/' + order_date[2][2] + order_date[2][3] + '</span>&nbsp; ' + response[i].order_time + ' <label class="digits"> ' + response[i].user_name + ' </label><div class="clear"></div></a></li>';
            if (i < 5 && response[i].status == "New") {
                $('#profile .outgoing-order').append(str);
            }
            $('#outgoing-order .outgoing-order').append(str);
        }
    }
    $('[href=#order-detail]').each(function () {
        $(this).bind('click', function () {
            var orderID = $(this).attr('data-order-id');
            for (i = 0; i < response.length; i++) {
                if (response[i].order_id == orderID) {
                    var order_date = response[i].order_date.split("/");
                    var pquantity = 0;
                    var mquantity = 0;
                    var itemArr = JSON.parse(response[i].order_detail);
                    $.each(itemArr, function (j, item) {
                        if(item.type == "product"){
                            pquantity += parseInt(item.quantity);
                        }else if(item.type == "marketing"){
                            mquantity += parseInt(item.quantity);
                        }
                    });

                    $('.agent_name').html(response[i].user_name);
                    $('.username').html(response[i].user_callsign);
                    $('.date_order').html(order_date[0] + '/' + order_date[1] + '/' + order_date[2][2] + order_date[2][3]+"&nbsp;");
                    $('.time_order').html(response[i].order_time);
                    $('.p-quantity_order').html(pquantity+"pcs");
                    $('.m-quantity_order').html(mquantity+"pcs");
                    $('.status-badge').html(response[i].status);
                    if(response[i].status == "Completed"){
                        $('.status-badge').css('background','#11a8ab');
                        $('.id_order').html(response[i].order_id+'&nbsp;');
                        $('#order-detail .order-detail').append('<li><a href="#"><span>Completed Date</span> <label class="complete_on">'+response[i].clear_date+'</label><div class="clear"></div></a> </li>');
                        $('#order-detail .signin_facebook').hide();
                    }else if(response[i].status == "New"){
                        $('.id_order').html(response[i].order_id+'&nbsp;');
                        $('.status-badge').css('background','#e64c65');
                        $('#order-detail .order-detail li:last-child').remove();
                        $('#order-detail .signin_facebook').show();
                    }
                }
            }
        });
    });
});
$.get(api + 'GO_ORDER_CONTROLLER.php?action=stockist_order_history' + '&obe_id=' + localStorage.getItem('obe_sessionID'), function (response) {
    $('#profile .incoming-order').html("");
    $('#incoming-order .incoming-order').html("");
    response = JSON.parse(response);
    console.log(response);
    for (i = 0; i < response.length; i++) {
        if (response[i].order_status != null) {
            if(response[i].order_status == "New"){
                new_count++;
                $('.new-count').html(new_count);
                $('.total-count').html(new_count + complete_count);
            }
            if(response[i].order_status == "Completed"){
                complete_count++;
                $('.complete-count').html(complete_count);
                $('.total-count').html(new_count + complete_count);
            }
            var pquantity = 0;
            var mquantity = 0;
            var itemArr = JSON.parse(response[i].order_detail);
            $.each(itemArr, function (j, item) {
                if(item.type == "product"){
                    pquantity += parseInt(item.quantity);
                }else if(item.type == "marketing"){
                    mquantity += parseInt(item.quantity);
                }
            });
            var order_date = response[i].order_date.split("/");
            var str = '<li style="position:relative">'+checkOrder(response[i].status)+'<a href="#order-detail" data-order-id=' + response[i].order_id + '><span class="day_name">' + order_date[0] + '/' + order_date[1] + '/' + order_date[2][2] + order_date[2][3] + '</span>&nbsp; ' + response[i].order_time + ' <label class="digits"> ' + response[i].user_name + ' </label><div class="clear"></div></a></li>';
            if (i < 5 && response[i].status == "New") {
                $('#profile ul.incoming-order').append(str);
            }
            $('#incoming-order .incoming-order').append(str);
        }
    }
    $('[href=#order-detail]').each(function () {
        $(this).bind('click', function () {
            var orderID = $(this).attr('data-order-id');
            for (i = 0; i < response.length; i++) {
                if (response[i].order_id == orderID) {
                    var order_date = response[i].order_date.split("/");
                    var pquantity = 0;
                    var mquantity = 0;
                    var itemArr = JSON.parse(response[i].order_detail);
                    $.each(itemArr, function (j, item) {
                        if(item.type == "product"){
                            pquantity += parseInt(item.quantity);
                        }else if(item.type == "marketing"){
                            mquantity += parseInt(item.quantity);
                        }
                    });
                    
                    $('.agent_name').html(response[i].user_name);
                    $('.username').html(response[i].user_callsign);
                    $('.date_order').html(order_date[0] + '/' + order_date[1] + '/' + order_date[2][2] + order_date[2][3]+"&nbsp;");
                    $('.time_order').html(response[i].order_time);
                    $('.p-quantity_order').html(pquantity+"pcs");
                    $('.m-quantity_order').html(mquantity+"pcs");
                    $('.status-badge').html(response[i].status);
                    if(response[i].status == "Completed"){
                        $('.status-badge').css('background','#11a8ab');
                        $('.id_order').html(response[i].order_id+'&nbsp;');
                        $('#order-detail .order-detail').append('<li><a href="#"><span>Completed Date</span> <label class="complete_on">'+response[i].clear_date+'</label><div class="clear"></div></a> </li>');
                        $('#order-detail .signin_facebook').hide();
                    }else if(response[i].status == "New"){
                        $('.id_order').html(response[i].order_id+'&nbsp;');
                        $('.status-badge').css('background','#e64c65');
                        $('#order-detail .order-detail li:last-child').remove();
                        $('#order-detail .signin_facebook').show();
                    }
                }
            }
        });
    });
});

function checkOrder(status){
    var checked = '<span style="position: absolute; right: 5px; top:5px;"><img src="images/check.png" id="remove" alt="" style="width:16px"></span>';
    if (status == "Completed"){
        return checked;
    }else{
        return "";
    }
}
