/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

module.exports = function (ret, settings, conf, opt) { //打包后处理
    var fis_sea_conf = fis.config.get('seajs', {});
    fis_sea_conf.alias = fis_sea_conf.alias || {};
    fis.util.map(ret.map.res, function (id, res) {
        fis_sea_conf.alias[id] = res.uri;
    });
    var seaconfig = '\n seajs.config(' + JSON.stringify(fis_sea_conf, null, opt.optimize ? null : 4) + ');';
    fis.util.map(ret.src, function (subpath, file) {
        if (file.isHtmlLike) {
            var content = file.getContent();
            if (/\bseajs\.use\s*\(/.test(content)) { //如果有sea.use(，才会插入
                content = content.replace(/\bseajs\.use\s*\(/, seaconfig + '\n$&');
                file.setContent(content);
            }
        }
    });
};