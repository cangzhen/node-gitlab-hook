#start by pm2
pm2 delete hook
pm2 start app.js --name "hook" -o './hook.log' -e './hook.err'
