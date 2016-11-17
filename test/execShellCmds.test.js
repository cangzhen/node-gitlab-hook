/**
 * Created by lcz on 16/11/17.
 */
"use strict"
var execShellCmds = require('../execShellCmds')
var cmds = [
    'echo \'GitLab Server: 127.0.0.1\' > /tmp/gitlabhook.tmp\necho \'Repository: jfjun-fp\' >> /tmp/gitlabhook.tmp\necho $(date) >> /tmp/gitlabhook.tmp\n',
    'echo `date`',
]
execShellCmds(cmds);