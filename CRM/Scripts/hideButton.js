function CheckClientType() {
    debugger;
        var isMobile = true;
        if (Xrm.Page.context.client.getClient() != "Mobile") {
            isMobile = false;
        }
        return isMobile;
    }