@echo off  
setlocal enabledelayedexpansion  
  

echo Pulling the latest code...  
call git pull origin main && (

	call yarn && (
		
		call yarn build  && (
			
			pm2 reload ecosystem.config.js --env production  
			
		)
 	) 
)