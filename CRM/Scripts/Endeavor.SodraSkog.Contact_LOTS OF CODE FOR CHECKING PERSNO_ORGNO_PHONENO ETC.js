// JavaScript source code

// Dependencies:
/// <reference path="Endeavor.Common.Page.js" />
/// <reference path="Endeavor.Common.Data.js" />
/// <reference path="vsdoc/XrmPage-vsdoc.js" />
/// <reference path="Endeavor.SodraSkog.GiSFramework.js" />

/*! head.load - v1.0.3 */
(function (n, t) { "use strict"; function w() { } function u(n, t) { if (n) { typeof n == "object" && (n = [].slice.call(n)); for (var i = 0, r = n.length; i < r; i++) t.call(n, n[i], i) } } function it(n, i) { var r = Object.prototype.toString.call(i).slice(8, -1); return i !== t && i !== null && r === n } function s(n) { return it("Function", n) } function a(n) { return it("Array", n) } function et(n) { var i = n.split("/"), t = i[i.length - 1], r = t.indexOf("?"); return r !== -1 ? t.substring(0, r) : t } function f(n) { (n = n || w, n._done) || (n(), n._done = 1) } function ot(n, t, r, u) { var f = typeof n == "object" ? n : { test: n, success: !t ? !1 : a(t) ? t : [t], failure: !r ? !1 : a(r) ? r : [r], callback: u || w }, e = !!f.test; return e && !!f.success ? (f.success.push(f.callback), i.load.apply(null, f.success)) : e || !f.failure ? u() : (f.failure.push(f.callback), i.load.apply(null, f.failure)), i } function v(n) { var t = {}, i, r; if (typeof n == "object") for (i in n) !n[i] || (t = { name: i, url: n[i] }); else t = { name: et(n), url: n }; return (r = c[t.name], r && r.url === t.url) ? r : (c[t.name] = t, t) } function y(n) { n = n || c; for (var t in n) if (n.hasOwnProperty(t) && n[t].state !== l) return !1; return !0 } function st(n) { n.state = ft; u(n.onpreload, function (n) { n.call() }) } function ht(n) { n.state === t && (n.state = nt, n.onpreload = [], rt({ url: n.url, type: "cache" }, function () { st(n) })) } function ct() { var n = arguments, t = n[n.length - 1], r = [].slice.call(n, 1), f = r[0]; return (s(t) || (t = null), a(n[0])) ? (n[0].push(t), i.load.apply(null, n[0]), i) : (f ? (u(r, function (n) { s(n) || !n || ht(v(n)) }), b(v(n[0]), s(f) ? f : function () { i.load.apply(null, r) })) : b(v(n[0])), i) } function lt() { var n = arguments, t = n[n.length - 1], r = {}; return (s(t) || (t = null), a(n[0])) ? (n[0].push(t), i.load.apply(null, n[0]), i) : (u(n, function (n) { n !== t && (n = v(n), r[n.name] = n) }), u(n, function (n) { n !== t && (n = v(n), b(n, function () { y(r) && f(t) })) }), i) } function b(n, t) { if (t = t || w, n.state === l) { t(); return } if (n.state === tt) { i.ready(n.name, t); return } if (n.state === nt) { n.onpreload.push(function () { b(n, t) }); return } n.state = tt; rt(n, function () { n.state = l; t(); u(h[n.name], function (n) { f(n) }); o && y() && u(h.ALL, function (n) { f(n) }) }) } function at(n) { n = n || ""; var t = n.split("?")[0].split("."); return t[t.length - 1].toLowerCase() } function rt(t, i) { function e(t) { t = t || n.event; u.onload = u.onreadystatechange = u.onerror = null; i() } function o(f) { f = f || n.event; (f.type === "load" || /loaded|complete/.test(u.readyState) && (!r.documentMode || r.documentMode < 9)) && (n.clearTimeout(t.errorTimeout), n.clearTimeout(t.cssTimeout), u.onload = u.onreadystatechange = u.onerror = null, i()) } function s() { if (t.state !== l && t.cssRetries <= 20) { for (var i = 0, f = r.styleSheets.length; i < f; i++) if (r.styleSheets[i].href === u.href) { o({ type: "load" }); return } t.cssRetries++; t.cssTimeout = n.setTimeout(s, 250) } } var u, h, f; i = i || w; h = at(t.url); h === "css" ? (u = r.createElement("link"), u.type = "text/" + (t.type || "css"), u.rel = "stylesheet", u.href = t.url, t.cssRetries = 0, t.cssTimeout = n.setTimeout(s, 500)) : (u = r.createElement("script"), u.type = "text/" + (t.type || "javascript"), u.src = t.url); u.onload = u.onreadystatechange = o; u.onerror = e; u.async = !1; u.defer = !1; t.errorTimeout = n.setTimeout(function () { e({ type: "timeout" }) }, 7e3); f = r.head || r.getElementsByTagName("head")[0]; f.insertBefore(u, f.lastChild) } function vt() { for (var t, u = r.getElementsByTagName("script"), n = 0, f = u.length; n < f; n++) if (t = u[n].getAttribute("data-headjs-load"), !!t) { i.load(t); return } } function yt(n, t) { var v, p, e; return n === r ? (o ? f(t) : d.push(t), i) : (s(n) && (t = n, n = "ALL"), a(n)) ? (v = {}, u(n, function (n) { v[n] = c[n]; i.ready(n, function () { y(v) && f(t) }) }), i) : typeof n != "string" || !s(t) ? i : (p = c[n], p && p.state === l || n === "ALL" && y() && o) ? (f(t), i) : (e = h[n], e ? e.push(t) : e = h[n] = [t], i) } function e() { if (!r.body) { n.clearTimeout(i.readyTimeout); i.readyTimeout = n.setTimeout(e, 50); return } o || (o = !0, vt(), u(d, function (n) { f(n) })) } function k() { r.addEventListener ? (r.removeEventListener("DOMContentLoaded", k, !1), e()) : r.readyState === "complete" && (r.detachEvent("onreadystatechange", k), e()) } var r = n.document, d = [], h = {}, c = {}, ut = "async" in r.createElement("script") || "MozAppearance" in r.documentElement.style || n.opera, o, g = n.head_conf && n.head_conf.head || "head", i = n[g] = n[g] || function () { i.ready.apply(null, arguments) }, nt = 1, ft = 2, tt = 3, l = 4, p; if (r.readyState === "complete") e(); else if (r.addEventListener) r.addEventListener("DOMContentLoaded", k, !1), n.addEventListener("load", e, !1); else { r.attachEvent("onreadystatechange", k); n.attachEvent("onload", e); p = !1; try { p = !n.frameElement && r.documentElement } catch (wt) { } p && p.doScroll && function pt() { if (!o) { try { p.doScroll("left") } catch (t) { n.clearTimeout(i.readyTimeout); i.readyTimeout = n.setTimeout(pt, 50); return } e() } }() } i.load = i.js = ut ? lt : ct; i.test = ot; i.ready = yt; i.ready(r, function () { y() && u(h.ALL, function (n) { f(n) }); i.feature && i.feature("domloaded", !0) }) })(window);
/*
//# sourceMappingURL=head.load.min.js.map
*/

// Begin scoping 
if (typeof (Endeavor) == "undefined") {
    var Endeavor = {
    };
}

