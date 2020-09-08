Gesture controlled game for tetraplegics

## Gesture Controller (beta version)

Watch [demo](nenapeli-b7576.web.app).

<b>Example:</b>

Download gesture-controller.js or install via npm:

        npm install gesture-controller
        
Create incredibly stylish HTML file:
        
        <html>
          <head>
            <title>Gesture controller example</title>
            <style>
              body {
                width: 100%;
                height: 100vh;
              }
              #canvas {
                width: 600px;
                height: 400px;
                margin: 16px;
              }
            </style>
          </head>
          <body>
            <canvas id="canvas"></canvas>
            <video id="video" style="display: none"></video>
          </body>
        </html>

Import face-api.js and gesture-controller.js just before body end tag. Face-api.js should be imported first.

        <script src="face-api/dist/face-api.min.js"></script>
        <script src="gesture-controller.js"></script>

Get canvas and video elements.

      const video = document.getElementById("video");
      const canvas = document.getElementById("canvas");
   

Create a new gesture controller by calling constructor.
  
      const gestureController = new GestureController(video, canvas)
     
      
You can also set a threshold. Threshold controls the head angle needed to trigger a horizontal movement property (getter). Default value is 10.

      const gestureController = new GestureController(video, canvas, 5)
    
    
Start gesture controller by calling:

     gestureController.start()
 
 
Start method will start the webcam stream, load face-api.js models and start face recognition. After that it emits controllerloaded event. You can listen the event with on method and for example, start a loop to check face movements:

    gestureController.on("controllerloaded", function() {
      const interval = setInterval(() => {
        const vertical = gestureController.vertical;
        const horizontal = gestureController.horizontal;
        
        if(vertical === 1) {
          console.log("up)
        }
        else if(vertical === 0) {
          console.log("straigth")
        }
        else if(vertical === -1) {
          console.log("down")
        }
        
        if(horizontal === 1) {
          console.log("left")
        }
        else if(horizontal === 0) {
          console.log("straigth")
        }
        else if(horizontal === -1) {
          console.log("right")
        }
        
        const headAngel = gestureController.degree;
        // head angle in degrees relative to webcam angle. Negative value is left, positive value is right.
        console.log(headAngel); 
      }, 100)
    })
    
You can stop gesture controller by calling:

    
    gestureController.stop()
    
<b>Use events example</b>

        const gestureController = new GestureController(video, canvas, 10, true);

        gestureController.on("left", function() {
            console.log("left")
        });
        gestureController.on("right", function() {
            console.log("right")
        });
        gestureController.on("up", function() {
            console.log("up")
        });
        gestureController.on("down", function() {
            console.log("down")
        });
        gestureController.on("mouthopen", function() {
            console.log("mouth is open")
        });
        gestureController.on("mouthclosed", function() {
            console.log("mouth is closed")
        });

<b>Constructor parameters</b>

|Parameter|Description|Type|Default|
|---------|-----------|----|-------|
|canvas| - | HTMLCanvasElement| - |
|video|Video for webcam stream|HTMLVideoElement| - |
|threshold|Controls the head angle needed to trigger <br> a horizontal movement property|Number|10|
|use_events*|Use on method to listen controls|Boolean|false|

*Important! If use_event is set to true, only the degree property can be used.

<b>Methods</b>

|Method|Description|Parameters|
|------|-----------|----------|
|start()|Starts a gesture controller| - |
|stop()|Stops the gesture controller| - |
|on(event, callback)| Listens emited events|event (string), callback (function)|

<b>Properties</b>

|Property|Description|Type|Can be used with use_events|
|--------|-----------|----|---------------------------|
|degree|Returns relative angel of head in degrees|Number|yes|
|horizontal|Returns horizontal controls (1: left, 0: none, -1: right)|Number|no|
|mouthOpen|Returns true if mouth open, else false|Boolean|no|
|vertical|Returns vertical controls (1: up, 0: none, -1: down)|Number|no|

<b>Events</b>

|Event|Description|use_events argument is needed|
|-----|----------|--------------------------|
|"controllerloaded"|Gesture controller is loaded <br> and ready to use|no|
|"up"|Head moves up|yes|
|"down|Head moves down|yes|
|"left"|Head moves left|yes|
|"right"|Head moves right|yes|
|"mouthopen"|Mouth is open|yes|
|"mouthclosed"|Mouth is closed|yes|

<b>Known issues</b>

Vertical property is triggered incorrectly when head angle is something over 12 - 20 degrees in both directions.

## License

MIT.

## Used technologies

 face-api.js

https://github.com/justadudewhohacks/face-api.js/

"# Nenapeli" 
