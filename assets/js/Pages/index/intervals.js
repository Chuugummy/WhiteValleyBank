function initDataInterval() {
    setInterval(function() {
        loadData();
        renderNews();
        renderOnlineUsers();
    }, 30000)
}

$(document).ready(function() {
    initDataInterval();
});