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

var Xrm = Xrm || window.parent.Xrm;

// Begin scoping 
if (typeof (Endeavor) == "undefined") {
    var Endeavor = {
    };
}

if (typeof (Endeavor.Incident) == "undefined") {
    Endeavor.Incident = {
    };
}

if (typeof (Endeavor.Incident.MarkAttachments) == "undefined") {
    Endeavor.Incident.MarkAttachments = {


        onLoad: function () {
            try {
            }
            catch (error) {
                parent.Xrm.Utility.alertDialog("Exception caught in fx:onLoad.\r\n\r\n" + error);
            }
        },

        loadAttachments: function () {
            emailId = this.getDataParam();

            if (emailId != null) {
                //var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "EmailSet?$top=50&$select=email_activity_mime_attachment/ActivityMimeAttachmentId,email_activity_mime_attachment/FileName,email_activity_mime_attachment/FileSize,email_activity_mime_attachment/ActivityMimeAttachmentIdUnique,email_activity_mime_attachment/ActivityId&$expand=email_activity_mime_attachment&$filter=ActivityId eq (guid'" + emailId + "')";
                var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "EmailSet?$select=email_activity_mime_attachment/ActivityMimeAttachmentId,email_activity_mime_attachment/FileName,email_activity_mime_attachment/FileSize,email_activity_mime_attachment/MimeType,email_activity_mime_attachment/ActivityMimeAttachmentIdUnique,email_activity_mime_attachment/ActivityId&$expand=email_activity_mime_attachment&$filter=ActivityId eq (guid'" + emailId[0] + "')";
                //var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "EmailSet?$top=50&$select=RegardingObjectId,Subject,email_activity_mime_attachment/ActivityMimeAttachmentId,email_activity_mime_attachment/FileName,email_activity_mime_attachment/ObjectId,email_activity_mime_attachment/MimeType,email_activity_mime_attachment/ActivityMimeAttachmentIdUnique,email_activity_mime_attachment/Body&$expand=email_activity_mime_attachment&$filter=Subject eq ('" + Test 5 + "')";
                //var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "EmailSet?$top=50&$select=RegardingObjectId,email_activity_mime_attachment/ActivityMimeAttachmentId,email_activity_mime_attachment/FileName,email_activity_mime_attachment/FileSize,email_activity_mime_attachment/AttachmentId,email_activity_mime_attachment/ActivityMimeAttachmentIdUnique&$expand=email_activity_mime_attachment&$filter=Subject eq 'Test 5'";
                //var iMurl = Endeavor.Common.Data.getOrganizationServiceEndpoint();
                var attachmentsResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

                // Get attachment objects
                if (attachmentsResultSet.length > 0) {
                    var table = document.getElementById("attachmentsTable");
                    for (var i = 0; i < attachmentsResultSet[0].email_activity_mime_attachment.results.length; i++) {
                        var checkbox = document.createElement("INPUT"); checkbox.setAttribute("type", "checkbox");
                        var btnPreview = document.createElement("button"); btnPreview.innerHTML = "+";

                        this.appendRow(table, attachmentsResultSet[0].email_activity_mime_attachment.results[i], checkbox, btnPreview);
                    }
                    $('#attachmentsTable tr').click(function (event) {
                        if (event.target.type !== 'checkbox') {
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
                }

            } else {
                alert("Was not able to fetch Email Id, please contact an administrator.")
            }
        },
        appendRow: function (table, attachment, checkbox, btnPreview) {
            btnPreview.value = attachment.ActivityMimeAttachmentId;
            // Set preview button listener
            Endeavor.Incident.MarkAttachments.addBtnPreviewListener(btnPreview);
            var row = table.insertRow(table.rows.length);
            row.className = "attachment-row";
            this.createCell(row.insertCell(0), checkbox);
            this.createCell(row.insertCell(1), document.createTextNode(attachment.FileName));
            this.createCell(row.insertCell(2), document.createTextNode(Math.round(attachment.FileSize / 1024)));
            this.createCell(row.insertCell(3), btnPreview);
        },
        createCell: function (cell, content) {
            cell.appendChild(content);
        },
        // Set preview button listener
        addBtnPreviewListener(button) {
            button.onclick = function () {
                var attachmentId = button.value;
                //var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "ActivityMimeAttachmentSet?$top=50&$select=FileName,Body&$filter=AttachmentId/Id eq (guid'" + attachmentId + "')";
                var div = document.getElementById("imageHolder");
                var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "ActivityMimeAttachmentSet?$top=50&$select=FileName,Body,MimeType&$filter=ActivityMimeAttachmentId eq (guid'" + attachmentId + "')";
                var attachment = Endeavor.Common.Data.fetchJSONResults(iMUrl);
                if (attachment.length > 0 && attachment != null) {
                    if (attachment[0].MimeType === "application/pdf") {
                        let pdfWindow = window.open("")
                        pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(attachment[0].Body) + "'></iframe>")
                    } else {
                        var image = new Image();
                        image.src = ("data:" + attachment[0].MimeType + ";base64," + attachment[0].Body);

                        if (div.firstChild)
                            div.removeChild(div.firstChild);
                        div.appendChild(image);
                    }
                    //    // Get mimeType through FileName regex
                    //    var mimeType = attachment[0].FileName.match(/(?<=(\.)).*/g);
                    //    switch(mimeType[0]){
                    //        case "jpg":
                    //        case "jpeg":
                    //        case "png":
                    //        case "gif":
                    //        case "tiff":
                    //        case "bmp":
                    //            //window.open("data:image/" + mimeType + ";base64," + button.value);
                    //            var image = new Image();
                    //            var div = document.getElementById("imageHolder");
                    //            image.src = ("data:image/" + mimeType + ";base64," + attachment[0].Body);

                    //            if(div.firstChild)
                    //                div.removeChild(div.firstChild);
                    //            div.appendChild(image);
                    //            break;
                    //        case "pdf":
                    //            //window.open("data:application/" + mimeType + ";base64," + encodeURI(attachment[0].Body);
                    //            let pdfWindow = window.open("")
                    //            pdfWindow.document.write("<iframe width='80%' height='80%' src='application/pdf'base64, " + encodeURI(attachment[0].Body)+"'></iframe>")
                    //            //var image = new Image();
                    //            //var div = document.getElementById("imageHolder");
                    //            //image.src = ("data:application/" + mimeType + ";base64," + button.value);    
                    //            break;
                    //    }
                    //}else{
                    //    window.alert("Was not able to find selected attachment.");

                }
            };
        },

        // On submit
        onSubmit: function () {
            // for each row loop
            Endeavor.Incident.MarkAttachments.run_Waitme();
            var bool = false;
            var attachmentsTable = document.getElementById("attachmentsTable");
            for (var i = 2; i < attachmentsTable.rows.length; i++) {
                if (attachmentsTable.rows[i].cells[0].children[0].checked) {
                    bool = true;
                    var col = attachmentsTable.rows[i];
                    var attachment = {};
                    var count = 0;
                    attachment.edp_Name = col.cells[1].innerHTML;
                    attachment.edp_fileSize = col.cells[2].innerHTML;
                    attachment.edp_attachmentId = col.cells[3].children[0].value;
                    if (this.createImportantAttachmentRecord(attachment, col)) {
                        count++;
                    }
                }
            }
            if (bool) {
                document.getElementById("status").innerHTML = count + "/" + (attachmentsTable.rows.length - 2) + " were successfully saved.";
            }

            this.sleep(500).then(() => {
                $("body").waitMe('hide');
            });



            // if first cell in row (checkbox) is not null or has value 0 
            //     Get that rows attachment id and save it to custom entity object (write a function for this)
            // Create new array object with attachmentId, IncidentId, FileName, MimeType and Size and send the object to createImportantAttachmentRecord

        },

        createImportantAttachmentRecord: function (attachment, row) {
            // create record using arrayobject 
            var incidentId = this.getDataParam();
            attachment.edp_incidentId = toString(incidentId[1]);
            SDK.REST.createRecord(
                 attachment,
                 "edp_RelevantAttachment",
                 function (attachment) {
                     $(row).addClass('color-success');
                 },
                this.errorHandler

               );


        },
        errorHandler: function (error) {
            alert(error.message);
            return false;
        },

        // Get passed values from btnOnClickMarkAttachments
        getDataParam: function () {
            // Get url string
            // Split value from string
            // parse value
            var vals = new Array();
            if (location.search != "") {
                var query = decodeURIComponent(location.search);
                vals = query.substr(6).split("&");
                for (var i in vals) {
                    vals[i] = vals[i].replace(/\+/g, " ").split("=");
                }
                //look for the parameter named 'data'
                for (var i in vals) {
                    if (vals[i][0]) {
                        vals[i][0] = vals[i][0].slice(1, -1);
                    }
                }
                return vals;
            }
        },

        run_Waitme: function () {
            $('body').waitMe({
                effect: 'win8',
                text: "Creating records..",
                bg: 'rgba(255,255,255,0.7)',
                color: '#000'
            });
        },

        // sleep time expects milliseconds
        sleep: function(time) {
          return new Promise((resolve) => setTimeout(resolve, time));
        },

        fetchAttachments: function () {
            // Get incident id by xrm.getattribute

            //
            var iMUrl = "https://endeavorincidentdev.api.crm4.dynamics.com/XRMServices/2011/OrganizationData.svc/edp_RelevantAttachmentSet?$top=50&$select=edp_mimeType,edp_attachmentId,edp_fileSize,edp_Name&$filter=edp_incidentid/Id" + "eq (guid'2fc48321-75b7-46bb-8d7a-4d5b8da744db')";
            var resultSet = CrmFetchKit.Fetch(iMUrl);
            if (resultSet.length > 0) {

                //i en loop hämta varje bilaga
                //kalla funktion som dynamiskt hämtar dem

                //försök att få subgrid relation att fungera innnan du gör detta
            }
        }
    };
}