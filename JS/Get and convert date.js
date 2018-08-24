var accessdate = Xrm.Page.getAttribute("ed_accessdate");                        
var inDate = new Date(accessdate.getValue()).toISOString(); 
// expected output: 2011-10-05T14:48:00.000Z

// OR
var inDate = new Date(accessdate.getValue()).toUTCString(); 
// expected output: Sun, 31 Dec 1899 00:00:00 GMT (europeisk bla bla)


var lastCreditReport = new Date((Xrm.Page.getAttribute("edp_updates_from_creditsafe").getValue().toUTCString()).replace(/GMT(.*)/gm, ""));
// expected output: Sun, 31 Dec 1899 00:00:00 GMT
