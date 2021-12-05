import "./index.css"
import light from './assets/images/light.png'
// import {
//     test,testBable
// } from './a.js'
import {
    add
} from './b.js'
//webpackChunkName，它其实就是对chunkFilename定义时[name]值的改写，/* webpackChunkName: "hello" */，意味着[name]等于hello。
import(/*webpackChunkName:'hello'*/'./a.js').then(({
    testBable
}) => {
    testBable()
})

function youName(name) {
    console.log("my name is" + name);
}
youName("zhangzheng1111111111111")
// testBable()
console.log("b组件输出的是" + add(2, 6));
// console.log("a组件输出的是" + test(2, 6));
const img = document.createElement('img')
img.src = light;
let app = document.querySelector("#app");
app.appendChild(img)