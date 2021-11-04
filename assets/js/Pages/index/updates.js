var update_spinner = document.getElementById("update-spinner");

function showUpdates() {
    $("#updates").modal("show");
    update_spinner.style.display = "inherit";
    
    axios.get(
        "https://api.ryujinx.tk/bank/updates"
    ).then(response => {
        document.getElementById("updates-markup").innerHTML = marked.parse(response.data);
        
        update_spinner.style.display = "none";
    });
}