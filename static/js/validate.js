// Project Copilot Concierge -- validate.js
// Set of validation functions to help parse and clean up form input
// Copyright 2016 Project Copilot

const validate = {
  email(mail) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  },
  phone(phone) {
    try {
      return phoneUtils.isValidNumber(phone, 'US');
    } catch (err) {
      return false;
    }
  },
  contact(type, c) {
    return type.toLowerCase() == 'sms' ? validate['phone'](c) : validate['email'](c);
  },
  string(s) {
    return typeof s == 'string' && s.length !== 0 ? true : false;
  },
  number(n) {
    return isNaN(parseInt(n, 10)) ? false : true;
  },
};
