// Defaults
let client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
let joinChannelBtn = document.querySelector('#jChannel')
let channelNameI = document.querySelector('#channel_name')
let modal = document.querySelector('.join')
let container = document.querySelector('.container')

joinChannelBtn.addEventListener('click', (event) => {
  let agoraAppId = "26ec1c7ca4044efc8b2631858ba9eb35";
  if (channelNameI != '') {
    let channelName = channelNameI.value;
    initClientAndJoinChannel(agoraAppId, channelName);
    modal.classList.add('hide')
    container.classList.remove('modal')
  }

});

// Initialise Agora CDN
let initClientAndJoinChannel = (agoraAppId, channelName) => {
  client.init(agoraAppId, () => {
    joinChannel(channelName);
  }, (err) => { console.error(err) });
}

// Publish Stream
client.on('stream-published', function (evt) {
});

// Connect New People
client.on('stream-added', function (evt) {
  let stream = evt.stream;
  client.subscribe(stream, (err) => { console.error(err) });
});

client.on('stream-subscribed', (evt) => {
  let remoteStream = evt.stream;
  let remoteId = remoteStream.getId();
  mainStreamId = remoteId;
  remoteStream.play('video');
});

// Stop Stream
client.on('stream-removed', (evt) => {
  let stream = evt.stream;
  stream.stop();
  stream.close();
  location.reload()
});

// Stop Stream When Leaving
client.on('peer-leave', function (evt) {
  evt.stream.stop();
  location.reload()
});

// Join Channel
let joinChannel = (channelName) => {
  let token = null;
  client.setClientRole('audience');
  client.join(token, channelName, 0, () => {}, (err) => {console.error(err)});
}

// Leave Channel
let leaveChannel = () => {
  client.leave(() => {location.reload()}, (err) => {console.error(err)});
}
