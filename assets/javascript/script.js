$(document).ready(function () {


    //initialize firebase
    var config = {
        apiKey: "AIzaSyAOSYriAKqBLNsc9sdHJ2yVPnUnFCYkwPw",
        authDomain: "trainscheduler-f4cd6.firebaseapp.com",
        databaseURL: "https://trainscheduler-f4cd6.firebaseio.com",
        projectId: "trainscheduler-f4cd6",
        storageBucket: "trainscheduler-f4cd6.appspot.com",
        messagingSenderId: "940793721392"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    //hide the Add Train stuff
    $(".add-train").hide();
    $("#message").hide()


    //create the row where the train schedule headings will be located.
    var trainScheduleHeading = $("<div>");
    trainScheduleHeading.addClass("row col-12");
    trainScheduleHeading.attr("id", "train-schedule-heading-row");

    //create the columns where the train schedule headings will be located.
    var trainNameHeading = $("<div>");
    trainNameHeading.addClass("col-xl-2 col-lg-2 col-md-2 col-sm-4 col-4 train-schedule-heading text-center");
    trainNameHeading.attr("id", "train-name-heading");
    trainNameHeading.text("Train Name");

    var destinationHeading = $("<div>");
    destinationHeading.addClass("col-xl-3 col-lg-3 col-md-3 col-sm-4 col-4 train-schedule-heading text-center");
    destinationHeading.attr("id", "destination-heading");
    destinationHeading.text("Destination");

    var frequencyHeading = $("<div>");
    frequencyHeading.addClass("col-xl-2 col-lg-2 col-md-2 col-sm-1 col-1 train-schedule-heading text-center");
    frequencyHeading.attr("id", "frequency-heading");
    frequencyHeading.text("Freq. (min)");

    var nextArrivalHeading = $("<div>");
    nextArrivalHeading.addClass("col-xl-3 col-lg-3 col-md-3 col-sm-3 col-3 train-schedule-heading text-center");
    nextArrivalHeading.attr("id", "next-arrival-heading");
    nextArrivalHeading.text("Next Arrival");


    var minutesAwayHeading = $("<div>");
    minutesAwayHeading.addClass("col-xl-2 col-lg-2 col-md-2 col-sm-0 col-0 train-schedule-heading text-center");
    minutesAwayHeading.attr("id", "minutes-away-heading");
    minutesAwayHeading.text("Min Away");


    //create the hr divisor
    var hrHeadingTop = $("<hr>");

    var hrHeadingBottom = $("<hr>");
    hrHeadingBottom.attr("id", "hr-heading-bottom")

    //append the columns to the row
    trainScheduleHeading.append(trainNameHeading);
    trainScheduleHeading.append(destinationHeading);
    trainScheduleHeading.append(frequencyHeading);
    trainScheduleHeading.append(nextArrivalHeading);
    trainScheduleHeading.append(minutesAwayHeading);

    //append the hr's and row to the html
    $(".train-schedule-container").append(hrHeadingTop);
    $(".train-schedule-container").append(trainScheduleHeading);
    $(".train-schedule-container").append(hrHeadingBottom);


    //go to firebase database to get the trains already created and store the values in variables
    database.ref("/Trains").on("child_added", function (childSnapshot, prevChildKey) {

        // Store everything into a variable.
        var trainNameFb = childSnapshot.val().trainName;
        var destinationFb = childSnapshot.val().destination;
        var firstTrainFb = childSnapshot.val().firstTrainTime;
        var frequencyFb = childSnapshot.val().frequency;

        console.log(trainNameFb);
        console.log(destinationFb);
        console.log(firstTrainFb);
        console.log(frequencyFb);


        // Get the firstTrainFB changed to HH:mm
        var firstTrainTime = moment.unix(firstTrainFb).format("HH:mm");
        console.log(firstTrainTime);

        // Get the moment right now in HH:mm
        var now = moment().format("HH:mm");
        console.log(now);


        //calculations of Minutes away
        var difference = moment(now, "HH:mm").diff(moment(firstTrainTime, "HH:mm"), "minutes");
        console.log(difference);

        var minutesAwayCalc;

        var minAwayCalculation = function () {
            if (difference < 0) {
                minutesAwayCalc = difference * -1;
            } else if (difference == 0) {
                minutesAwayCalc = difference
            } else if (difference > 0) {
                minutesAwayCalc = frequencyFb - (difference % frequencyFb);
            }
        }

        minAwayCalculation();

        console.log(minutesAwayCalc);



        //calculations of Next Arrival 

        var nextArrivalCalc = moment(now, "HH:mm").add(minutesAwayCalc, "minutes").format("HH:mm");
        console.log(nextArrivalCalc);



        //create the row and columns that the information will be set and append to html ... and calculate the Next Arrival and Minutes Away
        var trainSchedule = $("<div>");
        trainSchedule.addClass("row col-12");
        trainSchedule.attr("id", "train-schedule-row");

        //create the columns where the train schedule will be located.
        var trainName = $("<div>");
        trainName.addClass("col-xl-2 col-lg-2 col-md-2 col-sm-4 col-4 train-schedule text-center");
        trainName.attr("id", "train-name");
        trainName.text(trainNameFb);

        var destination = $("<div>");
        destination.addClass("col-xl-3 col-lg-3 col-md-3 col-sm-4 col-4 train-schedule text-center");
        destination.attr("id", "destination");
        destination.text(destinationFb);

        var frequency = $("<div>");
        frequency.addClass("col-xl-2 col-lg-2 col-md-2 col-sm-1 col-1 train-schedule text-center");
        frequency.attr("id", "frequency");
        frequency.text(frequencyFb);

        var nextArrival = $("<div>");
        nextArrival.addClass("col-xl-3 col-lg-3 col-md-3 col-sm-3 col-3 train-schedule text-center");
        nextArrival.attr("id", "next-arrival");
        nextArrival.text(nextArrivalCalc);

        var minutesAway = $("<div>");
        minutesAway.addClass("col-xl-2 col-lg-2 col-md-2 col-sm-0 col-0 train-schedule text-center");
        minutesAway.attr("id", "minutes-away");
        minutesAway.text(minutesAwayCalc);


        //create the hr divisor

        var hrBottom = $("<hr>");
        hrBottom.attr("id", "hr-bottom");

        //append the columns to the row
        trainSchedule.append(trainName);
        trainSchedule.append(destination);
        trainSchedule.append(frequency);
        trainSchedule.append(nextArrival);
        trainSchedule.append(minutesAway);


        //append the hr and row to the html
        $(".train-schedule-container").append(trainSchedule);
        $(".train-schedule-container").append(hrBottom);


    });




    //--CREATE THE ADD TRAIN TAB FORM--

    //the form where everything will be appended
    var form = $("<form>");


    //Train Name input and appends
    var trainNameFormGroup = $("<div>");
    trainNameFormGroup.addClass("form-group");

    var trainNameFormLabel = $("<label>");
    trainNameFormLabel.attr("for", "formGroupExampleInput");
    trainNameFormLabel.text("Train Name");

    var trainNameFormInput = $("<input>");
    trainNameFormInput.attr("type", "text");
    trainNameFormInput.addClass("form-control");
    trainNameFormInput.attr("id", "train-name-input");
    trainNameFormInput.attr("placeholder", "Train Name");


    trainNameFormGroup.append(trainNameFormLabel);
    trainNameFormGroup.append(trainNameFormInput);

    form.append(trainNameFormGroup);


    //Destination input
    var destinationFormGroup = $("<div>");
    destinationFormGroup.addClass("form-group");

    var destinationFormLabel = $("<label>");
    destinationFormLabel.attr("for", "formGroupExampleInput2");
    destinationFormLabel.text("Destination");

    var destinationFormInput = $("<input>");
    destinationFormInput.attr("type", "text");
    destinationFormInput.addClass("form-control");
    destinationFormInput.attr("id", "destination-input");
    destinationFormInput.attr("placeholder", "Destination");


    destinationFormGroup.append(destinationFormLabel);
    destinationFormGroup.append(destinationFormInput);

    form.append(destinationFormGroup);


    //First Train Time input
    var firstTrainFormGroup = $("<div>");
    firstTrainFormGroup.addClass("form-group");

    var firstTrainFormLabel = $("<label>");
    firstTrainFormLabel.attr("for", "formGroupExampleInput3");
    firstTrainFormLabel.text("First Train Time (HH:mm - military time)");

    var firstTrainFormInput = $("<input>");
    firstTrainFormInput.attr("type", "text");
    firstTrainFormInput.addClass("form-control");
    firstTrainFormInput.attr("id", "first-train-input");
    firstTrainFormInput.attr("placeholder", "First Train Time (HH:mm - military time)");


    firstTrainFormGroup.append(firstTrainFormLabel);
    firstTrainFormGroup.append(firstTrainFormInput);

    form.append(firstTrainFormGroup);


    //Frequency input
    var frequencyFormGroup = $("<div>");
    frequencyFormGroup.addClass("form-group");

    var frequencyFormLabel = $("<label>");
    frequencyFormLabel.attr("for", "formGroupExampleInput4");
    frequencyFormLabel.text("Frequency (min)");

    var frequencyFormInput = $("<input>");
    frequencyFormInput.attr("type", "text");
    frequencyFormInput.addClass("form-control");
    frequencyFormInput.attr("id", "frequency-input");
    frequencyFormInput.attr("placeholder", "Frequency (min)");


    frequencyFormGroup.append(frequencyFormLabel);
    frequencyFormGroup.append(frequencyFormInput);

    form.append(frequencyFormGroup);



    //Submit and add more trains button
    var submitAndMore = $("<button>");
    submitAndMore.attr("type", "submit");
    submitAndMore.addClass("btn btn-primary");
    submitAndMore.attr("id", "submit-and-more");
    submitAndMore.text("Submit and add more Trains");

    form.append(submitAndMore);


    //submit and close button
    var submitAndClose = $("<button>");
    submitAndClose.attr("type", "submit");
    submitAndClose.addClass("btn btn-primary");
    submitAndClose.attr("id", "submit-and-close");
    submitAndClose.text("Submit and show Schedule");

    form.append(submitAndClose);


    //Append form to HTML
    $(".add-train").append(form);


    //APPEND THE MESSAGE WHEN ADDING A NEW TRAIN
    $("#message").text("\nNew Train Added!");




    //when clicking the Add Train tab
    $("#add-train-menu").on("click", function (event) {

        //change the color of the tabs to orange and white respectively
        $(this).css({ "background-color": "#ffffff", "color": "#777777" });
        $("#train-schedule-menu").css({ "background-color": "#E9967A", "color": "#EEF1F0" })


        //hide the current train schedule stuff and show the Add Train stuff
        $(".train-schedule-container").hide();
        $(".add-train").show();

    });




    //when clicking the Current Train Schedule tab
    $("#train-schedule-menu").on("click", function (event) {

        //change the color of the tabs to orange and white
        $("#train-schedule-menu").css({ "background-color": "#ffffff", "color": "#777777" });
        $("#add-train-menu").css({ "background-color": "#E9967A", "color": "#EEF1F0" })


        //hide the Add Train stuff and show the current train schedule stuff
        $(".add-train").hide();
        $(".train-schedule-container").show();

        //refresh the table to get the most updated data
        location.reload();

    });

    //message to display when adding a new train
    var messageNewTrainAdded = function () {
        $("#message").show().delay(200).fadeIn();
        $("#message").hide().delay(1000).fadeOut();
    };


    //create function submitFirebase() that will check all fields have a correct value, submit to Firebase, and clear the values in the fields
    var submitFireBase = function () {
        event.preventDefault();

        var errors = 0;
        var message = "\nPlease add a ";

        if ($("#train-name-input").val().trim() == "") {
            errors++;
            message += "Train Name - "
        }

        if ($("#destination-input").val().trim() == "") {
            errors++;
            message += "Destination - "
        }

        if ($("#first-train-input").val().trim() == "" || $("#first-train-input").val().trim().length != 5) {
            errors++;
            message += "First Train Time correctly - "
        }

        if ($("#frequency-input").val().trim() == "") {
            errors++;
            message += "Frequency - "
        }



        if (errors > 0) {

            return $("#error-message").text(message);

        } else {

            // Grabs user input
            var trainName = $("#train-name-input").val().trim();
            var destination = $("#destination-input").val().trim();
            var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").format("X");
            var frequency = $("#frequency-input").val().trim();

            // Creates local "temporary" object for holding employee data
            var newTrain = {
                trainName: trainName,
                destination: destination,
                firstTrainTime: firstTrain,
                frequency: frequency
            };

            // Uploads employee data to the database
            database.ref("/Trains").push(newTrain);

            // Logs everything to console
            console.log(newTrain.trainName);
            console.log(newTrain.destination);
            console.log(newTrain.firstTrainTime);
            console.log(newTrain.frequency);

            // Clears all of the text-boxes
            $("#train-name-input").val("");
            $("#destination-input").val("");
            $("#first-train-input").val("");
            $("#frequency-input").val("");


            //if there was an error before, hide the error-message
            $("#error-message").hide();


            //Message saying that the train has been added
            messageNewTrainAdded();


        }
    };




    //When clicking the submit and add more trains button, call the function submitFirebase()
    $("#submit-and-more").on("click", function (event) {

        event.preventDefault();

        //Call the submitFirebase() function
        submitFireBase();

    });



    //When clicking the submit and add close button, call the function submitFirebase() and do the same things as the train-schedule-menu On Click event
    $("#submit-and-close").on("click", function (event) {

        event.preventDefault();

        //Call the submitFirebase() function
        submitFireBase();

        //change the color of the tabs to orange and white
        $("#train-schedule-menu").css({ "background-color": "#ffffff", "color": "#777777" });
        $("#add-train-menu").css({ "background-color": "#E9967A", "color": "#EEF1F0" })


        //hide the Add Train stuff and show the current train schedule stuff
        $(".add-train").hide();
        $(".train-schedule-container").show();

        //refresh the table to get the most updated data
        location.reload();

    });


});