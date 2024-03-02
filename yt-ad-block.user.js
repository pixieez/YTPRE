// ==UserScript==
// @name YouTubeADsBlocker
// @namespace https://github.com/pixieez
// @version 1.0
// @description No ads OP
// @author https://github.com/pixieez
// @match *://*.youtube.com/*
// @exclude *://accounts.youtube.com/*
// @exclude *://www.youtube.com/live_chat_replay*
// @exclude *://www.youtube.com/persist_identity*
// @icon https://raw.githubusercontent.com/pixieez/pixieez/main/icon.png
// @grant none
// @licenseMIT
// @downloadURL https://github.com/pixieez/YTPRE/raw/main/yt-ad-block.user.js
// @updateURL https://github.com/pixieez/YTPRE/raw/main/yt-ad-block.user.js
// ==/UserScript==
(function() {
     `use strict`;

     //Interface ad selector
     const cssSeletorArr = [
         `#masthead-ad`,//The banner ad at the top of the homepage.
         `ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)`,//Homepage video layout advertisement.
         `.video-ads.ytp-ad-module`,//Ads at the bottom of the player.
         `tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)`, //Play page membership promotion advertisement.
         `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`,//Recommended ads in the upper right corner of the play page.
         `#related #player-ads`,//Promote ads on the right side of the comment area on the play page.
         `#related ytd-ad-slot-renderer`, //Video layout advertisement on the right side of the comment area of ​​the play page.
         `ytd-ad-slot-renderer`,//Search page advertisement.
         `yt-mealbar-promo-renderer`, //Play page member recommendation advertisement.
         `ad-slot-renderer`,//M play page third-party recommended ads
         `ytm-companion-ad-renderer`,//M skippable video ad link
     ];

     window.dev=false;//development use

     /**
     * Format standard time
     * @param {Date} time standard time
     * @param {String} format format
     * @return {String}
     */
     function moment(time) {
         // Get year, month, hour, minute and second
         let y = time.getFullYear()
         let m = (time.getMonth() + 1).toString().padStart(2, `0`)
         let d = time.getDate().toString().padStart(2, `0`)
         let h = time.getHours().toString().padStart(2, `0`)
         let min = time.getMinutes().toString().padStart(2, `0`)
         let s = time.getSeconds().toString().padStart(2, `0`)
         return `${y}-${m}-${d} ${h}:${min}:${s}`
     }

     /**
     * Output information
     * @param {String} msg information
     * @return {undefined}
     */
     function log(msg) {
         if(!window.dev){
             return false;
         }
         console.log(window.location.href);
         console.log(`${moment(new Date())} ${msg}`);
     }

     /**
     * Set the run flag
     * @param {String} name
     * @return {undefined}
     */
     function setRunFlag(name){
         let style = document.createElement(`style`);
         style.id = name;
         (document.querySelector(`head`) || document.querySelector(`body`)).appendChild(style);//Append nodes to HTML.
     }

     /**
     * Get the running flag
     * @param {String} name
     * @return {undefined|Element}
     */
     function getRunFlag(name){
         return document.getElementById(name);
     }

     /**
     * Check if the run flag is set
     * @param {String} name
     * @return {Boolean}
     */
     function checkRunFlag(name){
         if(getRunFlag(name)){
             return true;
         }else{
             setRunFlag(name)
             return false;
         }
     }

     /**
     * Generate a css element style that removes advertising and attach it to the HTML node
     * @param {String} styles style text
     * @return {undefined}
     */
     function generateRemoveADHTMLElement(id) {
         //If it has been set, exit.
         if (checkRunFlag(id)) {
             log(`Block page advertising node has been generated`);
             return false
         }

         //Set the removal ad style.
         let style = document.createElement(`style`);//Create style element.
         (document.querySelector(`head`) || document.querySelector(`body`)).appendChild(style);//Append nodes to HTML.
         style.appendChild(document.createTextNode(generateRemoveADCssText(cssSeletorArr)));//Append style nodes to element nodes.
         log(`Generating ad node for blocking page successfully`);
     }

     /**
     * Generate css text to remove ads
     * @param {Array} cssSeletorArr array of css selectors to be set
     * @return {String}
     */
     function generateRemoveADCssText(cssSeletorArr){
         cssSeletorArr.forEach((seletor,index)=>{
             cssSeletorArr[index]=`${seletor}{display:none!important}`;//Traverse and set styles.
         });
         return cssSeletorArr.join(` `);//Spliced ​​into a string.
     }

     /**
     * Touch event
     * @return {undefined}
     */
     function nativeTouch(){
         //Create Touch object
         let touch = new Touch({
             identifier: Date.now(),
             target: this,
             clientX: 12,
             clientY: 34,
             radiusX: 56,
             radiusY: 78,
             rotationAngle: 0,
             force: 1
         });

//Create TouchEvent object
         let touchStartEvent = new TouchEvent(`touchstart`, {
             bubbles: true,
             cancelable: true,
             view: window,
             touches: [touch],
             targetTouches: [touch],
             changedTouches: [touch]
         });

         //Dispatch touchstart event to target element
         this.dispatchEvent(touchStartEvent);

         //Create TouchEvent object
         let touchEndEvent = new TouchEvent(`touchend`, {
             bubbles: true,
             cancelable: true,
             view: window,
             touches: [],
             targetTouches: [],
             changedTouches: [touch]
         });

         //Dispatch touchend event to target element
         this.dispatchEvent(touchEndEvent);
     }

     /**
     * Skip ads
     * @return {undefined}
     */
     function skipAd(mutationsList, observer) {
         let video = document.querySelector(`.ad-showing video`) || document.querySelector(`video`);//Get the video node
         let skipButton = document.querySelector(`.ytp-ad-skip-button`) || document.querySelector(`.ytp-ad-skip-button-modern`);
         let shortAdMsg = document.querySelector(`.video-ads.ytp-ad-module .ytp-ad-player-overlay`);

         if(skipButton){
             //Mobile mute has a bug
             if( window.location.href.indexOf("https://m.youtube.com/") === -1){
                 video.muted = true;
             }
             if(video.currentTime>0.5){
                 video.currentTime = video.duration;//mandatory
                 log(`Special account skip button advertisement~~~~~~~~~~~~~~`);
                 return;
             }
             skipButton.click();//PC
             nativeTouch.call(skipButton);//Phone
             log(`Button to skip ads~~~~~~~~~~~~~~`);
         }else if(shortAdMsg){
             video.currentTime = video.duration;
             log(`Forced to end the ad~~~~~~~~~~~~~~`);
         }else{
             log(`######Ad does not exist######`);
         }

     }

     /**
     * Remove ads during playback
     * @return {undefined}
     */
     function removePlayerAD(id){
         //If it is already running, exit.
         if (checkRunFlag(id)) {
             log(`The function of removing advertisements during playback is already running`);
             return false
         }
         let observer;//listener
         let timerID;//Timer

         //Start listening
         function startObserve(){
             //Advertising node monitoring
             const targetNode = document.querySelector(`.video-ads.ytp-ad-module`);
             if(!targetNode){
                 log(`Looking for the target node to be monitored`);
                 return false;
             }
             //Listen to the ads in the video and process them
             const config = {childList: true, subtree: true }; // Monitor changes in the target node itself and nodes under the subtree
             observer = new MutationObserver(skipAd);//Create an observer instance and set the callback function to handle advertisements
             observer.observe(targetNode, config);//Start observing advertising nodes with the above configuration
             timerID=setInterval(skipAd, 500);//Those who slipped through the net
         }

         //Polling tasks
         let startObserveID = setInterval(()=>{
             if(observer && timerID){
                 clearInterval(startObserveID);
             }else{
                 startObserve();
             }
         },16);

         log(`The function of removing advertisements during playback was successfully run`);
     }

     /**
     * main function
     */
     function main(){
         generateRemoveADHTMLElement(`removeADHTMLElement`);//Remove advertisements in the interface.
         removePlayerAD(`removePlayerAD`);//Remove the playing advertisement.
     }

     if (document.readyState === `loading`) {
         log(`YouTube ad removal script is about to be called:`);
         document.addEventListener(`DOMContentLoaded`, main);//The loading has not been completed at this time
     } else {
         log(`Quick call of YouTube ad removal script:`);
         main();//At this time `DOMContentLoaded` has been triggered
     }

})();
