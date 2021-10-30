var update_spinner = document.getElementById("update-spinner");

function showUpdates() {
    $("#updates").modal("show");
    update_spinner.style.display = "inherit";
    
    axios.get(
        "http://72.13.20.105:231/bank/updates"
    ).then(response => {
        document.getElementById("updates-markup").innerHTML = marked(response.data);
        
        update_spinner.style.display = "none";
    });
}