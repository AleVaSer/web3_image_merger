const mergeImages = require("merge-images");
const {Canvas, Image} = require("canvas");
const fileSystem = require('fs');

module.exports = {
    async mergeImage(req, res) {
        const b64 = await mergeImages([res.locals.bonesPath, res.locals.chestPath, res.locals.headPath, res.locals.mouthPath, res.locals.eyesPath, res.locals.hatPath], {
            Canvas: Canvas,
            Image: Image
        });

        const im = b64.split(",")[1];
        const img = Buffer.from(im, 'base64');

        fileSystem.writeFileSync(res.locals.cachingPath, img);

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img);
    },
}
