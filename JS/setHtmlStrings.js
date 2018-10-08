 // setHtmlStrings: add element id's as keys in arr with corresponding text you want to display
    // byId returns the element, setVal sets the value to innerHTML of element
    setHtmlStrings: function () {
        var byId = function(id) { return document.getElementById( id ); };
        function setVal (el, val) { el = byId(el).innerHTML = val; }

        var arr = {
            "invoicedHoursHeader" : edp_ProjectManagement.Resources.InvoicedHoursHeader,
            "spentHoursHeader" : edp_ProjectManagement.Resources.SpentHoursHeader,
            "externalCommentHeader" : edp_ProjectManagement.Resources.ExternalCommentHeader,
            "internalCommentHeader" : edp_ProjectManagement.Resources.InternalCommentHeader,
            "toBeInvoicedHeader" : edp_ProjectManagement.Resources.ToBeInvoicedHeader,
            "delayInvoiceHeader" : edp_ProjectManagement.Resources.DelayInvoiceHeader,
            "projectSearchLabel" : edp_ProjectManagement.Resources.SearchProject,
            "btnCancelDetails" : edp_ProjectManagement.Resources.BtnCancelDetails,
            "btnUpdateDetails" : edp_ProjectManagement.Resources.BtnUpdateDetails,
            "projectSearchLabel" : edp_ProjectManagement.Resources.SearchProject
        };

        for (var el in arr){
            setVal(el, arr[el]);
        }
    },