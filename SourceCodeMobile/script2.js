/**
 * Created by Karthik on 3/05/14.
 */

var isLogged = false;
/**
 * Method used to log into the application
 */
$(document).on("pageinit", "#loginForm", function () {
    $("#form1").on("submit", function (event) {
        event.preventDefault();
        $.ajax({
            type: "GET",
            url: "http://softwarehuttest.x10.mx/public/account/login/",
            data: $("#form1").serialize(),
            success: function (data) {
                console.log(data);
                if (data.loggedIn) {
                    isLogged = true;
                    $.mobile.changePage("#home");
                } else {
                    alert("You entered the wrong username or password. Please try again.");
                }
            }
        });
    });
});

/**
 * Method used to update the 'expense' page and save information locally
 * Information will also be updated to the server
 */
$(document).on("pageinit", "#expense", function(){
    var listDescription;
    var payment;
    var ss = window.localStorage;
    var k;
    for(k in ss){
        //ss.clear();
        if(ss.getItem(k).charAt(0) != "a")
            $('#list1').prepend('<div>' + "\u00A3 "  + k + "\t\t\t" + ss.getItem(k) + '</div>');
    }
    //expense page ACCESS SET METHOD
    $('#add_list').click( function() {

        listDescription = $('#list_description').val();
        payment = $('#payment').val();
        if(!isNaN(listDescription) && listDescription != ""){
            $('#list1').prepend('<div>' + "\u00A3 "  + listDescription + "\t\t\t" + payment + "\t" + '</div>');
        }

        //sending the expense list information to the server each time it is added.
        $.ajax({
            url: "http://softwarehuttest.x10.mx/public/user/spent",
            data: {
                amount: listDescription,
                account: payment
            },
            type: "GET",
            dataType:'json',
            async:true,
            cache:false,
            success: function (data) {
                if(data.status == "validationError")
                    alert("Invalid Entry.");
                else
                    alert("Successfully added.");
                if(!isNaN(listDescription) && listDescription != "")
                    ss.setItem(listDescription, payment);
            },
            error: function (xhr, status, error) {
                //alert(error);
                alert("Invalid Entry");
            }
        });

        $('#list_form')[0].reset();
        return false;
    });
});

/**
 * Method used to update the 'earnings' page and save information locally
 * Information will also be updated to the server
 */
$(document).on("pageinit", "#earnings", function(){
    var listDescription1;
    var payment1;
    var ss1 = window.localStorage;
    var j;
    for(j in ss1){
        //ss1.clear();
        if(ss1.getItem(j).charAt(0) == "a"){
            $('#list2').prepend('<div>' + "\u00A3 "  + j + "\t\t\t" + ss1.getItem(j).substring(1) + '</div>');
        }
    }
    //earnings page ACCESS SET METHOD
    $('#add_list1').click( function() {

        //appending information to the list in earnings page
        listDescription1 = $('#list_description1').val();
        payment1 = $('#payment1').val();
        if(!isNaN(listDescription1) && listDescription1 != ""){
            $('#list2').prepend('<div>' + "\u00A3 "  + listDescription1 + "\t\t\t" + payment1 + '</div>');
        }

        $.getJSON("http://softwarehuttest.x10.mx/public/user/income", {
            amount: listDescription1,
            account: payment1
        }, function(data) {
            //alert(data.status);
            if(data.status == "validationError")
                alert("Invalid Entry");
            else
                alert("Successfully added");
            if(!isNaN(listDescription1) && listDescription1 != "")
                ss1.setItem(listDescription1, "a" + payment1);
        }).fail(function() {
                alert("Invalid Entry.");
            })

        $('#list_form1')[0].reset();
        return false;
    });//END OF SET METHOD ACCESS
});

/**
 * Method used to retrieve information from the server
 * and update the data on the mobile application's 'transaction page'
 */
$(document).on("pageinit", "#transaction" ,function(){
    //Transaction
    $.getJSON("http://softwarehuttest.x10.mx/public/user/transactionlog/", function (data) {
        //Loop for each element on the data
        $.each(data, function (elem) {
            var wrap = $("<div/>").attr('data-role', 'collapsible');
            //Create the h1 and the other elements appending them to benefits List
            $("<h1/>", {
                text: data[elem].reference
            }).appendTo(wrap);

            $("<p/>", {
                text: "Date: " + data[elem].date
            }).appendTo(wrap);

            $("<p/>", {
                text: "Days: " + data[elem].account
            }).appendTo(wrap);

            $("<p/>", {
                text: "Amount: \u00A3" + data[elem].amount
            }).appendTo(wrap);
            wrap.appendTo('#transactionList');
        });//end of for loop
        $( "#transactionList" ).collapsibleset();
    });//end of transaction page update
});

/**
 * Method used to retrieve information from the server
 * and update the data on the mobile application's 'budget page'
 */
