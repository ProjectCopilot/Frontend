$(function() {
    $("#submit").css("display", "none");

    var referralQuestionList = [
      {"key":"name", "value": "Their Name", "helper": "What's their name?"},
      {"key":"referer_name", "value": "Your Name", "helper": "What's your name?"},
      {"key":"age", "value": "Their Age", "helper": "How old are they?"},
      {"key": "gender", "value": "Gender", "helper": "What gender do they identify as?"},
      {"key": "school", "value": "School Name", "helper": "What school do they attend?"},
      {"key": "contact", "value": "Their Contact", "helper": "What's the best way to reach them?"},
      {"key": "referer_contact", "value": "Your Contact", "helper": "What's the best way to reach you?"},
      {"key": "situation", "value": "Please Explain", "helper": "Please provide any additional information."}
    ]
    var individualQuestionList = [
      {"key":"name", "value": "Your Name", "helper": "What's your name?"},
      {"key":"age", "value": "Your Age", "helper": "How old are you?"},
      {"key": "gender", "value": "Gender", "helper": "What gender do you identify as?"},
      {"key": "school", "value": "School Name", "helper": "What school do you attend?"},
      {"key": "contact", "value": "Your Contact", "helper": "What's the best way to reach you?"},
      {"key": "situation", "value": "Please Explain", "helper": "What thoughts are you having?"} // definitely rephrase
    ];

    var helper = $("#helper");
    var mainInput = $("#mainField");
    var questionList = individualQuestionList;
    var placeholder = mainInput.attr("placeholder");
    var inputJSON = {};
    var currentQuestion = -1;
    var referral = false;

    // Process current question and pull up next question
    function next() {
      var input = mainInput.val();

      if (currentQuestion == -1 && (input.toLowerCase() == "yes" || input.toLowerCase() == "y")) {
        referral = true;
        questionList = referralQuestionList;
      }

      inputJSON[currentQuestion !== -1 ? questionList[currentQuestion].key : "referral"] = currentQuestion !== -1 ? input : referral;

      if (currentQuestion < questionList.length-1) {
        currentQuestion++;
        helper.fadeOut(function() {
          helper.text(questionList[currentQuestion].helper);
          mainInput.val("").attr("placeholder", questionList[currentQuestion].value);
        }).fadeIn();
      } else {
        helper.text("Hit \"Finish\" to complete.");
        mainInput.val("").hide();
        $("#mainFieldSubmit").hide();
        $("#submit").fadeIn();

      }
    }




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



    // What happens when the submit button is clicked
    $('#submit').click(function() {
      console.log(inputJSON);

      $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/addUserRequest",
        data: inputJSON,
        error: function(err) { // I have no clue why, but the response gets passed through the error method
          if (err.status == 200) {
            helper.text("Successfully submitted.");
          } else {
            console.log(err);
            helper.html("There was an error submitting. Try again later.");
          }
        },
        dataType: 'json',
      });

      return false;
    });
  });
