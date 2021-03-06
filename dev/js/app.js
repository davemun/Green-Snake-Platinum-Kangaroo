/*
  A litte UI for changing the source of input for the Audio tag.
  You can point to a remote Audio file.
  <input> field's visibility is based on the status fo the checkbox
*/

// controls the visibility of the input field
$('#box').click(function(){
   var isChecked = $('#box').prop('checked');
   if (isChecked) {
    $('#loader').removeClass('hidden');
   } else {
    $('#loader').addClass('hidden');
   }
});

// updates the src on the audio tag
// * should add some validation here
$("#load").click(function(){
  var dest = $("#link").val();
  // a little easter egg for Doctor Who fans
  // if ( dest === "who") {
  //   $('audio').attr("src", 'sounds/doctor_who_theme_full.mp3');
  // } // otherwise just load the remote file
  //   else {
  //   $('audio').attr("src", $("#link").val());
  // }
  var fileName = dest.slice(dest.lastIndexOf("/")+1)
  AudioManager().hookUp("media", dest, fileName);
});
// end



// a checkbox to provide the option to loop the audio
$('#loop').click(function(){
   var isChecked = $('#loop').prop('checked');
   if (isChecked) {
    AudioManager().source.loop = true;
   } else {
    AudioManager().source.loop = false;
   }
});



// a checkbox to provide the option to loop the audio
$('.stop').click(function(){
  AudioManager().pause();
});

$('.play').click(function(){
  AudioManager().playNext(true);
});

$('.ff').click(function(){
  AudioManager().playNext();
  console.log("clicked.")
});

$('.rw').click(function(){
  AudioManager().playNext(false, true);
});
