# node-gitlab-hook

This is an easy to use nodeJS based web hook for GitLab.

## Quick start

**1.Download this project**
```
git clone https://github.com/cangzhen/node-gitlab-hook
```
**2.Start the `./app.js`**
```
cd node-gitlab-hook
npm install
node ./app.js
```

**3.Mock the request from gitlab**
```
node ./test/gitlab.client.js
```


Configure a WebHook URL to whereever the server is listening.

### Available options are:

* **host**: the host to listen on, defaults to `0.0.0.0`
* **port**: the port to listen on, defaults to `3420`
* **keep**: if true, temporary files are not deleted, defaults to `false`. Mostly only for debugging purposes.
* **tasks**: relations between repositories and shell commands (e.g. `{repo1:'cmd1', repo2:['cmd2a','cmd2b','cmd2c']}`)
* **cmdshell**: the command-line interpreter to be used, defaults to `/bin/bash`

Example config file with task definitions(./config.js):

```javascript
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
        
        //判断分支可以通过shell的正则表达式完成
        "myRepo2": [
            "if [[ '%b' =~ dev ]]; then echo 'this is a dev branch';fi",
            "if [[ '%b' =~ master ]]; then echo 'this is master branch ';fi"
         ],
    },
    keep: true,//是否保留执行目录和文件
    port: 3420,
    host: '0.0.0.0',
}

```
The `*` matches any tasks.

The place holders are:

* `%s`: GitLab server's IP address
* `%r`: name of the repository (e.g. `myRepo`)
* `%k`: kind of event (e.g. `tag_push`)
* `%u`: owner of the repository (user name)
* `%b`: branch reference (e.g. `refs/heads/master`)
* `%g`: ssh-based cloning url on the GitLab server (e.g. `git@gitlab.host:rolf.niepraschk/myRepo.git`)
* `%h`: http-based cloning url on the GitLab server (e.g. `http://gitlab.host/rolf.niepraschk/myRepo.git`)
* `%i`: id of the last commit
* `%t`: timestamp of the last commit
* `%m`: message of the last commit

The file `app.js` shows an example GitLab Hook server listen at port 3420.

## Start script for pm2
The file `start.sh` shows an example started by pm2
```
./start.sh
```
# License

MIT
