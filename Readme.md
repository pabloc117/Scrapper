## Web Scraping    
This App scraps data from Amazon and Ebay
#### Run app
In the client and sever directory run
```
npm install
```
```
npm run dev
```
or
```
npm start
```
#### App Runing
Open [http://localhost:3000](http://localhost:3000/main) to view it in the browser.<br /> 
Open [http://localhost:8080](http://localhost:4040) to view it in the browser.<br />

#### API
App can be used like api with this url (GET)
```
http://localhost:4040/:"search_term"
```

#### Note
After installing, if app gives this error: `Error: Failed to launch the browser process!` <br/>
Extract chrome-win.zip (chrome-win.zip file locates in the /node_modules/puppeteer/.local-chromium/) file to /node_modules/puppeteer/.local-chromium/win64-776035. If there is not any chrome-win.zip file, download chormium from this link [Chromium](https://download-chromium.appspot.com/)