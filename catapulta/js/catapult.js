//http://www.emanueleferonato.com/2010/05/04/following-a-body-with-the-camera-in-box2d-the-smart-way/
var catapult = function(){
	//basenames
	var b2Vec2 = Box2D.Common.Math.b2Vec2, 
		b2AABB = Box2D.Collision.b2AABB,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2MassData = Box2D.Collision.Shapes.b2MassData,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2Shape = Box2D.Collision.Shapes.b2Shape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
        b2MouseJoint =  Box2D.Dynamics.Joints.b2MouseJoint,
        mouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
        b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
        b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
        b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
	//subnames
    var world = new b2World(new b2Vec2(0,10),true),
		world_scale = 30,
		the_cannonball_itself,
		catapult_chassis_body,
		catapult_arm_body,
        rear_wheel_body,
        front_wheel_body,
        arm_revolute_joint,
        front_wheel_revolute_joint,
        rear_wheel_revolute_joint,
        left_key_pressed,
        right_key_pressed,
        following_catapult,
		cnv = document.getElementById('canvas'),
		ctx = cnv.getContext('2d');
	return {
        init:function(){
			//debug
			this.debug_draw();
			this.the_ground_box();
			this.the_catapult_body();
			this.the_catapult_arm();
			this.the_catapult_motor();
			this.the_wheels();
			this.the_wheel_motors();
			this.the_cannonball();
			//events
			this.bindEvents();
        },
        the_cannonball:function(){
            var cannonball = new b2BodyDef;
            cannonball.position.Set(90/world_scale, 90/world_scale);
            cannonball.type = b2Body.b2_dynamicBody;
            var ball = new b2CircleShape(10/world_scale);
            var cannonball_fixture = new b2FixtureDef;
            cannonball_fixture.shape = ball;
            cannonball_fixture.friction = 0.9;
            cannonball_fixture.density = 20;
            cannonball_fixture.restitution = 0.5;
            the_cannonball_itself = world.CreateBody(cannonball);
            the_cannonball_itself.CreateFixture(cannonball_fixture);
		},
        the_wheel_motors:function(){
			var front_wheel_joint = new b2RevoluteJointDef;
            front_wheel_joint.enableMotor = true;
            front_wheel_joint.Initialize(catapult_chassis_body, front_wheel_body, new b2Vec2(0,0));
            front_wheel_joint.localAnchorA = new b2Vec2(80/world_scale, 0);
            front_wheel_joint.localAnchorB = new b2Vec2(0,0);
            front_wheel_revolute_joint = world.CreateJoint(front_wheel_joint);
            front_wheel_revolute_joint.SetMaxMotorTorque(1000000);
            //
            var rear_wheel_joint = new b2RevoluteJointDef;
            rear_wheel_joint.enableMotor = true;
            rear_wheel_joint.Initialize(catapult_chassis_body, rear_wheel_body, new b2Vec2(0,0));
            rear_wheel_joint.localAnchorA = new b2Vec2(-80/world_scale, 0);
            rear_wheel_joint.localAnchorB = new b2Vec2(0,0);
            rear_wheel_revolute_joint = world.CreateJoint(rear_wheel_joint);
            rear_wheel_revolute_joint.SetMaxMotorTorque(1000000);
		},
        the_wheels:function(){
            var rear_wheel = new b2BodyDef;
            rear_wheel.position.Set(250/world_scale, 200/world_scale);
            rear_wheel.type = b2Body.b2_dynamicBody;
            var rear_wheel_shape = new b2CircleShape(40/world_scale);
            var rear_wheel_fixture = new b2FixtureDef;
            rear_wheel_fixture.shape = rear_wheel_shape;
            rear_wheel_fixture.friction = 0.9;
            rear_wheel_fixture.density = 30;
            rear_wheel_fixture.restitution = 0.1;
            rear_wheel_body = world.CreateBody(rear_wheel);
            rear_wheel_body.CreateFixture(rear_wheel_fixture);
            //
            var front_wheel = new b2BodyDef;
            front_wheel.position.Set(450/world_scale, 200/world_scale);
            front_wheel.type = b2Body.b2_dynamicBody;
            var front_wheel_shape = new b2CircleShape(40/world_scale);
            var front_wheel_fixture = new b2FixtureDef;
            front_wheel_fixture.shape = front_wheel_shape;
            front_wheel_fixture.friction = 0.9;
            front_wheel_fixture.density = 30;
            front_wheel_fixture.restitution = 0.1;
            front_wheel_body = world.CreateBody(front_wheel);
            front_wheel_body.CreateFixture(front_wheel_fixture);    
		},
        the_catapult_motor: function(){
            var arm_point = new b2RevoluteJointDef;
            arm_point.enableMotor = true;
            arm_point.enableLimit = true;
            arm_point.Initialize(catapult_chassis_body, catapult_arm_body, new b2Vec2(0,0));
            arm_point.localAnchorA = new b2Vec2(-80/world_scale, -90/world_scale);
            arm_point.localAnchorB = new b2Vec2(60/world_scale, 0);
            arm_revolute_joint = world.CreateJoint(arm_point);
            arm_revolute_joint.SetMotorSpeed(1000);
            arm_revolute_joint.SetLimits(-Math.PI,Math.PI/3);
            arm_revolute_joint.SetMaxMotorTorque(1);
		},
        the_catapult_arm: function(){
            var catapult_arm = new b2BodyDef;
            catapult_arm.allowSleep = false;
            catapult_arm.position.Set(210/world_scale, 110/world_scale);
            catapult_arm.type = b2Body.b2_dynamicBody;
            var arm_part = new b2PolygonShape;
            arm_part.SetAsOrientedBox(150/world_scale, 10/world_scale, new b2Vec2(0,0),0);
            var arm_part_fixture = new b2FixtureDef;
            arm_part_fixture.shape = arm_part;
            arm_part_fixture.friction = 0.9;
            arm_part_fixture.density = 5;
            arm_part_fixture.restitution = 0.1;
            var stopper = new b2PolygonShape;
            stopper.SetAsOrientedBox(10/world_scale, 20/world_scale, new b2Vec2(-140/world_scale, -30/world_scale),0);
            var stopper_fixture = new b2FixtureDef;
            stopper_fixture.shape = stopper;
            stopper_fixture.friction = 0.9;
            stopper_fixture.density = 10;
            stopper_fixture.restitution = 0.1;
            catapult_arm_body = world.CreateBody(catapult_arm);
            catapult_arm_body.CreateFixture(arm_part_fixture);
            catapult_arm_body.CreateFixture(stopper_fixture);
		},
        the_catapult_body:function(){
            var catapult_body = new b2BodyDef;
            catapult_body.position.Set(350/world_scale, 200/world_scale);
            catapult_body.type = b2Body.b2_dynamicBody;
            var main_part = new b2PolygonShape;
            main_part.SetAsOrientedBox(125/world_scale, 20/world_scale, new b2Vec2(0,0),0);
            var chassis_fixture = new b2FixtureDef;
            chassis_fixture.shape = main_part;
            chassis_fixture.friction = 0.9;
            chassis_fixture.density = 50;
            chassis_fixture.restitution = 0.1;
            var fixed_arm = new b2PolygonShape;
            fixed_arm.SetAsOrientedBox(20/world_scale, 60/world_scale, new b2Vec2(-80/world_scale,-40/world_scale),0);
            var fixed_arm_fixture = new b2FixtureDef;
            fixed_arm_fixture.shape = fixed_arm;
            fixed_arm_fixture.friction = 0.9;
            fixed_arm_fixture.density = 1;
            fixed_arm_fixture.restitution = 0.1;
            catapult_chassis_body = world.CreateBody(catapult_body);
            catapult_chassis_body.CreateFixture(chassis_fixture);
            catapult_chassis_body.CreateFixture(fixed_arm_fixture);
		},
        the_ground:function(){
            var ground = new b2BodyDef;
            ground.position.Set(2500/world_scale, 400/world_scale);
            var my_box = new b2PolygonShape;
            my_box.SetAsBox(2500/world_scale, 15/world_scale);
            var ground_fixture = new b2FixtureDef;
            ground_fixture.shape = my_box;
            ground_fixture.friction = 0.9;
            ground_fixture.restitution = 0.1;
            var the_ground_itself = world.CreateBody(ground);
            the_ground_itself.CreateFixture(ground_fixture);
			return  ground;
		},
		the_ground_box: function(){
			var groundBox = new b2BodyDef();
			groundBox.position.Set(2500/world_scale, 400/world_scale);
			
			var my_box = new b2PolygonShape();
			my_box.SetAsBox( 2500/world_scale, 15/world_scale);
			
			var ground_fixture = new b2FixtureDef();
			ground_fixture.shape = my_box;
			ground_fixture.friction = 0.9;
			ground_fixture.restitution = 0.1;
			
			var my_box2 = new b2PolygonShape();
			my_box2.SetAsOrientedBox(15/world_scale, 350/world_scale, new b2Vec2(2485/world_scale, -335/world_scale), 0);
			var right_wall_fixture = new b2FixtureDef();
			right_wall_fixture.shape = my_box2;
			right_wall_fixture.friction = 0.9;
			right_wall_fixture.restitution = 0.1;

			var my_box3 = new b2PolygonShape();
			my_box3.SetAsOrientedBox(15/world_scale, 350/world_scale, new b2Vec2(-2485/world_scale, -335/world_scale), 0);
			var left_wall_fixture = new b2FixtureDef();
			left_wall_fixture.shape = my_box3;
			left_wall_fixture.friction = 0.9;
			left_wall_fixture.restitution = 0.1;
			
			var my_box4 = new b2PolygonShape();
			my_box4.SetAsOrientedBox(2500/world_scale, 15/world_scale, new b2Vec2(0, -670/world_scale), 0);
			var roof_fixture = new b2FixtureDef();
			roof_fixture.shape = my_box4;
			roof_fixture.friction = 0.9;
			roof_fixture.restitution = 0.1;
			
			var the_ground_itself = world.CreateBody(groundBox);
			the_ground_itself.CreateFixture(ground_fixture);
			the_ground_itself.CreateFixture(right_wall_fixture);
			the_ground_itself.CreateFixture(left_wall_fixture);
			the_ground_itself.CreateFixture(roof_fixture);
			//http://www.emanueleferonato.com/2010/05/04/following-a-body-with-the-camera-in-box2d-the-smart-way/
		},
        debug_draw:function(){
            var debug_draw = new b2DebugDraw;
            debug_draw.SetSprite(document.getElementById("canvas").getContext("2d"));
            debug_draw.SetDrawScale(30.0);
            debug_draw.SetFillAlpha(0.5);
            debug_draw.SetLineThickness(1.0);
            debug_draw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            world.SetDebugDraw(debug_draw);
		},
        set_motor_speed:function(){
            var current_speed;
            if(right_key_pressed){
				current_speed = 1;
            }
            if(left_key_pressed){
                current_speed = -1;
			}
            if(!right_key_pressed && !left_key_pressed){
                current_speed = rear_wheel_revolute_joint.GetMotorSpeed()*0.9;
                if(Math.abs(current_speed)<0.1){
					current_speed = 0;
                }
			}
            rear_wheel_revolute_joint.SetMotorSpeed(current_speed);
            front_wheel_revolute_joint.SetMotorSpeed(current_speed);
		},
        bindEvents:function(){
            $(document).keydown(function(e){
                switch(e.which){
					case 39: 
						right_key_pressed=false;
					break;
                    case 37:
                        left_key_pressed=false;
					break;
				}               
			});
            $(document).keyup(function(e){
				switch(e.which){
					case 39 :
						right_key_pressed=true;
                        left_key_pressed=false;
					break;
                    case 37 :
                        left_key_pressed=true;
                        right_key_pressed=false;
					break;
                    case 32 :
                        arm_revolute_joint.SetMaxMotorTorque(10000);
                        following_catapult = false;
					break;
				}                       
			});
		},
        update: function(){
            var pos_x, pos_y, msje = "";
            this.set_motor_speed();
            world.Step(
				1/30, //frame-rate
                10,     //velocity-iterations
                10 //position-iterations
			);
            if(following_catapult){
				pos_x = catapult_chassis_body.GetWorldCenter().x * world_scale;
                pos_y = catapult_chassis_body.GetWorldCenter().y * world_scale;
			}else{
                pos_x = the_cannonball_itself.GetWorldCenter().x * world_scale;
                pos_y = the_cannonball_itself.GetWorldCenter().y * world_scale;
			}
            pos_x = -1 * (pos_x - (cnv.width/2));
			pos_xx = pos_x;
            if(pos_xx < 0-4200 ){
			   pos_xx = -4200;
			}
			if(pos_xx > 0){
			   pos_xx = 0;       
			}
			x = pos_xx;
			pos_y = -1 * (pos_y - (cnv.height/2));
			pos_yy = pos_y;
			if( pos_yy < 0-15){
				pos_yy = -15;
			}
			if(pos_yy > 285){
				pos_yy = 285;
			}
			y = pos_yy;
			document.getElementById("textarea-x-y").textContent = "X:"+ -1*pos_x +"\nY:"+ -1*pos_y;
			document.getElementById("textarea-xx-yy").textContent = "X:"+ pos_xx +"\nY:"+pos_yy;
			world.ClearForces();
            ctx.clearRect(0,0, cnv.width, cnv.height);
			ctx.save();
			ctx.translate(x , y);
			world.DrawDebugData();
			ctx.restore();
		}
	}
}();
catapult.init();
(function loop(){
	catapult.update();
	requestAnimFrame(loop);       
})();