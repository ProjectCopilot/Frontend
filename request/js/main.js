$(function() {
    var helper = $("#helper");
    var mainInput = $("#mainField");
    var placeholder = mainInput.attr("placeholder");

    $('.contact input').keyup(function(e){
      if (e.keyCode == 13) {
          var input = mainInput.val();
      
      }
    });

    $("#mainFieldSubmit").click(function() {

    });

    // What happens when the submit button is clicked
    $('#submit').click(function() {
      var d = {
        "name": $(".contact input[name=name]").val(),
        "age": $("form input[name=age]").val(),
        "gender": $("form select[name=gender]").val(),
        "contactMethod": $("form select[name=preferredComm]").val(),
        "contact": $("form input[name=contact]").val(),
        "situation": $("form textarea[name=situation]").val()
      };

      $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/addUserRequest",
        data: d,
        error: function(err) { // I have no clue why, but the response gets passed through the error method
          if (err.status == 200) {
            $("#message").html('<span style="color:green;">Successfully submitted.</span>');
            $(".contact")[0].reset();
          } else {
            console.log(err);
            $("#message").html('<span style="color:red;">There was an error submitting.</span>');
          }
        },
        dataType: 'json',
      });

      return false;
    });
  });
