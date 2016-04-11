var THREEx = THREEx || {}

// shim
//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
//window.URL = window.URL || window.webkitURL;

/**
 * Grab camera
 * @constructor
 */
THREEx.WebcamGrabbing = function(){

	//////////////////////////////////////////////////////////////////////////////////
	//		Comments
	//////////////////////////////////////////////////////////////////////////////////
        // create video element
        var domElement        = document.createElement('video')
        domElement.setAttribute('autoplay', true)

	// window.domElement = video
	domElement.style.zIndex = -1;
        domElement.style.position = 'absolute'

	// domElement.style.top = '50%'
	// domElement.style.left = '50%'
	// domElement.style.marginRight = '50%'
	// domElement.style.transform = 'translate(-50%, -50%)'
	// domElement.style.minWidth = '100%'

	domElement.style.top = '0px'
	domElement.style.left = '0px'
	domElement.style.width = '100%'
	domElement.style.height = '100%'

        /**
         * Resize video element.
         * - Made complex to handle the aspect change
         * - it is frequently when the mobile is changing orientation
         * - after a search on the internet, it seems hard/impossible to prevent browser from changing orientation
         */
        function onResize(){
                // is the size of the video available ?
                if( domElement.videoHeight === 0 )   return

                var videoAspect = domElement.videoWidth / domElement.videoHeight
                var windowAspect = window.innerWidth / window.innerHeight

                // var video = document.querySelector('video')
//                 if( videoAspect < windowAspect ){
//                         domElement.style.left        = '0%'
//                         domElement.style.width       = window.innerWidth + 'px'
//                         domElement.style.marginLeft  = '0px'
//
//                         domElement.style.top         = '50%'
//                         domElement.style.height      =  (window.innerWidth/videoAspect) + 'px'
//                         domElement.style.marginTop   = -(window.innerWidth/videoAspect) /2 + 'px'
// console.log('videoAspect <<<<< windowAspect')
//                 }else{
//                         domElement.style.top         = '0%'
//                         domElement.style.height      = window.innerHeight+'px'
//                         domElement.style.marginTop   =  '0px'
//
//                         domElement.style.left        = '50%'
//                         domElement.style.width       =  (window.innerHeight*videoAspect) + 'px'
//                         domElement.style.marginLeft  = -(window.innerHeight*videoAspect)/2 + 'px'
// console.log('videoAspect >>>> windowAspect')
//                 }
        }

        window.addEventListener('resize', function(event){
                onResize()
        })

        // just to be sure - resize on mobile is funky to say the least
        setInterval(function(){
                onResize()
        }, 500)

        // get the media sources
        navigator.mediaDevices.enumerateDevices().then(function(devices){
          var constraints = {
                  video: true,
                  audio: false,
          }
          for (var i = 0; i != devices.length; ++i) {
                  var sourceInfo = devices[i];
                  console.log(devices[i].kind + ": " + devices[i].label + " id = " + devices[i].deviceId +" facing = " + devices[i].facing);
                  if(sourceInfo.kind == "videoinput" && sourceInfo.label.indexOf("facing back") > -1) {
                        console.log("using back camera");
                          constraints.video = {
                                  deviceId: {exact: sourceInfo.id}
                          }
                          // not to mirror the video element when it is 'environment'
                          // domElement.style.transform   = ''
                  }
          }

          // try to get user media
          navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
                  domElement.src = URL.createObjectURL(stream);
          }, function(error) {
                  console.error("Cant getUserMedia()! due to ", error);
          });

        });
	this.domElement = domElement
}
