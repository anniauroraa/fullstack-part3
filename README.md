# fullstack-part3
scripts:  
..  
"build:ui": "@powershell Remove-Item -Recurse -Force dist && cd ../fullstack/part2/phonebook && npm run build && @powershell Copy-Item dist -Recurse ../../../fullstack-part3",  
"deploy": "fly deploy",  
"deploy:full": "npm run build:ui && npm run deploy",      
"logs:prod": "fly logs"  

npm run [script]

when same origin the address can just be **'/api/persons'**  
then frontend development doesn't work without vite.config.js:  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
