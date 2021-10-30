var account;
var spinner = document.getElementById("spinner");

function getValue(html_id) {
    return document.getElementById(html_id).value;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function autherror() {
    document.getElementById("auth_error").style.display = "inherit";
    setTimeout(function() {
        document.getElementById("auth_error").style.display = "none";
    }, 1500);
}

document.getElementById("auth").onclick = async function() {
    await authenticate(getValue("auth_entry"), function(status) {
        if (status == true) {
            $("#authmodal").modal("hide");
            setCookie("auth", getValue("auth_entry"), 30);
            loadData();
        } else {
            autherror();
        }
    });
}

async function authenticate(pincode, callback) {
    console.log(pincode);
    axios.post(
        "https://brixybot.bubbleapps.io/version-test/api/1.1/wf/BANK_AUTH",
        {
            pin: pincode
        }
    ).then(response => {
        callback(response.data.response.authenticated);
    });
}

async function loadData() {
    spinner.style.display = "inherit";
    
    var acc;
    axios.post(
        "https://brixybot.bubbleapps.io/version-test/api/1.1/wf/bank_data",
        {
            pin: getCookie("auth")
        }
    ).then(response => {
        acc = response.data.response.user;
        
        if (acc.name) {
            account = acc;
            
            if (acc.balance == 0) {
                acc.balance = parseInt(0);
            }
            
            if (acc.banned == true) {
                document.getElementById("htmlbody").innerHTML = `
                    <h1 class="text-danger">Your account has been deleted</h1>
                        <hr />
                        <p style="margin-bottom: 10px;">This may be because of one of the following:</p>
                        <ul>
                            <li>Money laundering</li>
                            <li>Abuse of our system</li>
                            <li>Impersonation</li>
                            <li>Unrecoverable debt</li>
                        </ul>
                        <p style="margin-bottom: 10px;">If you believe this action was a mistake, you can always contact us at the bank.</p>
                `;
            }
            
            var uu = uuid.v4();
            uu = uu.substring(25);

            document.getElementById("iron").innerHTML = acc.balance + " iron";
            document.getElementById("welcome").innerHTML = "Welcome, <strong>" + acc.name + "</strong>";
            document.getElementById("acc-info").innerHTML = `
                <div id="acc-info" style="display: flex;">
                    <div>
                        <p style="margin-bottom: 3px;">Account Name <strong>${acc.name}</strong></p>
                        <p style="margin-bottom: 3px;">Account ID <strong>${acc._id.substring(6, acc._id.indexOf("x"))}</strong></p>
                        <p style="margin-bottom: 0px;">Session ID <strong>${uu}</strong></p>
                    </div>
                    <div style="margin-left: 30px;">
                        <p style="margin-bottom: 3px;">Pincode <strong>****${acc.pincode.substring(4)}</strong></p>
                    </div>
                </div>
            `;

            var append = [];
            response.data.response.transactions.forEach(transact => {
                var data = `
                    <tr>
                        <td>${transact._id.substring(6, transact._id.indexOf("x"))}</td>
                        <td>${transact.to}</td>
                        <td>${transact.memo}</td>
                        <td>${transact.type}</td>
                        <td>${transact.amount}</td>
                    </tr>
                `;
                
                append.push(data);
            });
            
            document.getElementById("transactions").innerHTML = append.reverse().join("\n");
            
            if (parseInt(acc.balance) < 0) {
                document.getElementById("debt").style.display = "inherit";
            } else {
                document.getElementById("debt").style.display = "none";
            }
            
            if (account.moderator == true) {
                document.getElementById("taxviewbtn").style.display = "inherit";
            }
            
            spinner.style.display = "none";
            
            renderNews();
            renderOnlineUsers();
        } else {
            $("#authmodal").modal("show");
        }
    });
}

function serverUp(callback) {
    axios.get(
        "http://72.13.20.105:231/bank/server"
    ).then(function(response) {
        callback(response.data);
    });
}

function logout() {
    $("#account").modal("hide");
    setCookie("auth", "", 0);
    $("#authmodal").modal("show");
}

function withdraw_error() {
    document.getElementById("with_error").style.display = "inherit";
    spinner.style.display = "none";
    setTimeout(
    function() {
        document.getElementById("with_error").style.display = "none";
    }, 1500);
}

function withdraw() {
    var name = getValue("with_name");
    var amount = getValue("with_amount");
    
    spinner.style.display = "inherit";
    
    document.getElementById("with_amount").max = account.balance;
    
    if (amount > account.balance) {
        withdraw_error();
    } else {
        serverUp(function(isup) {
           if (!isup) {
               withdraw_error();
           } else {
               axios.post(
                   "http://72.13.20.105:231/bank/withdrawmc",
                   {
                       playerName: name,
                       amount: amount,
                       pin: getCookie("auth")
                   }
               ).then(function(response) {
                   if (response.data.status != "success") {
                       withdraw_error();
                   } else if (response.data.status == "success") {
                       name = "";
                       amount = null;
                       
                       $("#withdraw").modal("hide");
                       loadData();
                       spinner.style.display = "none";
                   }
               });
           }
        });
    }
}

$(document).ready(function() {
    if (!getCookie("auth")) {
        $("#authmodal").modal("show");
    } else {
        var login = authenticate(getCookie("auth"), function(status) {
            if (!status) {
                $("#authmodal").modal("show");
            } else {
                loadData();
            }
        });
    }
})