if (typeof (Endeavor.SodraSkog) == "undefined") {
    Endeavor.SodraSkog = {
    };
}

if (typeof (Endeavor.SodraSkog.Contact) == "undefined") {
    Endeavor.SodraSkog.Contact = {

        // Copied from Generated entities.
        ed_stakeholdercategory: {
            Potentiellskogsbrukare: 899310005,
            Skogsbrukare: 899310006,
            Leverantorkund: 899310001,
            Ovrigt: 899310007,
            Medlem: 899310000,
            UppsagdMedlem: 899310008,
            UppsagdSkogsagandeMedlem: 899310009,
            Uttraddmedlem: 899310010,
            UteslutenMedlem: 899310011,
            Anstalldhosskogsbrukare: 899310012,
            Anstalldhosentreprenor: 899310013,
            Entreprenor: 899310014,
            Arbetslag: 899310016,
        },

        mapUrl: "",
        mapFunctionUri: "Crm/Hyggesanmalan",
        iFrameName: "IFRAME_map_property",
        mapIsLoaded: false,

        missingCommunicationDataNotificationId: "CommunicationData",
        warnIfOwnerMissingNotificationId: "OwnerMissing",
        addressFromBizTalkNotificationId: "addressBizTalk",

        onLoad: function (ctx) {

            Endeavor.SodraSkog.Contact.addHandlers(ctx);
            Endeavor.SodraSkog.Contact.lockContactNumber();
            Endeavor.SodraSkog.Contact.hideFormComponentsByContactType();
            Endeavor.SodraSkog.Contact.loadMap();
            // Prepare URL for SIR component
            //var isCrmForTablets = (Xrm.Page.context.client.getClient() == 'Mobile');
            //if (!isCrmForTablets)
            //    Endeavor.SodraSkog.Contact.setupSIRURL();
            //Endeavor.SodraSkog.Contact.onTabChangeStateSIR();

            // Is this an Entreprenör or a Arbetslag?
            if (Xrm.Page.ui.getFormType() == 2) {   // Update form?
                var picklistField = Xrm.Page.getAttribute("ed_stakeholdercategory");
                if (picklistField != null) {
                    if (picklistField.getValue() == Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Entreprenor
                        || picklistField.getValue() == Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Arbetslag) {
                        // Disable ALL fields on FORM. Data managed in PP.
                        Endeavor.SodraSkog.Contact.disableForm();
                    }
                }
                // Warn if communication data is missing.
                Endeavor.SodraSkog.Contact.checkCommunicationData();
                // Warn if Stakeholder (Intressent) does not have an Owner
                Endeavor.SodraSkog.Contact.warnIfOwnerMissing();
            }
        },

        onQuickCreateLoad: function (ctx) {
            Endeavor.SodraSkog.Contact.addQuickCreateHandlers(ctx);
        },

        onSave: function () {
            Endeavor.SodraSkog.Contact.checkContactNumber();
            Xrm.Page.ui.clearFormNotification(Endeavor.SodraSkog.Contact.missingCommunicationDataNotificationId);
        },

        onPrintAddress: function () {
            var firstName = Xrm.Page.getAttribute("firstname").getValue();
            var lastName = Xrm.Page.getAttribute("lastname").getValue();
            var co = Xrm.Page.getAttribute("ed_address2_co").getValue();
            var address1 = Xrm.Page.getAttribute("address2_line1").getValue();
            var address2 = Xrm.Page.getAttribute("address2_line2").getValue();
            var postalCode = Xrm.Page.getAttribute("address2_postalcode").getValue();
            var city = Xrm.Page.getAttribute("address2_city").getValue();
            if (Xrm.Page.getAttribute("edp_address2_countryid").getValue().length > 0)
                var countryName = Xrm.Page.getAttribute("edp_address2_countryid").getValue()[0].name;
            else
                var countryName = "";
            var addressString =
                (firstName ? firstName + " " : "") + (lastName ? lastName : "") + (firstName || lastName ? "\n" : "") +
                (co ? co + "\n" : "") +
                (address1 ? address1 + "\n" : "") +
                (address2 ? address2 + "\n" : "") +
                (postalCode ? postalCode + " " : "") + (city ? city : "") + (postalCode || city ? "\n" : "") +
                (countryName != "Sverige" ? countryName : "");

            var phrase = "Skriv ut adress?\n\n" + addressString;
            Xrm.Utility.confirmDialog(phrase, function () {
                if (!Endeavor.SodraSkog.DymoLabel.printAddress(addressString))
                    Xrm.Utility.alertDialog("Ingen DYMO-printer kunde hittas, vänligen installera en DYMO-printer.");
            }, function () { });
        },

        onPrintMultipleAddresses: function (entRefs) {
            if (entRefs.length == 0) {
                Xrm.Utility.alertDialog("Vänligen markera en eller fler Intressenter och försök igen")
            }
            if (entRefs.length > 0) {
                var phrase = "Skriv ut " + entRefs.length + " adresser?";
                Xrm.Utility.confirmDialog(phrase, function () { Endeavor.SodraSkog.Contact.printMultipleAddresses(entRefs) }, function () { });
            }
        },

        printMultipleAddresses: function (entRefs) {
            var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "ContactSet?$select=FirstName,LastName,ed_Address2_Co,Address2_Line1,Address2_Line2,Address2_PostalCode,Address2_City,edp_Address2_CountryId&$filter=";

            for (var i = 0; i < entRefs.length; i++) {
                if (i != 0) {
                    iMUrl += " or "
                }
                iMUrl += "ContactId eq (guid'" + entRefs[i].Id.substr(1, entRefs[i].Id.length - 2) + "')";
            }
            var ContactResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

            //if (ContactResultSet.length != entRefs.length) {
            //    Xrm.Utility.alertDialog("Hittade inte alla önskade Intressenter i databasen. Vänligen försök igen eller kontakta administratör");
            //    return;
            //}

            Endeavor.SodraSkog.DymoLabel.printMultipleContactAddresses(ContactResultSet);
        },

        onCreateChecklist: function () {
            var idWithBrackets = Xrm.Page.data.entity.getId();
            var parameters = {};
            parameters["ed_contactid"] = idWithBrackets.substr(1, idWithBrackets.length - 2);
            parameters["ed_contactidname"] = Xrm.Page.getAttribute("lastname").getValue();
            Xrm.Utility.openEntityForm("ed_checklist", null, parameters, null);
        },

        onCreateIncident: function (primaryItemIds) {
            if (primaryItemIds.length > 0) {
                var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "ContactSet?$select=FullName&$filter=ContactId eq (guid'" + primaryItemIds[0] + "')";
                var contactResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

                if (contactResultSet.length > 0) {
                    var parameters = {};
                    parameters["customerid"] = primaryItemIds[0];
                    parameters["customeridname"] = contactResultSet[0].FullName;
                    parameters["customeridtype"] = "contact";
                    Xrm.Utility.openEntityForm("incident", null, parameters);
                }
            }
        },

        checkContactNumber: function () {
            var contactNumberControlTag = "ed_contactnumber";
            var isCrmForTablets = (Xrm.Page.context.client.getClient() == 'Mobile');
            if (isCrmForTablets)
                contactNumberControlTag = "header_ed_contactnumber";

            var contactNumber = Xrm.Page.getAttribute("ed_contactnumber");
            if (!(!contactNumber.getValue() || 0 === contactNumber.getValue().length)) {
                if (!Endeavor.SodraSkog.Contact.checkPersonnummer(contactNumber.getValue())
                    && !Endeavor.SodraSkog.Contact.checkOrgnummer(contactNumber.getValue())
                    && !Endeavor.SodraSkog.Contact.checkGDNumber(contactNumber.getValue())
                    && !Endeavor.SodraSkog.Contact.checkSamOrdNumber(contactNumber.getValue())) {
                    Xrm.Page.getControl(contactNumberControlTag).setNotification("Intressentnummer måste vara nåt av följande format: ååååmmddxxxx, yyyyyyzzzz, 302xxxyyyy");
                } else {
                    Xrm.Page.getControl(contactNumberControlTag).clearNotification();
                }
            } else {
                Xrm.Page.getControl(contactNumberControlTag).clearNotification();
            }
        },

        warnIfOwnerMissing: function () {
            var idWithBrackets = Xrm.Page.data.entity.getId();
            var notificationLevel = "WARNING";
            var notificationMessage = "Ägare saknas för intressenten.";

            // Get the default owner set in integrations as it should not be counted as an actual owner.
            var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "edp_SystemParameterSet?$select=ed_DefaultOwner";
            var systemParameterResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);
            var defaultOwner = systemParameterResultSet[0].ed_DefaultOwner;

            // Clear previously posted notification.
            Xrm.Page.ui.clearFormNotification(Endeavor.SodraSkog.Contact.warnIfOwnerMissingNotificationId);

            var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "ed_OwnersForContactSet?$select=ed_OwnerId&$filter=ed_ContactId/Id eq (guid'" + idWithBrackets.replace(/{|}/g, '') + "')";
            var ownersForContactResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

            for (var i = 0; i <= ownersForContactResultSet.length; i++) {
                if (ownersForContactResultSet[i] && ownersForContactResultSet[i].ed_OwnerId && ownersForContactResultSet[i].ed_OwnerId.Id) {

                    // If this owner is the default owner and there are no other owners - set notification.
                    if (ownersForContactResultSet[i].ed_OwnerId.Id == defaultOwner.Id && !ownersForContactResultSet[i + 1]) {
                        Xrm.Page.ui.setFormNotification(notificationMessage, notificationLevel, Endeavor.SodraSkog.Contact.warnIfOwnerMissingNotificationId);
                    }
                    break;
                }
                else {
                    Xrm.Page.ui.setFormNotification(notificationMessage, notificationLevel, Endeavor.SodraSkog.Contact.warnIfOwnerMissingNotificationId);
                }
            }

        },

        checkCommunicationData: function () {
            var notificationLevel = "WARNING";
            var notificationMessage;
            // Clear previously posted notification.
            Xrm.Page.ui.clearFormNotification(Endeavor.SodraSkog.Contact.missingCommunicationDataNotificationId);

            var hasTelephone = true;
            var hasemailAddress = true;

            var telephone1 = Xrm.Page.getAttribute("telephone1");
            var telephone2 = Xrm.Page.getAttribute("telephone2");
            var mobilephone = Xrm.Page.getAttribute("mobilephone");
            var emailAddress1 = Xrm.Page.getAttribute("emailaddress1")

            hasTelephone = (telephone1 && telephone1.getValue() && telephone1.getValue().length > 0) ||
                (telephone2 && telephone2.getValue() && telephone2.getValue().length > 0) ||
                (mobilephone && mobilephone.getValue() && mobilephone.getValue().length > 0);

            hasemailAddress = (emailAddress1 && emailAddress1.getValue() && emailAddress1.getValue().length > 0);

            if (!hasTelephone && !hasemailAddress) {
                notificationMessage = "E-post och telefonnummer saknas för intressenten.";
            }
            else if (!hasemailAddress) {
                notificationMessage = "E-post saknas för intressenten.";
            }
            else if (!hasTelephone) {
                notificationMessage = "Telefonnummer saknas för intressenten.";
            }

            if (!hasTelephone || !hasemailAddress) {
                Xrm.Page.ui.setFormNotification(notificationMessage, notificationLevel, Endeavor.SodraSkog.Contact.missingCommunicationDataNotificationId);
            }
        },

        onTabChangeStateSIR: function () {
            var isCrmForTablets = (Xrm.Page.context.client.getClient() == 'Mobile');
            if (!isCrmForTablets) {
                // Wait a few ms to init 
                setTimeout(Endeavor.SodraSkog.Contact.initSIRURL, 80);
            }
        },


        initSIRURL: function () {
            var params = Endeavor.SodraSkog.Contact.getSystemParametersForUrls();
            var newTarget = params.sir;

            var contactNumber = Xrm.Page.getAttribute("ed_contactnumber");
            if (contactNumber == null)
                return;

            var value = contactNumber.getValue();

            if (value == null)
                return;

            //Set the target based on the value of the option set
            switch (value.length) {
                case 10:        // Organisation
                    newTarget += "?id=";
                    break;
                default:
                    newTarget += "?id=";
                    break;
            }
            var IFrame = Xrm.Page.ui.controls.get("IFRAME_SIR");
            newTarget += value;
            // Use the setSrc method so that the IFRAME uses the
            IFrame.setSrc(newTarget);

        },

        onTabChangeStateKAPITAL: function () {
            var isCrmForTablets = (Xrm.Page.context.client.getClient() == 'Mobile');
            if (!isCrmForTablets) {
                // Wait a few ms to init 
                setTimeout(Endeavor.SodraSkog.Contact.initKAPITALURL, 80);
            }
        },

        initKAPITALURL: function () {
            var params = Endeavor.SodraSkog.Contact.getSystemParametersForUrls();

            var contactNumber = Xrm.Page.getAttribute("ed_contactnumber");
            if (contactNumber == null)
                return;

            var value = contactNumber.getValue();

            if (value == null)
                return;

            var newTarget = params.sir;
            //Set the target based on the value of the option set
            switch (value.length) {
                case 10:        // Organisation
                    newTarget += "?id=";
                    break;
                default:
                    newTarget += "?id=";
                    break;
            }

            var IFrameKap = Xrm.Page.ui.controls.get("IFRAME_Kapital");
            IFrameKap.setSrc(params.kapital + value);
        },

        onTabChangeStateWSOP: function () {
            var isCrmForTablets = (Xrm.Page.context.client.getClient() == 'Mobile');
            if (!isCrmForTablets) {
                // Wait a few ms to init (need more time)...
                setTimeout(Endeavor.SodraSkog.Contact.initWSOPURL, 200);
            }
        },

        initWSOPURL: function () {
            var params = Endeavor.SodraSkog.Contact.getSystemParametersForUrls();

            var contactNumber = Xrm.Page.getAttribute("ed_contactnumber");
            if (contactNumber == null)
                return;

            var value = contactNumber.getValue();

            if (value == null)
                return;

            var IFrameWsop = Xrm.Page.ui.controls.get("IFRAME_WSOP");
            IFrameWsop.setSrc(params.wsop + value);
        },

        addQuickCreateHandlers: function (ctx) {
            var isCrmForTablets = (Xrm.Page.context.client.getClient() == 'Mobile');
            var userId = Xrm.Page.context.getUserId();
            var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "SystemUserRolesSet?$select=RoleId&$filter=SystemUserId eq (guid'" + userId.substr(1, userId.length - 2) + "')";
            var systemUserRolesResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

            debugger;

            iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "RolesSet?$select=RoleId,Name&$filter=Name eq 'Södra Skog Medlemsadministratör'";
            //            iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "RoleSet?$select=RoleId,Name&$filter=(Name eq 'Södra Skog Medlemsadministratör') or (Name eq 'Södra Skog Användare')";
            var roleResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

            for (var i = 0; i < roleResultSet.length; i++) {
                if (roleResultSet[i].Name == 'Södra Skog Medlemsadministratör')
                    var membershipServiceId = roleResultSet[i].RoleId;
                if (roleResultSet[i].Name == 'Södra Skog Användare')
                    var inspektorId = roleResultSet[i].RoleId;
            }

            var membershipService = false, inspektor = false;
            for (var i = 0; i < systemUserRolesResultSet.length; i++) {
                if (systemUserRolesResultSet[i].RoleId == membershipServiceId)
                    membershipService = true;
                if (systemUserRolesResultSet[i].RoleId == inspektorId)
                    inspektor = true;
            }

            var options = Xrm.Page.getAttribute("ed_stakeholdercategory").getOptions();
            var picklistField = Xrm.Page.getControl("ed_stakeholdercategory");

            for (var i = 0; i < options.length; i++) {
                picklistField.removeOption(options[i].value);
            }

            // Adding category Ovrigt as a default if no privileges exist.
            picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Ovrigt, text: "Övrigt" });
            picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Potentiellskogsbrukare, text: "Potentiell skogsbrukare" });
            picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosskogsbrukare, text: "Anställd hos skogsbrukare" });
            picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosentreprenor, text: "Anställd hos entreprenör" });
            if (membershipService) {
                picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Leverantorkund, text: "Leverantör/kund" });
                picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Skogsbrukare, text: "Skogsbrukare" });
            }
        },

        addHandlers: function (ctx) {
            var isCrmForTablets = (Xrm.Page.context.client.getClient() == 'Mobile');
            // Current StakeholderCategory
            var stakeholderCategory = Xrm.Page.getAttribute("ed_stakeholdercategory").getValue();
            // The Guid of the currently logged in user
            var userId = Xrm.Page.context.getUserId();
            var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "SystemUserRolesSet?$select=RoleId&$filter=SystemUserId eq (guid'" + userId.substr(1, userId.length - 2) + "')";
            var systemUserRolesResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

            //iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "RoleSet?$select=RoleId,Name&$filter=(Name eq 'Södra Skog Medlemsadministratör') or (Name eq 'Södra Skog Användare')";
            //var roleResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

            //for (var i = 0; i < roleResultSet.length; i++) {
            //    if (roleResultSet[i].Name == 'Södra Skog Medlemsadministratör')
            //        var membershipServiceId = roleResultSet[i].RoleId;
            //    if (roleResultSet[i].Name == 'Södra Skog Användare')
            //        var inspektorId = roleResultSet[i].RoleId;
            //}

            var membershipServiceId = 'C3FEC50E-86EA-E511-80DE-5065F38A99D1';
            var inspektorId = 'A89FC0F1-75EA-E511-80DE-5065F38A99D1';

            // Booleans to know what privileges the logged in user has
            var membershipService = false, inspektor = false;
            for (var i = 0; i < systemUserRolesResultSet.length; i++) {
                if (systemUserRolesResultSet[i].RoleId.toUpperCase() == membershipServiceId.toUpperCase())
                    membershipService = true;
            }

            // Every user (so far) has the privileges of inspektor. This might change so we keep the code to determine if the role is assigned.
            inspektor = true;

            // Clear all options except an eventual current one to keep the selection, needed for mobile client.
            var options = Xrm.Page.getAttribute("ed_stakeholdercategory").getOptions();
            var picklistField = Xrm.Page.getControl("ed_stakeholdercategory");
            if (isCrmForTablets)
                var picklistFieldHeader = Xrm.Page.getControl("header_ed_stakeholdercategory");

            for (var i = 0; i < options.length; i++) {
                if (options[i].value != stakeholderCategory) {
                    picklistField.removeOption(options[i].value);
                    if (isCrmForTablets)
                        picklistFieldHeader.removeOption(options[i].value);
                }
            }

            // Every user has the privilege to change to these categories.
            if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Ovrigt)
                picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Ovrigt, text: "Övrigt" });
            if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Potentiellskogsbrukare)
                picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Potentiellskogsbrukare, text: "Potentiell skogsbrukare" });
            if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosskogsbrukare)
                picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosskogsbrukare, text: "Anställd hos skogsbrukare" });
            if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosentreprenor)
                picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosentreprenor, text: "Anställd hos entreprenör" });
            if (isCrmForTablets) {
                if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Ovrigt)
                    picklistFieldHeader.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Ovrigt, text: "Övrigt" });
                if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Potentiellskogsbrukare)
                    picklistFieldHeader.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Potentiellskogsbrukare, text: "Potentiell skogsbrukare" });
                if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosskogsbrukare)
                    picklistFieldHeader.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosskogsbrukare, text: "Anställd hos skogsbrukare" });
                if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosentreprenor)
                    picklistFieldHeader.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosentreprenor, text: "Anställd hos entreprenör" });
            }

            // Only allow for changes if there is no stakeholdercategory (new Contact) or the user has privileges to alter the Category.
            if (stakeholderCategory == null || stakeholderCategory == Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Ovrigt
                || stakeholderCategory == Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Potentiellskogsbrukare
                || stakeholderCategory == Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Anstalldhosskogsbrukare
                || stakeholderCategory == Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Leverantorkund
                || stakeholderCategory == Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Skogsbrukare) {

                if (membershipService) {
                    if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Leverantorkund) {
                        picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Leverantorkund, text: "Leverantör/kund" });
                        if (isCrmForTablets)
                            picklistFieldHeader.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Leverantorkund, text: "Leverantör/kund" });
                    }
                    if (stakeholderCategory != Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Skogsbrukare) {
                        picklistField.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Skogsbrukare, text: "Skogsbrukare" });
                        if (isCrmForTablets)
                            picklistFieldHeader.addOption({ value: Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Skogsbrukare, text: "Skogsbrukare" });
                    }
                } else if (stakeholderCategory == Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Leverantorkund || stakeholderCategory == Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Skogsbrukare) {
                    // If the user don't have privileges to alter the category and the category is set.
                    Xrm.Page.getControl("ed_stakeholdercategory").setDisabled(true);
                    if (isCrmForTablets)
                        Xrm.Page.getControl("header_ed_stakeholdercategory").setDisabled(true);
                }
            }
            else {
                if (!membershipService)
                    Xrm.Page.getControl("ed_stakeholdercategory").setDisabled(true);
                if (isCrmForTablets)
                    Xrm.Page.getControl("header_ed_stakeholdercategory").setDisabled(true);
            }
        },

        setupSIRURL: function () {
            // Get the IFrames URLs 
            var params = this.getSystemParametersForUrls();

            var contactNumber = Xrm.Page.getAttribute("ed_contactnumber");
            if (contactNumber == null)
                return;

            var value = contactNumber.getValue();

            if (value == null)
                return;

            var newTarget = params.sir;
            //Set the target based on the value of the option set
            switch (value.length) {
                case 10:        // Organisation
                    newTarget += "?id=";
                    break;
                default:
                    newTarget += "?id=";
                    break;
            }
            var IFrame = Xrm.Page.ui.controls.get("IFRAME_SIR");
            newTarget += value;
            // Use the setSrc method so that the IFRAME uses the
            IFrame.setSrc(newTarget);

            var IFrameKap = Xrm.Page.ui.controls.get("IFRAME_Kapital");
            IFrameKap.setSrc(params.kapital + value);

            var IFrameWsop = Xrm.Page.ui.controls.get("IFRAME_WSOP");
            IFrameWsop.setSrc(params.wsop + value);
        },

        onFetchAddressFromBizTalk: function () {
            try {
                Xrm.Page.ui.clearFormNotification(Endeavor.SodraSkog.Contact.addressFromBizTalkNotificationId);
                var contactNumber = Xrm.Page.getAttribute("ed_contactnumber");
                if (Endeavor.SodraSkog.Contact.checkOrgnummer(contactNumber.getValue())) {
                    Xrm.Utility.alertDialog("Kan inte hämta adress från SPAR för företag.");
                    return;
                }
                if (!confirm("Hämta adressinformation från SPAR?"))
                    return;

                //var sdkObject = new Sdk.ed_RetrieveAddressFromBizTalkRequest(contactNumber.getValue());
                //var response = Sdk.Sync.execute(sdkObject);

                Endeavor.SodraSkog.Contact.requestAddressFromBizTalk(contactNumber.getValue());

                /*
                if (response == null) {
                    Xrm.Page.ui.setFormNotification("Inget svar från tjänst.", "ERROR", Endeavor.SodraSkog.Contact.addressFromBizTalkNotificationId);
                    return;
                }
                else {
                    Endeavor.SodraSkog.Contact.otherFunction(response);
                } */
            } catch (e) {
                Xrm.Utility.alertDialog("Fel i onFetchAddressFromBizTalk.\r\n\r\n" + e);
            }
        },

        requestAddressFromBizTalk: function (contactNumber) {

            if (contactNumber) {
                // get uri
                var odataurl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "edp_SystemParameterSet?$select=ed_UrlIndividualSearch";
                var systemparameterresults = Endeavor.Common.Data.fetchJSONResults(odataurl);

                var SearchUrl = systemparameterresults[0].ed_UrlIndividualSearch;

                // Create Query Uri
                var queryUri = SearchUrl;
                var httpMethod = "POST";
                var data = Endeavor.SodraSkog.Contact.buildSoapRequest(contactNumber);
                var async = false;

                try {
                    Endeavor.SodraSkog.Contact.sendWebAPIRequest(queryUri, httpMethod, data, async);
                }
                catch (error) {
                    if (!Xrm.Page.ui.setFormNotification("Ett fel inträffade vid kommunikation med webbtjänsten. Fel: " + error))
                        Xrm.Utility.alertDialog("Ett fel inträffade vid kommunikation med webbtjänsten. Fel: " + error);
                }

            }

        },

        buildSoapRequest: function (contactNumber) {

            var req = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="Sodra.Skog.DynamicsCRM">' +
                '<soapenv:Header/>' +
                '<soapenv:Body>' +
                    '<ns:PersonSok xmlns="Sodra.Skog.DynamicsCRM">' +
                        '<PersonNr>' + contactNumber + '</PersonNr>' +
                    '</ns:PersonSok>' +
                '</soapenv:Body>' +
                '</soapenv:Envelope>';

            return req;
        },

        sendWebAPIRequest: function (queryUri, httpMethod, requestString, async) {

            var request = new XMLHttpRequest();
            request.open(httpMethod, encodeURI(queryUri), async);
            //request.setRequestHeader("OData-MaxVersion", "4.0");
            //request.setRequestHeader("OData-Version", "4.0");
            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            request.withCredentials = true;
            //XMLReq.setRequestHeader("Authorization", "Basic " + btoa("username:password"));

            if (requestString != null) {
                request.send(requestString);
                var responsetext = request.response;

                var parser = new DOMParser();
                var response = parser.parseFromString(responsetext, "text/xml");

                Endeavor.SodraSkog.Contact.populateForm(response);
            }
        },

        populateForm: function (response) {

            /* Local function for not getting null reference from xml objects */
            function getElementValue(xmlelement, tagname) {
                if (xmlelement.getElementsByTagName(tagname)[0] != null) {
                    if (xmlelement.getElementsByTagName(tagname)[0].firstChild != null) {
                        return xmlelement.getElementsByTagName(tagname)[0].firstChild.nodeValue;
                    }
                    else {
                        return "";
                    }
                }
                else {
                    return "";
                }
            }

            var error = getElementValue(response, 'ErrorMessage');

            if (error) {
                throw new Error("Error in BizTalk response: " + error)
            }

            var addressSource1 = Xrm.Page.getAttribute("ed_addresssource1");
            var addressSource2 = Xrm.Page.getAttribute("ed_addresssource2");
            var addressSource3 = Xrm.Page.getAttribute("ed_addresssource3");
            var addressSource4 = Xrm.Page.getAttribute("ed_addresssource4");
            if (!addressSource1 && !addressSource2 && !addressSource3 && !addressSource4) {
                Xrm.Page.ui.setFormNotification("Inga adressfält funna på formuläret.", "WARNING", Endeavor.SodraSkog.Contact.addressFromBizTalkNotificationId);
                return;
            }

            var countryId = "";
            if (getElementValue(response, 'Land')) {
                countryId = getElementValue(response, 'Land');
            }
            else {
                countryId = "SE";
            }

            var url = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "edp_CountrySet?$select=edp_CountryId,edp_Name&$filter=edp_CountryCode eq('" + countryId + "')";
            var detailsresults = Endeavor.Common.Data.fetchJSONResults(url);

            countryRef = [{
                id: detailsresults[0].edp_CountryId,
                name: detailsresults[0].edp_Name,
                entityType: "edp_Country"
            }]


            if (!getElementValue(response, 'Co') &&
                !getElementValue(response, 'Utdelningsadress1') &&
                !getElementValue(response, 'Utdelningsadress2') &&
                !getElementValue(response, 'Postnummer') &&
                !getElementValue(response, 'Ort') &&
                countryRef == null) {

                Xrm.Page.ui.setFormNotification("Ingen adressinformation hittades. (Tom adress)", "WARNING", Endeavor.SodraSkog.Contact.addressFromBizTalkNotificationId);
                return;
            }
            if (addressSource1 && !(addressSource1.getValue() == 100)) {
                //if (response.getCoOut() != null)
                Xrm.Page.getAttribute("ed_address1_co").setValue(getElementValue(response, 'Co'));
                //if (response.getLine1Out() != null)
                Xrm.Page.getAttribute("address1_line1").setValue(getElementValue(response, 'Utdelningsadress1'));
                //if (response.getLine2Out() != null)
                Xrm.Page.getAttribute("address1_line2").setValue(getElementValue(response, 'Utdelningsadress2'));
                //if (response.getPostalcodeOut() != null)
                Xrm.Page.getAttribute("address1_postalcode").setValue(getElementValue(response, 'Postnummer'));
                //if (response.getCityOut() != null)
                Xrm.Page.getAttribute("address1_city").setValue(getElementValue(response, 'Ort'));
                //if (response.getCountryOut() != null)
                Xrm.Page.getAttribute("edp_address1_countryid").setValue(countryRef);
                Xrm.Page.getAttribute("ed_addresssource1").setValue(101);
            }
            if (addressSource1 && !(addressSource2.getValue() == 100)) {
                //if (response.getCoOut() != null)
                Xrm.Page.getAttribute("ed_address2_co").setValue(getElementValue(response, 'Co'));
                //if (response.getLine1Out() != null)
                Xrm.Page.getAttribute("address2_line1").setValue(getElementValue(response, 'Utdelningsadress1'));
                //if (response.getLine2Out() != null)
                Xrm.Page.getAttribute("address2_line2").setValue(getElementValue(response, 'Utdelningsadress2'));
                //if (response.getPostalcodeOut() != null)
                Xrm.Page.getAttribute("address2_postalcode").setValue(getElementValue(response, 'Postnummer'));
                //if (response.getCityOut() != null)
                Xrm.Page.getAttribute("address2_city").setValue(getElementValue(response, 'Ort'));
                //if (response.getCountryOut() != null)
                Xrm.Page.getAttribute("edp_address2_countryid").setValue(countryRef);
                Xrm.Page.getAttribute("ed_addresssource2").setValue(101);
            }
            if (addressSource1 && !(addressSource3.getValue() == 100)) {
                //if (response.getCoOut() != null)
                Xrm.Page.getAttribute("ed_address3_co").setValue(getElementValue(response, 'Co'));
                //if (response.getLine1Out() != null)
                Xrm.Page.getAttribute("address3_line1").setValue(getElementValue(response, 'Utdelningsadress1'));
                //if (response.getLine2Out() != null)
                Xrm.Page.getAttribute("address3_line2").setValue(getElementValue(response, 'Utdelningsadress2'));
                //if (response.getPostalcodeOut() != null)
                Xrm.Page.getAttribute("address3_postalcode").setValue(getElementValue(response, 'Postnummer'));
                //if (response.getCityOut() != null)
                Xrm.Page.getAttribute("address3_city").setValue(getElementValue(response, 'Ort'));
                //if (response.getCountryOut() != null)
                Xrm.Page.getAttribute("ed_address3_countryid").setValue(countryRef);
                Xrm.Page.getAttribute("ed_addresssource3").setValue(101);
            }
            if (addressSource1 && !(addressSource4.getValue() == 100)) {
                //if (response.getCoOut() != null)
                Xrm.Page.getAttribute("ed_address4_co").setValue(getElementValue(response, 'Co'));
                //if (response.getLine1Out() != null)
                Xrm.Page.getAttribute("ed_address4_line1").setValue(getElementValue(response, 'Utdelningsadress1'));
                //if (response.getLine2Out() != null)
                Xrm.Page.getAttribute("ed_address4_line2").setValue(getElementValue(response, 'Utdelningsadress2'));
                //if (response.getPostalcodeOut() != null)
                Xrm.Page.getAttribute("ed_address4_postalcode").setValue(getElementValue(response, 'Postnummer'));
                //if (response.getCityOut() != null)
                Xrm.Page.getAttribute("ed_address4_city").setValue(getElementValue(response, 'Ort'));
                //if (response.getCountryOut() != null)
                Xrm.Page.getAttribute("ed_address4_countryid").setValue(countryRef);
                Xrm.Page.getAttribute("ed_addresssource4").setValue(101);
            }
        },

        onContactNumberChange: function () {
            Endeavor.SodraSkog.Contact.checkContactNumber();
        },

        onPhoneNumber1Change: function () {
            var phoneNumber = Xrm.Page.getAttribute("telephone1");
            if (!(!phoneNumber.getValue() || 0 === phoneNumber.getValue().length)) {
                if (!Endeavor.SodraSkog.Contact.checkPhoneNumber(phoneNumber.getValue())) {
                    Xrm.Page.getControl("telephone1").setNotification("Ogiltigt telefonnummer: Måste vara på format: +LLxxxxxxx");
                } else {
                    Xrm.Page.getControl("telephone1").clearNotification();
                }
            } else {
                Xrm.Page.getControl("telephone1").clearNotification();
            }
        },

        onPhoneNumber2Change: function () {
            var phoneNumber = Xrm.Page.getAttribute("telephone2");
            if (!(!phoneNumber.getValue() || 0 === phoneNumber.getValue().length)) {
                if (!Endeavor.SodraSkog.Contact.checkPhoneNumber(phoneNumber.getValue())) {
                    Xrm.Page.getControl("telephone2").setNotification("Ogiltigt telefonnummer: Måste vara på format: +LLxxxxxxx");
                } else {
                    Xrm.Page.getControl("telephone2").clearNotification();
                }
            } else {
                Xrm.Page.getControl("telephone2").clearNotification();
            }
        },

        onMobilePhoneChange: function () {
            var phoneNumber = Xrm.Page.getAttribute("mobilephone");
            if (!(!phoneNumber.getValue() || 0 === phoneNumber.getValue().length)) {
                if (!Endeavor.SodraSkog.Contact.checkPhoneNumber(phoneNumber.getValue())) {
                    Xrm.Page.getControl("mobilephone").setNotification("Ogiltigt telefonnummer: Måste vara på format: +LLxxxxxxx");
                } else {
                    Xrm.Page.getControl("mobilephone").clearNotification();
                }
            } else {
                Xrm.Page.getControl("mobilephone").clearNotification();
            }
        },

        lockContactNumber: function () {
            var contactNumber = Xrm.Page.getAttribute("ed_contactnumber");
            if (!(!contactNumber.getValue() || 0 === contactNumber.getValue().length)) {
                var isCrmForTablets = (Xrm.Page.context.client.getClient() == 'Mobile');
                if (isCrmForTablets) {
                    Xrm.Page.getControl("header_ed_contactnumber").setDisabled(true);
                }
                else {
                    Xrm.Page.getControl("ed_contactnumber").setDisabled(true);
                }
            }
        },

        checkPhoneNumber: function (nr) {
            // Must be of form '+CCXXYYZZDD(DD)'
            return (nr.match(/^\+\d{2}\d{10}$/) || nr.match(/^\+\d{2}\d{9}$/) || nr.match(/^\+\d{2}\d{8}$/) || nr.match(/^\+\d{2}\d{7}$/))
        },

        checkPersonnummer: function (nr) {
            this.valid = false;
            //if(!nr.match(/^(\d{2})(\d{2})(\d{2})\-(\d{4})$/)){ return false; }
            if (!nr.match(/^(\d{4})(\d{2})(\d{2})(\d{4})$/)) {
                return false;
            }

            this.fullYear = RegExp.$1;
            this.year = this.fullYear.substring(2, 4);
            this.month = RegExp.$2;
            this.day = RegExp.$3;
            this.controldigits = RegExp.$4;

            var months = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            if (this.fullYear % 400 == 0 || this.fullYear % 4 == 0 && this.fullYear % 100 != 0) {
                months[1] = 29;
            }

            if (this.month * 1 < 1 || this.month * 1 > 12 || this.day * 1 < 1 || this.day * 1 > months[this.month * 1 - 1]) {
                return false;
            }

            this.alldigits = this.year + this.month + this.day + this.controldigits;

            var nn = "";
            for (var n = 0; n < this.alldigits.length; n++) {
                nn += ((((n + 1) % 2) + 1) * this.alldigits.substring(n, n + 1));
            }
            this.checksum = 0;

            for (var n = 0; n < nn.length; n++) {
                this.checksum += nn.substring(n, n + 1) * 1;
            }
            this.valid = (this.checksum % 10 == 0) ? true : false;
            this.sex = parseInt(this.controldigits.substring(2, 3)) % 2;
            return this.valid;
        },

        checkOrgnummer: function (nr) {
            this.valid = false;

            if (!nr) {
                return false;
            }

            //if(!nr.match(/^(\d{1})(\d{5})\-(\d{4})$/)){ return false; }
            if (!nr.match(/^(\d{1})(\d{5})(\d{4})$/)) {
                return false;
            }

            this.group = RegExp.$1;
            this.controldigits = RegExp.$3;
            this.alldigits = this.group + RegExp.$2 + this.controldigits;

            if (this.alldigits.substring(2, 3) < 2) {
                return false;
            }

            var nn = "";
            for (var n = 0; n < this.alldigits.length; n++) {
                nn += ((((n + 1) % 2) + 1) * this.alldigits.substring(n, n + 1));
            }
            this.checksum = 0;

            for (var n = 0; n < nn.length; n++) {
                this.checksum += nn.substring(n, n + 1) * 1;
            }
            this.valid = (this.checksum % 10 == 0) ? true : false;
            return this.valid;
        },

        checkGDNumber: function (nr) {
            // Must be of form '302xxxyyyy'
            return (nr.match(/^(?:302)(?:\d{3})(?:\d{4})$/));
        },

        checkSamOrdNumber: function (nr) {
            this.valid = false;

            if (!nr) {
                return false;
            }

            if (nr.length != 12) {
                return false;
            }

            var c = nr.charAt(6);
            if (c < '6' || c > '9') {
                return false;
            }

            var int = parseInt(c, 10);
            int = int - 6;

            var personNr = nr.substr(0, 6) + int + nr.substr(7, 12);
            Endeavor.SodraSkog.Contact.checkPersonnummer()
        },

        openFieldApp: function () {
            var contactNumber = Xrm.Page.getAttribute("ed_contactnumber");
            if (!(!contactNumber.getValue() || 0 === contactNumber.getValue().length)) {
                var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "edp_SystemParameterSet?$select=ed_FieldAppUrl";
                var systemParameterResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

                window.open(systemParameterResultSet[0].ed_FieldAppUrl + contactNumber.getValue());
            } else {
                Xrm.Utility.alertDialog("Intressentnummer saknas");
            }
        },

        getSystemParametersForUrls: function () {
            var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "edp_SystemParameterSet?$select=ed_UrlIFRAMESIR,ed_UrlIFRAMEKapital,ed_UrlIFRAMEWSOP";
            var systemParameterResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);
            var params = new Object();
            params.sir = systemParameterResultSet[0].ed_UrlIFRAMESIR;
            params.kapital = systemParameterResultSet[0].ed_UrlIFRAMEKapital;
            params.wsop = systemParameterResultSet[0].ed_UrlIFRAMEWSOP;
            return params;
        },

        // Return true if control is possible to disable.
        doesControlHaveAttribute: function (control) {
            var controlType = control.getControlType();
            return controlType != "iframe" && controlType != "webresource" && controlType != "subgrid";
        },

        // Loop througt all fields and disable them!
        disableForm: function () {
            // Iterate over all controls on form.
            Xrm.Page.ui.controls.forEach(function (control, index) {
                if (Endeavor.SodraSkog.Contact.doesControlHaveAttribute(control)) {
                    control.setDisabled(true);
                }
            });
        },

        hideFormComponentsByContactType: function () {

            var stakeHolderType = Xrm.Page.getAttribute("ed_stakeholdercategory");
            if (stakeHolderType != null) {
                stakeHolderType = stakeHolderType.getValue();

                if (stakeHolderType === Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Arbetslag || stakeHolderType === Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Entreprenor) {
                    // Hide subgrids
                    Endeavor.SodraSkog.Contact.setSubgridVisibility("Lead", false);
                    Endeavor.SodraSkog.Contact.setSubgridVisibility("Opportunity", false);
                    // Hide specific sections of tabs
                    Endeavor.SodraSkog.Contact.setSectionVisibilityOfTab("SUMMARY_TAB", "SUMMARY_TAB_section_9", false);
                    // Hide tabs
                    Endeavor.SodraSkog.Contact.setTabVisibility("tab_2", false);
                    Endeavor.SodraSkog.Contact.setTabVisibility("tab_3", false);
                    Endeavor.SodraSkog.Contact.setTabVisibility("tab_8", false);
                    Endeavor.SodraSkog.Contact.setTabVisibility("tab_9", false);
                    Endeavor.SodraSkog.Contact.setTabVisibility("tab_10", false);
                    Endeavor.SodraSkog.Contact.setTabVisibility("tab_11", false);
                    Endeavor.SodraSkog.Contact.setTabVisibility("tab_12", false);

                    // Show correct checklist-grid
                    if (stakeHolderType === Endeavor.SodraSkog.Contact.ed_stakeholdercategory.Arbetslag) {
                        Endeavor.SodraSkog.Contact.setTabVisibility("tab_13", false);
                    }
                    else {
                        Endeavor.SodraSkog.Contact.setTabVisibility("tab_14", false);
                    }
                }
                else {
                    // Hide checklists
                    Endeavor.SodraSkog.Contact.setTabVisibility("tab_13", false);
                    Endeavor.SodraSkog.Contact.setTabVisibility("tab_14", false);
                }
            }
            else {
                // Hide both Checklists
                Endeavor.SodraSkog.Contact.setTabVisibility("tab_13", false);
                Endeavor.SodraSkog.Contact.setTabVisibility("tab_14", false);
            }
        },

        setTabVisibility: function (tabName, visible) {
            var tab = Xrm.Page.ui.tabs.get(tabName);
            if (tab != null) {
                tab.setVisible(visible);
            }
        },

        setSectionVisibilityOfTab: function (tabName, sectionName, visible) {
            var tab = Xrm.Page.ui.tabs.get(tabName);
            if (tab != null) {
                var section = tab.sections.get(sectionName);
                if (section != null) {
                    section.setVisible(visible);
                }
            }
        },

        setSubgridVisibility: function (subgridName, visible) {
            subgrid = Xrm.Page.getControl(subgridName);
            if (subgrid != null) {
                subgrid.setVisible(visible);
            }
        },

        openOwnersForContactManager: function (entityReferences) {
            debugger;
            var refs = "";
            for (var i = 0; i < entityReferences.length; i++) {
                if (entityReferences[i].Id) {
                    if (i > 0)
                        refs += ";";
                    refs += encodeURI(entityReferences[i].Id + ":" + entityReferences[i].Name);
                }
            }
            window.entityRefData = refs;
            var url = "ed_/html/Endeavor.SodraSkog.OwnersForContactManager.html";
            var manager = Xrm.Utility.openWebResource(url, null, 1200, 800);
        },


        //
        // Functions for handling the map
        //
        // -----------------------------------------------------

        loadMap: function () {
            var mapIframe = Xrm.Page.ui.controls.get(Endeavor.SodraSkog.Contact.iFrameName);

            if (mapIframe != null && mapIframe.getObject() != null) {
                if (window.XMLHttpRequest) {
                    //for browsers other than ie
                    window.parent.addEventListener("message", Endeavor.SodraSkog.Contact.onPostMessage, false);
                } else {
                    //ie
                    window.parent.attachEvent('onmessage', Endeavor.SodraSkog.Contact.onPostMessage);
                }

                // As scripts are loaded asyncronously we need to make sure all depending scripts are loaded before calling them.
                // load all missing scripts
                var jsToLoad = [];
                var clientUrl = Xrm.Page.context.getClientUrl();
                debugger;
                // Load scripts individually
                if (typeof Endeavor == "undefined" || typeof Endeavor.Common == "undefined" || typeof Endeavor.Common.Page == "undefined") {
                    debugger;
                    jsToLoad.push(clientUrl + "/WebResources/ed_/script/Endeavor.Common.Page.js");
                }
                if (typeof Endeavor == "undefined" || typeof Endeavor.Common == "undefined" || typeof Endeavor.Common.Data == "undefined") {
                    debugger;
                    jsToLoad.push(clientUrl + "/WebResources/ed_/script/Endeavor.Common.Data.js");
                }
                if (typeof SDK == "undefined" || typeof SDK.REST == "undefined") {
                    debugger;
                    jsToLoad.push(clientUrl + "/WebResources/ed_/script/Sdk.Rest.js");
                }
                if (typeof Endeavor == "undefined" || typeof Endeavor.SodraSkog == "undefined" || typeof Endeavor.SodraSkog.GiSFramework == "undefined") {
                    debugger;
                    jsToLoad.push(clientUrl + "/WebResources/ed_/script/Endeavor.SodraSkog.GiSFramework.js");
                }

                if (jsToLoad.length > 0) {
                    head.load(jsToLoad, Endeavor.SodraSkog.Contact.handleOnLoad());
                }
                else {
                    Endeavor.SodraSkog.Contact.handleOnLoad();
                }
            }
        },

        handleOnLoad: function () {
            Endeavor.SodraSkog.Contact.onMapLoaded(0);
        },


        tryPostPropertyIdToMap: function () {
            try {
                var formType = Xrm.Page.ui.getFormType();

                // Not undefined, create or bulkedit
                if (formType != 0 && Xrm.Page.ui.getFormType() != 1 && Xrm.Page.ui.getFormType() != 6) {
                    var attribute = null;
                    var data = null;
                    if (Endeavor.SodraSkog.Contact.mapUrl == "") {
                        Endeavor.SodraSkog.Contact.getMapDefaultUrl();
                        Endeavor.SodraSkog.Contact.postDataToMap("setMapUrl", "url", Endeavor.SodraSkog.Contact.mapUrl);
                    }
                    var mapObj = new Endeavor.SodraSkog.GiSFramework(Endeavor.SodraSkog.Contact.mapUrl);

                    var contactId = Xrm.Page.data.entity.getId();
                    if (contactId != null) {
                        contactId = contactId.replace('{', '').replace('}', '');
                        var iMUrl = Endeavor.Common.Data.getOrganizationServiceEndpoint() + "ed_UseRightSet?$select=ed_PropertyId&$filter=ed_ContactId/Id eq (guid'" + contactId + "')";
                        var useRightResultSet = Endeavor.Common.Data.fetchJSONResults(iMUrl);

                        if (useRightResultSet && useRightResultSet.length > 0) {
                            attribute = new Array();
                            for (var i = 0; i < useRightResultSet.length; i++) {
                                attribute.push(useRightResultSet[i].ed_PropertyId.Name);
                            }
                        }
                        if (attribute != null) {
                            data = new Endeavor.SodraSkog.GiSFramework.Data(null, null, attribute, mapObj.Mode.view);
                        }
                    }

                    if (data != null) {
                        Endeavor.SodraSkog.Contact.postDataToMap("postDataObject", "dto", data);
                    }
                }
            }
            catch (e) {
                Xrm.Utility.alertDialog("Ett fel inträffade då information skulle skickas till kartan.\r\nFel: " + e.message);
            }
        },

        getMapDefaultUrl: function () {
            var mapUrl = Endeavor.Common.Data.getSystemParameterValue("ed_UrlIFrameGiSMap");
            if (mapUrl == null || mapUrl.ed_UrlIFrameGiSMap == null) {
                Xrm.Utility.alertDialog("Adressen till kartan kunde inte hittas. Var god kontrollera att fält 'Url iFrame Verksamhetskarta' är ifylld i systemparametern.");
            }
            else {
                // Combine base-url with specific url for this application
                Endeavor.SodraSkog.Contact.mapUrl = mapUrl.ed_UrlIFrameGiSMap + Endeavor.SodraSkog.Contact.mapFunctionUri;
            }
        },

        postDataToMap: function (eventName, paramName, paramData) {
            paramName = paramName || null;
            paramData = paramData || null;

            var mapIframe = Xrm.Page.ui.controls.get(Endeavor.SodraSkog.Contact.iFrameName).getObject();
            if (mapIframe) {
                var contentWin = mapIframe.contentWindow;
                if (contentWin) {
                    var message = { type: eventName };
                    if (paramName != null && paramData != null) {
                        message[paramName] = paramData;
                    }
                    var origin = Xrm.Page.context.getClientUrl();
                    contentWin.postMessage(JSON.stringify(message), origin);
                }
            }
        },

        onPostMessage: function (message) {
            try {
                var origin = Xrm.Page.context.getClientUrl();
                if (message.origin === origin) {
                    // parse the string to an object
                    var messageData = JSON.parse(message.data);
                    // If event is mapIsLoaded, try to load the map with data
                    if (messageData != null && messageData.type != null && messageData.type.toLowerCase() === "gismaploaded") {
                        // make sure next mapload does not trigger onLoad-event
                        Endeavor.SodraSkog.Contact.mapIsLoaded = true;
                    }
                }
            } catch (e) {
                //  Xrm.Utility.alertDialog("Ett fel inträffade:" + e.message);
                Xrm.Utility.alertDialog("Ett fel inträffade då information togs emot från kartan.\r\nFel" + e.message);
            }
        },

        onMapLoaded: function (i) {
            i == i || -1;
            i++;

            // If iFrame is not yet loaded - wait a little while and check again.
            if (Endeavor.SodraSkog.Contact.mapIsLoaded == false) {
                if (i % 4 == 0) {
                    var eventName = "getwebresourceloaded";
                    Endeavor.SodraSkog.Contact.postDataToMap(eventName);
                }
                if (i < 50) {
                    // Wait and check once again if map is loaded
                    setTimeout(function () { Endeavor.SodraSkog.Contact.onMapLoaded(i); }, 250);
                }
            }
            else {
                Endeavor.SodraSkog.Contact.tryPostPropertyIdToMap();
            }
        },

    };
}