const Flux = {
    Server: {
        getPlayersOnline: function(callback) {
            axios.get(
                "https://api.ryujinx.tk/bank/players"
            ).then(response => {
                callback(response.data.players);  
            });
        }
    },
    showPopup: function(title, body) {
        document.getElementById("popupTitle").innerText = title;
        document.getElementById("popupBody").innerText = body;
        
        $("#popup").modal("show");
    }
}