import CameraMoveScript from "./common/CameraMoveScript"
import CustomMaterial1 from "./customMaterials/CustomMaterial1"

export default class ShaderBox {

    constructor() {
        //添加3D场景
        var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;

        //添加照相机
        var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 3, 3));
        camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);

        //添加方向光
        var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
        this.initShader();
        //添加自定义模型
        var box: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1))) as Laya.MeshSprite3D;
        box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        // var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
		// Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function(tex:Laya.Texture2D) {
		// 		material.albedoTexture = tex;
        // }));
        var _material = new CustomMaterial1();
        box.meshRenderer.material = _material;
        //new Shader_Simple();
        //为了更好的表现该自定义shader我们去掉模型旋转,同时给摄影机添加了移动脚本
        camera.addComponent(CameraMoveScript);

    }

    //初始化我们的自定义shader
    initShader() {
        //所有的attributeMap属性
        var attributeMap = {'a_Position': Laya.VertexMesh.MESH_POSITION0, 'a_Normal': Laya.VertexMesh.MESH_NORMAL0};
        //所有的uniform属性
        var uniformMap = {'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, 'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE};
        //CustomShader1
        
        var simpleShaderVS : string = `
        #include "Lighting.glsl"
        attribute vec4 a_Position;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        attribute vec3 a_Normal;
        varying vec3 v_Normal;
        void main()
        {
            gl_Position = u_MvpMatrix * a_Position;
            mat3 worldMat=mat3(u_WorldMat);
            v_Normal=worldMat*a_Normal;
            gl_Position=remapGLPositionZ(gl_Position);
        }`;
        var simpleShaderFS : string =`
        #ifdef FSHIGHPRECISION
        precision highp float;
        #else
        precision mediump float;
        #endif
        varying vec3 v_Normal;
        void main()
        {    
            gl_FragColor=vec4(v_Normal,2.0);
        }`;

        var customShader = Laya.Shader3D.add("CustomShader1");
        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        //我们的自定义shader customShader中添加我们新创建的subShader
        customShader.addSubShader(subShader);
        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(simpleShaderVS, simpleShaderFS);
    }
}

