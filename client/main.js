// Import the Discord Embedded App SDK module
import { DiscordSDK } from "@discord/embedded-app-sdk";
import * as THREE from 'three';

// Import images and styles

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'sounds/Caramelldansen.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.1 );
  sound.play();
});
scene.add(sound);

export const addObjectClickListener = (
  camera,
  scene,
  raycaster,
  objectToWatch,
  onMouseClick,
) => {
  const objectToWatchId = objectToWatch.uuid;
  let mouse = new THREE.Vector2();

  document.addEventListener(
    "click",
    (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      const isIntersected = intersects.find(
        (intersectedEl) => intersectedEl.object.uuid === objectToWatchId
      );

      if (isIntersected) {
        onMouseClick();
      }
    },
    false
  );
};
addObjectClickListener(camera, scene, raycaster, cube, onMouseClick);
await animate();
// DEFAULT CODE DOWN HERE

// Declare a variable to store authentication status
let auth;
// Update the content of an HTML element with id 'app'

// Create a new instance of DiscordSDK with the provided client ID
const discordSdk = new DiscordSDK("import.meta.env.VITE_DISCORD_CLIENT_ID");

// Call setupDiscordSdk function and log a message once it's resolved
setupDiscordSdk().then(() => {
  console.log("Discord SDK is authenticated");
});

// Function to set up the Discord SDK
async function setupDiscordSdk() {
  // Wait for the Discord SDK to be ready
  await discordSdk.ready();
  console.log("Discord SDK is ready");

  // Authorize the Discord SDK with necessary permissions
  const { code } = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: [
      "identify",
      "guilds",
    ],
  });
  
  // Send a POST request to retrieve the access token from the server. In this case it's our Flask Python code.
  const response = await fetch("/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });

  // Extract the access token from the response
  const access_token = await response.text();

  // Authenticate the Discord SDK with the obtained access token
  auth = await discordSdk.commands.authenticate({
    access_token: access_token,
  });

  // Throw an error if authentication fails
  if (auth == null) {
    throw new Error("Authenticate command failed");
  }
}
function onMouseClick() {
  var keys = Object.keys(THREE.Color.NAMES);
  cube.material.color.set(THREE.Color.NAMES[keys[[Math.floor(Math.random() * keys.length)]]]);
  if (!sound.isPlaying) {
    sound.play();
  } 
  else {
    sound.stop();
  }
}

async function animate() {
	requestAnimationFrame( animate );
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}


