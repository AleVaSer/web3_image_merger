const Web3 = require('web3');
const config = require('../config/cfg');
const path = require('path');
const fileSystem = require("fs");


module.exports = {
    async getToken(req, res, next) {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(config.node_address));
            const Axes721Contract = web3.eth.Contract(config.abi, config.address);
            const tokenInfo = await Axes721Contract.methods.tokenFullInfo(res.locals.tokenId).call();

            const tokenData = JSON.parse(tokenInfo.tokenData);

            if (tokenInfo.tokenItem === 'hero') {

                const bonesTokenFullInfo = await Axes721Contract.methods.tokenFullInfo(tokenData.Bones).call();
                const chestTokenFullInfo = await Axes721Contract.methods.tokenFullInfo(tokenData.Chest).call();
                const eyesTokenFullInfo = await Axes721Contract.methods.tokenFullInfo(tokenData.Eyes).call();
                const headTokenFullInfo = await Axes721Contract.methods.tokenFullInfo(tokenData.Head).call();
                const hatTokenFullInfo = await Axes721Contract.methods.tokenFullInfo(tokenData.Hat).call();
                const mouthTokenFullInfo = await Axes721Contract.methods.tokenFullInfo(tokenData.Mouth).call();

                const bonesTokenData = JSON.parse(bonesTokenFullInfo.tokenData);
                const chestTokenData = JSON.parse(chestTokenFullInfo.tokenData);
                const eyesTokenData = JSON.parse(eyesTokenFullInfo.tokenData);
                const headTokenData = JSON.parse(headTokenFullInfo.tokenData);
                const hatTokenData = JSON.parse(hatTokenFullInfo.tokenData);
                const mouthTokenData = JSON.parse(mouthTokenFullInfo.tokenData);

                res.locals.bonesPath = path.join('.', 'miscellaneous', 'pics', 'bones', bonesTokenData?.Rarity?.toLowerCase(), `${bonesTokenData?.Skin}.png`);
                res.locals.chestPath = path.join('.', 'miscellaneous', 'pics', 'chest', chestTokenData?.Rarity?.toLowerCase(), `${chestTokenData?.Skin}.png`);
                res.locals.eyesPath = path.join('.', 'miscellaneous', 'pics', 'eyes', eyesTokenData?.Rarity?.toLowerCase(), `${eyesTokenData?.Skin}.png`);
                res.locals.headPath = path.join('.', 'miscellaneous', 'pics', 'head', headTokenData?.Rarity?.toLowerCase(), `${headTokenData?.Skin}.png`);
                res.locals.hatPath = path.join('.', 'miscellaneous', 'pics', 'hat', hatTokenData?.Rarity?.toLowerCase(), `${hatTokenData?.Skin}.png`);
                res.locals.mouthPath = path.join('.', 'miscellaneous', 'pics', 'mouth', mouthTokenData?.Rarity?.toLowerCase(), `${mouthTokenData?.Skin}.png`);
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
