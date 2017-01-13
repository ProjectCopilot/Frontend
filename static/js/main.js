  'use strict';

  // Project Copilot Concierge Client
  // Copyright 2016 Project Copilot

  const HOSTNAME = '{HOSTNAME}';
  const PORT = '{PORT}';

    // Load questions
  $.getJSON('data/questions.json', function (questionList) {
          // initialize standard form variables on page load
    const helper = $('#helper');
    const mainInput = [
      $('#mainField'),
      $('#mainOption'),
      $('#mainTextArea'),
    ];
    const inputJSON = {};
    let questionQueue = questionList.slice();
    const backStack = [];
    let currentQuestion = 0;
    let q_count = -1;
    let queueLength = questionQueue.length;
    let ix = getInputIndex(questionQueue[currentQuestion].type);
    let q_prev = '';
    let current = {};
    let prev = {};


          // return ix given type
    function getInputIndex(type) {
      if (type === 'option') {
        return 1;
      } else if (type === 'textarea') {
        return 2;
      } else {
        return 0;
      }
    }

    function validateQuestion(question, value) {
      let valid = false;
      if (question.validator == 'contact') {
        valid = validate[question.validator](inputJSON[question.key == 'referer_contact' ? 'referer_contactMethod' : 'contactMethod'], value);
      } else {
        valid = question.validator in validate ? validate[question.validator](value) : false;
      }

      return valid;
    }


          // Process current question and pull up next question
    function next() {
      helper.fadeOut(200, function () {
        if (currentQuestion < queueLength) {
          if (q_count > -1) $('#backButton').css('display', 'inline-block');
          q_count++;

          helper.text(questionQueue[currentQuestion].helper);

          var backObject = questionQueue[currentQuestion];
          backObject['queue'] = questionQueue.slice();

          backObject['currentIndex'] = currentQuestion;
          backObject['previousValue'] = q_prev;
          backStack.push(backObject);

                // Is the question type an option or a textfield?
          ix = getInputIndex(questionQueue[currentQuestion].type);

          queueLength = questionQueue.length;

          $('#mainFieldSubmit').show();

          if (ix == 1) {
            mainInput[0].css('display', 'none');
            mainInput[1].css('display', 'inline-block');
            mainInput[2].css('display', 'none');
            $('#mainOption').html('<option value="" id="optionHelper" disabled selected>Option Placeholder</option>');
            $('#optionHelper').text(questionQueue[currentQuestion].value);
            for (let i = 0; i < questionQueue[currentQuestion].options.length; i++) {
              mainInput[ix].append('<option value="' + questionQueue[currentQuestion].options[i] + '">' + questionQueue[currentQuestion].options[i] + '</option>');
            }

            if (questionQueue[currentQuestion].key in inputJSON) mainInput[ix].val(inputJSON[questionQueue[currentQuestion].key]);
          } else if (ix == 0) {
            mainInput[0].css('display', 'inline-block');
            mainInput[1].css('display', 'none');
            mainInput[2].css('display', 'none');
            mainInput[ix].val('').attr('placeholder', questionQueue[currentQuestion].value);

            if (questionQueue[currentQuestion].key in inputJSON) mainInput[ix].val(inputJSON[questionQueue[currentQuestion].key]);
          } else if (ix == 2) {
            mainInput[2].css('display', 'block');
            mainInput[0].css('display', 'none');
            mainInput[1].css('display', 'none');
            mainInput[ix].val('').attr('placeholder', questionQueue[currentQuestion].value);

            if (questionQueue[currentQuestion].key in inputJSON) mainInput[ix].val(inputJSON[questionQueue[currentQuestion].key]);
          }
        } else {
          helper.text('Hit "Finish" to complete.');
          mainInput[ix].val('').hide();
          $('#mainFieldSubmit').hide();
          $('#submit').fadeIn();

          var backObject = questionQueue[currentQuestion] ? questionQueue[currentQuestion] : { 'key': 'finish' };
          backObject['queue'] = questionQueue.slice();
          backObject['currentIndex'] = currentQuestion;
          backObject['previousValue'] = q_prev;
          backStack.push(backObject);
        }
      }).fadeIn(200);


      const input = mainInput[ix].val();


      q_prev = input;

            // add data to inputJSON, the object that will eventually be sent up to the server
      inputJSON[questionQueue[currentQuestion].key] = input;

            // iteratively move through all of the questions
      if (mainInput[ix].val() == questionQueue[currentQuestion].followUpValue && questionQueue[currentQuestion].followUpValue !== 'NONE') {
        const followUpArray = questionQueue[currentQuestion].followUpQuestions.slice();

        questionQueue.length = 0; // wipe array
        questionQueue = followUpArray.slice();

        currentQuestion = 0;
      } else {
        if (mainInput[1].val() !== null || mainInput[0].val() !== '') currentQuestion++;
      }
    }


          // How to go back in time (without having to go 88 mph)
    function back() {
      if (q_count > 0) {
        q_count--;

        if (q_count == 0) {
          $('#backButton').css('display', 'none');
        }

              // the LAST object on the backstack is the current question
        current = backStack[backStack.length - 1]; // grab last object
        backStack.pop(); // remove it
        prev = backStack[backStack.length - 1]; // get the previous object
        ix = getInputIndex(prev.type);
        currentQuestion = prev.currentIndex;
        questionQueue = prev.queue.slice();

        helper.fadeOut(200, function() {
          helper.text(prev.helper);
        }).fadeIn(200);

        if (ix == 1) {
          mainInput[0].css('display', 'none');
          mainInput[1].css('display', 'inline-block');
          mainInput[2].css('display', 'none');
          $('#mainOption').html('<option value="" id="optionHelper" disabled selected>Option Placeholder</option>');
          $('#optionHelper').text(prev.value);
          for (let i = 0; i < prev.options.length; i++) {
            mainInput[ix].append('<option value="' + prev.options[i] + '">' + prev.options[i] + '</option>');
          }
          $('#mainOption').val(current.previousValue);
          $('#mainFieldSubmit').show();
          $('#submit').hide();
        } else if (ix == 0) {
          mainInput[0].css('display', 'inline-block');
          mainInput[1].css('display', 'none');
          mainInput[2].css('display', 'none');
          mainInput[ix].val(current.previousValue).attr('placeholder', prev.value);
          $('#mainFieldSubmit').show();
          $('#submit').hide();
        } else if (ix == 2) {
          mainInput[2].css('display', 'block');
          mainInput[0].css('display', 'none');
          mainInput[1].css('display', 'none');
          mainInput[ix].val(current.previousValue).attr('placeholder', prev.value);
          $('#mainFieldSubmit').show();
          $('#submit').hide();
        }
      }
    }


          // load initial question
    next();


          // Standard handlers for when the user hits return or "OK"
    $('.contact input').keyup(function (e) {
      if (validateQuestion(questionQueue[currentQuestion], mainInput[ix].val())) {
        mainInput[ix].css('border-bottom', '2px solid #3498db');
        mainInput[ix].css('color', '#3498db');
      } else {
        mainInput[ix].css('border-bottom', '2px solid #e74c3c');
        mainInput[ix].css('color', '#e74c3c');
      }

      if (e.keyCode == 13) {
        if (validateQuestion(questionQueue[currentQuestion], mainInput[ix].val())) {
          $('.feedbackMessage').fadeOut(100, function () {
            $(this).css('display', 'none');
            mainInput[ix].css('border-bottom', '2px solid #3498db');
            mainInput[ix].css('color', '#3498db');
          });
          next();
        } else {
          $('.feedbackMessage').fadeIn(100);
          $('.feedback').text('Invalid ' + questionQueue[currentQuestion].key + '.');
          mainInput[ix].css('border-bottom', '2px solid #e74c3c');
          mainInput[ix].css('color', '#e74c3c');
        }
      }
    });

    $('#mainFieldSubmit').click(function () {
      if (validateQuestion(questionQueue[currentQuestion], mainInput[ix].val())) {
        $('.feedbackMessage').fadeOut(function () {
          $(this).css('display', 'none');
          mainInput[ix].css('border-bottom', '2px solid #3498db');
          mainInput[ix].css('color', '#3498db');
        });
        next();
      } else {
        $('.feedbackMessage').fadeIn(100);
        $('.feedback').text('Invalid ' + questionQueue[currentQuestion].key + '.');
        mainInput[ix].css('border-bottom', '2px solid #e74c3c');
        mainInput[ix].css('color', '#e74c3c');
      }
    });

          // Back button handler
    $('.contact #backButton').click(function () {
      back();
    });


          // SUBMIT button is clicked: Sends form data off to the server.
    $('#submit').click(function () {
      console.log(inputJSON);

            // make the call
      $.ajax({
        type: 'POST',
        url: 'http://' + HOSTNAME + ':' + PORT + '/api/addUserRequest',
        data: inputJSON,
        error(err) { // Something went wrong
          console.log(err.status);
          if (err.status == 409) { // duplicate entry sent
            helper.text('A request has already been submitted. We will be in touch shortly.');
          } else if (err.status == 500) { // server down
            helper.text('Server error. Please try again later.');
          }
        },
        success() { // if everything's all good, then fade everything out and redirect to the beginning of the form
          helper.text('Successfully submitted.');
          setTimeout(function () {
            $('body').fadeOut(function () {
              location.href = '/';
            });
          }, 1000);
        },
        dataType: 'html',
      });

      return false;
    });
  });
