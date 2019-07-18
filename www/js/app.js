// Dom7
var $$ = Dom7;

Framework7.use(Framework7Keypad);

// Change below value
var HomeURL = 'http://tejoodemo.netcarrots.in';
var BaseURL = 'http://tejoodemo.netcarrots.in/api';
var AuthUsername = 'Tejoo';
var AuthPassword = 'Tejoo@123';

// Init App
var app = new Framework7({
  id: 'com.techstreet.tejoo',
  root: '#app',
  theme: 'md',
  name: 'Tejoo Fashions',
  view: {
    animate: true,
    xhrCache: false,
  },
  dialog: {
    title: 'Tejoo Fashions',
  },
  panel: {
    swipe: 'left',
    swipeOnlyClose: true,
  },
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/',
  on: {
    pageInit: function (page) {
      if (page.route.name == 'home') {
        app.request({
          url: 'plugins/CountryCodes.json',
          method: 'GET',
          success: function (data, status, xhr) {
            var parsed_data = JSON.parse(data);
            for (var i = 0; i < parsed_data.length; i++) {
              var name = parsed_data[i].name;
              var code = parsed_data[i].code;
              var dial_code = parsed_data[i].dial_code;
              var html = `<option value="${code}(${dial_code})">${name}</option>`;
              $$('#login-form select[name=Country]').append(html);
              $$('#login-form select[name=Country]').val('IN(+91)');
            }
          }
        })
      }
    },
    init: function (event, page) {
      var User = localStorage.User;
      if (User) {
        $$('#loginpage').hide();
        this.router.navigate({
          name: 'dashboard',
        });
      }
      else {
        $$('#loginpage').show();
        app.request({
          url: 'plugins/CountryCodes.json',
          method: 'GET',
          success: function (data, status, xhr) {
            var parsed_data = JSON.parse(data);
            for (var i = 0; i < parsed_data.length; i++) {
              var name = parsed_data[i].name;
              var code = parsed_data[i].code;
              var dial_code = parsed_data[i].dial_code;
              var html = `<option value="${code}(${dial_code})">${name}</option>`;
              $$('#login-form select[name=Country]').append(html);
              $$('#login-form select[name=Country]').val('IN(+91)');
            }
          }
        })
      }
    },
  }
});

function statusMessage(status) {
  if (status == 0) {
    return 'No Network connection';
  }
  else if (status == 500) {
    return 'Internal Server Error';
  }
  else if (status == 400) {
    return 'Bad Request';
  }
  else {
    return 'Something went wrong';
  }
}

function empty(val) {
  if (val == '' || val == null || val == 'undefined') {
    return true;
  }
  else {
    return false;
  }
}

function NA(input) {
  if (input == '' || input == null) {
    return 'NA';
  }
  else {
    return input;
  }
}

function zeroIFNULL(input) {
  if (input == null) {
    return '0';
  }
  else {
    return input;
  }
}

function inputActive() {
  $$('#login-form input[name=country_code]').parent('div').addClass('disabled-focus');
}
function inputDeactive() {
  $$('#login-form input[name=country_code]').parent('div').removeClass('disabled-focus');
}
function putCountryCode(dial_code) {
  var code_trim = dial_code.slice(0, -1);
  var code_arr = code_trim.split('(');
  $$('#login-form input[name=country_code]').val(code_arr[1]);
}


