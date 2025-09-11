
var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var firstKeyPress = false;
var level = 0;

function nextSequence() {

  userClickedPattern = [];

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenNumber = buttonColours[randomNumber];

  gamePattern.push(randomChosenNumber);

  $("#" + randomChosenNumber).fadeOut(100).fadeIn(100);

  playSound(randomChosenNumber);
  level++;
  $("#level-title").text("Level " + level);
}


function playSound(name){
  var audio = new Audio("./sounds/" + name +".mp3");
  audio.play();
}


function animatePress(currentColour) {

  $("#" + currentColour).addClass("pressed");

  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);

}


$(".btn").on("click", function(){
  var userChosenColour = this.id;

  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length-1);
});


$("body").keydown(function(){
  if (firstKeyPress == false) {
    firstKeyPress = true;
    $("h1").html("Level " + level);
    nextSequence();
    console.log(gamePattern);
  }
  else {
    console.log("ada error nich!");
  }
});

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] == gamePattern[currentLevel]) {
      console.log("success");

      if (userClickedPattern.length == gamePattern.length){

        setTimeout(function () {
          nextSequence();
        }, 1000);

      }

    }
    else {
      console.log("wrong");
      var wrong = new Audio("./sounds/wrong.mp3");
      wrong.play();

      $("body").addClass("game-over");
      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);

      $("#level-title").text("Game Over, Press Any Key to Restart");

      StartOver();

    }

  }


function StartOver() {
  level = 0;
  gamePattern = [];
  firstKeyPress = false;
}
