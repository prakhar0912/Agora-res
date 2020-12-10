let client = AgoraRTC.createClient({
    mode: 'live',
    codec: 'vp8'
});

let videoDiv = document.querySelector('#video')
let micBtn = document.querySelector('#mic')
let vidBtn = document.querySelector('#vid')
let quitBtn = document.querySelector('#quit')

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


client.on('stream-added', (evt) => {
    let stream = evt.stream;
    client.subscribe(stream, (err) => { console.log(err) });
});


client.on('stream-subscribed', function (evt) {
    let remoteStream = evt.stream;
    let remoteId = remoteStream.getId();
    console.log("Subscribe remote stream successfully: " + remoteId);
    mainStreamId = remoteId;
    remoteStream.play('video');
});


client.on('stream-removed',  (evt) => {
    let stream = evt.stream;
    stream.stop();
    stream.close();
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
    client.leave( () => {
        localStreams.camera.stream.stop()
        localStreams.camera.stream.close();
        client.unpublish(localStreams.camera.stream);
    },  (err) => {console.error(err) });
}

// function changeStreamSource(deviceIndex, deviceType) {
//     console.log('Switching stream sources for: ' + deviceType);
//     let deviceId;
//     let existingStream = false;
//     if (deviceType === "video") {
//         deviceId = devices.cameras[deviceIndex].deviceId
//     }
//     if (deviceType === "audio") {
//         deviceId = devices.mics[deviceIndex].deviceId;
//     }
//     localStreams.camera.stream.switchDevice(deviceType, deviceId, function () {
//         console.log('successfully switched to new device with id: ' + JSON.stringify(deviceId));
//         if (deviceType === "audio") {
//             localStreams.camera.micId = deviceId;
//         } else if (deviceType === "video") {
//             localStreams.camera.camId = deviceId;
//         } else {
//             console.log("unable to determine deviceType: " + deviceType);
//         }
//     }, function () {
//         console.log('failed to switch to new device with id: ' + JSON.stringify(deviceId));
//     });
// }


// function getCameraDevices() {
//     client.getCameras(function (cameras) {
//         devices.cameras = cameras;
//         cameras.forEach(function (camera, i) {
//             let name = camera.label.split('(')[0];
//             let optionId = 'camera_' + i;
//             let deviceId = camera.deviceId;
//             if (i === 0 && localStreams.camera.camId === '') {
//                 localStreams.camera.camId = deviceId;
//             }
//             $('#camera-list').append('<a class="dropdown-item" id="' + optionId + '">' + name + '</a>');
//         });
//         $('#camera-list a').click(function (event) {
//             let index = event.target.id.split('_')[1];
//             changeStreamSource(index, "video");
//         });
//     });
// }


// function getMicDevices() {
//     client.getRecordingDevices(function (mics) {
//         devices.mics = mics;
//         mics.forEach(function (mic, i) {
//             let name = mic.label.split('(')[0];
//             let optionId = 'mic_' + i;
//             let deviceId = mic.deviceId;
//             if (i === 0 && localStreams.camera.micId === '') {
//                 localStreams.camera.micId = deviceId;
//             }
//             if (name.split('Default - ')[1] != undefined) {
//                 name = '[Default Device]'
//             }
//             $('#mic-list').append('<a class="dropdown-item" id="' + optionId + '">' + name + '</a>');
//         });
//         $('#mic-list a').click(function (event) {
//             let index = event.target.id.split('_')[1];
//             changeStreamSource(index, "audio");
//         });
//     });
// }


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
        setTimeout(leaveChannel(), 900)
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
            setTimeout(leaveChannel(), 900)
            break;
        }
    });
}


let toggleMic = (ele) => {
    if(ele.classList[0] != 'disabled'){
        localStreams.camera.stream.muteAudio();
        console.log("Disabled Audio");
    } else {
        localStreams.camera.stream.unmuteAudio();
        console.log("Enabled Audio");
    }
    ele.classList.toggle('disabled')

}


let toggleVideo = (ele) => {
    if(ele.classList[0] != 'disabled'){
        localStreams.camera.stream.muteVideo();
        console.log("Disabled Video");
    } else {
        localStreams.camera.stream.unmuteVideo();
        console.log("Enabled Video");
    }
    ele.classList.toggle('disabled')

}
