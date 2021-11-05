var account;
var transactions;
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

function seeTransaction(id) {
    var tr = transactions.find((tr) => tr._id == id);
    console.log(tr)
    document.getElementById("transactionContent").innerHTML = `
        <div id="transactionContent">
        <p style="margin-bottom: 0px;">Transaction ${tr._id.substring(6, tr._id.indexOf("x"))}</p>
        <hr />
        <div style="display: flex;">
            <div style="width:50%">
                <div><span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" class="bi bi-person-circle" style="margin-right: 7px;">
                            <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z"></path>
                            <path fill-rule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                            <path fill-rule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                        </svg>To <strong>${tr.to}</strong></span></div>
                <div style="margin-top: 5px;"><span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" class="bi bi-ui-radios" style="margin-right: 7px;">
                            <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM0 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm7-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1z"></path>
                            <path fill-rule="evenodd" d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zM3 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                        </svg>Type <strong>${tr.type}</strong></span></div>
            </div>
            <div style="margin-left: 25px; width:50%;">
                <div><span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" class="bi bi-cash-stack" style="margin-right: 7px;">
                            <path d="M14 3H1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1h-1z"></path>
                            <path fill-rule="evenodd" d="M15 5H1v8h14V5zM1 4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H1z"></path>
                            <path d="M13 5a2 2 0 0 0 2 2V5h-2zM3 5a2 2 0 0 1-2 2V5h2zm10 8a2 2 0 0 1 2-2v2h-2zM3 13a2 2 0 0 0-2-2v2h2zm7-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path>
                        </svg>Amount <strong>${tr.amount}</strong></span></div>
                <div style="margin-top: 5px;"><span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" class="bi bi-file-richtext" style="margin-right: 7px;">
                            <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z"></path>
                            <path fill-rule="evenodd" d="M4.5 11.5A.5.5 0 0 1 5 11h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 9h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm1.639-3.708l1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V7.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V7s1.54-1.274 1.639-1.208zM6.25 5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"></path>
                        </svg>Memo <strong>${tr.memo}</strong></span></div>
            </div>
        </div>
    </div>
    `;
    
    $("#transactionView").modal("show");
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
            
            document.getElementById("pfp").src = acc.picture;

            var append = [];
            response.data.response.transactions.forEach(transact => {
                var data = `
                    <tr style="cursor:pointer" onclick='seeTransaction("${transact._id}")'>
                        <td>${transact._id.substring(6, transact._id.indexOf("x"))}</td>
                        <td>${transact.to}</td>
                        <td>${transact.memo}</td>
                        <td>${transact.type}</td>
                        <td>${transact.amount}</td>
                    </tr>
                `;
                
                append.push(data);
            });
            
            transactions = response.data.response.transactions;
            
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
        "https://api.ryujinx.tk/bank/server"
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
                   "https://api.ryujinx.tk/bank/withdrawmc",
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