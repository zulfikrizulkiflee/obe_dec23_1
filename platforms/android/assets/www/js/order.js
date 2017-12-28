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
            $('#add-order .product-list li a').each(function () {
                var id = $(this).attr("data-product");
                var quantity = $(this).find('input').val();
                item = {}
                item["product_id"] = id;
                item["quantity"] = quantity;
                if (quantity != 0) {
                    jsonProduct.push(item);
                }
            });
            localStorage.setItem('obe_sessionORDERITEMS', JSON.stringify(jsonProduct));
            $.get(api + 'GO_ORDER_CONTROLLER.php?action=order', {
                agent_id: localStorage.getItem('obe_sessionID')
                , order_detail: jsonProduct
                , total_quantity: $('input[name=total_product]').val()
                , note: $('textarea[name=order_desc]').val()
                , stockist_id: 1
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

$.get(api + 'GO_ORDER_CONTROLLER.php?action=agent_order_history' + '&obe_id=' + localStorage.getItem('obe_sessionID'), function (response) {
    $('#profile .outgoing-order').html("");
    $('#outgoing-order .outgoing-order').html("");
    response = JSON.parse(response);
    
    for (i = 0; i < response.length; i++) {
        if (response[i].order_status != null) {
            var quantity = 0;
            var itemArr = JSON.parse(response[i].order_detail);
            $.each(itemArr, function (j, item) {
                quantity += parseInt(item.quantity);
            });
            var str = '<li><a href="#order-detail"><span class="day_name">'+response[i].order_date+'</span>&nbsp; '+response[i].order_time+' <label class="digits"> agent_a </label><div class="clear"></div></a></li>';
            if(i<5){
                $('#profile .outgoing-order').append(str);
            }
            $('#outgoing-order .outgoing-order').append(str);
        }
    }
});
