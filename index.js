'use strict';

module.exports = function (ret, settings, conf, opt) { //打包后处理
    var fis_sea_conf = fis.config.get('seajs', {});
    fis_sea_conf.alias = fis_sea_conf.alias || {};
    fis.util.map(ret.map.res, function (id, res) {
        fis_sea_conf.alias[id] = res.uri;
    });
    var content = 'seajs.config(' + JSON.stringify(fis_sea_conf, null, opt.optimize ? null : 4) + ');';
    var seajs_config = fis.file(fis.project.getProjectPath(), 'sea-config.js');
    seajs_config.setContent(content);
    ret.pkg[seajs_config.subpath] = seajs_config;

    var script = '<script src="' + seajs_config.getUrl(opt.hash, opt.domain) + '"></script>';
    fis.util.map(ret.src, function (subpath, file) {
        if (file.isHtmlLike) { //类html文件
            var content = file.getContent();
            if (/\bseajs\.use\s*\(/.test(content)) { //如果有sea.use(，才会插入
                //插入到页面</head>标签结束之前
                content = content.replace(/<\/head>/, script + '\n$&');
                file.setContent(content);
            }
        }
    });
};