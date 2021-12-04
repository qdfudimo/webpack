import "./index.css"
import light from './assets/images/light.png'

function add(name) {
    console.log("my name is" + name);
}
add("zhangzheng1111111111111")
const img = document.createElement('img')
img.src = light;
let app = document.querySelector("#app");
app.appendChild(img)