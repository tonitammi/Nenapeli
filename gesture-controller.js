class GestureController {

    constructor(canvas, video, threshold = 10, use_events = false) {
        this.canvas = canvas;
        this.video = video;
        this.video_w = video.clientWidth;
        this.video_h = video.clientHeight;
        this.threshold = threshold;
        this._degree = 0;
        this._vertical = 0;
        this._mouthOpen = false;
        this._use_events = use_events;

        if(use_events) {
            const func = () => {return};
            this._events = {};
            this.on("left", func)
            this.on("right", func)
            this.on("up", func)
            this.on("down", func)
            this.on("mouthopen", func)
            this.on("mouthclosed", func)
        }
    }

    get horizontal() {
        if(this.degree > this.threshold) return -1;
        else if(this.degree + this.threshold < 0) return 1;
        else return 0;
    }

    set horizontal(direction) {
        this._horizontal = direction;
    }

    get vertical() {
        return this._vertical;
    }
    set vertical(direction) {
        this._vertical = direction;
    }

    get degree() {
        return -this._degree;
    }

    get mouthOpen() {
        return this._mouthOpen;
    }

    start() {
        this.startWebcam();
    }
    loadModels() {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri("face-api/weights"),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri("face-api/weights")
        ])
        .then(() => {
            this.startController();
        })
    }
    startController() {
        const tinyFaceDetector =  new faceapi.TinyFaceDetectorOptions();

        if(!this._use_events) {
            this.interval = setInterval(async() => {

                const detections = await faceapi.detectSingleFace(video, tinyFaceDetector).withFaceLandmarks(true)
                
                if(detections !== undefined) {
                    const resizedDetections = faceapi.resizeResults(detections, this.displaysize);    
                    const left = resizedDetections.landmarks._positions[37];
                    const right = resizedDetections.landmarks._positions[46];  
                    this._degree = Math.atan2(right._y - left._y, right._x - left._x) * 180 / Math.PI;
                    
                    const height = resizedDetections.landmarks._positions[9]._y - resizedDetections.landmarks._positions[1]._y;
                    const height2 = resizedDetections.landmarks._positions[9]._y - resizedDetections.landmarks._positions[34]._y 
                    const heightRatio = height / height2;
                    
                    const mouthratio = (resizedDetections.landmarks._positions[67]._y 
                                        - resizedDetections.landmarks._positions[63]._y) / (resizedDetections.landmarks._positions[52]._y - resizedDetections.landmarks._positions[34]._y)
                    
                                        if(mouthratio > 1.2) this._mouthOpen = true;
                    else this._mouthOpen = false;
                    
                    if(heightRatio < 0.75) this._vertical = 1;
                    else if(heightRatio > 1.45) this._vertical = -1;
                    else this._vertical = 0;
                }
            }, 100);
        }
        else {
            this.interval = setInterval(async() => {

                const detections = await faceapi.detectSingleFace(video, tinyFaceDetector).withFaceLandmarks(true)
                
                if(detections !== undefined) {
                    const resizedDetections = faceapi.resizeResults(detections, this.displaysize);    
                    const left = resizedDetections.landmarks._positions[37];
                    const right = resizedDetections.landmarks._positions[46];  
                    this._degree = Math.atan2(right._y - left._y, right._x - left._x) * 180 / Math.PI;
                    
                    const height = resizedDetections.landmarks._positions[9]._y - resizedDetections.landmarks._positions[1]._y;
                    const height2 = resizedDetections.landmarks._positions[9]._y - resizedDetections.landmarks._positions[34]._y 
                    const heightRatio = height / height2;
                    
                    const mouthratio = (resizedDetections.landmarks._positions[67]._y 
                                        - resizedDetections.landmarks._positions[63]._y) / 
                                        (resizedDetections.landmarks._positions[52]._y - 
                                            resizedDetections.landmarks._positions[34]._y)
                    
                    if(this._degree > this.threshold) this.emit("left");
                    if(this._degree + this.threshold < 0) this.emit("right");

                    if(mouthratio > 1.2) this.emit("mouthopen");
                    else this.emit("mouthclosed");
                    
                    if(heightRatio < 0.75) this.emit("up");
                    if(heightRatio > 1.45) this.emit("down"); 
                }
            }, 100);
        }

        this.emit("controllerloaded");
    }

    stop() {
        clearInterval(this.interval);
    }

    startWebcam() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => {
            this.video.srcObject = stream;
            this.video.setAttribute("playsinline", true);
            this.video.play();
            this.displaysize = { width : this.video_w, height: this.video_h }        
        })
        .then(() => this.loadModels())
        .catch(err => {
            console.error("Error! " + err);
        });
    }

    on(name, listener) {
        if(!this._events[name]) this._events[name] = [];
        this._events[name].push(listener);
    }
    
    removeListener(name, listenerToRemove) {
        if (!this._events[name]) {
            throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
        }

        const filterListeners = (listener) => listener !== listenerToRemove;
        this._events[name] = this._events[name].filter(filterListeners);
    }

    emit(name, data) {
        if (!this._events[name]) {
          throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
        }
    
        const fireCallbacks = callback => {
          callback(data);
        };
    
        this._events[name].forEach(fireCallbacks);
    }
}