/*lang*/
/*
 -  Manejando el patrón de prototipos, debido a que JS no maneja un sistema clásico de herencia
 - el modelo de hernecia prototipado es mas poderoso que el modelo clásico.
*/
/*function persona(nombre){
	this.nombre = nombre;	
}
function empleado(nombre, salario){
	persona.call(this, nombre);
	this.salario = salario;
	console.info(this);
	console.log(nombre, salario);
}
empleado.prototype = delegate(persona.prototype);
empleado.prototype.constructor = empleado;
*/
var tankDelegate = (function(){
	function F() {}
	return (function(obj){
		F.prototype = obj;
		return new F();
	});
})();
function tankBindCall(obj, fn){
	return function(){
		return fn.call(obj);
	};
}
function tankBindApply(obj, fn){
	return function(){
		return fn.apply(obj, arguments);
	}
}
/*end lang*/
/*progress*/
/**
	Clase utilitaria para dibujar el progress (cargando... messages);
	A class that keeps two counters. A counter of the number of tasks left to be done
and a counter of how far the current task has progressed. Execution of the tasks
are outside of ProgressMeter but when progress is made on a task the executor
calls ProgressMeter.progress. This class then issues callbacks to listeners to
inform them of the progress being made. The listeners, typicaly GUI elements,
can inform the user of the progress.

Constructor: 
  tasknames - An Array of (String) names for the tasks to be performed. Used in 
              the callbacks to inform the listeners of the current task name.
  listeners - An array of functions that are to be called on progress. The first
              parameter on the callback is the (String) taskname. The second
              parameters on the callback is the progress as a number between 0
              and 1. The progress indicates overall total progress, not the 
              progress for a single task.
*/
function ProgressMeter(tasknames, listeners) {
    this.tasknames = new Array() ;
    this.tasknames = this.tasknames.concat(tasknames) ;
    this.listeners = new Array() ;
    this.listeners = this.listeners.concat(listeners) ;
	
    this.activeTaskIndex = 0 ;
    this.activeTaskProgress = 0 ;
    this.progressPerTask = 1/this.tasknames.length ;
    this.totalTaskProgress = 0 ;
}

ProgressMeter.prototype = {
    /*
	Function: progress
	
	Used to inform the ProgressMeter that a task has progressed. Issues 
	callbacks to the registered listeners to inform of the progress. The callback
	informs of the overall progress and which task is the current active one.
	
	Parameters:
		fractionComplete - A number between 0 and 1 indicating the progress for
			the current task. When progress is >= 1.0 the ProgressMeter switches 
			the active task to the next. 
	*/
    progress : function(fractionComplete) {
        if (fractionComplete > 1.0) {
            fractionComplete = 1.0 ;
        }
        if (fractionComplete < 0) {
            fractionComplete = 0 ;
        }
        this.activeTaskProgress = fractionComplete ;
        this.totalTaskProgress = this.activeTaskIndex*this.progressPerTask + (this.activeTaskProgress * this.progressPerTask) ;
        this.fireProgress();
        if (this.activeTaskProgress > 0.99) {
            this.activeTaskIndex++ ;
        }
    }, 
    /*
	Function: fireProgress
	
	Internal function, do not call. Issues callbacks to the registered listener
	functions to indicate progress.
	*/
    fireProgress : function() {
        for (var n=0; n<this.listeners.length; n++) {
            this.listeners[n](this.tasknames[this.activeTaskIndex], this.totalTaskProgress); 
        }
    }
};

/*
Class: ProgressBar

Draws a progress bar on the given canvas. Register an instance of this class on
a progress meter and watch the blinken bars.

Constructor:
	ctx - The canvas 2D context to draw on.
	appearance - Optional object defining the appearance of the progress bar.
	
appearance:
	x - The left edge of the progress bar in the canvas. Defaults to 10.
	y - The top edge of the progress bar in the canvas. Defaults to 10.
	width - The width of the progress bar in the canvas. Defaults to 620.
	height - The height of the progress bar in the canvas. Defaults to 40.
*/
function ProgressBar(ctx, appearance) {
    this.ctx = ctx ;
    this.x = 10 ;
    this.y = 10 ;
    this.width = 620 ;
    this.height = 40 ;
    if (appearance) {
        if (appearance.x) {
            this.x = appearance.x ;
        }
        if (appearance.y) {
            this.y = appearance.y ;
        }
        if (appearance.width) {
            this.width = appearance.width ;
        }
        if (appearance.height) {
            this.height = appearance.height ;
        }
    }
    this.gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
    this.gradient.addColorStop(0, "#0000ff");
    this.gradient.addColorStop(1, "#00ff00");
    var fontHeight = (this.height/2)-4 ;
    fontHeight = Math.min(fontHeight, 30);
    this.font = fontHeight + "px sans" ;
}

