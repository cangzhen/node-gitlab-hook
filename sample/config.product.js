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
        "jfjun-ml-js": "if [[ '%b' =~ \\master$ ]]; then /root/project/jfjun-cw-ml/bin/deploy.sh ;fi",
        "jfjun-wx": [ //微信前端
            "if [[ '%b' =~ master$ ]]; then /root/project/jfjun-wx-front/bin/deploy.sh ;fi",
        ],
        "jfjun-cw": [
            "if [[ '%b' =~ wx$ ]]; then /root/project/jfjun-wx/bin/deploy.sh ;fi",//微信后端
            "if [[ '%b' =~ icw$ ]]; then /root/project/jfjun-cw-i/bin/deploy.sh ;fi",//icw系统管理后端
        ],
        "jfjun-cw-front": [
            "if [[ '%b' =~ master$ ]]; then /root/project/jfjun-cw-front/bin/deploy.sh ;fi",//会计师前端
        ],

        //判断分支可以通过shell的正则表达式完成，注意'[['之后的空格
        "myRepo2": [
            "if [[ '%b' =~ dev$ ]]; then echo 'this is a dev branch';fi",
            "if [[ '%b' =~ master$ ]]; then echo 'this is master branch ';fi"
        ],
    },
    keep: true,//是否保留执行目录和文件
    port: 3420,
    host: '0.0.0.0',
}