$(document).on("pageinit", "#budget",function(){
    //Budget
    $.getJSON("http://softwarehuttest.x10.mx/public/user/balance/",function(data){
        var wrap = $("<div/>").attr('data-role', 'collapsible');
        //Create the h1 and the other elements appending them to bills List
        $("<h1/>",{
            text:"Budget Details"
        }).appendTo(wrap);
        $("<p/>",{
            text:"Bank Balance: \u00A3"+ data.bank
        }).appendTo(wrap);
        $("<p/>",{
            text:"Cash Balance: \u00A3"+ data.cash
        }).appendTo(wrap);
        $("<p/>",{
            text:"Daily Budget: \u00A3"+ data.daily_aim
        }).appendTo(wrap);
        $("<p/>",{
            text:"Daily Expense: \u00A3"+ data.spent_today
        }).appendTo(wrap);
        wrap.appendTo('#budgetList');
        $( "#budgetList" ).collapsibleset();
    })//end of budget page update
});

var identity = [];
var count = 0;
/**
 * Method used to retrieve information from the server
 * and update the data on the mobile application's 'unpaid page'
 */
$(document).on("pageinit", "#unpaidBills",function(){
    //UNPAID BILLS
    $.getJSON("http://softwarehuttest.x10.mx/public/user/listunpaidbills/",function(data){
        //Loop for each element on the data
        $.each(data,function(elem){
            var wrap = $("<div/>").attr('data-role', 'collapsible');
            identity.push(data[elem].id);
            //Create the h1 and the other elements appending them to bills List
            $("<h1/>",{
                text:data[elem].reference
            }).appendTo(wrap);
            $("<p/>",{
                text:"Account: "+ data[elem].account
            }).appendTo(wrap);
            $("<p/>",{
                text:"Amount: "+ data[elem].amount
            }).appendTo(wrap);
            $("<p/>",{
                text:"ID: "+ data[elem].id
            }).appendTo(wrap);

            /*$("<input type='submit' value='Paid' class='myinput'/>",{
             data:{'identityindex':count}, //information not being assigned
             text:"Paid"
             }).appendTo(wrap);*/

            $("<input type='submit' value='Paid' class='myinput'>",{
                text:"Paid"
            }).data('identityindex',count).appendTo(wrap);


            wrap.appendTo('#unpaidList');
            count++;
        })//end of for each loop
        $( "#unpaidList" ).collapsibleset();

        //Confirm Payment function within the 'unpaid page'
        //clicking the paid button activates this function
        //and confirms the payment and removes the bill
        $(".myinput").click(function(){
            var $this = $(this);
            var index = $this.data('identityindex'); //undefined.
            $.getJSON("http://softwarehuttest.x10.mx/public/user/confirmbill/", {
                id: identity[index]
            }, function(data) {
                alert(data.status);
            }).fail(function() {
                    alert("error");
                });
        });
    });
});//end of unpaid bills page update

/**
 * Method used to retrieve information from the server
 * and update the data on the mobile application's 'benefit page'
 */
$(document).on("pageinit", "#benefits",function(){
    //UPDATING BENEFITS PAGE WITH INFO FROM DATABASE
    $.getJSON("http://softwarehuttest.x10.mx/public/user/listincome/", function (data) {
        //Loop for each element on the data
        $.each(data, function (elem) {
            var wrap = $("<div/>").attr('data-role', 'collapsible');
            //Create the h1 and the other elements appending them to benefits List
            $("<h1/>", {
                text: data[elem].reference
            }).appendTo(wrap);

            $("<p/>", {
                text: "Date: " + data[elem].due.date
            }).appendTo(wrap);

            $("<p/>", {
                text: "Days: " + data[elem].due.days
            }).appendTo(wrap);

            $("<p/>", {
                text: "Amount: " + data[elem].amount
            }).appendTo(wrap);
            wrap.appendTo('#benefitsList');
        });//end of for loop
        $( "#benefitsList" ).collapsibleset();
    });//end of benefits page update
});

/**
 * Method used to retrieve information from the server
 * and update the data on the mobile application's 'bills page'
 */
$(document).on("pageinit", "#bills",function(){
    //UPDATING THE BILLS PAGE WITH INFO FROM DATABASE // ACCESSING GET METHOD
    $.getJSON("http://softwarehuttest.x10.mx/public/user/listbills/",function(data){
        //Loop for each element on the data
        $.each(data,function(elem){
            var wrap = $("<div/>").attr('data-role', 'collapsible');
            //Create the h1 and the other elements appending them to bills List
            $("<h1/>",{
                text:data[elem].reference
            }).appendTo(wrap);

            $("<p/>",{
                text:"Date: "+ data[elem].due.date
            }).appendTo(wrap);

            $("<p/>",{
                text:"Days: "+ data[elem].due.days
            }).appendTo(wrap);

            $("<p/>",{
                text:"Amount: "+ data[elem].amount
            }).appendTo(wrap);
            wrap.appendTo('#billsList');
        })//end of for each loop
        $( "#billsList" ).collapsibleset( "refresh" );
    })//end of bills page update
});

/**
 * triggers when leaving any page. Used constrain the user
 * from being able to click back button and go back to log in page.
 */
$(document).on('pagebeforechange', function (e, data) {
    var to = $.mobile.path.parseUrl(data.toPage);
    if (typeof to === 'object') {
        var u = to.href;
        if (u === $.mobile.urlHistory.stack[0].url) {
            var current = "#" + $.mobile.activePage[0].id;
            window.location.hash += current;
            return false; //this will stop page change process
        }
    }
});

/**
 * back buttons for all pages less log in and main page
 * @type {string}
 */
$.mobile.page.prototype.options.addBackBtn = "true";
$.mobile.page.prototype.options.backBtnText = "Go Back";