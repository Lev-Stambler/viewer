function MouseCamera (scene, renderer) {
  var self = this;

  this.scene = scene;
  this.renderer = renderer;

  this.rotationSpeed = 0.1;
  this.rotationEnabled = false;

  this.targetPosition = new THREE.Vector3 (0,200, 0);

  this.radius = 1600;
  this.theta = 45;
  this.onMouseDownTheta = 45;
  this.phi = 60;
  this.onMouseDownPhi = 60;

  this.isMouseDown = false;
  this.onMouseDownPosition = new THREE.Vector2();

  this.gridSize = 30;
  this.gridSpacing = 50;
  this.gridY = 0;

  this.updateCameraPos = function () {
    self.camera.position.x = self.radius * Math.sin( self.theta * Math.PI / 180 ) * Math.cos( self.phi * Math.PI / 180 );
    self.camera.position.y = self.radius * Math.sin( self.phi * Math.PI / 180 );
    self.camera.position.z = self.radius * Math.cos( self.theta * Math.PI / 180 ) * Math.cos( self.phi * Math.PI / 180 );
    self.camera.position.addSelf (self.targetPosition);
    self.camera.updateMatrix();
  }

  this.camera = new THREE.Camera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
  this.updateCameraPos();
  this.camera.target.position = self.targetPosition;

  this.update = function () {
    self.updateCameraPos ();
    self.render ();
  }

  this.rotate = function () {
    if (self.rotationEnabled){
      self.theta = (self.theta + self.rotationSpeed)%720;
      self.updateCameraPos ();
    }
  }

  this.topView = function () {
    this.radius = 1600;
    this.theta = 0;
    this.phi = 180;
    this.update();
  }

  this.mainView = function () {
    this.radius = 1600;
    this.theta = 0;
    this.phi = 50;
    this.update();
  }

  


  this.render = function () {
    self.renderer.render (self.scene, self.camera);
  }

  //MOUSE
  this.addMouseListeners = function () {
    self.renderer.domElement.addEventListener( 'mousemove',this.onDocumentMouseMove, false );
    self.renderer.domElement.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
    self.renderer.domElement.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
  }

  this.onDocumentMouseDown = function( event ) {

    event.preventDefault();

    self.isMouseDown = true;

    self.onMouseDownTheta = self.theta;
    self.onMouseDownPhi = self.phi;
    self.onMouseDownPosition.x = event.clientX;
    self.onMouseDownPosition.y = event.clientY;
  }

  this.onDocumentMouseMove = function( event ) {

    event.preventDefault();

    if ( self.isMouseDown ) {

      self.theta = (- ( ( event.clientX - self.onMouseDownPosition.x ) * 0.5 ) + self.onMouseDownTheta) % 360;
      self.phi = ( ( event.clientY - self.onMouseDownPosition.y ) * 0.5 ) + self.onMouseDownPhi;

      self.phi = Math.min( 180, Math.max( 0, self.phi ) );

      self.updateCameraPos();
    }

    self.render ();
  }

  this.onDocumentMouseUp = function ( event ) {
    event.preventDefault();
    self.isMouseDown = false;
  }
}

