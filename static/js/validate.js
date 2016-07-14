// Project Copilot Concierge -- validate.js
// Set of validation functions to help parse and clean up form input
// Copyright 2016 Project Copilot

var validate = {
  email: function(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
      return true;
    }
      return false;
  },
  phone: function(phone) {
    return phoneUtils.isValidNumber(phone, "US");
  },
  string: function(s) {
    return typeof s == "string" ? true : false;
  },
  number: function(n) {
    return isNaN(parseInt(n, 10)) ? false : true;
  }
}
