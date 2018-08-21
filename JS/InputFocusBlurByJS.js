        //Removes the default value of the input field when focused

        inputOnFocus: function (ths) {
            var elem = document.getElementById(ths.id);
            if (elem.value == '--') {
                elem.value = '';
            }
        },

        //Enters the default value of the input field if nothing is entered
        inputOnBlur: function (ths) {
            var elem = document.getElementById(ths.id);
            if (elem.value == '') {
                elem.value = '--';
            }
        },