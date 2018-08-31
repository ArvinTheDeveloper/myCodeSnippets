// References:
/// <reference path="vsdoc/jquery_2.1.4.js" />
/// <reference path="SDK.Rest.js" />
/// <reference path="CrmFetchKit.js" />
/// <reference path="Endeavor.Common.Data.js" />

/*
Authour:     Arvin Maryami
Date:        2018-06-01
Dependencies: 
Called from: Mark Attachments button from Incident Email
*/


// Begin scoping 
if (typeof (Endeavor) == "undefined") {
    var Endeavor = {
    };
}

if (typeof (Endeavor.Incident) == "undefined") {
    Endeavor.Incident = {
    };
}

if (typeof (Endeavor.Incident.RelevantAttachments) == "undefined") {
    Endeavor.Incident.DisplayRelevantAttachments = {


        
        appendRow: function (table, attachment) {
            var row = table.insertRow(table.rows.length);
            row.className = "attachment-row";

            //id of attachment in hidden form
            var idInDiv = document.createElement('DIV');
            $(idInDiv).addClass("hide");idInDiv.appendChild(document.createTextNode(attachment.AttachmentId));

            //preview button (span)
            var preview = document.createElement('SPAN');
            preview.title = "Förhandsvisa";
            $(preview).addClass("file-name");preview.appendChild(document.createTextNode(attachment.FileName));

            //checkbox
            var checkbox = document.createElement("INPUT"); checkbox.setAttribute("type", "checkbox");
            $(checkbox).addClass("pointify");

            //size in kb column
            var size = document.createElement('DIV');
            $(size).addClass("file-size");
            size.appendChild(document.createTextNode(attachment.FileSize / 1024));

            this.createCell(row.insertCell(0), checkbox);
            this.createCell(row.insertCell(1), preview);
            this.createCell(row.insertCell(2), size);
            this.createCell(row.insertCell(3), idInDiv);
        },
        createCell: function (cell, content) {
            cell.appendChild(content);
        },

        run_Waitme: function () {
            $('body').waitMe({
                effect: 'win8',
                text: "Creating records..",
                bg: 'rgba(255,255,255,0.7)',
                color: '#000'
            });
        },

        // Get the attachments
        fetchAttachments: function () {
            var incidentId = window.parent.Xrm.Page.data.entity.getId().replace(/[{}]/g,"");
            if (incidentId){
                var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "edp_RelevantAttachmentSet?$top=50&$select=edp_mimeType,edp_attachmentId,edp_fileSize,edp_Name&$filter=edp_IncidentId eq ('" + incidentId + "')";
                var relAttachResSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

                if (relAttachResSet.length > 0) {
                    var attachObj  = {};
                    var table = document.getElementById("attachmentsTable");
                    for (var i = 0; i < relAttachResSet.length; i++){
                        attachObj.FileName = relAttachResSet[i].edp_Name;
                        attachObj.FileSize = relAttachResSet[i].edp_fileSize;
                        attachObj.AttachmentId = relAttachResSet[i].edp_attachmentId;                       
                        this.appendRow(table, attachObj);
                    }
                    this.addListeners();
                    this.weirdWrapFix();
                }               
            }
        },
        //do not touch
        weirdWrapFix: function(){
            $("#attachmentsTable td:nth-child(1)").addClass('box');
        },
        //download record
        download: function (filename, id){
            if (id){
                !filename || filename == "" ? "Untitled" : false;

                var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "ActivityMimeAttachmentSet?$select=FileName,Body,MimeType&$filter=ActivityMimeAttachmentId eq (guid'" + id + "')";
                var attachment = Endeavor.Common.Data.fetchJSONResults(iMUrl);

                if (attachment.length > 0){
                    var e = document.createElement("a");
                    e.setAttribute("href", "data:" + attachment[0].MimeType + ";base64," + attachment[0].Body);
                    e.setAttribute("download", filename);
                    e.style.display = "none";
                    document.body.appendChild(e);
                    e.click();
                    document.body.removeChild(e);
                }
            }
        },
        //delete a record
        delete: function (id) {
            var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "edp_RelevantAttachmentSet?$select=edp_RelevantAttachmentId&$filter=edp_attachmentId eq ('" + id + "')";
            var relAttach = Endeavor.Common.Data.fetchJSONResults(iMUrl);
            if (relAttach.length > 0){  
                for(var i = 0; i < relAttach.length; i++){
                    SDK.REST.deleteRecord(
                        relAttach[i].edp_RelevantAttachmentId,
                        "edp_RelevantAttachment",
                        function () {
                        return;
                        },
                        this.errorHandler
                    );
                }              
            }
            
        },
        errorHandler: function (error) {
            alert(error.message);
            return false;
        },
        addListeners: function () {
            $('#attachmentsTable tr').click(function (event) {
                if (event.target.type !== 'checkbox' && event.target.tagName !== 'SPAN') {
                    $(':checkbox', this).trigger('click');
                }
            });
            $("input[type='checkbox']").change(function (e) {
                if ($(this).is(":checked")) { //If the checkbox is checked
                    $(this).closest('tr').addClass("highlight-row");
                    //Add class on checkbox checked
                } else {
                    $(this).closest('tr').removeClass("highlight-row");
                    //Remove class on checkbox uncheck
                }
            });
            //select or deselect all
            $(".select").click(function (){
                var table = document.getElementById("attachmentsTable");
                var count = 0;
                for (var i = 0; i < table.rows.length; i++){
                    if (table.rows[i].cells[0].children[0].checked) {
                        count++;
                    }
                }
                if (count == table.rows.length) {
                    for (var i = 0; i < table.rows.length; i++){
                        table.rows[i].cells[0].children[0].checked = false;                         
                    }
                }else {
                    for (var i = 0; i < table.rows.length; i++){
                        table.rows[i].cells[0].children[0].checked = true; 
                    }
                }
            });
            $(".drop-list").click(function () {
                if ($(".drop-menu").hasClass("hide")){
                    $(".drop-menu").removeClass("hide");
                }else{
                    $(".drop-menu").addClass("hide");
                }
            });
            $("#download").click(function () {
                var table = document.getElementById("attachmentsTable");
                if (table){
                    for (var i = 0; i < table.rows.length; i++){
                        if (table.rows[i].cells[0].children[0].checked){
                            var fileName = table.rows[i].cells[1].children[0].innerHTML;
                            var id = table.rows[i].cells[3].children[0].innerHTML;
                            Endeavor.Incident.DisplayRelevantAttachments.download(fileName, id);

                        }
                    }
                }
            });
            $("#delete").click(function (){
                var table = document.getElementById("attachmentsTable");
                if (table){
                    if (confirm("Vill du ta bort valda filer från den här listan? Filerna kommer fortfarande att finnas kvar under tillhörande e-post")) {
                        for (var i = 0; i < table.rows.length; i++){
                            if (table.rows[i].cells[0].children[0].checked){
                                var id = table.rows[i].cells[3].children[0].innerHTML;
                                Endeavor.Incident.DisplayRelevantAttachments.delete(id);
                            }
                        }
                        location.reload();
                    }
                }
            });
            $(".file-name").click(function () {
                var attachmentId = $(this).closest("tr").find('td:eq(3)').text();
                var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "ActivityMimeAttachmentSet?$top=50&$select=FileName,Body,MimeType&$filter=ActivityMimeAttachmentId eq (guid'" + attachmentId + "')";
                var attachment = Endeavor.Common.Data.fetchJSONResults(iMUrl);
                if (attachment.length > 0) {
                    if (attachment[0].MimeType === "application/pdf") {
                        let pdfWindow = window.open("")
                        pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(attachment[0].Body) + "'></iframe>");
                    } else {
                        var img = new Image();
                        img.src = "data:" + attachment[0].MimeType + ";base64," + attachment[0].Body;

                        while (img.width > 800 && img.height > 600) {
                            img.width = img.width / 2;
                            img.height = img.height / 2;
                        }

                        var wdv = window.open("", "_blank", "width=" + img.width + ", height="+ img.height);
                        wdv.document.write(img.outerHTML);
                    }
                }
            });
        }
    };
}