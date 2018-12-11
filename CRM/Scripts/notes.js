var shoppingCartId = null;
var shoppingCart = null;
var displayFullListOfContacts = false; //Set to false if user must type (part of) the Contact name to be able to select a Contact reference.

(function ($) {
    var gotShoppingCart = false;
    var gotProducts = false;
    var gotAllAddresses = false;
    var gotWizard = false;
    var shoppingCartUpdateInProgress = 0;
    var requiresApproval = false;
    var deliveryAddressRequired = false;

    function timeoutErrorHandling(){
        setTimeout(function() {
            if($('#loadingSpinner').is(":visible")){
                if (confirm("Press OK to try again. If problem persists please contact support.")){
                    location.reload();
                }else{
                    ('#loadingSpinner').hide();
                }
            }            
        }, 30000) 
    }timeoutErrorHandling();
    
    function getProducts(purchaseOrder) {
        DynPCA.App.ExecuteRequest('POST', JSON.stringify(purchaseOrder), 'json', true, '/CrmSdk/GetProducts', { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" })
            .done(function (data) {
                initializeProductsTable(data);
                gotProducts = true;
                checkLoading();
            }).fail(function (exception) {
                $('#crmsdk').html(exception.error);
            });
    }

    function getShoppingCart(getProductsCallBack) {
        startShoppingCartUpdate();
        //console.log("GetShoppingCart ExecuteRequest called.");
        DynPCA.App.ExecuteRequest('GET', null, 'json', true, '/CrmSdk/GetShoppingCart', null)
            .done(function (responseData) {
                if (!responseData) {
                    $('#loadingSpinner').hide();
                    $('#notLoggedIn').removeClass('hidden');
                    return;
                }
                updateShoppingCart(responseData);
                updateSummary();
                $('textarea.instructions').val(responseData.messageToApprover);
                var purchaseOrder = {
                    'shoppingCartId': responseData.shoppingCartId,
                    'forContactId': responseData.forContact.id
                };
                if (typeof (getProductsCallBack) === 'function') getProductsCallBack(purchaseOrder);
                gotShoppingCart = true;
                endShoppingCartUpdate();
                checkLoading();
            }).fail(function (exception) {
                //console.log("GetShoppingCart .fail() called.");
                $('#crmsdk').html(exception.error);
            });
    }

    function calculateTotalPrice() {
        if (!shoppingCart) return null;
        var shoppingCartData = shoppingCart.data();
        var totalPrice = 0;
        $.each(shoppingCartData, function (index, lineItem) {
            totalPrice += lineItem.price;
        });
        return totalPrice;
    }

    function startShoppingCartUpdate() {
        shoppingCartUpdateInProgress++;
        $('.wizard li').addClass('disabled').find('a').addClass('disabled');
    }

    function endShoppingCartUpdate() {
        shoppingCartUpdateInProgress--;
        if (!shoppingCartUpdateInProgress) $('.wizard li').removeClass('disabled').find('a').removeClass('disabled');
    }

    function updateSummary() {
        if (shoppingCart != null) {
            var shoppingCartData = shoppingCart.data();
            //console.log('selectedProducts:');
            //console.log(shoppingCartData);
            $('#tab4 tbody').empty();
            $('#tab5 tbody').empty();
            var subscriptionSubtotal = 0;
            var subtotal = 0;

            var hideDeleteIfOnlyOne = function () {
                var remainingDeleteButtons = $('#tab4 tbody .deleteLineItem:not(.deleting)');
                remainingDeleteButtons.toggle(remainingDeleteButtons.length > 1);
            };

            requiresApproval = false;

            $.each(shoppingCartData, function (index, lineItem) {
                var lineItemRow = $('<tr data-lineitemid="' + lineItem.id + '">').appendTo('#tab4 tbody');
                lineItemRow.append('<td>' + lineItem.quantity + '</td><td>' + lineItem.product.name + '</td>');

                var approval = $('<td>').appendTo(lineItemRow);
                if (lineItem.product.sysAdminApprovalRequired && lineItem.product.managerApprovalRequired) {
                    approval.html('Chef/Systemadministratör');
                    requiresApproval = true;
                } else if (lineItem.product.sysAdminApprovalRequired) {
                    approval.html('Systemadministratör');
                    requiresApproval = true;
                } else if (lineItem.product.managerApprovalRequired) {
                    approval.html('Chef');
                    requiresApproval = true;
                } else {
                    approval.html('');
                    requiresApproval = requiresApproval || false;
                }

                lineItemRow.append('<td>' + lineItem.unitPrice + " " + lineItem.currency + '</td>');
                var discountHtml = "";
                if (lineItem.discountAmount != "NaN") {
                    discountHtml = lineItem.discountAmount + " " + lineItem.currency;
                }
                lineItemRow.append('<td>' + discountHtml + '</td>');
                lineItemRow.append('<td>' + lineItem.lineTotal + " " + lineItem.currency + '</td>');

                if (lineItem.product.defaultItemUnit.subscriptionUnit) {
                    subscriptionSubtotal += lineItem.lineTotal;
                } else {
                    subtotal += lineItem.lineTotal;
                }

                var deleteWrapperTd = $('<td>').appendTo(lineItemRow);
                var deleteWrapper = $('<span class="spanButton">').appendTo(deleteWrapperTd);
                var deleteButton = $('<button class="btn btn-success deleteLineItem" data-lineitemid="' + lineItem.id + '" type="button" class="btn btn-success">Delete</button>').on('click', function () {
                    var self = $(this);
                    self.addClass('deleting').hide();
                    hideDeleteIfOnlyOne();
                    self.closest('td').find('.buttonSpinner').removeClass("hidden");

                    startShoppingCartUpdate();

                    DynPCA.App.ExecuteRequest('POST', "'" + lineItem.id + "'", 'json', true, '/CrmSdk/DeleteLineItem', { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }).done(function (data) {

                        endShoppingCartUpdate();

                        shoppingCart.row(index).remove().draw();
                        self.closest('tr').remove();
                        $('#tab5 tbody').find('tr[data-lineitemid="' + lineItem.id + '"]').remove();
                    }).fail(function (exception) {
                        $('#crmsdk').html(exception.error);
                    });
                }).appendTo(deleteWrapper);
                deleteWrapperTd.append('<span class="buttonSpinner hidden"><span class="btn btn-success"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span></span></span>');
                $('#tab5 tbody').append('<tr data-lineitemid="' + lineItem.id + '"><td>' + lineItem.quantity + '</td><td>' + lineItem.product.name + '</td><td>' + lineItem.lineTotal + " " + lineItem.currency + '</td></tr>');
                //totalprice += lineItem.lineTotal;
            });
            $('.totalAmount').html(subtotal);
            $('.monthlyAmount').html(subscriptionSubtotal);
            hideDeleteIfOnlyOne();
        }
    };

    function addLineItem(lineItem, doneCallback) {
        console.log(JSON.stringify(lineItem));
        DynPCA.App.ExecuteRequest('POST', JSON.stringify(lineItem), 'json', true, '/CrmSdk/AddLineItem', { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }).done(function (responseData) {
            //console.log(responseData);
            shoppingCart.row.add(responseData).draw();
            var confirmationMessage = lineItem.Quantity + " x " + lineItem.Product.Name + " har lagts till i din varukorg.";
            //$("#AddProductConfirmationModal .modal-body span").text(confirmationMessage);
            //$("#AddProductConfirmationModal").modal('show');
            addNotification(confirmationMessage);
            adjustTables();
            updateSummary();
            doneCallback();
        }).fail(function (exception) {
            $('#crmsdk').html(exception.error);
        });
    }

    function displayProductConfiguration() {
        var shoppingCartData = shoppingCart.data();
        $('#ProductConfiguration tbody').empty();

        $.each(shoppingCartData, function (index, lineItem) {
            var dimensionWrapper = $('<tr><td>' +
                '<h4>' + lineItem.product.name + '</h4>' +
                '</td>' +
                '<td>' +
                '<div class="row" data-lineitemid="' + lineItem.id + '">' +
                '</div>' +
                '</td></tr>');

            var lineItemDimensions = dimensionWrapper.find('div.row');
            var dimensionNumber = 1;
            for (dimensionNumber = 1; dimensionNumber <= 8; dimensionNumber++) {
                var visible = "true";
                if (lineItem["dimension" + dimensionNumber + "Visible"] != true) visible = "false";
                if (visible = "true") {
                    var mandatory = "true";
                    var editable = "true";

                    if (lineItem["dimension" + dimensionNumber + "Mandatory"] != true) mandatory = "false";
                    if (lineItem["dimension" + dimensionNumber + "Visible"] != true) visible = "false";
                    if (lineItem["dimension" + dimensionNumber + "Editable"] != true) editable = "false";

                    var options = lineItem["dimension" + dimensionNumber + "Options"];
                    var selectedOption = lineItem["dimension" + dimensionNumber + "Id"];
                    var label = lineItem["dimension" + dimensionNumber + "Label"];

                    if (lineItem["dimension" + dimensionNumber + "Mandatory"]) {
                        label += "<span class=\"required\">*</span>";
                    }

                    var dimensionDiv = $('<div class="col-md-3 form-group" data-dimensionnumber="' + dimensionNumber + '" data-visible="' + visible + '" data-mandatory="' + mandatory + '" data-editable="' + editable + '">').appendTo(lineItemDimensions);
                    $('<label>').html(label).appendTo(dimensionDiv);
                    var selectTag = $('<select class="form-control">').on('change', function () {
                        var lineItemId = $(this).closest('.row').data('lineitemid');
                        var indexToUpdate = null
                        $(shoppingCart.data()).each(function (index, row) {
                            if (row.id == lineItemId) {
                                indexToUpdate = index;
                                return false;
                            }
                        });
                        var rowLineItem = shoppingCart.data().row(indexToUpdate).data();
                        var dimension = null;
                        if ($(this).val()) {
                            var newSelectedOption = $(this).find('option[value="' + $(this).val() + '"]');
                            var dimension = {
                                code: newSelectedOption.data('code'),
                                dimensionId: $(this).val(),
                                name: newSelectedOption.text(),
                            }
                        }
                        rowLineItem["dimension" + $(this).parent().data("dimensionnumber") + "Id"] = dimension;
                        shoppingCart.data().row(indexToUpdate).data(rowLineItem);
                    }).appendTo(dimensionDiv);
                    $('<option>').val(null).appendTo(selectTag);
                    if ((options != null) && (options.length > 0)) {
                        $.each(options, function (optionsIndex, singleOption) {
                            $('<option data-code="' + singleOption.code + '">').html(singleOption.name).val(singleOption.dimensionId).appendTo(selectTag);
                        });
                    }
                    if (selectedOption != null) {
                        selectTag.val(selectedOption.dimensionId);
                    }
                    if (visible != "true") dimensionDiv.hide();
                    if (editable != "true") dimensionDiv.find('select').prop('disabled', true);
                }
            }
            if (lineItemDimensions.children().length) {
                $('#ProductConfiguration tbody').append(dimensionWrapper);
            }
        });
    }

    function isValidProductConfiguration(callback) {
        var isValid = true;
        var lineItems = [];
        $('#ProductConfiguration div.row').each(function (index, configurationLineItem) {
            var lineItem = {
                "id": $(configurationLineItem).data('lineitemid')
            }
            $(configurationLineItem).children(':visible').each(function (index, element) {
                if ($(element).data("mandatory")) {
                    if (!$(this).find('select').val()) {
                        $(this).addClass('has-error');
                        $(this).find('select').addClass('has-error');
                        isValid = false;
                    } else {
                        $(this).removeClass('has-error');
                        $(this).find('select').removeClass('has-error');
                    }
                }

                var dimensionNumber = $(element).data("dimensionnumber");
                var selectValue = $(this).find('select').val();
                var selectedDimension = null;
                if (selectValue) {
                    selectedDimension = {
                        "dimensionId": selectValue
                    }
                }
                lineItem["dimension" + dimensionNumber + "Id"] = selectedDimension;
            });
            lineItems.push(lineItem);
        });

        if (typeof (callback) === "function") {
            callback(isValid, lineItems);
        }

        return isValid;
    }

    function saveProductConfiguration(lineItems) {
        DynPCA.App.ExecuteRequest('POST', JSON.stringify(lineItems), 'json', true, '/CrmSdk/UpdateLineItems', { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }).done(function (data) {
        }).fail(function (exception) {
            $('#crmsdk').html(exception.error);
        });
    }

    function loadRequest() {
        if (typeof DynPCA === 'undefined') {
            setTimeout(loadRequest, 100);
        } else if (typeof DynPCA.Auth === 'undefined') {
            setTimeout(loadRequest, 100);
        } else if (typeof DynPCA.Auth.Client === 'undefined') {
            setTimeout(loadRequest, 100);
        } else if (typeof DynPCA.Auth.Client.GetToken === 'undefined') {
            setTimeout(loadRequest, 100);
        } else {

            if (displayFullListOfContacts) {
                $('#addressRecipient')[0].style.display = "initial";
                $('#addressRecipientLimited')[0].style.display = "none";
            } else {
                $('#addressRecipient')[0].style.display = "none";
                $('#addressRecipientLimited')[0].style.display = "initial";
            }

            $("#Products tbody").empty();

            getShoppingCart(getProducts);
            
            DynPCA.App.ExecuteRequest('GET', null, 'json', true, '/CrmSdk/GetAllAddresses', null).done(function (data) {
                $.each(data, function (index, address) {
                    $('#addressSelect').append("<option value='" + address.id +
                        "' data-id='" + address.id +
                        "' data-name='" + address.addressName +
                        "' data-address1='" + address.address1 +
                        "' data-address2='" + address.address2 +
                        "' data-city='" + address.city +
                        "' data-postalcode='" + address.postalCode +
                        "' data-workplace='" + address.workplace +
                        "' data-telephone='" + address.telephone +
                        "' >" + address.addressName + "</option>");
                });
                gotAllAddresses = true;
                checkLoading();
            }).fail(function (exception) {
                $('#crmsdk').html(exception.error);
            });

            DynPCA.App.ExecuteRequest('GET', null, 'json', true, '/CrmSdk/GetContacts', null).done(function (data) {

                if (displayFullListOfContacts) {
                    $.each(data, function (index, contact) {
                        $('#addressRecipient').append("<option value='" + contact.id +
                            "' data-id='" + contact.id +
                            "' data-name='" + contact.name +
                            "' data-email='" + contact.email +
                            "' >" + contact.name + "</option>");
                    });
                } else {
                    var contactList = [];
                    $.each(data, function (index, contact) {
                        var contactObject = { label: contact.name + " - " + contact.jobtitle + " - " + contact.email, value: contact.name, data: contact.id, email: contact.email, jobtitle: contact.jobtitle };
                        contactList.push(contactObject);
                        $('#addressRecipientLimited').autocomplete({

                            source: function (req, responseFn) {
                                var re = $.ui.autocomplete.escapeRegex(req.term);
                                var matcher = new RegExp("^" + re, "i");
                                var a = $.grep(contactList, function (item, index) {
                                    return matcher.test(item.value);
                                });
                                responseFn(a);
                            },
                            select: function (event, ui) {
                                var selectedAddressRecipient = $('#selectedAddressRecipientId')[0];
                                selectedAddressRecipient.value = "";
                                if (ui && ui.item && ui.item.data) {
                                    selectedAddressRecipient.value = ui.item.data;
                                }
                            }
                        });
                    });
                }
            }).fail(function (exception) {
                $('#crmsdk').html(exception.error);
            });

            // index starts at 0, 0 => page 1, 1 => page 2 ... index corresponds to the page that will shown.
            var procession = 'backward';
            deliveryAddressRequired = false;

            $('#checkoutWizard').bootstrapWizard({
                tabClass: 'nav nav-pills',
                onTabClick: function (tab, navigation, index) { return false; },
                onNext: function (tab, navigation, index) {
                    procession = 'forward';
                    var pageNumber = index + 1;

                    switch (pageNumber) {
                        case 2:
                            var shoppingCartData = shoppingCart.data();
                            if (!shoppingCartData[0]) {
                                $('#EmptyCartWarningModal').modal('show');
                                //alert("Your Shopping Cart is Empty! Please select a product to purchase.");
                                return false;
                            }
                            deliveryAddressRequired = false;
                            $.each(shoppingCartData, function (lineItemIndex, lineItem) {
                                if (lineItem.product.deliveryAddressRequired) {
                                    deliveryAddressRequired = true;
                                    return true;
                                }
                            });
                            if (!deliveryAddressRequired) {
                                $('input[type="radio"][name="deliveryOptions"][value="pickup"]').prop('checked', true).change();
                                $('#checkoutWizard').bootstrapWizard('disable', 2);
                            } else {
                                $('#checkoutWizard').bootstrapWizard('enable', 2);
                            }
                            break;
                        case 3:
                            return isValidProductConfiguration(function (isValid, lineItems) {
                                if (isValid) saveProductConfiguration(lineItems);
                            });
                            break;
                        case 4:
                            if (!updateShoppingCartAddress()) return false;
                            $('#tab' + pageNumber + ' .tabSpinner').hide();
                            $('#tab' + pageNumber + ' .tabContent').show();
                            $('.orderDate').text((new Date()).toString('yyyy-MM-dd'));
                            break;
                        case 5:
                            if (shoppingCartUpdateInProgress) return false;
                            var shoppingCartData = shoppingCart.data();
                            var purchaseOrder = {
                                "shoppingCartId": shoppingCartId,
                                "instructions": $('#tab4 textarea.instructions').val()
                            };
                            $('#tab5 textarea.instructions').val($('#tab4 textarea.instructions').val());
                            $('.tabSpinner').show();
                            DynPCA.App.ExecuteRequest('POST', JSON.stringify(purchaseOrder), 'json', true, '/CrmSdk/SubmitOrder ', { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" })
                                .done(function (data) {
                                    $('.shopordernumber').text(data.shopOrderNumber);
                                    var infoList = $('<ul>');
                                    $('.additionalInfo .panel-body').append(infoList);
                                    if (data.status) {
                                        $.each(data.additionalInfo, function (index, info) {
                                            infoList.append('<li class="' + info.class + '">' + info.content + '</li>');
                                        });
                                        toggleAdditionalInformation();
                                        $('#tab' + pageNumber + ' .tabSpinner').hide();
                                        $('#tab' + pageNumber + ' .tabContent').show();
                                        adjustTables();
                                    } else {
                                        return false;
                                    }
                                }).fail(function (exception) {
                                    var errorMessage = exception.error;
                                    try {
                                        var occuredErrors = $(exception.xhr.responseText).closest("div.titleerror");
                                        if (occuredErrors != null && occuredErrors.length > 0) {
                                            var firstErrorMessage = occuredErrors[0].innerText;
                                            firstErrorMessage = firstErrorMessage.substr(firstErrorMessage.indexOf(": ") + 2);
                                            if (firstErrorMessage != null) {
                                                errorMessage = firstErrorMessage;
                                            }
                                        }

                                    } catch (err) {
                                        // swallow parsing error
                                    }
                                    $('#tab' + pageNumber + ' .tabSpinner').hide();
                                    $('#crmsdk').html(errorMessage).removeClass('hidden');
                                });
                            break;
                        default:
                            break;
                    }
                    return;
                },
                onPrevious: function (tab, navigation, index) {
                    procession = 'backward';
                    var pageNumber = index + 1;
                    switch (pageNumber) {
                        case 1:
                            isValidProductConfiguration(function (isValid, lineItems) {
                                saveProductConfiguration(lineItems);
                            });
                            break;
                        case 2:
                        // no break;
                        case 3:
                            updateShoppingCartAddress();
                            break;
                        default:
                            break;
                    }
                    return;
                },
                onTabShow: function (tab, navigation, index) {
                    var pageNumber = index + 1;
                    switch (pageNumber) {
                        case 1:
                            $('li.previous').hide();
                            break;
                        case 4:
                            //$('#tab4 textarea').val($('#addressComment').val());
                            $('li.next a').text('Beställ').addClass('btn-primary').removeClass('btn-default');
                            break;
                        case 5:
                            $('li.previous').hide();
                            $('li.next a').hide();
                            break;
                        case 2:
                            displayProductConfiguration();
                            if (!($('#ProductConfiguration tbody').children().length)) {
                                if (procession == 'backward') index--;
                                if (procession == 'forward') index++;
                                $('#checkoutWizard').bootstrapWizard('show', index); //skip next page
                            }
                            $('li.previous').show();
                            $('li.next a').text('Nästa').addClass('btn-default').removeClass('btn-primary');
                            $('#tab' + pageNumber + ' .tabSpinner').hide();
                            $('#tab' + pageNumber + ' .tabContent').show();
                            break;
                        /*
                    case 3:
                        if (!deliveryAddressRequired) {
                            updateShoppingCartAddress();
                            if (procession == 'backward') index--;
                            if (procession == 'forward') index++;
                            $('#checkoutWizard').bootstrapWizard('show', index); //skip next page
                        }
                        */
                        //No break;
                        default:
                            $('li.previous').show();
                            $('li.next a').text('Nästa').addClass('btn-default').removeClass('btn-primary');
                            $('#tab' + pageNumber + ' .tabSpinner').hide();
                            $('#tab' + pageNumber + ' .tabContent').show();
                            break;
                    }
                    return;
                }
            });

            gotWizard = true;

            checkLoading();
        }
    }

    function toggleAdditionalInformation() {
        $('#AdditionalInfo').appendTo($('#tab5 .additionalInfo .panel-body')).removeClass('hidden');

        var pickupParcel = $('input[name="deliveryOptions"]:checked').val() == "pickup";
        if (requiresApproval) {
            $('li.requiresapproval').removeClass('hidden');
            $('li.notificationonapproval').removeClass('hidden');
        }
        if (deliveryAddressRequired) {
            if (pickupParcel) {
                $('li.deliverypickup').removeClass('hidden');
            } else {
                $('li.deliverytocontact').removeClass('hidden');
            }
        }
    }

    function updateShoppingCartAddress() {
        var shoppingCartData = $('#shoppingCart').dataTable().fnGetData();
        if (!shoppingCartData[0]) {
            $('#crmsdk').html("Shopping Cart is Empty!");
            return false;
        }
        var pickupParcel = $('input[name="deliveryOptions"]:checked').val() == "pickup";
        var newAddress = {
            "shoppingCartId": shoppingCartId,
            "pickupParcel": pickupParcel,
            "deliveryAddress": null
        };
        if (!pickupParcel) {
            if (!$('.orderPickup').hasClass("hidden")) $('.orderPickup').addClass("hidden");
            if ($('.orderAddress').hasClass("hidden")) $('.orderAddress').removeClass("hidden");
            newAddress.deliveryAddress = {
                "id": $('#addressSelect option').filter(':selected').data('id'),
                "addressName": $('#addressSelect option').filter(':selected').data('name'),
                "address1": $('#addressLine1').val(),
                "address2": $('#addressLine2').val(),
                "city": $('#addressCity').val(),
                "postalCode": $('#addressPostalcode').val(),
                "workplace": $('#addressWorkplace').val(),
                "telephone": $('#addressTelephone').val()
            };
            newAddress.addressComment = $('#addressComment').val();

            if (displayFullListOfContacts) {
                var recipientSelected = $('#addressRecipient option').filter(':selected');
                if (recipientSelected.val() == "") {
                    newAddress.addressRecipient = null;
                    if (!$('.orderReceiver').parent().hasClass("hidden")) $('.orderReceiver').parent().addClass("hidden");
                } else {
                    newAddress.addressRecipient = {
                        "id": recipientSelected.data('id'),
                        "name": recipientSelected.data('name'),
                        "email": recipientSelected.data('email')
                    };
                    $('.orderReceiver').text(recipientSelected.data('name'));
                    if ($('.orderReceiver').parent().hasClass("hidden")) $('.orderReceiver').parent().removeClass("hidden");
                }
            } else {
                var recipientSelected = $('#selectedAddressRecipientId')[0];
                if (recipientSelected == "") {
                    newAddress.addressRecipient = null;
                    if (!$('.orderReceiver').parent().hasClass("hidden")) $('.orderReceiver').parent().addClass("hidden");
                } else {

                    var addressRecipientLimitedSelectedValue = $('#addressRecipientLimited').val();
                    
                    newAddress.addressRecipient = {
                        "id": recipientSelected.value, 
                        "name": addressRecipientLimitedSelectedValue,
                        "email": ""
                    }
                    $('.orderReceiver').text(newAddress.addressRecipient.name);
                    if ($('.orderReceiver').parent().hasClass("hidden")) $('.orderReceiver').parent().removeClass("hidden");
                }
            }
            $('.orderAddress1').text(newAddress.deliveryAddress.address1);
            $('.orderAddress2').text(newAddress.deliveryAddress.address2);
            $('.orderCity').text(newAddress.deliveryAddress.city);
            $('.orderPostalCode').text(newAddress.deliveryAddress.postalCode);
            $('.orderWorkPlace').text(newAddress.deliveryAddress.workplace);
            $('.orderTelephone').text(newAddress.deliveryAddress.telephone);
            $('.orderComment').text(newAddress.addressComment);
            var isValidAddress = true;
            $.each(newAddress.deliveryAddress, function (index, element) {
                var div = null;
                switch (index) {
                    case 'address1':
                        div = $('#addressLine1');
                        break;
                    case 'city':
                        div = $('#addressCity');
                        break;
                    case 'workplace':
                        div = $('#addressWorkplace');
                        break;
                    case 'telephone':
                        div = $('#addressTelephone');
                        break;
                    default:
                        break;
                }
                if (div) {
                    if (!element) {
                        div.closest('.form-group').addClass('has-error');
                        isValidAddress = false;
                    } else {
                        div.closest('.form-group').removeClass('has-error');
                    }
                }
            });
            if (!isValidAddress) return false;
        } else {
            if (!$('.orderReceiver').parent().hasClass("hidden")) $('.orderReceiver').parent().addClass("hidden");
            if (!$('.orderAddress').hasClass("hidden")) $('.orderAddress').addClass("hidden");
            if ($('.orderPickup').hasClass("hidden")) $('.orderPickup').removeClass("hidden");
        }
        newAddress.messageToApprover = $('#tab4 textarea.instructions').val();
        var newAddressJson = JSON.stringify(newAddress);
        DynPCA.App.ExecuteRequest('Post', newAddressJson, 'json', true, '/CrmSdk/UpdateShoppingCartAddress', {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }).done(function (data) {
        }).fail(function (exception) {
            $('#crmsdk').html(exception.error);
        });
        return true;
    }

    function checkLoading() {
        if (gotShoppingCart && gotProducts && gotAllAddresses && gotWizard) {
            $('#loadingSpinner').hide();
            $('#checkoutWizard').show();
            $('#viewShoppingCart').show();
            adjustTables();
        }
    }

    $(document).ready(function () {

        $('input[type="radio"][name="deliveryOptions"]').on('change', function () {
            if ($(this).val() == "delivery") {
                $('#deliveryDetails select').prop('disabled', false);
                $('#deliveryDetails input').prop('disabled', false);
                $('#deliveryDetails textarea').prop('disabled', false);
                if (displayFullListOfContacts) {
                    if (!($('#addressRecipient').val())) {
                        $('#addressRecipient option[value="{{user.id}}"]').prop('selected', true);
                    }
                } else {

                }
                
                $('#deliveryDetails .form-group').removeClass('has-error');
            }
            if ($(this).val() == "pickup") {
                $('#deliveryDetails select').prop('disabled', true);
                $('#deliveryDetails input').prop('disabled', true);
                $('#deliveryDetails textarea').prop('disabled', true);
                if (displayFullListOfContacts) {
                    $('#addressRecipient').val("").change();
                }
                $('#addressSelect').val("").change();
                $('#addressLine1').val("");
                $('#addressLine2').val("");
                $('#addressCity').val("");
                $('#addressPostalcode').val("");
                $('#addressWorkplace').val("");
                $('#addressTelephone').val("");
                $('#addressComment').val("");
            }
        });

        $('#addressSelect').on('change', function () {
            var selectedOption = $('#addressSelect option').filter(':selected');
            $('#addressLine1').val(selectedOption.data('address1'));
            $('#addressLine2').val(selectedOption.data('address2'));
            $('#addressCity').val(selectedOption.data('city'));
            $('#addressPostalcode').val(selectedOption.data('postalcode'));
            $('#addressWorkplace').val(selectedOption.data('workplace'));
            $('#addressTelephone').val(selectedOption.data('telephone'));
        });

        $('#shoppingCart').on('change', '.lineItemQuantity', function () {
            var newValue = parseInt($(this).val(), 10);
            //console.log($(this));
            //console.log($(this).data("lineitemid"));
            var lineItem = {
                "Id": $(this).data("lineitemid"),
                "Quantity": newValue
            };
            var lineItemRow = $(this).closest('tr');
            DynPCA.App.ExecuteRequest('POST', JSON.stringify(lineItem), 'json', true, '/CrmSdk/EditLineItem', { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }).done(function (data) {
                if (data == null) {
                    console.log("EditLineItem returned null for lineitemid=" + lineItem.Id + ".");
                };
                var lineItemData = shoppingCart.data().row(lineItemRow).data();

                lineItemData.quantity = newValue;
                lineItemData.unitPrice = data.unitPrice;
                lineItemData.lineTotal = data.lineTotal;
                shoppingCart.data().row(lineItemRow).data(lineItemData);
                shoppingCart.draw(false);
                updateSummary();
            }).fail(function (exception) {
                $('#crmsdk').html(exception.error);
            });
        });

        $('#shoppingCart').on('click', '.deleteLineItem', function () {
            startShoppingCartUpdate();
            var wrapper = $(this).closest('td');
            $(this).parent().hide();
            wrapper.find('.buttonSpinner').removeClass("hidden");
            var lineItemId = $(this).data("lineitemid");
            DynPCA.App.ExecuteRequest('POST', "'" + lineItemId + "'", 'json', true, '/CrmSdk/DeleteLineItem', { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }).done(function (data) {
                endShoppingCartUpdate();
                if (data) {
                    //console.log("DeleteLineItem lineitemid=" + lineItemId + ".");

                    shoppingCart.rows(function (idx, rowData, node) {
                        return rowData.id == lineItemId;
                    }).remove().draw();
                } else {
                    console.log("FAILED: DeleteLineItem lineitemid=" + lineItemId + ".");
                }
                updateSummary();
            }).fail(function (exception) {
                $('#crmsdk').html(exception.error);
            });
        });

        $('#Products tbody').on('click', 'button', function () {
            startShoppingCartUpdate();
            var wrapper = $(this).closest('td');
            $(this).parent().addClass("hidden");
            wrapper.find('.buttonSpinner').removeClass("hidden");
            var productsTable = $("#Products").DataTable();

            var data = productsTable.row($(this).parents('tr')).data();
            var quantity = $(this).closest('td').find('input').val();
            var jsonObj = {
                "Id": null,
                "Product": {
                    "ItemId": data.itemId,
                    "Name": data.name,
                    "ItemNumber": data.itemNumber,
                    "Price": data.price
                },
                "Quantity": quantity,
                "ShoppingCartId": shoppingCartId
            };
            addLineItem(jsonObj, function () {
                endShoppingCartUpdate();
                wrapper.find('.buttonSpinner').addClass("hidden");
                wrapper.find('.spanButton').removeClass("hidden");
            });
        });

        // Add event listener for opening and closing details
        $('#Products tbody').on('click', 'td.details-control', function () {
            function showChildRows(rowData) {
                var itemDescription = rowData.itemDescription;
                if (!itemDescription) itemDescription = '';
                return $('<tr><td></td>' +
                    '<td>Description:</td>' +
                    '<td colspan="3">' + itemDescription + '</td>' +
                    '</tr>' +
                    '<tr><td></td>' +
                    '<td>Image:</td>' +
                    '<td colspan="3"><img src="' + rowData.imageUrl + '"/></td>' +
                    '</tr>');
            }

            var tr = $(this).closest('tr');
            var productsTable = $("#Products").DataTable();

            var row = productsTable.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child(showChildRows(row.data())).show();
                tr.addClass('shown');
            }
        });

        $('#checkoutModal').on('shown.bs.modal', adjustTables);

        loadRequest();
    });

})(jQuery);

function updateShoppingCart(shoppingCartData) {
    var tableData = [];
    shoppingCartId = shoppingCartData.shoppingCartId;
    if (shoppingCartData != null) {
        tableData = shoppingCartData.lineItems;
        if (shoppingCartData.pickupParcel) {
            $('#delivery').prop('checked', false);
            $('#pickup').prop('checked', true);
            $('#deliveryDetails select').prop('disabled', true);
            $('#deliveryDetails input').prop('disabled', true);
            $('#deliveryDetails textarea').prop('disabled', true);
            if (displayFullListOfContacts) {
                $('#addressRecipient').val("").change();
            }
            $('.deliveryDestinationRow').hide(200);
        } else {
            $('#delivery').prop('checked', true);
            $('#pickup').prop('checked', false);
            $('#deliveryDetails select').prop('disabled', false);
            $('#deliveryDetails input').prop('disabled', false);
            $('#deliveryDetails textarea').prop('disabled', false);
            $('.deliveryDestinationRow').show(100);
            if (shoppingCartData.addressRecipient != null)
                if (displayFullListOfContacts) {
                    $('#addressRecipient').val(shoppingCartData.addressRecipient.id);
                } else {
                    
                }
            if (shoppingCartData.deliveryAddress != null) {
                $('#addressSelect').val(shoppingCartData.deliveryAddress.id);
                $('#addressLine1').val(shoppingCartData.deliveryAddress.address1);
                $('#addressLine2').val(shoppingCartData.deliveryAddress.address2);
                $('#addressCity').val(shoppingCartData.deliveryAddress.city);
                $('#addressPostalcode').val(shoppingCartData.deliveryAddress.postalCode);
                $('#addressWorkplace').val(shoppingCartData.deliveryAddress.workplace);
                $('#addressTelephone').val(shoppingCartData.deliveryAddress.telephone);
            }
            $('#addressComment').val(shoppingCartData.addressComment);
        }
    }
    if ($.fn.DataTable.isDataTable('#shoppingCart')) {
        $('#shoppingCart').DataTable().destroy();
        $('#shoppingCart tbody').empty();
    }
    $('#pickup').click(function() {
        $('.deliveryDestinationRow').hide(200);
    });

    $('#delivery').click(function() {
        $('.deliveryDestinationRow').show(100);
    });
    shoppingCart = $('#shoppingCart').DataTable({
        data: tableData,
        "columns": [
            { "data": "shoppingCartId", "title": "Shopping Cart ID", "orderable": false, "visible": false },
            { "data": "id", "title": "Line Item ID", "orderable": false, "visible": false },
            { "data": "product.itemId", "title": "Product ID", "orderable": false, "visible": false },
            { "data": "product.itemNumber", "title": "Artikelnummer", "orderable": false, "visible": false },
            { "data": "product.name", "title": "Artikelnamn" },
            {
                "data": "quantity",
                "title": "Antal",
                "orderable": false,
                "render": function (data, type, row) {
                    return "<input class=\"lineItemQuantity\" data-lineitemid=\"" + row.id + "\" type=\"number\" min=\"1\" max=\"999999\" step=\"1\" maxlength=\"6\" oninput=\"javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);\" onchange=\"javascript: if (this.value < this.min) this.value = this.min; if (this.value > this.max) this.value = this.max;\" value=\"" + row.quantity + "\">";
                }
            },
            {
                "data": "unitPrice",
                "title": "Pris",
                "orderable": false,
                "searchable": false
            },
            {
                "data": "discountAmount",
                "title": "Rabatt",
                "orderable": false,
                "searchable": false
            },
            {
                "data": "lineTotal",
                "title": "Radbelopp",
                "orderable": false,
                "searchable": false
            },
            {
                "data": null,
                "title": ""
            }
        ],
        "columnDefs": [
            {
                "targets": 9,
                "orderable": false,
                "render": function (data, type, row) {
                    return "<span class=\"spanButton\"><button class=\"btn btn-success deleteLineItem\" data-lineitemid=\"" + row.id + "\" type=\"button\" class=\"btn btn-success\">Delete</button></span><span class=\"buttonSpinner hidden\"><span class=\"btn btn-success\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span></span></span>";
                }
            }
        ],
        "scrollY": "50vh",
        "scrollCollapse": true,
        "createdRow": function (row, data, index) {
            for (var i = 2; i <= 4; i++) {
                var text = $('td', row).eq(i).html();
                if (text == "NaN") {
                    $('td', row).eq(i).html("");
                    continue;
                }
                $('td', row).eq(i).html(text + " " + data.currency);
            }
        },
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(), data;

            var itemsCount = 0;
            var subscriptionSubtotal = 0;
            var subtotal = 0;
            $.each(api.data(), function (index, lineItem) {
                itemsCount += lineItem.quantity;
                try {
                    if (lineItem.product.defaultItemUnit.subscriptionUnit) {
                        subscriptionSubtotal += lineItem.lineTotal;
                    } else {
                        subtotal += lineItem.lineTotal;
                    }
                }
                catch (err) {
                    subtotal += lineItem.lineTotal;
                }
            });

            // Update ShoppingCartInfo
            $('.shoppingCartInfo .totalItemsCount').text(itemsCount);
            $('.totalAmount').html(subtotal);
            $('.monthlyAmount').html(subscriptionSubtotal);
        }
    });

    var forContact = shoppingCartData.forContact;
    if (forContact != null) {
        $('#forContact').val(forContact.name);
        $('.orderFor').text(forContact.name);
        $('.orderForEmail').text(forContact.email);
    } else {
        $('#forContact')
    }
}

function adjustTables() {
    (function ($) {
        $($.fn.dataTable.tables(true)).css('width', '100%');
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
    })(jQuery);
}

function initializeProductsTable(productsData) {
    (function ($) {
        if ($.fn.DataTable.isDataTable('#Products')) {
            $('#Products').DataTable().destroy();
            $('#Products tbody').empty();
        }

        var productsTable = $("#Products").DataTable({
            data: productsData,
            "columns": [
                {
                    "className": 'details-control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": ''
                },
                { "data": "itemId", "visible": false, "searchable": false },
                { "data": "itemNumber", "visible": true },
                { "data": "name" },
                { "data": "price", "orderable": false, "searchable": false },
                null,
                { "data": "itemCategory", "visible": false, "searchable": true }
            ],
            "columnDefs": [
                {
                    "targets": 5,
                    "width": "100px",
                    "data": null,
                    "orderable": false,
                    "searchable": false,
                    "defaultContent": "<div class=\"input-group\"><input class=\"form-control\" type=\"number\" step=\"1\" min=\"1\" max=\"999999\" maxlength=\"6\" oninput=\"javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);\" onchange=\"javascript: if (this.value < this.min) this.value = this.min; if (this.value > this.max) this.value = this.max;\" value=\"1\"><span class=\"spanButton input-group-btn\"><button type=\"button\" class=\"btn btn-success\"><span><i class=\"fa fa-shopping-cart\"></i></span></i></button></span><span class=\"input-group-btn buttonSpinner hidden\"><span class=\"btn btn-success\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span></span></span></div>"
                }
            ],
            "destroy": true,
            "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            "rowGroup": {
                "dataSrc": "itemCategory"
            },
            "scrollY": "50vh",
            "scrollCollapse": true,
            "order": [[6, "asc"]],
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Swedish.json"
            }
        });
    })(jQuery);
}

