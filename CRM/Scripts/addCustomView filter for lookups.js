 // For Incident business process. Filter 'ed_casesubtypeid' by 'ed_casetypeid'.
 // This is from Endeavor.Balder.Incident


        FilterLookup: function () {
            try {
                if (Xrm.Page.getControl("ed_casetypeid") != null && Xrm.Page.getControl("ed_casetypeid") != undefined) {
                    var test = Xrm.Page.getControl("ed_casesubtypeid");
                    Xrm.Page.getControl("ed_casesubtypeid").addPreSearch(this.FilterCaseSubType);
                }
            } catch (e) {
                throw new Error(e.Message);
            }
        },


        FilterCaseSubType: function () {
            try {
                var recordId = Xrm.Page.data.entity.getId();
                var caseType = Xrm.Page.getAttribute("ed_casetypeid").getValue();

                if (caseType != null && caseType != undefined) {
                    var entityName = "ed_casetype";
                    var viewDisplayName = "Filtered caseSubTypes";
                    var viewId = Xrm.Page.getControl("ed_casesubtypeid").getDefaultView();
                    var fetchXml = "<fetch top='50'>"
                        + "<entity name='ed_casetype' >"
                        + "<attribute name='ed_name' />"
                        + "<filter type='and' >"
                        + "<condition attribute='ed_casetypeid' operator='eq' value='" + caseType[0].id + "' />"
                        + "</filter>"
                        + "<link-entity name='ed_ed_casetype_ed_casesubtype' from='ed_casetypeid' to='ed_casetypeid' alias='casesubtyp' intersect='true' >"
                        + "<attribute name='ed_casesubtypeid' />"
                        + "<attribute name='ed_casetypeid' />"
                        + "</link-entity>"
                        + "</entity>"
                        + "</fetch>";

                    var layoutXml = "<grid name='resultset' object='4230' jump='name' select='1' icon='1' preview='1'><row name='result' id='userqueryid'><cell name='name' width='300' /><cell name='ownerid' width='100'/><cell name='modifiedon' width='100' /></row></grid>";
                    Xrm.Page.getControl("ed_casesubtypeid").addCustomView(viewId.toUpperCase, entityName, viewDisplayName, fetchXml, layoutXml, true);
                }
            } catch (e) {
                throw new Error(e.Message);
            }
        }
        
    };
}