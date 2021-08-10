// Load in the required modules
const Animation = require('Animation');
const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Patches = require('Patches');
const FaceTracking = require('FaceTracking');
const D = require('Diagnostics');

// Enable async/await in JS [part 1]
(async function() {
  // Access a plane inserted in the scene
  const [object] = await Promise.all([
    Scene.root.findFirst('mouth_eat')
  ]);

  object.transform.x = FaceTracking.face(0).cameraTransform.applyToPoint(FaceTracking.face(0).mouth.center).x;
  object.transform.y = FaceTracking.face(0).cameraTransform.applyToPoint(FaceTracking.face(0).mouth.center).y;

  var mouth_eat_x = FaceTracking.face(0).cameraTransform.applyToPoint(FaceTracking.face(0).mouth.center).x;
  var mouth_eat_y = FaceTracking.face(0).cameraTransform.applyToPoint(FaceTracking.face(0).mouth.center).y;
  //object.transform.z = FaceTracking.face(0).cameraTransform.applyToPoint(FaceTracking.face(0).mouth.center).z;

  Patches.inputs.setScalar('mouth_eat_x', mouth_eat_x);
  Patches.inputs.setScalar('mouth_eat_y', mouth_eat_y);
})();

Promise.all([
  // findByPath returns array of results as it supports wildcards
  Scene.root.findFirst('game_score_text'),
  Patches.outputs.getScalar('game_score'),
  Scene.root.findFirst('time_count_text'),
  Patches.outputs.getScalar('game_time'),
]).then(function(results){

  var Counter = results[0];
  var Score = results[1];
  var game_time_text = results[2];
  var game_time_num = results[3];

  Counter.text = Score.toString();
  game_time_text.text = game_time_num.toString();
  // if(game_delay_num.toString() == '3'){
  //   game_delay_text.text = game_delay_num.toString();
  // }
  //game_delay_text.text = game_delay_num.toString();
});

Patches.outputs.getScalar('game_life').then(event=> {
  event.monitor().subscribe(function (values) {
       //Diagnostics.log(values.newValue);
       //Example
       Patches.inputs.setScalar('game_life_rtn', values.newValue);
  });
});

Patches.outputs.getScalar('game_score').then(event=> {
  event.monitor().subscribe(function (values) {
       //Diagnostics.log(values.newValue);
       //Example
       Patches.inputs.setScalar('game_score_rtn', values.newValue);
  });
});

// Declare variable to keep track of this pulse
var score_count = 0;

Patches.outputs.getPulse('game_score_pulse').then(event => {
     event.subscribe(function () {
          score_count++;

          Patches.inputs.setScalar('game_score_pulse_rtn', score_count);
     });
});
