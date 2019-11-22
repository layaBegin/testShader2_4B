(function () {
    'use strict';

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class CameraMoveScript extends Laya.Script3D {
        constructor() {
            super();
            this._tempVector3 = new Laya.Vector3();
            this.yawPitchRoll = new Laya.Vector3();
            this.resultRotation = new Laya.Quaternion();
            this.tempRotationZ = new Laya.Quaternion();
            this.tempRotationX = new Laya.Quaternion();
            this.tempRotationY = new Laya.Quaternion();
            this.rotaionSpeed = 0.00006;
        }
        _updateRotation() {
            if (Math.abs(this.yawPitchRoll.y) < 1.50) {
                Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
                this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
                this.camera.transform.localRotation = this.camera.transform.localRotation;
            }
        }
        onAwake() {
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
            this.camera = this.owner;
        }
        onUpdate() {
            var elapsedTime = Laya.timer.delta;
            if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
                var scene = this.owner.scene;
                Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime);
                var offsetX = Laya.stage.mouseX - this.lastMouseX;
                var offsetY = Laya.stage.mouseY - this.lastMouseY;
                var yprElem = this.yawPitchRoll;
                yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
                yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
                this._updateRotation();
            }
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
        }
        onDestroy() {
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        }
        mouseDown(e) {
            this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            this.isMouseDown = true;
        }
        mouseUp(e) {
            this.isMouseDown = false;
        }
        mouseOut(e) {
            this.isMouseDown = false;
        }
        moveForward(distance) {
            this._tempVector3.x = this._tempVector3.y = 0;
            this._tempVector3.z = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveRight(distance) {
            this._tempVector3.y = this._tempVector3.z = 0;
            this._tempVector3.x = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveVertical(distance) {
            this._tempVector3.x = this._tempVector3.z = 0;
            this._tempVector3.y = distance;
            this.camera.transform.translate(this._tempVector3, false);
        }
    }

    class CustomTerrainMaterial extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("CustomTerrainShader");
        }
        static __init__() {
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM1");
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM2");
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM3");
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM4");
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM5");
        }
        get splatAlphaTexture() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.SPLATALPHATEXTURE);
        }
        set splatAlphaTexture(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.SPLATALPHATEXTURE, value);
        }
        get diffuseTexture1() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE1);
        }
        set diffuseTexture1(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE1, value);
            this._setDetailNum(1);
        }
        get diffuseTexture2() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE2);
        }
        set diffuseTexture2(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE2, value);
            this._setDetailNum(2);
        }
        get diffuseTexture3() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE3);
        }
        set diffuseTexture3(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE3, value);
            this._setDetailNum(3);
        }
        get diffuseTexture4() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE4);
        }
        set diffuseTexture4(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE4, value);
            this._setDetailNum(4);
        }
        get diffuseTexture5() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE5);
        }
        set diffuseTexture5(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE5, value);
            this._setDetailNum(5);
        }
        setDiffuseScale1(scale1) {
            this._shaderValues.setVector2(CustomTerrainMaterial.DIFFUSESCALE1, scale1);
        }
        setDiffuseScale2(scale2) {
            this._shaderValues.setVector2(CustomTerrainMaterial.DIFFUSESCALE2, scale2);
        }
        setDiffuseScale3(scale3) {
            this._shaderValues.setVector2(CustomTerrainMaterial.DIFFUSESCALE3, scale3);
        }
        setDiffuseScale4(scale4) {
            this._shaderValues.setVector2(CustomTerrainMaterial.DIFFUSESCALE4, scale4);
        }
        setDiffuseScale5(scale5) {
            this._shaderValues.setVector2(CustomTerrainMaterial.DIFFUSESCALE5, scale5);
        }
        _setDetailNum(value) {
            switch (value) {
                case 1:
                    this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    break;
                case 2:
                    this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    break;
                case 3:
                    this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    break;
                case 4:
                    this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    break;
                case 5:
                    this._defineDatas.add(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._defineDatas.remove(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    break;
            }
        }
    }
    CustomTerrainMaterial.SPLATALPHATEXTURE = Laya.Shader3D.propertyNameToID("u_SplatAlphaTexture");
    CustomTerrainMaterial.DIFFUSETEXTURE1 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture1");
    CustomTerrainMaterial.DIFFUSETEXTURE2 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture2");
    CustomTerrainMaterial.DIFFUSETEXTURE3 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture3");
    CustomTerrainMaterial.DIFFUSETEXTURE4 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture4");
    CustomTerrainMaterial.DIFFUSETEXTURE5 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture5");
    CustomTerrainMaterial.DIFFUSESCALE1 = Laya.Shader3D.propertyNameToID("u_DiffuseScale1");
    CustomTerrainMaterial.DIFFUSESCALE2 = Laya.Shader3D.propertyNameToID("u_DiffuseScale2");
    CustomTerrainMaterial.DIFFUSESCALE3 = Laya.Shader3D.propertyNameToID("u_DiffuseScale3");
    CustomTerrainMaterial.DIFFUSESCALE4 = Laya.Shader3D.propertyNameToID("u_DiffuseScale4");
    CustomTerrainMaterial.DIFFUSESCALE5 = Laya.Shader3D.propertyNameToID("u_DiffuseScale5");

    class Shader_Terrain {
        constructor() {
            Laya3D.init(0, 0);
            Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
            Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            Laya.Stat.show();
            this.initShader();
            var scene = Laya.stage.addChild(new Laya.Scene3D);
            var camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
            camera.transform.rotate(new Laya.Vector3(-18, 180, 0), false, false);
            camera.transform.translate(new Laya.Vector3(-28, 20, -18), false);
            camera.addComponent(CameraMoveScript);
            Laya.Mesh.load("res/threeDimen/skinModel/Terrain/terrain_New-Part-01.lm", Laya.Handler.create(this, function (mesh) {
                var terrain = scene.addChild(new Laya.MeshSprite3D(mesh));
                var customMaterial = new CustomTerrainMaterial();
                Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/splatAlphaTexture.png", Laya.Handler.create(null, function (tex) {
                    customMaterial.splatAlphaTexture = tex;
                }));
                Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_01.jpg", Laya.Handler.create(null, function (tex) {
                    customMaterial.diffuseTexture1 = tex;
                }));
                Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_02.jpg", Laya.Handler.create(null, function (tex) {
                    customMaterial.diffuseTexture2 = tex;
                }));
                Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_03.jpg", Laya.Handler.create(null, function (tex) {
                    customMaterial.diffuseTexture3 = tex;
                }));
                Laya.Texture2D.load("res/threeDimen/skinModel/Terrain/ground_04.jpg", Laya.Handler.create(null, function (tex) {
                    customMaterial.diffuseTexture4 = tex;
                }));
                customMaterial.setDiffuseScale1(new Laya.Vector2(27.92727, 27.92727));
                customMaterial.setDiffuseScale2(new Laya.Vector2(13.96364, 13.96364));
                customMaterial.setDiffuseScale3(new Laya.Vector2(18.61818, 18.61818));
                customMaterial.setDiffuseScale4(new Laya.Vector2(13.96364, 13.96364));
                terrain.meshRenderer.sharedMaterial = customMaterial;
            }));
        }
        initShader() {
            CustomTerrainMaterial.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_SplatAlphaTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture1': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture2': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture3': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture4': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture5': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale1': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale2': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale3': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale4': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale5': Laya.Shader3D.PERIOD_MATERIAL
            };
            var vs = `
        #include "Lighting.glsl";
        attribute vec4 a_Position;
        attribute vec2 a_Texcoord0;
        attribute vec3 a_Normal;
        uniform mat4 u_MvpMatrix;
        varying vec2 v_Texcoord0;
        void main()
        {
          gl_Position = u_MvpMatrix * a_Position;
          v_Texcoord0 = a_Texcoord0;
          gl_Position=remapGLPositionZ(gl_Position);
       }`;
            var ps = `
        #ifdef FSHIGHPRECISION
        precision highp float;
        #else
        precision mediump float;
        #endif
        uniform sampler2D u_SplatAlphaTexture;
        uniform sampler2D u_DiffuseTexture1;
        uniform sampler2D u_DiffuseTexture2;
        uniform sampler2D u_DiffuseTexture3;
        uniform sampler2D u_DiffuseTexture4;
        uniform sampler2D u_DiffuseTexture5;
        uniform vec2 u_DiffuseScale1;
        uniform vec2 u_DiffuseScale2;
        uniform vec2 u_DiffuseScale3;
        uniform vec2 u_DiffuseScale4;
        uniform vec2 u_DiffuseScale5;
        varying vec2 v_Texcoord0;
        void main()
        {
        #ifdef CUSTOM_DETAIL_NUM1
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r;
        #elif defined(CUSTOM_DETAIL_NUM2)
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r + color2.xyz * (1.0 - splatAlpha.r);
        #elif defined(USTOM_DETAIL_NUM3)
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
        vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * (1.0 - splatAlpha.r - splatAlpha.g);
        #elif defined(CUSTOM_DETAIL_NUM4)
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
        vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
        vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b);
        #elif defined(CUSTOM_DETAIL_NUM5)
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
        vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
        vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
        vec4 color5 = texture2D(u_DiffuseTexture5, v_Texcoord0 * u_DiffuseScale5);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * splatAlpha.a + color5.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b - splatAlpha.a);
        #else
        #endif
        }`;
            var customTerrianShader = Laya.Shader3D.add("CustomTerrainShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            customTerrianShader.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }
    new Shader_Terrain;

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            new Shader_Terrain;
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