ProgressBar.prototype = {
    /*
	callback: progress
		
	Callback from a <ProgressMeter> to update the progress bar GUI.
	*/
    progress : function(taskname, progressFraction) {
        this.ctx.fillStyle="#000000" ;
        this.ctx.fillRect(this.x, this.y, this.width, this.height) ;
        this.ctx.fillStyle=this.gradient;
        this.ctx.fillRect(this.x, this.y, this.width * progressFraction, this.height) ;
		
        this.ctx.lineWidth = 2.0 ;
        this.ctx.strokeStyle="#f0f0f0" ;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height) ;
		
        this.ctx.font=this.font ;
        this.ctx.textBaseline="middle";
        var metrics = this.ctx.measureText(taskname) ;
        var textx = this.width/2 - metrics.width/2 + this.x;
        this.ctx.fillStyle="#f0f0f0" ;
        this.ctx.fillText(taskname, textx, this.y+this.height/2, this.width) ;
    }
};
/*end progress*/
/*Canvas*/
var tankCanvas = (function(){
	var self = {},
		width = 640,
		height = 480,
		pixelsPerMeter = 20,
		cameraDefaultWorldViewPortValues = {
			halfWidth: 16,
			helfHeight: 12,
			xoffset: 16,
			yoffset: 12
		},
		cameraDefaultWorldViewPort = {
			lowerBound: new Box2D.Common.Math.b2Vec2(
						cameraDefaultWorldViewPortValues.xoffset - cameraDefaultWorldViewPortValues.halfWidth,
						cameraDefaultWorldViewPortValues.yoffset - cameraDefaultWorldViewPortValues.helfHeight
						),
			upperBound: new Box2D.Common.Math.b2Vec2(
						cameraDefaultWorldViewPortValues.xoffset + cameraDefaultWorldViewPortValues.halfWidth,
						cameraDefaultWorldViewPortValues.yoffset + cameraDefaultWorldViewPortValues.helfHeight
						)		
		},
		cameraWorldViewPort = {
			lowerBound: new Box2D.Common.Math.b2Vec2(cameraDefaultWorldViewPort.lowerBound.x, cameraDefaultWorldViewPort.lowerBound.y),
			upperBound: new Box2D.Common.Math.b2Vec2(cameraDefaultWorldViewPort.upperBound.x, cameraDefaultWorldViewPort.upperBound.y)
		},
		cameraZoom = 1,
		ctx, 
		canvas;
	self.onLoad = function(){
		canvas = document.getElementById('canvas');
		width = canvas.getAttribute('width');
		height = canvas.getAttribute('height');
		ctx = canvas.getContext('2d');
	};
	self.getContext = function(){
		return ctx;	
	};	
	self.getCanvas = function(){
		return canvas;
	};
	self.getCanvasSize = function(){
		return {
			width: width,
			height: height
		};
	};
	self.clear = function(){
		ctx.clearRect(0,0, width, height);
	};
	self.worldToScreen = function(wp){
		var sp = {};
		sp.x = Math.round( (wp.x - cameraWorldViewPort.lowerBound.x) * pixelsPerMeter);
		sp.y = Math.round( (wp.y - cameraWorldViewPort.lowerBound.y) * pixelsPerMeter);
		return sp;
	};
	self.worldToScreenOrigo = function(wp){
		var sp = {};
		sp.x = Math.round(wp.x * pixelsPerMeter);
		sp.y = Math.round(wp.y * pixelsPerMeter);
		return sp;
	};
	self.worldLengthToScreen = function(length){
		return Math.max(1, Math.round(length * pixelsPerMeter));
	};
	self.getViewportAABB = function(){
		return cameraWorldViewPort;
	};
	self.pan = function(x, y){
		cameraWorldViewPort.lowerBound.x+= x;
		cameraWorldViewPort.lowerBound.y+= y;
		cameraWorldViewPort.upperBound.x+= x;
		cameraWorldViewPort.upperBound.y+= y;
	};
	self.panTo = function(x, y){
		cameraWorldViewPort.lowerBound.x = x - cameraDefaultWorldViewPortValues.halfWidth;
		cameraWorldViewPort.lowerBound.y = y - cameraDefaultWorldViewPortValues.helfHeight;
		cameraWorldViewPort.upperBound.x = x + cameraDefaultWorldViewPortValues.halfWidth;
		cameraWorldViewPort.upperBound.y = y + cameraDefaultWorldViewPortValues.helfHeight;
	};
	self.resetCamera = function(){
		cameraWorldViewPort.lowerBound.x = cameraDefaultWorldViewPort.lowerBound.x;
		cameraWorldViewPort.lowerBound.y = cameraDefaultWorldViewPort.lowerBound.y;
		cameraWorldViewPort.upperBound.x = cameraDefaultWorldViewPort.upperBound.x;
		cameraWorldViewPort.upperBound.y = cameraDefaultWorldViewPort.upperBound.y;
	};
	self.setupDebugDraw = function(world){
		var dd = new Box2D.Dynamics.b2DebugDraw();
		dd.SetSprite(ctx);
		dd.SetDrawScale(pixelsPerMeter);
		dd.SetFillAlpha(0.6);
		dd.SetLineThickness(1.0);
		dd.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
		world.SetDebugDraw(dd);
	};
	return self;
}());
/*end canvas*/
/*renderers*/
var ZIndices = {
		Space: 0,
		FarBackground: 1,
		Background: 2,
		Ground: 3,
		Far: 4,
		Normal: 5,
		Near: 6,
		FarOverlay: 7,
		Overlay: 8,
		NearOverlay: 9
};
function FilledCircleRenderer(body, zindex, fillStyle, radius){
	this.body = body;
	this.radius = radius;
	this.fillStyle = fillStyle;
	this.zindex = zindex || ZIndices.Normal;
}
	FilledCircleRenderer.prototype.render = function(){
		var worldPosition = this.body.GetPosition(),
			screenPosition = tankCanvas.worldToScreen(worldPosition),
			ctx = tankCanvas.getContext();
		ctx.fillStyle = this.fillStyle;
		ctx.beginPath();
		ctx.arc(
			screenPosition.x,
			screenPosition.y,
			tankCanvas.worldLengthToScreen(this.radius),
			0,
			Math.PI * 2,	
			false);
		ctx.closePath();
		ctx.fill();	
	}
	FilledCircleRenderer.prototype.getZIndex = function(){
		return this.zindex;
	}	
