$(function() {

    // QUESTIONS (by default the form starts by asking whether the request is a referral or not)
    // Will most likely need to be moved to a JSON file at some point in the near future
    var questionList = [
      {"key":"referral", "type": "option", "options": ["I'm referring someone else.", "This is personal."], "value": "Referral?", "helper": "Is this personal or are you referring someone else?",
        "followUpQuestions": [
          {"key":"name", "type": "text", "value": "Their Name", "helper": "What's their name?"},
          {"key":"referer_name", "type": "text", "value": "Your Name", "helper": "What's your name?"},
          {"key":"age", "type": "text", "value": "Their Age", "helper": "How old are they?"},
          {"key": "gender", "type": "option", "options": ["Female", "Male", "Non-binary"], "value": "Gender", "helper": "What gender do they identify as?"},
          {"key": "school", "type": "option", "options": ["Henry M. Gunn High School", "Palo Alto High School"], "value": "School Name", "helper": "What school do they attend?"},
          {"key": "contact", "value": "Their Contact", "helper": "What's the best way to reach them?"},
          {"key": "referer_contact", "value": "Your Contact", "helper": "What's the best way to reach you?"},
          {"key": "situation", "value": "Please Explain", "helper": "Please provide any additional information."}
        ]
      },
      {"key":"name", "value": "Your Name", "helper": "What's your name?"},
      {"key":"age", "value": "Your Age", "helper": "How old are you?"},
      {"key": "gender", "value": "Gender", "helper": "What gender do you identify as?"},
      {"key": "school", "value": "School Name", "helper": "What school do you attend?"},
      {"key": "contact", "value": "Your Contact", "helper": "What's the best way to reach you?"},
      {"key": "situation", "value": "Please Explain", "helper": "What thoughts are you having?"}

    ];


    // initialize standard form variables on page load
    var helper = $("#helper");
    var mainInput = [
        $("#mainField"),
        $("#mainOption")
    ];
    var placeholder = mainInput.attr("placeholder");
    var inputJSON = {};
    var currentQuestion = 0;
    var referral = false;

    // load initial question
    next();

    // Process current question and pull up next question
    function next() {
      if (questionList[currentQuestion].type == "option") {
        mainInput[0].css("display", "none");
        mainInput[1].css("display", "inline-block"); // show the element
      } else {
        mainInput[0].css("display", "inline-block");
        mainInput[1].css("display", "none");
      }

      var input = mainInput.val(); // grab main textfield input



      // decide whether the request is a referral or not
      if (currentQuestion == -1 && (input.toLowerCase() == "yes" || input.toLowerCase() == "y")) {
        referral = true;
        questionList = referralQuestionList;
      }

      inputJSON[currentQuestion !== -1 ? questionList[currentQuestion].key : "referral"] = currentQuestion !== -1 ? input : referral;

      // iteratively move through all of the questions
      if (currentQuestion < questionList.length-1) {
        currentQuestion++;
        helper.fadeOut(function() {
          helper.text(questionList[currentQuestion].helper);
          mainInput.val("").attr("placeholder", questionList[currentQuestion].value);
        }).fadeIn();
      } else {

        // once all of the questions have been completed, show the SUBMIT button
        helper.text("Hit \"Finish\" to complete.");
        mainInput.val("").hide();
        $("#mainFieldSubmit").hide();
        $("#submit").fadeIn();

      }
    }



    // Standard handlers for when the user hits return or "OK"
    $('.contact input').keyup(function(e){
      if (e.keyCode == 13 && mainInput.val().length !== 0) {
        next();
      }
    });

    $("#mainFieldSubmit").click(function() {
      if (mainInput.val().length !== 0) {
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
  });