function addNotification(message) {
    var notificationArea = $('#eobNotifications');

    if (notificationArea.length == 0) {
        notificationArea = $('<div id="eobNotifications">').appendTo('body');
        notificationArea.css('position', 'fixed')
            .css('right', '15px')
            .css('top', '15px')
            .css('width', '300px')
            .css('z-index', '10000');
    }

    var newMessage = $('<div>').addClass('well').css('width', '100%').html('<button type="button" class="close"><span aria-hidden="true">×</span></button><div>' + message + '</div>').appendTo(notificationArea);

    var removeMessage = function () {
        newMessage.slideUp(400, function () {
            newMessage.remove();
        });
    };

    newMessage.find('button').click(removeMessage);

    setTimeout(function () {
        removeMessage();
    }, 5000);
}

function updateForContact(contact) {
    (function ($) {
        var shoppingCartData = $('#shoppingCart').dataTable().fnGetData();
        var purchaseOrder = {
            'shoppingCartId': shoppingCartId,
            'forContactId': contact.id
        };
        DynPCA.App.ExecuteRequest('POST', JSON.stringify(purchaseOrder), 'json', true, '/CrmSdk/UpdateForContact ', { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }).done(function (data) {
            if (data) {
                $('#forContact').val(contact.name);
            } else {
                console.log("UpdateForContact returned null for contact=" + contact.id + ".");
                $('#forContact').val("");
            };
            DynPCA.App.ExecuteRequest('GET', null, 'json', true, '/CrmSdk/GetShoppingCart', null)
                .done(function (data) {
                    if (!data) {
                        $('#loadingSpinner').hide();
                        $('#notLoggedIn').removeClass('hidden');
                        return;
                    }
                    updateShoppingCart(data);
                }).fail(function (exception) {
                    $('#crmsdk').html(exception.error);
                });
            var getProductsParam = {
                'forContactId': contact.id
            };
            DynPCA.App.ExecuteRequest('POST', JSON.stringify(purchaseOrder), 'json', true, '/CrmSdk/GetProducts', { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" })
                .done(function (data) {
                    initializeProductsTable(data);
                }).fail(function (exception) {
                    $('#crmsdk').html(exception.error);
                });
            $('.orderFor').text(contact.name);
            $('.orderForEmail').text(contact.email);
        }).fail(function (exception) {
            $('#crmsdk').html(exception.error);
        });
        $('#contactModal').modal('hide');
        $('#forContact').val(contact.name);
        $('.orderFor').text(contact.name);
        $('.orderForEmail').text(contact.email);
    })(jQuery);
}