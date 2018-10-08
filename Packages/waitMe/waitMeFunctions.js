// WAITME WAITING ICON
// --------------------------------------------------
// Dependecies: CSS and Script File located in github
// --------------------------------------------------

// To start the wait run this function
// target: The element to target ex. body
// displayText: text ot display
run_Waitme: function (target, displayText) {
    $(target).waitMe({
        effect: 'win8',
        text:displayText,
        bg: 'rgba(255,255,255,0.7)',
        color: '#000'
    });
},

//To hide
hide_Waitme: function (target){
    $(target).waitMe('hide');
},
