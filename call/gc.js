let client = AgoraRTC.createClient({
    mode: 'live',
    codec: 'vp8'
});

let videoDiv = document.querySelector('#video')
let micBtn = document.querySelector('#mic')
let vidBtn = document.querySelector('#vid')
let quitBtn = document.querySelector('#quit')
let videoContainer = document.querySelector('.videos')

let mainStreamId;
let cameraVideoProfile = '720p_6';
let localStreams = {
    uid: '',
    camera: {
        camId: '',
        micId: '',
        stream: {}
    }
};


let devices = {
    cameras: [],
    mics: []
}


let initClientAndJoinChannel = (agoraAppId, channelName) => {
    client.init(agoraAppId, () => {
        joinChannel(channelName);
    }, (err) => { console.log(err) });
}

let addNewPerson = (id) => {
    let div = document.createElement("div");
    // alert(id)
    div.id = `${id}_container`
    div.classList.add('video')
    div.innerHTML = `

    <div class="controls control">
        <div id="vid-${id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
        </div>
        <div id="mic-${id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        </div>
    </div>

    `
    videoContainer.appendChild(div);
}


client.on('stream-added', (evt) => {
    let stream = evt.stream;
    client.subscribe(stream, (err) => { console.log(err) });
});


client.on('stream-subscribed', function (evt) {
    let remoteStream = evt.stream;
    let remoteId = remoteStream.getId();
    console.log("Subscribe remote stream successfully: " + remoteId);
    addNewPerson(remoteId)
    mainStreamId = remoteId;
    remoteStream.play(`${remoteId}_container`);
});


client.on('stream-removed', (evt) => {
    let stream = evt.stream;
    stream.stop();
    stream.close();
    location.reload()
});

client.on("peer-leave", (evt) => {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    document.getElementById(`${streamId}_container`).remove()
});


// show mute icon whenever a remote has muted their mic
client.on("mute-audio", function (evt) {
    console.log("Remote stream: " + evt.uid + "has muted audio");
    document.querySelector(`#mic-${evt.uid}`).classList.toggle('disabled')
});

client.on("unmute-audio", function (evt) {
    console.log("Remote stream: " + evt.uid + "has muted audio");
    document.querySelector(`#mic-${evt.uid}`).classList.toggle('disabled')
});

// show user icon whenever a remote has disabled their video
client.on("mute-video", function (evt) {
    console.log("Remote stream: " + evt.uid + "has muted video");
    document.querySelector(`#vid-${evt.uid}`).classList.toggle('disabled')
});

client.on("unmute-video", function (evt) {
    console.log("Remote stream: " + evt.uid + "has un-muted video");
    document.querySelector(`#vid-${evt.uid}`).classList.toggle('disabled')
});


function joinChannel(channelName) {
    let token = null;
    let userID = null;
    client.setClientRole('host');
    client.join(token, channelName, userID, (uid) => {
        createCameraStream(uid, {});
        localStreams.uid = uid;
    }, (err) => { console.error(err) });
}


let createCameraStream = (uid, deviceIds) => {
    let localStream = AgoraRTC.createStream({
        streamID: uid,
        audio: true,
        video: true,
        screen: false
    });
    localStream.setVideoProfile(cameraVideoProfile);
    localStream.on("accessAllowed", function () {

    });
    localStream.init(() => {
        localStream.play('video')
        enableUiControls()
        client.publish(localStream, (err) => { console.error(err) })
        localStreams.camera.stream = localStream
    }, (err) => { console.err(err) })
}


let leaveChannel = () => {
    client.leave(() => {
        localStreams.camera.stream.stop()
        localStreams.camera.stream.close();
        client.unpublish(localStreams.camera.stream);
        location.reload();
    }, (err) => { console.error(err) });
}



let createChannelBtn = document.querySelector('#cChannel')
let channelNameI = document.querySelector('#channel_name')
let modal = document.querySelector('.join')
let container = document.querySelector('.container')

createChannelBtn.addEventListener('click', (event) => {
    let agoraAppId = "26ec1c7ca4044efc8b2631858ba9eb35";
    if (channelNameI != '') {
        let channelName = channelNameI.value;
        initClientAndJoinChannel(agoraAppId, channelName);
        modal.classList.add('hide')
        container.classList.remove('modal')
    }

});

function enableUiControls() {
    micBtn.addEventListener('click', () => {
        toggleMic(micBtn);
    });
    vidBtn.addEventListener('click', () => {
        toggleVideo(vidBtn);
    });
    quitBtn.addEventListener('click', () => {
        leaveChannel()
    });
    document.addEventListener('keypress', (e) => {
        switch (e.key) {
            case "m":
                toggleMic();
                break;
            case "v":
                toggleVideo();
                break;
            case "q":
                leaveChannel()
                break;
        }
    });
}


let toggleMic = (ele, evt) => {
    if (ele.classList[0] != 'disabled') {
        localStreams.camera.stream.muteAudio();
        console.log("Disabled Audio");
    } else {
        localStreams.camera.stream.unmuteAudio();
        console.log("Enabled Audio");
    }
    ele.classList.toggle('disabled')

}


let toggleVideo = (ele, evt) => {
    if (ele.classList[0] != 'disabled') {
        localStreams.camera.stream.muteVideo();
        console.log("Disabled Video");
    } else {
        localStreams.camera.stream.unmuteVideo();
        console.log("Enabled Video");
    }
    ele.classList.toggle('disabled')

}
