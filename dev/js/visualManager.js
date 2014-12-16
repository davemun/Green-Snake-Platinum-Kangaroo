//render booleans - save perf by not rendering if other views are active
var vis1IsOn = true, vis2IsOn = false, vis3IsOn = false;

$(function() {
  //carousel dependencies
  var counter = 0;
  var arr = ['js/visualizer1.js','js/visualizer2.js', 'js/visualizer3.js'];
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', arr[counter]);
  script.setAttribute('id', counter);
  script.setAttribute('class', 'classify');
  $('body').append(script);

  //right click on visual carousel
  $('.right').on('click', function(){
    if(counter < 2){
      counter++;
    }else{
      counter = 0;
    }
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', arr[counter]);
    script.setAttribute('id', counter + 1);
    script.setAttribute('class', 'classify');
    $('.classify').remove();
    $('#container1').empty();
    $('#container2').empty();
    $('#container3').empty();
    console.log('script', script);
    if(counter === 0){
      vis1IsOn = true;
      vis2IsOn = false;
      vis3IsOn = false;
    }
    if(counter === 1){
      vis1IsOn = false;
      vis2IsOn = true;
      vis3IsOn = false;
    }
    if(counter === 2){
      vis1IsOn = false;
      vis2IsOn = false;
      vis3IsOn = true;
    }
    $('body').append(script);
  });

  //left click on visual carousel
  $('.left').on('click', function(){
    if(counter > 0){
      counter--;
    }else{
      counter = 2;
    }
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', arr[counter]);
    script.setAttribute('id', counter + 1);
    script.setAttribute('class', 'classify');
    $('.classify').remove();
    $('#container1').empty();
    $('#container2').empty();
    $('#container3').empty();
    console.log('script', script);
    if(counter === 0){
      vis1IsOn = true;
      vis2IsOn = false;
      vis3IsOn = false;
    }
    if(counter === 1){
      vis1IsOn = false;
      vis2IsOn = true;
      vis3IsOn = false;
    }
    if(counter === 2){
      vis1IsOn = false;
      vis2IsOn = false;
      vis3IsOn = true;
    }
    $('body').append(script);
  });

});

