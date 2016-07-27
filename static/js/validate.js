// Project Copilot Concierge -- validate.js
// Set of validation functions to help parse and clean up form input
// Copyright 2016 Project Copilot

var validate = {
  email: function(mail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  },
  phone: function(phone) {
    try {
      return phoneUtils.isValidNumber(phone, "US");
    } catch (err) {
      return false;
    }
  },
  contact: function(type, c) {
    return type.toLowerCase() == "sms" ? validate["phone"](c) : validate["email"](c);
  },
  string: function(s) {
    return typeof s == "string" && s.length !== 0 ? true : false;
  },
  number: function(n) {
    return isNaN(parseInt(n, 10)) ? false : true;
  }
}
