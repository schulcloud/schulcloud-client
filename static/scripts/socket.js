/* global io feathers */

$(document).ready(function () {
    let url = $('#backendUrl').html();
    let socket = io(url);

    socket.on('newReleaseAvailable', (res) => {
        if (res.bool) {
            $.ajax({
                type: "POST",
                url: "/account/preferences",
                data: { attribute: { key: "releaseDate", value: res.createdAt } }
            });
            $('.feature-modal').appendTo('body').modal('show');
        }
    });
});