const Flux = {
    Server: {
        getPlayersOnline: function(callback) {
            axios.get(
                "http://72.13.20.105:231/bank/players"
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