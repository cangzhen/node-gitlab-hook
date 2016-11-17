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
        "myRepo": "/usr/local/bin/myDeploy %g",

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