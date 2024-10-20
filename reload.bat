@echo off  
setlocal enabledelayedexpansion  
  
echo reloading...  
pm2 reload ecosystem.config.js --env production 
echo done