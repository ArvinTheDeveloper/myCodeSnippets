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

if (typeof (Endeavor.Incident.RelevantAttachments) == "undefined") {
    Endeavor.Incident.RelevantAttachments = {

        loadAttachments: function () {
            emailId = this.getDataParam();
            if (emailId) {
                var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "EmailSet?$select=email_activity_mime_attachment/ActivityMimeAttachmentId,email_activity_mime_attachment/FileName,email_activity_mime_attachment/FileSize,email_activity_mime_attachment/MimeType,email_activity_mime_attachment/ActivityMimeAttachmentIdUnique,email_activity_mime_attachment/ActivityId&$expand=email_activity_mime_attachment&$filter=ActivityId eq (guid'" + emailId[0] + "')";               
                var attachmentsResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

                if (attachmentsResultSet.length > 0) {
                    var table = document.getElementById("attachmentsTable");
                    for (var i = 0; i < attachmentsResultSet[0].email_activity_mime_attachment.results.length; i++) {
                        //Create checkbox
                        var checkbox = document.createElement("INPUT"); checkbox.setAttribute("type", "checkbox");
                        //create preview button
                        var preDiv = document.createElement("DIV"); $(preDiv).addClass("preview font");
                        preDiv.value = attachmentsResultSet[0].email_activity_mime_attachment.results[i].ActivityMimeAttachmentId;
                        preDiv.appendChild(document.createTextNode("Visa "));
                        var preSpan = document.createElement("SPAN");
                        $(preSpan).addClass("glyphicon glyphicon-zoom-in");
                        preDiv.appendChild(preSpan);
                        //append the row
                        this.appendRow(table, attachmentsResultSet[0].email_activity_mime_attachment.results[i], checkbox, preDiv);
                    } 
                    this.addListeners();
                  
                }

            } else {
                alert("Was not able to fetch Email Id, please contact an administrator.")
            }
        },
        appendRow: function (table, attachment, checkbox, preDiv) {
            // Set preview button listener
            var row = table.insertRow(table.rows.length);
            row.className = "attachment-row";
            this.createCell(row.insertCell(0), checkbox);
            this.createCell(row.insertCell(1), document.createTextNode(attachment.FileName));
            this.createCell(row.insertCell(2), document.createTextNode(Math.round(attachment.FileSize / 1024)));
            this.createCell(row.insertCell(3), preDiv);
        },
        createCell: function (cell, content) {
            cell.appendChild(content);
        },
        // On submit: take all checked rows and send it to createImportantRecords
        onSubmit: function () {
            // for each row loop
            Endeavor.Incident.RelevantAttachments.run_Waitme();
            var attachmentsTable = document.getElementById("attachmentsTable");
            for (var i = 0; i < attachmentsTable.rows.length; i++) {
                if (attachmentsTable.rows[i].cells[0].children[0].checked) {
                    var col = attachmentsTable.rows[i];
                    var attachment = {};
                    attachment.edp_Name = col.cells[1].innerHTML;
                    attachment.edp_fileSize = ((col.cells[2].innerHTML) * 1024).toString();
                    attachment.edp_attachmentId = col.cells[3].children[0].value;
                    this.createImportantAttachmentRecord(attachment, col)                 
                }
            }
            this.sleep(500).then(() => {
                $("body").waitMe('hide');
            });
        },
        // create the relevant attachment records
        createImportantAttachmentRecord: function (attachment) {
            // create record using arrayobject 
            var incidentId = this.getDataParam();
            attachment.edp_IncidentId = incidentId[1].toString();
            SDK.REST.createRecord(
                 attachment,
                 "edp_RelevantAttachment",
                 function (attachment) {
                     $("#status-header").removeClass('hide');
                 },
                this.errorHandler

               );
        },
        
        errorHandler: function (error) {
            alert(error.message);
            location.reload();
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
  
        addListeners: function () {
            $('#attachmentsTable tr').click(function (event) {
                if (event.target.type !== 'checkbox' && event.target.tagName !== 'DIV') {
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
            $(".preview").click(function  () {
                var attachmentId = this.value;
                var div = document.getElementById("imageHolder");
                var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "ActivityMimeAttachmentSet?$top=50&$select=FileName,Body,MimeType&$filter=ActivityMimeAttachmentId eq (guid'" + attachmentId + "')";
                var attachment = Endeavor.Common.Data.fetchJSONResults(iMUrl);
                if (attachment.length > 0) {
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
                }              
            });
        }
    };
}