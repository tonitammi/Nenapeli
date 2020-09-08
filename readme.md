Gesture controlled game for tetraplegics

## Gesture Controller

<b>Example:</b>

Import face-api.js and gesture-controller.js. Face-api.js should be imported first.

        <script src="face-api/dist/face-api.min.js"></script>
        <script src="gesture-controller.js"></script>

Get canvas and video element

      const video = document.getElementById("video");
      const canvas = document.getElementById("canvas");
   

Create a new gesture controller by calling constructor.
  
      const gestureController = new GestureController(video, canvas)
     
      
You can also set a threshold. Threshold controls the head angle needed to trigger a horizontal movement property (getter). Default value is 10.

      const gestureController = new GestureController(video, canvas, 5)
    
    
Start gesture controller by calling:

     gestureController.start()
 
 
Start method will start the webcam stream, load face-api.js models and start face recognition. After that it dispatches controllerloaded event to document. You can listen the event with eventListener and forexample, start a loop to check face movements:

    document.addEventListener("controllerloaded", function() {
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
        
        const headDegree = gestureController.degree;
        // head angle in degrees relative to webcam angle. Negative value is left, positive value is right.
        console.log(headDegree); 
      }, 100)
    })
    
You can stop gesture controller by calling

    
    gestureController.stop()

<b>Constructor parameters</b>

|Parameter|Description|Type|
|---------|-----------|----|
|canvas| - | HTMLCanvasElement|
|video|Video for webcam stream|HTMLVideoElement|
|threshold|Controls the head angle needed to trigger a horizontal movement property|Number|

<b>Methods</b>

|Method|Description|
|------|-----------|
|start()|Starts a gesture controller|
|stop()|Stops the gesture controller|

<b>Properties</b>

|Property|Description|Type|
|--------|-----------|----|
|degree|Returns relative angel of head in degrees|Number|
|horizontal|Returns horizontal controls (1: left, 0: none, -1: right)|Number|
|mouthOpen|Returns true if mouth open, else false|Boolean|
|vertical|Returns vertical controls (1: up, 0: none, -1: down)|Number|


## License

MIT.

## Used technologies

 face-api.js

https://github.com/justadudewhohacks/face-api.js/

"# Nenapeli" 
