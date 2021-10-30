var people;
var send_spinner = document.getElementById("send_spinner");

function submitSendMoney() {
    var amount = document.getElementById("send_amount").value;
    var person = $("input[type='radio'][name='users']:checked");
    
    document.getElementById("send-btn").disabled = true;
    send_spinner.style.display = "inherit";
    
    function subError() {
        document.getElementById("send_error").style.display = "inherit";
        
        document.getElementById("send-btn").disabled = false;
        send_spinner.style.display = "none";
        
        setTimeout(function() {
            document.getElementById("send_error").style.display = "none";
        }, 2500);
    }
    
    if (!person.length > 0) {
        return subError();
    }
    
    sendMoney(amount, person[0].id.substring(1 + person[0].id.indexOf("-")), function(data) {
        $("#send").modal("hide");
        document.getElementById("send-btn").disabled = false;
        send_spinner.style.display = "none";
        loadData();
    });
}

function sendMoney(amount, person, callback) {
    axios.post(
        "https://brixybot.bubbleapps.io/version-test/api/1.1/wf/bank_sendcash",
        {
            auth: getCookie("auth"),
            to: person,
            amount: amount
        }
    ).then(response => {
        callback(response.data.response);  
    });
}

$("#send").on("shown.bs.modal", function() { 
    send_spinner.style.display = "inherit";
    var append = [];
    
    axios.post(
        "https://brixybot.bubbleapps.io/version-test/api/1.1/wf/bank_getpeople"
    ).then(response => {
        response.data.response.users.forEach(user => {
            var banned = `<span class="badge badge-danger">Banned</span>`;
            
            var data = `
                <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" id="user-${user._id}" name="users" /><label class="custom-control-label" for="user-${user._id}">${user.name} ${user.banned ? banned : ""}</label></div>
            `;
            
            append.push(data);
        });
        
        document.getElementById("send-people").innerHTML = append.join("\n");
        
        send_spinner.style.display = "none";
    });
});