function login() {
  window.plugins.uniqueDeviceID.get(success, fail);
  function success(IMEINo) {
    var DeviceID = localStorage.fcm_token;
    if (!DeviceID) {
      DeviceID = 'null';
    }
    var Country = $$('#login-form select[name=Country]').val();
    var MobileNo = $$('#login-form input[name=MobileNo]').val();
    var EmailId = $$('#login-form input[name=EmailId]').val();
    var ExistingMember = $$('#login-form input[name=ExistingMember]:checked').val();

    var EmailRequired = false;
    if (Country != 'IN(+91)') {
      EmailRequired = true;
    }

    if (MobileNo == '') {
      app.dialog.alert("Please enter Mobile Number");
    }
    else if (EmailId == '' && EmailRequired == true) {
      app.dialog.alert("Please enter Email ID");
    }
    else {
      var obj = {
        Country: Country.slice(0, -1).split('(')[0],
        MobileNo: MobileNo,
        EmailId: EmailId,
        ExistingMember: ExistingMember,
        IMEINo: IMEINo,
        DeviceID: DeviceID,
        OSType: device.platform,
        OTP: '',
      };
      app.request({
        url: BaseURL + '/Login',
        method: 'POST',
        dataType: 'json',
        data: obj,
        contentType: 'application/json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Basic " + btoa(AuthUsername + ":" + AuthPassword));
          var spinnerOptions = { dimBackground: false };
          SpinnerPlugin.activityStart(null, spinnerOptions);
        },
        error: function (xhr, status) {
          alert(statusMessage(status));
        },
        success: function (data, status, xhr) {
          if (data.ErrorCode == '0') {
            app.router.navigate('/dashboard/');
          }
          else if (data.ErrorCode == '-3100' || data.ErrorCode == '-1038') {
            app.views.main.router.navigate('/otp/', {
              context: {
                login_form_data: JSON.stringify(obj),
              }
            });
          }
          else if (data.ErrorCode == '-3300') {
            app.dialog.alert(data.ErrorMessage, function () {
              app.views.main.router.navigate('/otp/', {
                context: {
                  login_form_data: JSON.stringify(obj),
                }
              });
            });
          }
          else {
            app.dialog.alert(data.ErrorMessage);
          }
        },
        complete: function (xhr, status) {
          SpinnerPlugin.activityStop();
        }
      })
    }
  };
  function fail(error) {
    console.log(error);
    var DeviceID = localStorage.fcm_token;
    if (!DeviceID) {
      DeviceID = 'null';
    }
    var Country = $$('#login-form select[name=Country]').val();
    var MobileNo = $$('#login-form input[name=MobileNo]').val();
    var EmailId = $$('#login-form input[name=EmailId]').val();
    //var ExistingMember = $$('#login-form input[name=ExistingMember]:checked').val();

    var EmailRequired = false;
    if (Country != 'IN(+91)') {
      EmailRequired = true;
    }

    if (MobileNo == '') {
      app.dialog.alert("Please enter Mobile Number");
    }
    else if (EmailId == '' && EmailRequired == true) {
      app.dialog.alert("Please enter Email ID");
    }
    else {
      var obj = {
        Country: Country.slice(0, -1).split('(')[0],
        MobileNo: MobileNo,
        EmailId: EmailId,
        ExistingMember: 'Yes',
        IMEINo: 'null',
        DeviceID: DeviceID,
        //OSType: device.platform,
        OSType: 'android',
        OTP: '',
      };
      console.log(obj);
      app.request({
        url: BaseURL + '/Login',
        method: 'POST',
        dataType: 'json',
        data: obj,
        contentType: 'application/json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Basic " + btoa(AuthUsername + ":" + AuthPassword));
          var spinnerOptions = { dimBackground: false };
          SpinnerPlugin.activityStart(null, spinnerOptions);
        },
        error: function (xhr, status) {
          console.log(status);
          alert(statusMessage(status));
        },
        success: function (data, status, xhr) {
          console.log(data);
          if (data.ErrorCode == '0') {
            app.router.navigate('/dashboard/');
          }
          else if (data.ErrorCode == '-3100' || data.ErrorCode == '-1038') {
            app.views.main.router.navigate('/otp/', {
              context: {
                login_form_data: JSON.stringify(obj),
              }
            });
          }
          else if (data.ErrorCode == '-3300') {
            app.dialog.alert(data.ErrorMessage, function () {
              app.views.main.router.navigate('/otp/', {
                context: {
                  login_form_data: JSON.stringify(obj),
                }
              });
            });
          }
          else {
            app.dialog.alert(data.ErrorMessage);
          }
        },
        complete: function (xhr, status) {
          SpinnerPlugin.activityStop();
        }
      })
    }
  };
}

// logout
function logout() {
  localStorage.removeItem("User");
  app.views.main.router.navigate('/', {
    ignoreCache: true,
    reloadCurrent: true,
  });
}

// key press
$$('.input-end').keypress(function (e) {
  if (e.keyCode == 13) {
    this.blur();
  }
});