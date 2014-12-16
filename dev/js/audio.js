/*
  The following section is the setup for routing Audio to the visualizer:

  There are 5 general steps:

  1. Create audio context
  2. Inside the context, create sources — such as <audio>, oscillator, stream  
  3. Create effects nodes, such as reverb, biquad filter, panner, compressor
  4. Choose final destination of audio, for example your system speakers
  5. Connect the sources up to the effects, and the effects to the destination.

  For more information see: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

*/

//==================AudioManager====================
var AudioManager = function() {
  this.pause = function(){
    var i = AudioManager().soundsIndex;
   if(AudioManager().sounds[i].type === "buffer"){
      var source = AudioManager().source;
      source.onended = function(){};
      source.stop();
    }
    if(AudioManager().sounds[i].type === "media"){
        //todo
    }
    $('.title').text("");
  }

  this.clean = function(){
    if (this.source){
      if(this.source.disconnect){
        this.source.disconnect();
      }
      if(this.source.stop){
        this.source.stop();
      }
    }
    $('.title').text("");
  }

  this.playNext = function(restart, prev){
    //disconnect current music file
    if (this.source){
      if(this.source.disconnect){
        this.source.disconnect();
      }
      if(this.source.stop){
        this.source.stop();
      }
    }

    restart = restart || false;
    if(!restart && !prev){
      if(++AudioManager().soundsIndex >= AudioManager().sounds.length){
        AudioManager().soundsIndex = 0;
      }
    }

    prev = prev || false;
    if(prev){
      if(--AudioManager().soundsIndex < 0){
        AudioManager().soundsIndex = AudioManager().sounds.length-1;
      }
    }

    var i = AudioManager().soundsIndex;

    //create bufferNode if sound is a mediabuffer type
    if(AudioManager().sounds[i].type === "buffer"){
      var source = AudioManager().audioContext.createBufferSource();
      source.buffer = AudioManager().sounds[i].data;      
      source.onended = function(){
          AudioManager().playNext();
       };
    }
    if(AudioManager().sounds[i].type === "media"){
      var link = AudioManager().sounds[i].data;
      var audio = document.querySelector('audio'); // creating a reference to the <audio> tag on index.html
      $('audio').attr("src", link);
      var source = AudioManager().audioContext.createMediaElementSource(audio);
      // document.getElementById("audio").pause();
    }

    $('.currentSong').text(AudioManager().sounds[i].fileName);
    AudioManager().source = source;
    AudioManager().current = AudioManager().sounds[i].fileName;
    AudioManager().source.connect(AudioManager().nodes.masterGain);
    if(AudioManager().sounds[i].type === "buffer"){ 
      AudioManager().source.start();  //only works if buffer
    }else if(AudioManager().sounds[i].type === "media"){
      document.getElementById("audio").play();
    }
    AudioManager().paused = false;
  };

  this.init = function(){
    // map for loaded sounds
    this.sounds = [];
    this.soundsIndex = 0; 

    this.paused = true;

    //create audio context
    if(!this.audioContext){
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // create our permanent nodes
    this.nodes = {
      destination: this.audioContext.destination,
      masterGain: this.audioContext.createGain(),
    };

    // create analyser
    this.analyser = this.audioContext.createAnalyser();
    
    // and setup the graph
    this.nodes.masterGain.connect( this.analyser );

    // 4. Choose final destination of audio
    this.analyser.connect(this.nodes.destination);
    this.analyser.fftSize = 256;
  }

  this.hookUp = function(nodeType, nodeData, fileName){
    // Connect audio processing graph
    //====================hookUp() if bufferType start====================
    if(nodeType === "buffer"){
      var soundObj = {data:nodeData, type:"buffer", fileName: fileName};
      AudioManager().sounds.push(soundObj);
      var song = $('<p></p>').text(fileName);
      song.data("fileName", fileName);
      song.attr("class", "playlistSong");

      song.click(function(){
        var i = AudioManager().soundsIndex;
        if($(this).data().fileName === AudioManager().sounds[i].fileName && AudioManager().sounds.length === 1){
          AudioManager().pause();
          AudioManager().clean();
          AudioManager().sounds = [];
          AudioManager().soundsIndex = 0;
          $('.currentSong').text("");
          for(var i = 2; i < $('.playlist').children().length; i++){
            if( $($('.playlist').children()[i]).data().fileName === $(this).data().fileName){
              console.log("in splice")
              $($('.playlist').children()[i]).remove();
            }
          }
        }else if($(this).data().fileName === AudioManager().sounds[i].fileName){
          AudioManager().clean();
          AudioManager().sounds.splice(i,1);
          AudioManager().soundsIndex = Math.min(i, AudioManager().sounds.length-1);
          $('.currentSong').text("");
          for(var i = 2; i < $('.playlist').children().length; i++){
            if( $($('.playlist').children()[i]).data().fileName === $(this).data().fileName){
              console.log("in splice")
              $($('.playlist').children()[i]).remove();
            }
          }
          AudioManager().playNext(true);
        }
        $('.playList').remove(this);
      });
      $('.playlist').append(song);                                                  
    }
    //====================hookUp() if bufferType end====================

    //====================hookUp() if mediaType start====================
    else if(nodeType === "media"){
      AudioManager().sounds.push({data:nodeData, type:"media", fileName:fileName});
      var song = $('<p></p>').text(fileName);
      song.data("fileName", fileName);
      song.attr("class", "playlistSong");

      // song.click(function(){
      //   var i = AudioManager().soundsIndex;
      //   if($(this).data().fileName === AudioManager().sounds[i].fileName && AudioManager().sounds.length === 1){
      //     AudioManager().pause();
      //     AudioManager().clean();
      //     AudioManager().sounds = [];
      //     AudioManager().soundsIndex = 0;
      //     $('.currentSong').text("");
      //     for(var i = 2; i < $('.playlist').children().length; i++){
      //       if( $($('.playlist').children()[i]).data().fileName === $(this).data().fileName){
      //         console.log("in splice")
      //         $($('.playlist').children()[i]).remove();
      //       }
      //     }
      //   }else if($(this).data().fileName === AudioManager().sounds[i].fileName){
      //     AudioManager().clean();
      //     AudioManager().sounds.splice(i,1);
      //     AudioManager().soundsIndex = Math.min(i, AudioManager().sounds.length-1);
      //     $('.currentSong').text("");
      //     for(var i = 2; i < $('.playlist').children().length; i++){
      //       if( $($('.playlist').children()[i]).data().fileName === $(this).data().fileName){
      //         console.log("in splice")
      //         $($('.playlist').children()[i]).remove();
      //       }
      //     }
      //     AudioManager().playNext(true);
      //   }
      //   $('.playList').remove(this);
      // });

      $('.playlist').append(song);
    }
     //====================hookUp() if mediaType end====================

    // check if anything playing
    if(AudioManager().paused){
      AudioManager().playNext(true);
    }
  }
  return this;
}
//==================AudioManager====================
//==================AudioManager takeover====================
AudioManager().init();
var bufferLength = AudioManager().analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
var timeDomain = new Uint8Array(bufferLength);
var audioBuffer, status, droppedFiles, fileReaders = [];


//event listeners
document.addEventListener('drop', onMP3Drop, false);
document.addEventListener('dragover', onDocumentDragOver, false);
document.getElementById('fader').addEventListener('change', function (vol) {
        AudioManager().nodes.masterGain.gain.value = this.value;
        var fader = document.querySelector('#fader');
        var volume = document.querySelector('#volume');
        volume.value = (fader.value * 100) + '%';
    });
// document.getElementById('audio').addEventListener('ended', function(){
//   AudioManager().playNext();
// });
// document.getElementById('audio').addEventListener('play', function(){
//   AudioManager().paused = false;
// });

//==================AudioManager takeover====================

var elipses = function(state){
  if(state === "on"){
    status = setInterval(function(){
      if($('#prompt').text() === "Loading"){
        $('#prompt').text("Loading.");
      }else if($('#prompt').text() === "Loading."){
        $('#prompt').text("Loading..");
      }else if($('#prompt').text() === "Loading.."){
        $('#prompt').text("Loading...");
      }else if($('#prompt').text() === "Loading..."){
        $('#prompt').text("Loading");
      }
    }, 500);
  }else if(state === "off"){
    clearInterval(status);
  }
};

//==================File Drag And Drop Functionality====================

function onDocumentDragOver(evt) {
  $('#prompt').show();
  $('#prompt').text("drop MP3 here");
  evt.stopPropagation();
  evt.preventDefault();
  return false;
}

function onMP3Drop(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  $('#prompt').text("Loading...").fadeIn(1000);
  elipses("on");

  //store dropped files in var
  droppedFiles = evt.dataTransfer.files;

  //create reader for files that will pass data
  //to onDroppedMP3 callback after reading
  fileReaders = [];
  for (var i = 0; i < droppedFiles.length; i++) {
      fileReaders[i] = new FileReader();
      fileReaders[i].index = i;
      fileReaders[i].onload = function(fileEvent) {
        var fileObj = {};
        fileObj.data = fileEvent.target.result;
        fileObj.fileName = droppedFiles[this.index].name;
        //data, fileName, "buffer"
        onDroppedMP3Loaded(fileObj);
      };

  }
      // reader.readAsArrayBuffer(droppedFiles[i]);    
  

  //read all files and use func cb above
  // loop through files
  for (var i = 0; i < droppedFiles.length; i++) {
      fileReaders[i].readAsArrayBuffer(droppedFiles[i]);    
  }
}


function onDroppedMP3Loaded(fileObj) {
  AudioManager().audioContext.decodeAudioData(fileObj.data, function(buffer) {
    audioBuffer = buffer;
    startSound(buffer, fileObj.fileName);
  }, function(e) {
    $('#prompt').text("cannot decode mp3");
    console.log(e);
  });
}

function startSound(buffer, fileName) {

  // if (this.source){
  //   if(this.source.disconnect){
  //     this.source.disconnect();
  //   }
  //   if(this.source.stop){
  //     this.source.stop();
  //   }
  // }

  // Connect audio processing graph
  AudioManager().hookUp("buffer", buffer, fileName);

  elipses("off");
  $('#prompt').text("Loaded!");
  setTimeout(function(){$('#prompt').fadeOut(2000)},1500);

  // $('.audio').slideUp(1000);
  // setTimeout($('.bufferControls').slideDown(2000), 2000);
}
//==================File Drag And Drop Functionality====================

