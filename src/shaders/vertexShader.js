const vShader= `
    uniform float u_time;
    uniform vec2 u_mouse;
    void main(){
        float z = sin(u_time  * .005);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y , z , 1.0);
    }
`

export default vShader