Gesture controlled game for tetraplegics

## Gesture Controller

Example:

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
 
 
Start method will start the webcam stream, load face-api.js models and start face recognition. After that it dispatch controllerloaded event to document. You can listen the event with eventListener and example start a loop to check face movements:

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
    

## License

MIT.

## Used technologies

 face-api.js

https://github.com/justadudewhohacks/face-api.js/

"# Nenapeli" 