function GroundRenderer(body, vertices){
	this.body = body;
	this.vertices = vertices;
}	
	GroundRenderer.prototype.render = function(){
		var ctx = tankCanvas.getContext();
		ctx.fillStyle = '#c0c0c0';
		ctx.beginPath();
		var screenCoords = tankCanvas.worldToScreen(this.vertices[0]);
		ctx.moveTo(screenCoords.x, screenCoords.y);
		for(var n=1; n < this.vertices.length; n++){
			screenCoords = tankCanvas.worldToScreen(this.vertices[n]);
			ctx.lineTo(screenCoords.x, screenCoords.y);
		}
		ctx.closePath();
		ctx.fill();
	}	
	GroundRenderer.prototype.getZIndex = function() {
        return ZIndices.Ground ;
    }
function Rotated(body, zindex){
	this.body = body;
	this.zindex = zindex;
}
	Rotated.prototype.render = function(){
		var worldPosition = this.body.GetPosition(),
			screenPosition = tankCanvas.worldToScreen(worldPosition),
			ctx = tankCanvas.getContext();
			ctx.save();
			ctx.translate(screenPosition.x, screenPosition.y);
			ctx.rotate(this.body.GetAngle());
			this.renderRotated();
			ctx.restore();
	}
	Rotated.prototype.renderRotated = function(){
		if(console){
			console.log("Se olvida del renderRotated");	
		}
	}
	Rotated.prototype.getZIndex = function(){
		return this.zindex;
	}
function DeckRenderer(body, length, thickness){
	Rotated.call(this, body, ZIndices.Normal);
	this.length = length;
	this.thickness = thickness;
}
DeckRenderer.prototype = tankDelegate(Rotated.prototype);
	DeckRenderer.prototype.constructor = DeckRenderer;
	DeckRenderer.prototype.renderRotated = function(){
		var lengthPxls = tankCanvas.worldLengthToScreen(this.length),
			thicknessPxls = tankCanvas.worldLengthToScreen(this.thickness),
			ctx = tankCanvas.getContext();
		ctx.fillStyle = '#00ff00';
		ctx.fillRect( -lengthPxls/2, -thicknessPxls/2, lengthPxls, thicknessPxls);	
	}
function ArmRenderer(body, width, height){
	Rotated.call(this, body, ZIndices.Near);
	this.width = width;
	this.height = height;
}
ArmRenderer.prototype = tankDelegate(Rotated.prototype);
	ArmRenderer.prototype.constructor = ArmRenderer;
	ArmRenderer.prototype.renderRotated = function(){
		var widthPxls = tankCanvas.worldLengthToScreen(this.width),
			heightPxls = tankCanvas.worldLengthToScreen(this.height),
			ctx = tankCanvas.getContext();
		ctx.fillStyle = '#456789';	
		ctx.fillRect(-widthPxls/2, -heightPxls/2, widthPxls, heightPxls);
	}
function BodyRenderer(body, vertices){
	Rotated.call(this, body, ZIndices.Normal);
	this.vertices = vertices;
}	
BodyRenderer.prototype = tankDelegate(Rotated.prototype);
	BodyRenderer.prototype.constructor = BodyRenderer;
	BodyRenderer.prototype.renderRotated = function(){
		var ctx = tankCanvas.getContext();
		ctx.fillStyle = '#789abc';
		ctx.beginPath();
		var screenCoords = tankCanvas.worldToScreenOrigo(this.vertices[0]);
		ctx.moveTo(screenCoords.x, screenCoords.y);
		for(var n = 1; n < this.vertices.length; n++){
			screenCoords = tankCanvas.worldToScreenOrigo(this.vertices[n]);
			ctx.lineTo(screenCoords.x, screenCoords.y);
		}
		ctx.closePath();
		ctx.fill();
	}
function tankBotBoxRenderer(body, zindex, fillStyle, width, height){
	Rotated.call(this, body, zindex);
	this.width = width;
	this.height = height;
	this.fillStyle = fillStyle;
}	
tankBotBoxRenderer.prototype = tankDelegate(Rotated.prototype);
	tankBotBoxRenderer.prototype.constructor = tankBotBoxRenderer;
	tankBotBoxRenderer.prototype.renderRotated = function(){
		var widthPxls = tankCanvas.worldLengthToScreen(this.width),
			heightPxls = tankCanvas.worldLengthToScreen(this.height),
			ctx = tankCanvas.getContext();
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(-widthPxls/2, -heightPxls/2, widthPxls, heightPxls);
	}
function tankBotActorStateRenderer(actor){
	this.actor = actor;
}	
	tankBotActorStateRenderer.prototype.render = function(){
		var canvasSize = tankCanvas.getCanvasSize(),
			ctx = tankCanvas.getContext(),
			text = 'Left Desired [Arm Angle:' + (this.actor.leftArmDesiredAngle * (180/Math.PI)).toFixed(1) + "foot translation" + this.actor.leftFootDesiredTranslation.toFixed(1) + "]";
		ctx.textBaseline = "top";
		ctx.font = '14px sans';
		var metrics = ctx.measureText(text),
			textx = canvasSize.width/2 - metrics.width/2;
		ctx.clearRect(20, 0, canvasSize.width - 40, 24);
		ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
		ctx.fillRect(20, 0, canvasSize.width - 40, 24);
		ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.fillText(text, textx, 1, canvasSize.width);
	}
	tankBotActorStateRenderer.prototype.getZIndex = function(){
		return ZIndices.Overlay;
	}
