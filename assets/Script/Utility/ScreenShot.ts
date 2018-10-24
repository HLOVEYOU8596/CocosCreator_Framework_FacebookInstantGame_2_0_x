// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export  class ScreenShot {

    /**
     * 截图
     * @param rangeImg 表示截图范围的节点
     * @returns {} base64字符串
     */
    static Shot(rangeImg:cc.Node):string
    {
        let width=rangeImg.width;
        let height=rangeImg.height;

        let node = new cc.Node();
        node.parent = rangeImg;
        let camera = node.addComponent(cc.Camera);
        node.x=0;
        node.y=0;

        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = 0xffffffff;

        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new cc.RenderTexture();
        let gl = cc.game._renderContext;
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        texture.initWithSize(width,height,gl.STENCIL_INDEX8);
        camera.targetTexture = texture;

        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        camera.render(null);

        // 这样我们就能从 RenderTexture 中获取到数据了
        let data = texture.readPixels();

        // 接下来就可以对这些数据进行操作了
        let tempCanvas = document.createElement('canvas');
        let ctx = tempCanvas.getContext('2d');
        tempCanvas.width = texture.width;
        tempCanvas.height = texture.height;

        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) 
        {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow*width*4;
            for (let i = 0; i < rowBytes; i++) 
            {
                imageData.data[i] = data[start+i];
            }

            ctx.putImageData(imageData, 0, row);
        }

        return tempCanvas.toDataURL("image/jpeg");
        //let dataURL = tempCanvas.toDataURL("image/png");
        //let img = document.createElement("img");
        //img.src = dataURL;
    }
}
