"use strict";
  // Project Copilot Concierge Client
  // Copyright 2016 Project Copilot

    // Load questions
    $.getJSON("data/questions.json", function (questionList) {

          // initialize standard form variables on page load
          var helper = $("#helper");
          var mainInput = [
              $("#mainField"),
              $("#mainOption"),
              $("#mainTextArea")
          ];
          var inputJSON = {};
          var questionQueue = questionList.slice();
          var backStack = [];
          var currentQuestion = 0;
          var queueLength = questionQueue.length;
          var ix = getInputIndex(questionQueue[currentQuestion].type);
          var q_prev = '';
          var current = {};
          var prev = {};

          // return ix given type
          function getInputIndex(type) {
            if (type === "option") {
              return 1;
            } else if (type === "textarea") {
              return 2;
            } else {
              return 0;
            }
          }


          // Process current question and pull up next question
          function next() {

            helper.fadeOut(function() {
              if (currentQuestion < queueLength) {
                helper.text(questionQueue[currentQuestion].helper);

                  // q_prev = currentQuestion !== 0 || _.isEqual(questionList, questionQueue) ? q_prev : "NONE";

                  var backObject = questionQueue[currentQuestion];
                  backObject["queue"] = questionQueue.slice();
                  // console.log("Next", questionQueue);
                  backObject["currentIndex"] = currentQuestion;
                  backObject["previousValue"] = q_prev;
                  backStack.push(backObject);

                // Is the question type an option or a textfield?
                ix = getInputIndex(questionQueue[currentQuestion].type);
                // console.log(currentQuestion, questionQueue[currentQuestion].type, ix);

                queueLength = questionQueue.length;

                if (ix == 1) {
                  mainInput[0].css("display", "none");
                  mainInput[1].css("display", "inline-block");
                  mainInput[2].css("display", "none");
                  $("#mainOption").html("<option value=\"\" id=\"optionHelper\" disabled selected>Option Placeholder</option>");
                  $("#optionHelper").text(questionQueue[currentQuestion].value);
                  for (var i = 0; i < questionQueue[currentQuestion].options.length; i++) {
                    mainInput[ix].append('<option value="'+questionQueue[currentQuestion].options[i]+'">'+questionQueue[currentQuestion].options[i]+'</option>');
                  }
                } else if (ix == 0) {
                  mainInput[0].css("display", "inline-block");
                  mainInput[1].css("display", "none");
                  mainInput[2].css("display", "none");
                  mainInput[ix].val("").attr("placeholder", questionQueue[currentQuestion].value);

                } else if (ix == 2) {
                  mainInput[2].css("display", "block");
                  mainInput[0].css("display", "none");
                  mainInput[1].css("display", "none");
                  mainInput[ix].val("").attr("placeholder", questionQueue[currentQuestion].value);
                }

              } else {
                helper.text("Hit \"Finish\" to complete.");
                mainInput[ix].val("").hide();
                $("#mainFieldSubmit").hide();
                $("#submit").fadeIn();

                var backObject = questionQueue[currentQuestion] ? questionQueue[currentQuestion] : {"key": "finish"};
                backObject["queue"] = questionQueue.slice();
                backObject["currentIndex"] = currentQuestion;
                backObject["previousValue"] = q_prev;
                backStack.push(backObject);
              }



            }).fadeIn();



            var input = mainInput[ix].val();

            q_prev = input;

            // add data to inputJSON, the object that will eventually be sent up to the server
            inputJSON[questionQueue[currentQuestion].key] = input;

            // iteratively move through all of the questions
            if (mainInput[ix].val() == questionQueue[currentQuestion].followUpValue && questionQueue[currentQuestion].followUpValue !== "NONE") {
              var followUpArray = questionQueue[currentQuestion].followUpQuestions.slice();

              questionQueue.length = 0; // wipe array
              questionQueue = followUpArray.slice();

              currentQuestion = 0;

            } else {
              if (mainInput[1].val() !== null || mainInput[0].val() !== "") currentQuestion++;
            }


          }


          // How to go back in time (without having to go 88 mph)
          function back() {
            // the LAST object on the backstack is the current question
            current = backStack[backStack.length-1]; // grab last object
            backStack.pop(); // remove it
            prev = backStack[backStack.length-1]; // get the previous object
            ix = getInputIndex(prev.type);
            currentQuestion = prev.currentIndex;
            questionQueue = prev.queue.slice();

            helper.text(prev.helper);

            if (ix == 1) {
              mainInput[0].css("display", "none");
              mainInput[1].css("display", "inline-block");
              mainInput[2].css("display", "none");
              $("#mainOption").html("<option value=\"\" id=\"optionHelper\" disabled selected>Option Placeholder</option>");
              $("#optionHelper").text(prev.value);
              for (var i = 0; i < prev.options.length; i++) {
                mainInput[ix].append('<option value="'+prev.options[i]+'">'+prev.options[i]+'</option>');
              }
              $("#mainOption").val(current.previousValue);
              $("#mainFieldSubmit").show();
              $("#submit").hide();

            } else if (ix == 0) {
              mainInput[0].css("display", "inline-block");
              mainInput[1].css("display", "none");
              mainInput[2].css("display", "none");
              mainInput[ix].val(current.previousValue).attr("placeholder", prev.value);
              $("#mainFieldSubmit").show();
              $("#submit").hide();

            } else if (ix == 2) {
              mainInput[2].css("display", "block");
              mainInput[0].css("display", "none");
              mainInput[1].css("display", "none");
              mainInput[ix].val(current.previousValue).attr("placeholder", prev.value);
              $("#mainFieldSubmit").show();
              $("#submit").hide();
            }



          }





          // load initial question
          next();




          // Standard handlers for when the user hits return or "OK"
          $('.contact input').keyup(function(e){
            if (e.keyCode == 13 && mainInput[ix].val().length !== 0) {
              next();
            }
          });

          $("#mainFieldSubmit").click(function() {
              if (mainInput[ix].val() !== '' && mainInput[ix].val() !== null) {
                next();
              }
          });

          // Back button handler
          $(".contact #backButton").click(function() {
            back();
          });




          // SUBMIT button is clicked: Sends form data off to the server.
          $('#submit').click(function() {
            console.log(inputJSON);

            // make the call
            $.ajax({
              type: "POST",
              url: "http://localhost:3000/api/addUserRequest",
              data: inputJSON,
              error: function(err) { // Something went wrong
                console.log(err);
                helper.html("There was an error submitting. Try again later.");
              },
              success: function() { // if everything's all good, then fade everything out and redirect to the beginning of the form
                helper.text("Successfully submitted.");
                setTimeout(function() {
                    $("body").fadeOut(function() {
                      location.href = "/";
                    });
                }, 1000);
              },
              dataType: 'html',
            });

            return false;
          });

    });
