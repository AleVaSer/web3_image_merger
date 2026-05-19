const Web3 = require('web3');
const config = require('../config/cfg');
const path = require('path');
const fileSystem = require("fs");


module.exports = {
    async getToken(req, res, next) {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(config.node_address));
            const 721Contract = web3.eth.Contract(config.abi, config.address);
            const tokenInfo = await Axes721Contract.methods.tokenFullInfo(res.locals.tokenId).call();

            const tokenData = JSON.parse(tokenInfo.tokenData);

            if (tokenInfo.tokenItem === 'hero') {

                const lipsTokenFullInfo = await 721Contract.methods.tokenFullInfo(tokenData.Lips).call();
                const legsTokenFullInfo = await 721Contract.methods.tokenFullInfo(tokenData.Legs).call();
                const pupilsTokenFullInfo = await 721Contract.methods.tokenFullInfo(tokenData.Pupils).call();
                const headTokenFullInfo = await 721Contract.methods.tokenFullInfo(tokenData.Head).call();
                const shouldersTokenFullInfo = await 721Contract.methods.tokenFullInfo(tokenData.Shoulders).call();
                const browsTokenFullInfo = await 721Contract.methods.tokenFullInfo(tokenData.Brows).call();

                const lipsTokenData = JSON.parse(lipsTokenFullInfo.tokenData);
                const legsTokenData = JSON.parse(legsTokenFullInfo.tokenData);
                const pupilsTokenData = JSON.parse(pupilsTokenFullInfo.tokenData);
                const headTokenData = JSON.parse(headTokenFullInfo.tokenData);
                const shouldersTokenData = JSON.parse(shouldersTokenFullInfo.tokenData);
                const browsTokenData = JSON.parse(browsTokenFullInfo.tokenData);

                res.locals.bonesPath = path.join('.', 'miscellaneous', 'pics', 'lips', lipsTokenData?.Rarity?.toLowerCase(), `${lipsTokenData?.Skin}.png`);
                res.locals.chestPath = path.join('.', 'miscellaneous', 'pics', 'legs', legsTokenData?.Rarity?.toLowerCase(), `${legsTokenData?.Skin}.png`);
                res.locals.eyesPath = path.join('.', 'miscellaneous', 'pics', 'pupils', pupilsTokenData?.Rarity?.toLowerCase(), `${eyesTokenData?.Skin}.png`);
                res.locals.headPath = path.join('.', 'miscellaneous', 'pics', 'head', headTokenData?.Rarity?.toLowerCase(), `${headTokenData?.Skin}.png`);
                res.locals.hatPath = path.join('.', 'miscellaneous', 'pics', 'shoulders', shouldersTokenData?.Rarity?.toLowerCase(), `${shouldersTokenData?.Skin}.png`);
                res.locals.mouthPath = path.join('.', 'miscellaneous', 'pics', 'brows', browsTokenData?.Rarity?.toLowerCase(), `${browsTokenData?.Skin}.png`);
            }

        } catch (err) {
            return res.status(400).json({
                status: 'error',
                message: 'error occurred while connecting to blockchain'
            });
        }

        next();
    },

    checkCachedPng(req, res, next) {
        res.locals.tokenId = req.params.id;
        res.locals.cachingPath = path.join('.', 'miscellaneous', 'cache', `${res.locals.tokenId}.png`)

        if (fileSystem.existsSync(res.locals.cachingPath)) {

            res.setHeader('Content-Type', 'image/png');
            fileSystem.createReadStream(res.locals.cachingPath).pipe(res);
        } else {
            next();
        }
    }
}