/*end renderers*/
/*actors*/
function tankBotActor(box2dentities){
	if(!box2dentities){
		throw "tankBotActor debe tener entidades Box2D";
	}
	this.box2dentities = box2dentities;
	this.neutralArmAngle = 1; // 57 grados
	this.neutralFootDistance = box2dentities.rightFootJoint.GetLowerLimit() +
		(box2dentities.rightFootJoint.GetUpperLimit() - box2dentities.rightFootJoint.GetLowerLimit()) / 2;
	this.rightArmDesiredAngle = this.neutralArmAngle;
	this.leftArmDesiredAngle = this.neutralArmAngle;
	this.leftFootDesiredTranslation = this.neutralFootDistance;
	this.rightFootDesiredTranslation = this.neutralFootDistance;
	this.renderer = new tankBotActorStateRenderer(this);	
}	
	tankBotActor.prototype.Step = function(timeSinceLastStep){
		//brazos
		//lado derecho joint arm
		var raj = this.box2dentities.rightArmBodyJoint,
			rajAngleError = raj.GetJointAngle() - this.rightArmDesiredAngle;
		raj.SetMotorSpeed(-4 * rajAngleError);	
		//lado izquierdo joint arm
		var laj = this.box2dentities.leftArmBodyJoint,
			lajAngleError = laj.GetJointAngle() + this.leftArmDesiredAngle;
		laj.SetMotorSpeed(-4 * lajAngleError);
		//pies
		//lado pie izquierdo
		var lfj = this.box2dentities.leftFootJoint,
			lfjTranslatorError = lfj.GetJointTranslation() - this.leftFootDesiredTranslation;
		lfj.SetMotorSpeed(-1 * lfjTranslatorError);
		//lado pie derecho
		var rfj = this.box2dentities.rightFootJoint;
			rfjTranslatorError = rfj.GetJointTranslation() - this.rightFootDesiredTranslation;
		rfj.SetMotorSpeed(-1 * rfjTranslatorError);
		tankGameWorld.queueRenderer(this.renderer);	
	}
	tankBotActor.prototype.onkeydown = function(event){
		if(event){
			switch(event.keyIdentifier){
				case 'Right':
					this.leftFootDesiredTranslation += 0.1;
					this.rightFootDesiredTranslation -= 0.1;
					this.rightArmDesiredAngle -=0.1;
					this.leftArmDesiredAngle +=0.1;
					break;
				case 'Left':
					this.leftFootDesiredTranslation -= 0.1;
					this.rightFootDesiredTranslation += 0.1;
					this.rightArmDesiredAngle += 0.1;
					this.leftArmDesiredAngle -= 0.1;
					break;
				case 'Down':
				case 'Up':
					console.log(event.keyIdentifier);
					break;
				case 'Enter':
					tankGameWorld.reset();
					break;
			}
		}
		return true;
	}
