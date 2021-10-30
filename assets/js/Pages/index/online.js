function renderOnlineUsers() {
    Flux.Server.getPlayersOnline(function(players) {
        var append = [];
    
        if (players.length != 0) {
            players.forEach(player => {
                var data = `
                    <p style="margin-bottom: 0px;">${player}</p>
                `;

                append.push(data);
            });

            document.getElementById("playersOnline").innerHTML = append.join("\n");
        } else {
            document.getElementById("playersOnline").innerHTML = `<p style="margin-bottom: 0px;">No one is on the server right now.</p>`;
        }
    });
}