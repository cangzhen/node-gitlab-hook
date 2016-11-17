/**
 * Created by lcz on 16/11/16.
 */
"use strict";
module.exports = {
    tasks: {
        "*": [
            "echo ================trigger by webhook event=============",
            "echo 'GitLab Host: %s'",
            "echo 'Repository : %r'",
            "echo 'Event      : %k'",
            "echo 'User       : %u'",
            "echo 'Branch     : %b'",
            "echo 'Git Url    : %g'",
            "echo 'Last Commit: %i'",
            "echo '       Time: %t'",
            "echo '    Message: %m'",
        ],
        "jfjun-ml-js":[
            "if [[ '%b' =~ \\dev$ ]]; then /root/project/jfjun-cw-dev-ml/bin/deploy.sh ;fi", //dev有更新自动重启
            "if [[ '%b' =~ \\dev$ ]]; then /root/project/jfjun-cw-test-ml/bin/deploy.sh ;fi", //dev有更新自动重启
        ] ,
        "jfjun-wx": [
            "/root/project/jfjun-wx-dev-front/bin/deploy.sh", //微信前端
        ],
        "jfjun-cw": [
            "if [[ '%b' =~ \\dev$ ]]; then /root/project/jfjun-cw-dev-front/bin/deploy.sh ;fi",//开发环境,dev更新
            "if [[ '%b' =~ \\release ]]; then /root/project/jfjun-cw-test-front/bin/deploy.sh ;fi",//测试环境==>release分支
            "if [[ '%b' =~ accfun ]]; then /root/project/jfjun-accfun-dev/bin/deploy.sh ;fi",//乐财务
        ],
        "jfjun-cw-front":[
            "if [[ '%b' =~ \\dev$ ]]; then /root/project/jfjun-cw-dev-front/bin/deploy.sh ;fi",//开发环境,dev更新
            "if [[ '%b' =~ \\release ]]; then /root/project/jfjun-cw-test-front/bin/deploy.sh ;fi" //测试环境==>release分支
        ],

        //判断分支可以通过shell的正则表达式完成，注意'[['之后的空格
        "myRepo2": [
            "if [[ '%b' =~ dev ]]; then echo 'this is a dev branch';fi",
            "if [[ '%b' =~ master ]]; then echo 'this is master branch ';fi"
        ],
    },
    keep: true,//是否保留执行目录和文件
    port: 3420,
    host: '0.0.0.0',
}