function issueTax() {
    axios.post(
        "https://brixybot.bubbleapps.io/version-test/api/1.1/wf/bank_getpeople"
    ).then(response => {
        var done = 0;
        response.data.response.users.forEach(user => {
            if (done == response.data.response.users.length - 1) {
                setTimeout(
                    function() {
                        $("#issueTaxPrompt").modal("hide");
                        return loadData();
                    },
                    850
                );
            }
            
            done += 1;
            var amount_to_tax = Math.ceil(user.balance / 8 / 6)
            var new_balance = user.balance - amount_to_tax;
            
            if (user.balance <= 0) {
                axios.post(
                    "https://brixybot.bubbleapps.io/version-test/api/1.1/wf/bank_issue_tax",
                    {
                        newbal: user.balance - 2,
                        person: user._id
                    }
                );
            } else if (user.balance > 0) {
                axios.post(
                    "https://brixybot.bubbleapps.io/version-test/api/1.1/wf/bank_issue_tax",
                    {
                        newbal: new_balance,
                        person: user._id
                    }
                );
            }
        });
    });
}

function showTaxPanel() {
    var amount_to_tax = Math.ceil(account.balance / 8 / 6)
    var new_balance = account.balance - amount_to_tax;
    
    if (account.moderator != true) {
        return;
    } else if (account.moderator == true) {
        document.getElementById("issueTaxHtml").innerHTML = `
                <p>Are you sure you want to issue a tax collection? This process cannot be reversed.</p>
                <p style="margin-bottom: 0px;">Your balance after tax: <strong>${new_balance}</strong></p>
        `;
        
        $("#issueTaxPrompt").modal("show");
    }
}