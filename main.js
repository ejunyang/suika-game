import { Bodies, Body, Collision, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS_BASE } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});


const world = engine.world;
const leftWall = Bodies.rectangle(15, 395, 30, 790, {//Bodies.rectangle(x,y,width,height);
  isStatic: true,
  render: {fillStyle: "#E6B143"}
}) 

const rightWall = Bodies.rectangle(605, 395, 30, 790, {//Bodies.rectangle(x,y,width,height);
  isStatic: true,
  render: {fillStyle: "#E6B143"}
}) 

const ground = Bodies.rectangle(310, 820, 620, 60, {//Bodies.rectangle(x,y,width,height);
  isStatic: true,
  render: {fillStyle: "#E6B143"}
}) 

const topLine = Bodies.rectangle(310, 150, 620, 2, {//Bodies.rectangle(x,y,width,height);
  isStatic: true,
  isSensor: true,
  render: {fillStyle: "#E6B143"}
}) 

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);


let currentBody = null;
let currentFruit = null;
let disableAction = false; //액션X

function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS_BASE[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      //sprite: { texture: `${fruit.name}.png` }
    },
    restitution: 0.2, //튀는 모션
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}


window.onkeydown = (event) => {
  if (disableAction){
    return;
  }

  switch(event.code){
    case "KeyA":
      Body.setPosition(currentBody, {
        x: currentBody.position.x - 10,
        y: currentBody.position.y,
      });
    break;
  
    case "KeyD":
      Body.setPosition(currentBody, {
        x: currentBody.position.x + 10,
        y: currentBody.position.y,
      });
      break;

    case "KeyS":
      currentBody.isSleeping = false;
      disableAction= true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      },1000);

      break;
  }
}



//충돌
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index){

      if (index === FRUITS_BASE.length -1){
        return; //수박일때
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS_BASE[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          sprite: { texture: `${newFruit.name}.png` },
          index: index + 1,
        }
      );

      World.add(world, newBody);
    }
  });
});

addFruit();


