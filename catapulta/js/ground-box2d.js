var theGroundMove = (function(world, ctx){
	var config = {
		texto: 'a'
	},
	draw = function(){
		console.log(config.texto);
	};
	return{
		config: config,
		draw:draw
	}
}());
var testStatic = function(wB2, ctx){
	var bodyDef,
		config =  {
			w:5,
			h:5,
			x:20,
			y:20
	},
	cambiarPos = function(w , h, x, y){
	  config.w = w;
	  config.h = h;
	  config.x = x;
	  config.y = y;
	  remove();
	  //draw();				
	},
	getBody = function(){
	  return bodyDef;
	},
	remove = function(){
	 ctx.clearRect( 0 , 0 , cnv.width, cnv.height );
	 world.DestroyBody(bodyDef);	
	},
	draw = function(){
			/*fixture def*/
			var fixDef = new b2FixtureDef();
			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;
			/*body def*/
			bodyDef = new b2BodyDef();
			bodyDef.type = b2Body.b2_staticBody;
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(config.w/wScale, config.h/wScale);
			bodyDef.position.Set(config.x/wScale, config.y/wScale);
			world.CreateBody(bodyDef).CreateFixture(fixDef);
	};
	return {
		getBody: getBody,
		cambiarPos: cambiarPos,
		draw : draw
	}
}(world, ctx);