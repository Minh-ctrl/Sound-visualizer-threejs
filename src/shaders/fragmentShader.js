const fShader = 
`
    // uniform vec3 sphereColour;
    // varying vec3 v_Normal;
    uniform float u_time;
    void main() {
        // gl_FragColor = vec4(abs(sin(u_time)), 0.0, abs(sin(u_time)), 1.0);
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
`;

export default fShader;