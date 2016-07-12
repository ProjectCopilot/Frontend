  // Project Copilot Concierge Client
  // Copyright 2016 Project Copilot

  // Contact information validation helper methods
  var contactValidate = {
    email: function(mail) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
      {
        return true;
      }
        return false;
    },
    phone: function(phone) {
      return phoneUtils.isValidNumber(phone, "US");
    }
  }

    // QUESTIONS (by default the form starts by asking whether the request is a referral or not)
    // Will most likely need to be moved to a JSON file at some point in the near future
    var questionList = [
      {"key":"referral", "type": "option", "options": ["Yes", "No"], "value": "Referral?", "helper": "Is this personal or are you referring someone else?",
        "followUpValue": "Yes", "followUpQuestions": [
          {"key":"name", "type": "text", "value": "Their Name", "helper": "What's their name?", "followUpValue": "NONE"},
          {"key":"referer_name", "type": "text", "value": "Your Name", "helper": "What's your name?", "followUpValue": "NONE"},
          {"key":"age", "type": "text", "value": "Their Age", "helper": "How old are they?", "followUpValue": "NONE"},
          {"key": "gender", "type": "option", "options": ["Female", "Male", "Non-binary"], "value": "Gender", "helper": "What gender do they identify as?", "followUpValue": "NONE"},
          {"key": "school", "type": "option", "options": ["Henry M. Gunn High School", "Palo Alto High School"], "value": "School Name", "helper": "What school do they attend?", "followUpValue": "NONE"},
          {"key": "contactMethod", "type": "option", "options": ["SMS", "Email"], "value": "Preferred Contact", "helper": "What's the best way to reach them?", "followUpValue": "NONE"},
          {"key": "contact", "value": "Their Contact", "helper": "What's the best way to reach them?", "followUpValue": "NONE"},
          {"key": "referer_contactMethod", "type": "option", "options": ["SMS", "Email"], "value": "Preferred Contact", "helper": "What's the best way to reach you?", "followUpValue": "NONE"},
          {"key": "referer_contact", "value": "Your Contact", "helper": "What's the best way to reach you?", "followUpValue": "NONE"},
          {"key": "situation", "value": "Please Explain", "helper": "Please provide any additional information.", "followUpValue": "NONE"}
        ]
      },
      {"key":"name", "type": "text", "value": "Your Name", "helper": "What's your name?", "followUpValue": "NONE"},
      {"key":"age", "type": "text", "value": "Your Age", "helper": "How old are you?", "followUpValue": "NONE"},
      {"key": "gender", "type": "option", "options": ["Female", "Male", "Non-binary"], "value": "Gender", "helper": "What gender do you identify as?", "followUpValue": "NONE"},
      {"key": "school", "type": "option", "options": ["Henry M. Gunn High School", "Palo Alto High School"], "value": "School Name", "helper": "What school do you attend?", "followUpValue": "NONE"},
      {"key": "contactMethod", "type": "option", "options": ["SMS", "Email"], "value": "Preferred Contact", "helper": "What's the best way to reach you?", "followUpValue": "NONE"},
      {"key": "contact", "type": "text", "value": "Your Contact", "helper": "What's the best way to reach you?", "followUpValue": "NONE"},
      {"key": "situation", "value": "Please Explain", "helper": "What thoughts are you having?", "followUpValue": "NONE"}
    ];


    // initialize standard form variables on page load
    var helper = $("#helper");
    var mainInput = [
        $("#mainField"),
        $("#mainOption")
    ];
    var inputJSON = {};
    var questionQueue = [];
    for (var j = 0; j < questionList.length; j++) {
      questionQueue.push(questionList[j]);
    }
    var currentQuestion = 0;
    var ix = questionQueue[currentQuestion].type == "option" ? 1 : 0;
    var referral = false;

    // Process current question and pull up next question
    function next() {

      helper.fadeOut(function() {
        helper.text(questionQueue[currentQuestion].helper);
        // Is the question type an option or a textfield?
        ix = questionQueue[currentQuestion].type == "option" ? 1 : 0;

        if (ix == 1) {
          mainInput[0].css("display", "none");
          mainInput[1].css("display", "inline-block"); // show the element
          $("#mainOption").html("<option value=\"\" id=\"optionHelper\" disabled selected>Option Placeholder</option>");
          $("#optionHelper").text(questionQueue[currentQuestion].value);
          for (var i = 0; i < questionQueue[currentQuestion].options.length; i++) {
            mainInput[ix].append('<option value="'+questionQueue[currentQuestion].options[i]+'">'+questionQueue[currentQuestion].options[i]+'</option>');
          }
        } else {
          mainInput[0].css("display", "inline-block");
          mainInput[1].css("display", "none");
          mainInput[ix].val("").attr("placeholder", questionQueue[currentQuestion].value);

        }

      }).fadeIn();


      var input = mainInput[ix].val();


      inputJSON[questionQueue[currentQuestion].key] = input;

      // iteratively move through all of the questions
      // if (currentQuestion < questionQueue.length-1) {
        if (mainInput[ix].val() == questionQueue[currentQuestion].followUpValue && questionQueue[currentQuestion].followUpValue !== "NONE") {

          var followUpArray = questionQueue[currentQuestion].followUpQuestions;
          questionQueue.length = 0; // wipe array
          for (var k = 0; k < followUpArray.length; k++) {
              questionQueue.push(followUpArray[k]);
          }

          currentQuestion = 0;

        } else {
          if (mainInput[1].val() !== null || mainInput[0].val() !== "") currentQuestion++;
        }

        // helper.fadeOut(function() {
        //   helper.text(questionList[currentQuestion].helper);
        //   mainInput.val("").attr("placeholder", questionList[currentQuestion].value);
        // }).fadeIn();
      // } else {

        // // once all of the questions have been completed, show the SUBMIT button
        // helper.text("Hit \"Finish\" to complete.");
        // mainInput.val("").hide();
        // $("#mainFieldSubmit").hide();
        // $("#submit").fadeIn();

      // }
    }


    // load initial question
    next();


    // Standard handlers for when the user hits return or "OK"
    $('.contact input').keyup(function(e){
      // var ix = questionQueue[currentQuestion].type == "option" ? 1 : 0;
      if (e.keyCode == 13 && mainInput[ix].val().length !== 0) {
        next();
      }
    });

    $("#mainFieldSubmit").click(function() {
        if (mainInput[ix].val().length !== 0) {
          next();
        }
    });



    // SUBMIT button is clicked: Sends form data off to the server.
    $('#submit').click(function() {
      console.log(inputJSON);

      // make the call
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/addUserRequest",
        data: inputJSON,
        error: function(err) { // Not sure why, but the response always gets passed through the error method (even if it was successful)
          if (err.status == 200) { // if everything's all good, then fade everything out and redirect to the beginning of the form
            helper.text("Successfully submitted.");
            setTimeout(function() {
                $("body").fadeOut(function() {
                  location.href = "/";
                });
            }, 1000);
          } else { // something bad happened
            console.log(err);
            helper.html("There was an error submitting. Try again later.");
          }
        },
        dataType: 'json',
      });

      return false;
    });