/*end actors*/
/*object-factory*/
function tank(sizes){
	sizes = sizes || {};
	sizes.scale = sizes.scale || 1;
	//armando el tank
	sizes.wheelRadius = (sizes.wheelRadius || 0.05) * sizes.scale;
	sizes.boardThickness = (sizes.boardThickness || 0.02) * sizes.scale;
	sizes.boardLength = (sizes.boardLength || 0.82) * sizes.scale;
	sizes.truckOffset = (sizes.truckOffset || 0.18) * sizes.scale;
	//medida en el tank
	var offset = sizes.offset || {};
	offset.x = offset.x || 0;
	offset.y = offset.y || 0;
	//definiendo el body
	var bodyDef = new Box2D.Dynamics.b2BodyDef(),
		fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 1.0;
	fixDef.friction = 0.9;
	fixDef.restitution = 0.1;
	fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(sizes.wheelRadius);
	//rueda trasera
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.position.x = sizes.wheelRadius + offset.x;
	bodyDef.position.y = sizes.wheelRadius + offset.y;
	var backwheel = tankGameWorld.createBody(bodyDef, fixDef);
	backwheel.SetUserData(new FilledCircleRenderer(backwheel, ZIndices.Normal, "#a00000", sizes.wheelRadius));
	//rueda frontal
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.position.x = sizes.boardLength - sizes.wheelRadius + offset.x;
	bodyDef.position.y = sizes.wheelRadius + offset.y;
	var frontwheel = tankGameWorld.createBody(bodyDef, fixDef);
	frontwheel.SetUserData(new FilledCircleRenderer(frontwheel, ZIndices.Normal, "#00a000", sizes.wheelRadius));
	//cubierta
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	fixDef.shape.SetAsBox(sizes.boardLength / 2, sizes.boardThickness / 2);
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.position.x = sizes.boardLength / 2 + offset.x;
	bodyDef.position.y = sizes.boardThickness / 2 + offset.y;
	var board = tankGameWorld.createBody(bodyDef, fixDef);
	board.SetUserData(new DeckRenderer(board, sizes.boardLength, sizes.boardThickness));
	//uniones
	var b2JointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
	b2JointDef.bodyA = backwheel;
	b2JointDef.bodyB = board;
	b2JointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(0, 0);
	b2JointDef.localAnchorB = new Box2D.Common.Math.b2Vec2( -sizes.boardLength/2 + sizes.truckOffset, sizes.wheelRadius);
	tankGameWorld.createJoint(b2JointDef);
	b2JointDef.bodyA = frontwheel;
	b2JointDef.bodyB = board;
	b2JointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(0, 0);
	b2JointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(sizes.boardLength/2 - sizes.truckOffset, sizes.wheelRadius);
	tankGameWorld.createJoint(b2JointDef);
	
	return board;
}
function createDemoGround(){
	var fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 1.0;
	fixDef.friction = 0.9;
	fixDef.restitution = 0.01;
	var bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	var vertices = [
		new Box2D.Common.Math.b2Vec2(0, 10),
		new Box2D.Common.Math.b2Vec2(14, 12),
		new Box2D.Common.Math.b2Vec2(0, 12)
	];
	fixDef.shape = Box2D.Collision.Shapes.b2PolygonShape.AsArray(vertices, vertices.length);
	bodyDef.position.x = 0;
	bodyDef.position.y = 0;
	var staticBody = tankGameWorld.createUntrackedBody(bodyDef, fixDef);
	staticBody.SetUserData(new GroundRenderer(staticBody, vertices));
	vertices = [
		new Box2D.Common.Math.b2Vec2(14, 12),
		new Box2D.Common.Math.b2Vec2(16, 11.5),
		new Box2D.Common.Math.b2Vec2(16, 12)
	];
	fixDef.shape = Box2D.Collision.Shapes.b2PolygonShape.AsArray(vertices, vertices.length);
	bodyDef.position.x = 0;
	bodyDef.position.y = 0;
	staticBody = tankGameWorld.createUntrackedBody(bodyDef, fixDef);
	staticBody.SetUserData(new GroundRenderer(staticBody, vertices));
}
function createRobot(sizes){
	sizes = sizes || {};
	sizes.scale = sizes.scale || 1;
	sizes.offsetx = sizes.offsetx || 0.7 * sizes.scale;
	sizes.offsety = sizes.offsety || -1.7 * sizes.scale;
	var bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	var fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 1.0;
	fixDef.friction = 0.9;
	fixDef.restitution = 0.1;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	var limbHalfWidth = 0.25 * sizes.scale,
		limbHalfHeight = 0.5 * sizes.scale;
	//right leg
	bodyDef.position.x = sizes.offsetx + (0.75 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (3 * sizes.scale);
	fixDef.shape.SetAsBox(limbHalfWidth, limbHalfHeight);
	var rightLeg = tankGameWorld.createBody(bodyDef, fixDef);
	rightLeg.SetUserData(new ArmRenderer(rightLeg, limbHalfWidth *2, limbHalfHeight*2));
	//left leg
	bodyDef.position.x = sizes.offsetx + (1.75 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (3 * sizes.scale);
	fixDef.shape.SetAsBox(limbHalfWidth, limbHalfHeight);	
	var leftLeg = tankGameWorld.createBody(bodyDef, fixDef);
	leftLeg.SetUserData(new ArmRenderer(leftLeg, limbHalfWidth * 2, limbHalfHeight * 2));
	//right arm
	bodyDef.position.x = sizes.offsetx + (2.25 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (1.5 * sizes.scale);
	fixDef.shape.SetAsBox(limbHalfWidth, limbHalfHeight);
	var rightArm = tankGameWorld.createBody(bodyDef, fixDef);
	rightArm.SetUserData(new ArmRenderer(rightArm, limbHalfWidth * 2, limbHalfHeight * 2));
	//left arm
	bodyDef.position.x = sizes.offsetx + (0.25 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (1.5 * sizes.scale);
	fixDef.shape.SetAsBox(limbHalfWidth, limbHalfHeight);
	var leftArm = tankGameWorld.createBody(bodyDef, fixDef);
	leftArm.SetUserData(new ArmRenderer(leftArm, limbHalfWidth*2, limbHalfHeight*2));
	//body
	bodyDef.position.x = sizes.offsetx + (1.25 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (1.25 * sizes.scale);
	var bodyVertices = [
		new Box2D.Common.Math.b2Vec2(-0.75 * sizes.scale, -0.75 * sizes.scale),
		new Box2D.Common.Math.b2Vec2(-0.25 * sizes.scale, -1.25 * sizes.scale),
		new Box2D.Common.Math.b2Vec2(0.25 * sizes.scale, -1.25 * sizes.scale),
		new Box2D.Common.Math.b2Vec2(0.75 * sizes.scale, -0.75 * sizes.scale),
		new Box2D.Common.Math.b2Vec2(0.75 * sizes.scale, 1.25 * sizes.scale),
		new Box2D.Common.Math.b2Vec2(-0.75 * sizes.scale, 1.25 * sizes.scale)
	];
	fixDef.shape.SetAsArray(bodyVertices);
	var body = tankGameWorld.createBody(bodyDef, fixDef);
	body.SetUserData(new BodyRenderer(body, bodyVertices));
	//Arm joints
	var b2JointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
	b2JointDef.bodyA = body;
	var joint;
	//Right arm
	b2JointDef.bodyB = rightArm;
	b2JointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(0.75 * sizes.scale, -0.25 * sizes.scale);
	b2JointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(-limbHalfWidth, -limbHalfHeight);
	b2JointDef.lowerAngle = -Math.PI;
	b2JointDef.upperAngle = 0.5;
	b2JointDef.enableLimit = true;
	tankGameWorld.createJoint(b2JointDef);
	//Left Arm
	b2JointDef.bodyB = leftArm;
	b2JointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(-0.75 * sizes.scale, -0.25 * sizes.scale);
	b2JointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(limbHalfWidth, limbHalfHeight);
	b2JointDef.lowerAngle = -0.5;
	b2JointDef.upperAngle = Math.PI;
	b2JointDef.enableLimit = true;
	tankGameWorld.createJoint(b2JointDef);
	//Leg joints
	b2JointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
	b2JointDef.bodyA = body;
	b2JointDef.localAxisA = new Box2D.Common.Math.b2Vec2(0,1);
	b2JointDef.lowerTranslation = -0.5 *sizes.scale;
	b2JointDef.upperTranslation = 0.5 * sizes.scale;
	b2JointDef.enableLimit = true;
	//Right Leg
	b2JointDef.bodyB = rightLeg;
	b2JointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(0.5 * sizes.scale, 1.25 * sizes.scale);
	b2JointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(0 * sizes.scale, -limbHalfHeight);
	tankGameWorld.createJoint(b2JointDef);
	//Left Leg
	b2JointDef.bodyB = leftLeg;
	b2JointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(-0.5 * sizes.scale, 1.25 * sizes.scale);
	b2JointDef.localAnchorB = new Box2D.Common.Math.b2Vec2( 0 * sizes.scale, -limbHalfHeight);
	tankGameWorld.createJoint(b2JointDef);
}
function createTankRobot(sizes){
	sizes = sizes || {};
	sizes.scale = sizes.scale || 1;
	sizes.offsetx = sizes.offsetx || 0 * sizes.scale;
	sizes.offsety = sizes.offsety || 0 * sizes.scale;
	var bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	var fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 1.0;
	fixDef.friction = 0.9;
	fixDef.restitution = 0.1;
	//head
	//position: 1.25, 0.5
	//radius: 0.5
	var radius = 0.5 * sizes.scale;
	bodyDef.position.x = sizes.offsetx + (1.25 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (0.5 * sizes.scale);
	fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(radius);
	var head = tankGameWorld.createBody(bodyDef, fixDef);
	head.SetUserData(new FilledCircleRenderer(head, ZIndices.Near, "#123456", radius));
	//body
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	//position 1.25, 1.75
	//halfWidth = halfHeight = 0.75
	var bodyHalfSize = 0.75 * sizes.scale;
	bodyDef.position.x = sizes.offsetx + (1.25 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (1.75 * sizes.scale);
	fixDef.shape.SetAsBox(bodyHalfSize, bodyHalfSize);
	var body = tankGameWorld.createBody(bodyDef, fixDef);
	body.SetUserData(new tankBotBoxRenderer(body, ZIndices.Normal, "#123456", bodyHalfSize * 2, bodyHalfSize * 2));
	//Arms
	var armHalfWidth = 0.25 * sizes.scale,
		armHalfHeight = 0.75 * sizes.scale;
	//// Right arm
    // Position: 0.25, 1.75
    // Halfwidth: 0.25 Halfheight: 0.75
    bodyDef.position.x = sizes.offsetx + (0.25 * sizes.scale);
    bodyDef.position.y = sizes.offsety + (1.75 * sizes.scale);
    fixDef.shape.SetAsBox(armHalfWidth, armHalfHeight);
    var rightArm = tankGameWorld.createBody(bodyDef, fixDef) ; 
    rightArm.SetUserData(new tankBotBoxRenderer(rightArm, ZIndices.Far, "#987654", armHalfWidth * 2, armHalfHeight * 2)) ;
	//Left arm
	//Position 2.25, 1.75
	//HalfWidth 0.25 HalfHeight 0.75
	bodyDef.position.x = sizes.offsetx + (2.25 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (1.75 * sizes.scale);
	fixDef.shape.SetAsBox(armHalfWidth, armHalfHeight);
	var leftArm = tankGameWorld.createBody(bodyDef, fixDef);
	leftArm.SetUserData(new tankBotBoxRenderer(leftArm, ZIndices.Far, "#456789", armHalfWidth * 2, armHalfHeight * 2));
	//Legs
	var legHalfWidth = 0.25 * sizes.scale,
		legHalfHeight = 0.5 * sizes.scale;
	//Right Leg
	//Position 0.75, 3.0
	//HalfWidth 0.25 HalfHeight 0.5
	bodyDef.position.x = sizes.offsetx + (0.75 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (3.0 * sizes.scale);
	fixDef.shape.SetAsBox(legHalfWidth, legHalfHeight);
	var rightLeg = tankGameWorld.createBody(bodyDef, fixDef);
	rightLeg.SetUserData(new tankBotBoxRenderer(rightLeg, ZIndices.Normal, "#a0b0c0", legHalfWidth * 2, legHalfHeight * 2));
	//Left Leg
	//Position: 1.75, 3
	//HalfWidth: 0.25 halfHeight: 0.5
	bodyDef.position.x = sizes.offsetx + (1.75 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (3.0 * sizes.scale);
	fixDef.shape.SetAsBox(legHalfWidth, legHalfHeight);
	var leftLeg = tankGameWorld.createBody(bodyDef, fixDef);
	leftLeg.SetUserData(new tankBotBoxRenderer(leftLeg, ZIndices.Normal, "#c0b0a0", legHalfWidth * 2, legHalfHeight * 2));
	//Feet
	var feetHalfWidth = 0.25 * sizes.scale,
		feetHalfHeight = 0.5 * sizes.scale;
	//Right foot
	//Position 0.75, 3.75
	//HalfWidth = HalfHeight = 0.5
	bodyDef.position.x = sizes.offsetx + (0.75 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (3.75 * sizes.scale);
	fixDef.shape.SetAsBox(feetHalfWidth, feetHalfHeight);
	var rightFoot = tankGameWorld.createBody(bodyDef, fixDef);
	rightFoot.SetUserData(new tankBotBoxRenderer(rightFoot, ZIndices.Near, "#102030", feetHalfWidth * 2, feetHalfHeight * 2));
	//Left foot
	//Position 1.75, 3.75
	// Halfwidth = Halfheight: 0.25
	bodyDef.position.x = sizes.offsetx + (1.75 * sizes.scale);
	bodyDef.position.y = sizes.offsety + (3.75 * sizes.scale);
	fixDef.shape.SetAsBox(feetHalfWidth, feetHalfHeight);
	var leftFoot = tankGameWorld.createBody(bodyDef, fixDef);
	leftFoot.SetUserData(new tankBotBoxRenderer(leftFoot, ZIndices.Near, "#302010", feetHalfWidth * 2, feetHalfHeight * 2));
	//Joints
	var revolutionJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
	revolutionJointDef.enableLimit = true;
	//Head body revolution joint
	//BodyA = body
	//BodyB = head
	//BodyA-pos: 0, -0.75
	//BodyB-pos: 0, 0.5
	revolutionJointDef.bodyA = body;
	revolutionJointDef.bodyB = head;
	revolutionJointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(0, -0.75 * sizes.scale);
	revolutionJointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(0, 0.5 * sizes.scale);
	revolutionJointDef.lowerAngle = - (Math.PI / 8); //180/8 = 22.5 grados
	revolutionJointDef.upperAngle = Math.PI / 8;
	var headBodyJoint = tankGameWorld.createJoint(revolutionJointDef);
	//Arm joints
	revolutionJointDef.maxMotorTorque = 10.0;
	revolutionJointDef.motorSpeed = 0.0;
	revolutionJointDef.enableMotor = true;
	//Right arm-body revolution joint
	//BodyA = body
	//BodyB = right arm
	//BodyA-pos: -0.75, -0.75
	//BodyB-pos: 0.25, -0.75
	revolutionJointDef.bodyA = body;
	revolutionJointDef.bodyB = rightArm;
	revolutionJointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(-0.75 * sizes.scale, -0.75 * sizes.scale);
	revolutionJointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(0.25 * sizes.scale, -0.75 * sizes.scale);
	revolutionJointDef.lowerAngle = -(Math.PI / 8); // 180/8 = 22.5 grados
	revolutionJointDef.upperAngle = Math.PI;
	var rArmBodyBodyJoint = tankGameWorld.createJoint(revolutionJointDef);
	//Left arm-body revolution joint
	//BodyA = body
	//BodyB = left arm
	//BodyA-pos = 0.75, -0.75
	//BodyB-pos = -0.25, -0.75
	revolutionJointDef.bodyA = body;
	revolutionJointDef.bodyB = leftArm;
	revolutionJointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(0.75 * sizes.scale, -0.75 * sizes.scale);
	revolutionJointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(-0.25 * sizes.scale, -0.75 * sizes.scale);
	revolutionJointDef.lowerAngle = -Math.PI;
	revolutionJointDef.upperAngle = Math.PI/8; // 180/8 = 22.5 grados
	var lArmBodyBodyJoint = tankGameWorld.createJoint(revolutionJointDef);
	//Right leg-body revolution joint
	//BodyA = body
	//BodyB = right leg
	//BodyA-pos: -0.5, 0.75
	//BodyB-pos: 0, -0.5
	revolutionJointDef.bodyA = body;
	revolutionJointDef.bodyB = rightLeg;
	revolutionJointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(-0.5 * sizes.scale, 0.75 * sizes.scale);
	revolutionJointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(0, -0.5 * sizes.scale);
	revolutionJointDef.lowerAngle = -Math.PI/8; //180/8 = 22.5 grados
	revolutionJointDef.upperAngle = Math.PI/8; //180/8 = 22.5 grados
	var rLegBodyBodyJoint = tankGameWorld.createJoint(revolutionJointDef);
	//Left leg-body revolution joint
	//BodyA = body
	//BodyB = left leg
	//BodyA-pos: 0.5, 0.75
    //BodyB-pos: 0, -0.5
    revolutionJointDef.bodyA = body;
    revolutionJointDef.bodyB = leftLeg;
    revolutionJointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(0.5 * sizes.scale, 0.75 * sizes.scale);
    revolutionJointDef.localAnchorB =  new Box2D.Common.Math.b2Vec2(0, -0.5 * sizes.scale);
    revolutionJointDef.lowerAngle = -Math.PI / 8 ; // 180/8 = 22.5 degrees
    revolutionJointDef.upperAngle = Math.PI / 8 ; // 180/8 = 22.5 degrees
    var lLegBodyBodyJoint = tankGameWorld.createJoint(revolutionJointDef) ; 
	    //// Feet joints
    var prismaticJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
    prismaticJointDef.enableLimit = true ;
    prismaticJointDef.localAxisA =  new Box2D.Common.Math.b2Vec2(0,1);
    prismaticJointDef.lowerTranslation = -feetHalfHeight * 2 * sizes.scale ;
    prismaticJointDef.upperTranslation = feetHalfHeight * 2 * sizes.scale ;
    prismaticJointDef.maxMotorForce = 10.0 ;
    prismaticJointDef.motorSpeed = 0.0 ;
    prismaticJointDef.enableMotor = true;

    //// Right leg-Right foot prismatic joint
    // BodyA = right leg
    // BodyB = right foot
    // BodyA-pos: 0, 0.5
    // BodyB-pos: 0, -0.25
    prismaticJointDef.bodyA = rightLeg;
    prismaticJointDef.bodyB = rightFoot;
    prismaticJointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(0, 0.5 * sizes.scale);
    prismaticJointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(0, -feetHalfHeight * 2 * sizes.scale);
    var lFootJoint = tankGameWorld.createJoint(prismaticJointDef) ;

    
    //// Left leg-Left foot prismatic joint
    // BodyA = left leg
    // BodyB = left foot
    // BodyA-pos: 0, 0.5
    // BodyB-pos: 0, -0.25
    prismaticJointDef.bodyA = leftLeg;
    prismaticJointDef.bodyB = leftFoot;
    prismaticJointDef.localAnchorA = new Box2D.Common.Math.b2Vec2(0, 0.5 * sizes.scale);
    prismaticJointDef.localAnchorB = new Box2D.Common.Math.b2Vec2(0, -feetHalfHeight * 2 * sizes.scale);
    var rFootJoint = tankGameWorld.createJoint(prismaticJointDef) ;

    return {
        body : body,
        head : head,
        headBodyJoint : headBodyJoint,
        rightArm : rightArm,
        rightArmBodyJoint: rArmBodyBodyJoint,
        leftArm : leftArm,
        leftArmBodyJoint: lArmBodyBodyJoint,
        rightLeg : rightLeg,
        rightLegBodyJoint : rLegBodyBodyJoint,
        leftLeg : leftLeg,
        leftLegBodyJoint : lLegBodyBodyJoint,
        rightFoot : rightFoot,
        rightFootJoint : rFootJoint,
        leftFoot : leftFoot,
        leftFootJoint : lFootJoint
    } ;
	
}
/*end object-factory*/
/*box2d-world*/
var tankGameWorld = (function(){
	var debugDraw = false,
		self = {},
		bodies,
		joints,
		world,
		actors,
		timerID,
		lastFrameTime,
		renderCallBack = tankBindApply(self, renderFixtures),
		deck,
		cameraFollowsDeck = true,
		renderers = [];
	function initFixtures(progressMeter){
		createDemoGround();
		if(progressMeter){
			progressMeter.progress(0.4);
		}
	}
	function initBodies(progressMeter){
		deck = new tank({
			scale: 2,
			offset:{
				x:1.2,
				y:9.8
			}
		});
		if(progressMeter){
			progressMeter.progress(0.5);
		}
		var tankBody = createTankRobot({
			offsetx: 1,
			offsety: 6.5,
			scale: 0.8
		});
		var tankActor = new tankBotActor(tankBody);
		self.addActor(tankActor);
		window.onkeydown = tankBindApply(tankActor, tankActor.onkeydown);
		
		if(progressMeter){
			progressMeter.progress(0.6);
		}
	}
	function Step(){
		if(!world.IsLocked()){
			//advance physics
			world.Step(1/30, 10, 10);
			//Let AI-actors advance
			var now = new Date().getTime(),
				timeSinceLastFrame = now - lastFrameTime,
				lastFrameTime = now;
			for(var n = 0; n < actors.length; n++){
				actors[n].Step(timeSinceLastFrame);
			}
			if(cameraFollowsDeck){
				var wp = deck.GetPosition();
				tankCanvas.panTo(wp.x, wp.y);
			}
			//Renderers
			if(debugDraw){
				world.DrawDebugData();
			}else{
				tankCanvas.clear();
				var viewPortAABB = tankCanvas.getViewportAABB();
				world.QueryAABB(renderCallBack, viewPortAABB);
				for(var n = 0; n < renderers.length; n++){
					var renderer = renderers[n].pop();
					while(renderer){
						renderer.render();
						renderer = renderers[n].pop();
					}
				}
			}
			world.ClearForces();
		}else{
			if(console){
				console.log("World is locked when entering step");
			}
		}
	}
	function renderFixtures(b2Fixture){
		// TODO: bodies with several fixtures will be rendered several times using this. Might be ok
		var userdata = b2Fixture.GetBody().GetUserData();
		if(userdata){
			self.queueRenderer(userdata);
		}
		return true;
	}
	function start(){
		lastFrameTime = new Date().getTime();
		var callback = tankBindCall(self, Step);
		timerID = window.setInterval(callback, 1000/30);
	}
	self.queueRenderer = function(renderer){
		renderers[renderer.getZIndex()].push(renderer);
	};
	self.onLoad = function(){
		var progressBar = new ProgressBar(tankCanvas.getContext()),
			progressMeter = new ProgressMeter("Inicializando",[
					tankBindApply(progressBar, progressBar.progress),
					function(taskname, progressFraction){
						console.log("Progress[" + taskname +"]=" + progressFraction * 100 + "%");
					}
				]);
		//inicializando globales
		bodies = [],
		joints = [],
		actors = [],
		world = new Box2D.Dynamics.b2World(
					new Box2D.Common.Math.b2Vec2(0,10), true);
		//setUp debug draw
		if(debugDraw){
			tankCanvas.setupDebugDraw(world);
		}	
		progressMeter.progress(0.1);
		//setUp Game world
		initFixtures(progressMeter);
		initBodies(progressMeter);
		progressMeter.progress(0.7);
		for(var n=0; n<10; n++){
			renderers[n] = [];
		}
		progressMeter.progress(1.0);
		tankCanvas.clear();
		start();
	};
	self.reset = function(){
		tankCanvas.clear();
		var n;
		window.clearInterval(timerID);
		//destruyendo los joints existentes
		for(n = 0; n < joints.length; n++){
			world.DestroyJoint(joints[n]);
		}
		joints = [];
		//destruyendo bodies existentes
		for(n = 0; n < bodies.length; n++){
			world.DestroyBody(bodies[n]);
		}
		bodies = [];
		actors = [];
		//setUp Game World
		initBodies();
		start();
	};
	self.toggleFollow = function(){
		cameraFollowsDeck = !cameraFollowsDeck;
	};
	self.createBody = function(bodyDef, fixtureDef){
		var body = self.createUntrackedBody(bodyDef, fixtureDef);
		bodies.push(body);
		return body;
	};
	self.createUntrackedBody = function(bodyDef, fixtureDef){
		var fixtureDefinitions = [];
		fixtureDefinitions = fixtureDefinitions.concat(fixtureDef);
		var body = world.CreateBody(bodyDef);
		for(var n = 0; n < fixtureDefinitions.length; n++){
			body.CreateFixture(fixtureDefinitions[n]);
		}
		return body;	
	};
	self.createJoint = function(jointDef){
		var joint = world.CreateJoint(jointDef);
		joints.push(joint);
		return joint;
	};
	self.addActor = function(actor){
		if(actor){
			actors.push(actor);
		}
	};
	self.removeActor = function(actor){
		actors = actors.filter(function(curValue, curIndex, curArray){
			return (element != actor);
		});
	}
	return self;
}()); 
window.onload = function(){
	tankCanvas.onLoad();
	tankGameWorld.onLoad();
}
/*end box2d-world*/