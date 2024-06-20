# fullstack-part3

"build:ui": "@powershell Remove-Item -Recurse -Force dist && cd ../fullstack/part2/phonebook && npm run build && @powershell Copy-Item dist -Recurse ../../../fullstack-part3",  
"deploy": "fly deploy",  
"deploy:full": "npm run build:ui && npm run deploy",      
"logs:prod": "fly logs"  
