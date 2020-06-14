const socket = io("https://stream012020.herokuapp.com/");

$("#div-chat").hide();

socket.on("DANH_SACH_ONLINE", arrUserInfo => {
    $("#div-chat").show();
    $("#div-dang-ky").hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $("#ulUSer").append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on("CO_NGUOI_DUNG_MOI", user => {
        const { ten, peerId } = user;
        $("#ulUSer").append(`<li id="${peerId}">${ten}</li>`);
    });

    socket.on("AI_DO_NGAT_KET_NOI", peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on("DANG_KY_THAT_BAT", () =>
    alert("Please select a different username!")
);

function openStream() {
    var config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    var video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// var peer = new Peer({
//     host: "peerjs-server.herokuapp.com",
//     secure: true,
//     port: 443
// });

var peer = new Peer({
    key: "peerjs",
    host: "9000-da81e955-7114-46f0-840f-ae25b4d1ce1f.ws-us02.gitpod.io/",
    secure: true,
    port: 443
});

peer.on("open", id => {
    $("#my-peer").append(id);
    $("#btnSignUp").click(() => {
        const username = $("#txtUsername").val();
        socket.emit("NGUOI_DUNG_DANG_KY", { ten: username, peerId: id });
    });
});

//Caller
function OpenCall() {
    debugger;
    const id = $("#remoteId").val();
    openStream().then(stream => {
        debugger;
        playStream("localStream", stream);
        var call = peer.call(id, stream);
        call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
    });
}

//callee
peer.on("call", call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream("localStream", stream);
        call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
    });
});

$("#ulUSer").on("click", "li", function() {
    const id = $(this).attr("id");
    openStream().then(stream => {
        playStream("localStream", stream);
        var call = peer.call(id, stream);
        call.on("stream", remoteStream => playStream("remoteStream", remoteStream));
    });
});