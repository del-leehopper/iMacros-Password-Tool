// validate input parameters
function validateParameters(params) {
    try {
        var validator = document.getElementById("validator");
        validator.removeAttribute("show");
        validator.style.display = "none"; // IE CSS display bug workaround
        var ol = document.getElementById("error-list");
        var errors = ol.getElementsByTagName("li");
        while(errors.length) {
            ol.removeChild(errors[0]);
            errors = ol.getElementsByTagName("li");
        }

        var ok = true;
        for (var x = 0; x < params.length; x++) {
            if (!params[x].validate()) {
                if (params[x].element.getAttribute("invalid") == "true")
                    continue;
                if (ok) params[x].element.focus();
                ok = false;
                validator.setAttribute("show", "true");
                validator.style.display = "block";
                params[x].element.setAttribute("invalid", "true");
                var li = document.createElement("li");
                ol.appendChild(li);
                li.setAttribute("class", "invalid-element");
                li.appendChild(document.createTextNode(params[x].msg));
                validator.appendChild(ol);
            } else {
                params[x].element.removeAttribute("invalid");
            }
        }
        return ok;
    } catch (e) {
        alert(e);
    }
}

// encrypt handler
function onEncrypt() {
    try {
        var password = document.getElementById("master-password-input");
        var plaintext = document.getElementById("encrypt-input");
        var params = [{ msg: "Master password should have at least three non-whitespace chars",
                        element: password,
                        validate: function () {
                          return trimString(this.element.value).length >= 3;
                        }
                      },
                      { msg: "Text to encrypt can not be empty",
                        element: plaintext,
                        validate: function() { return !!this.element.value;}
                      }
                      ];
        var ok = validateParameters(params);
                                
        if (!ok)
            return;
        var result = document.getElementById("result");
        result.value = encryptData(plaintext.value, password.value);
    } catch (e) {
        alert(e);
    }
}




// decrypt handler
function onDecrypt() {
    try {
        var password = document.getElementById("master-password-input");
        var ciphertext = document.getElementById("decrypt-input");
        var params = [
                      { msg: "Master password can not be empty",
                        element: password,
                        validate: function () { return !!this.element.value; }
                      },
                      { msg: "Text to decrypt can not be empty",
                        element: ciphertext,
                        validate: function() { return !!this.element.value;}
                      },
                      { msg: "Text to decrypt must be Base64 or HEX encoded",
                        element: ciphertext,
                        validate: function() {
                            return /^\s*(?:[0-9a-f][0-9a-f])+\s*$/i.test(this.element.value) ||
                                /^\s*[A-Za-z0-9\+\/\=]+\s*$/.test(this.element.value);
                          }
                      }
                      ];
        var ok = validateParameters(params);
        if (!ok)
            return;
        var result = document.getElementById("result");
        try {
            result.value = decryptData(ciphertext.value, password.value);
        } catch(x) {
            alert(x);
            result.value = "";
        }
    } catch (e) {
        alert(e);
    }
}


function RuntimeError(msg, num) {
    this.message = msg;
    if (typeof num != "undefined")
        this.errnum = num;
    this.name = "RuntimeError";
}

RuntimeError.prototype = Error.prototype;



// trim string
function trimString(s) {
    return s.replace(/^\s+/, "").replace(/\s+$/, "");
}

// encrypt data using given password
function encryptData( data, password ) {
    // trim input data and password
    data = trimString(data);
    password = trimString(password);
    return Rijndael.encryptString(data, password);
}


// decript data using password
function decryptData( sdata, password ) {
    // trim input data
    sdata = trimString(sdata);
    password = trimString(password);
    return Rijndael.decryptString(sdata, password);
}

