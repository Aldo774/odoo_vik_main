(function(window){if(window.BX.frameCache)return;var BX=window.BX;var localStorageKey="compositeCache";var lolalStorageTTL=1440;var compositeMessageIds=["bitrix_sessid","USER_ID","SERVER_TIME","USER_TZ_OFFSET","USER_TZ_AUTO"];var compositeDataFile="/bitrix/tools/composite_data.php";var sessidWasUpdated=false;BX.frameCache=function(){};if(BX.browser.IsIE8()){BX.frameCache.localStorage=new BX.localStorageIE8}else if(typeof localStorage!=="undefined"){BX.frameCache.localStorage=new BX.localStorage}else{BX.frameCache.localStorage={set:BX.DoNothing,get:function(){return null},remove:BX.DoNothing}}BX.frameCache.localStorage.prefix=function(){return"bx-"};BX.frameCache.init=function(){this.cacheDataBase=null;this.tableParams={tableName:"composite",fields:[{name:"id",unique:true},"content","hash","props"]};this.frameData=null;if(BX.type.isString(window.frameDataString)&&window.frameDataString.length>0){BX.frameCache.onFrameDataReceived(window.frameDataString)}this.vars=window.frameCacheVars?window.frameCacheVars:{page_url:"",params:{},storageBlocks:[]};this.lastReplacedBlocks=false;var e=BX.frameCache.localStorage.get(localStorageKey)||{};for(var a=0;a<compositeMessageIds.length;a++){var t=compositeMessageIds[a];if(typeof BX.message[t]!="undefined"){e[t]=BX.message[t]}}BX.frameCache.localStorage.set(localStorageKey,e,lolalStorageTTL);BX.addCustomEvent("onBXMessageNotFound",function(e){if(BX.util.in_array(e,compositeMessageIds)){var a=BX.frameCache.localStorage.get(localStorageKey);if(a&&typeof a[e]!="undefined"){BX.message[e]=a[e]}else{BX.frameCache.getCompositeMessages()}}});if(!window.frameUpdateInvoked){this.update(false);window.frameUpdateInvoked=true}if(window.frameRequestStart){BX.ready(function(){BX.onCustomEvent("onCacheDataRequestStart");BX.frameCache.tryUpdateSessid()})}if(window.frameRequestFail){BX.ready(function(){setTimeout(function(){BX.onCustomEvent("onFrameDataRequestFail",[window.frameRequestFail])},0)})}BX.frameCache.insertBanner()};BX.frameCache.getCompositeMessages=function(){BX.ajax({method:"GET",dataType:"json",url:compositeDataFile,async:false,data:"",onsuccess:function(e){BX.frameCache.setCompositeVars(e)}})};BX.frameCache.setCompositeVars=function(e){if(!e){return}else if(e.lang){e=e.lang}var a=BX.frameCache.localStorage.get(localStorageKey)||{};for(var t in e){if(e.hasOwnProperty(t)){BX.message[t]=e[t];if(BX.util.in_array(t,compositeMessageIds)){a[t]=e[t]}}}BX.frameCache.localStorage.set(localStorageKey,a,lolalStorageTTL)};BX.frameCache.processData=function(e){var a;if(!e||!(a=BX(e.ID))){return}var t=false;var s=false;var r=false;var i=l();n(o);c();f(h);function n(a){var t=i.styles;if(BX.type.isArray(e.PROPS.CSS)&&e.PROPS.CSS.length>0){t=BX.util.array_merge(e.PROPS.CSS,t)}t.length>0?BX.load(t,a):a()}function o(){if(e.PROPS.USE_ANIMATION){a.style.opacity=0;a.innerHTML=e.CONTENT;new BX.easing({duration:1500,start:{opacity:0},finish:{opacity:100},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function(e){a.style.opacity=e.opacity/100},complete:function(){a.style.cssText=""}}).animate()}else{a.innerHTML=e.CONTENT}t=true;if(r){h()}}function c(){BX.evalGlobal(i.inlineJS.join(";"))}function l(){var a={styles:[],inlineJS:[],externalJS:[]};if(!BX.type.isArray(e.PROPS.STRINGS)||e.PROPS.STRINGS.length<1){return a}var t=BX.processHTML(e.PROPS.STRINGS.join(""),false);for(var s=0,r=t.SCRIPT.length;s<r;s++){var i=t.SCRIPT[s];if(i.isInternal){a.inlineJS.push(i.JS)}else{a.externalJS.push(i.JS)}}a.styles=t.STYLE;return a}function f(a){var t=i.externalJS;if(BX.type.isArray(e.PROPS.JS)&&e.PROPS.JS.length>0){t=BX.util.array_merge(t,e.PROPS.JS)}t.length>0?BX.load(t,a):a()}function h(){r=true;if(t){BX.ajax.processRequestData(e.CONTENT,{scriptsRunFirst:false,dataType:"HTML"})}}};BX.frameCache.update=function(e,a){a=!!a;e=typeof e=="undefined"?true:e;if(e){this.requestData()}if(!a){BX.ready(BX.proxy(function(){if(!this.frameData){this.invokeCache()}},this))}};BX.frameCache.invokeCache=function(){if(this.vars.storageBlocks&&this.vars.storageBlocks.length>0){BX.onCustomEvent(this,"onCacheInvokeBefore",[this.vars.storageBlocks]);this.readCacheWithID(this.vars.storageBlocks,BX.proxy(this.insertFromCache,this))}};BX.frameCache.handleResponse=function(e){if(e==null)return;BX.onCustomEvent("onFrameDataReceivedBefore",[e]);if(e.dynamicBlocks&&e.dynamicBlocks.length>0){this.insertBlocks(e.dynamicBlocks,false);this.writeCache(e.dynamicBlocks)}BX.onCustomEvent("onFrameDataReceived",[e]);if(e.isManifestUpdated=="1"&&this.vars.CACHE_MODE==="APPCACHE"){window.applicationCache.update()}if(e.htmlCacheChanged===true&&this.vars.CACHE_MODE==="HTMLCACHE"){BX.onCustomEvent("onHtmlCacheChanged",[e])}if(BX.type.isArray(e.spread)){for(var a=0;a<e.spread.length;a++){(new Image).src=e.spread[a]}}};BX.frameCache.requestData=function(){var e=[{name:"BX-ACTION-TYPE",value:"get_dynamic"},{name:"BX-REF",value:document.referrer},{name:"BX-CACHE-MODE",value:this.vars.CACHE_MODE}];if(this.vars.CACHE_MODE==="APPCACHE"){e.push({name:"BX-APPCACHE-PARAMS",value:JSON.stringify(this.vars.PARAMS)});e.push({name:"BX-APPCACHE-URL",value:this.vars.PAGE_URL?this.vars.PAGE_URL:""})}BX.onCustomEvent("onCacheDataRequestStart");var a=window.location.href;var t=a.indexOf("#");if(t>0){a=a.substring(0,t)}a+=(a.indexOf("?")>=0?"&":"?")+"bxrand="+(new Date).getTime();BX.ajax({timeout:60,method:"GET",url:a,data:{},headers:e,skipBxHeader:true,processData:false,onsuccess:BX.proxy(BX.frameCache.onFrameDataReceived,this),onfailure:function(){var e={error:true,reason:"bad_response",url:a,xhr:this.xhr,status:this.xhr?this.xhr.status:0};BX.onCustomEvent("onFrameDataRequestFail",[e])}})};BX.frameCache.onFrameDataReceived=function(response){var result=null;try{eval("result = "+response);this.frameData=result}catch(e){BX.ready(function(){setTimeout(function(){BX.onCustomEvent("onFrameDataRequestFail",[{error:true,reason:"bad_eval",response:response}])},0)});return}if(this.frameData&&BX.type.isNotEmptyString(this.frameData.redirect_url)){window.location=this.frameData.redirect_url;return}if(this.frameData&&this.frameData.error===true){BX.ready(BX.proxy(function(){setTimeout(BX.proxy(function(){BX.onCustomEvent("onFrameDataRequestFail",[this.frameData])},this),0)},this));return}BX.frameCache.setCompositeVars(this.frameData);BX.ready(BX.proxy(function(){this.handleResponse(this.frameData);this.tryUpdateSessid()},this))};BX.frameCache.insertFromCache=function(e,a){if(!this.frameData){var t=e.items;if(t.length>0){for(var s=0;s<t.length;s++){t[s].PROPS=JSON.parse(t[s].PROPS)}this.insertBlocks(t,true)}else{this.update(true,true)}}};BX.frameCache.insertBlocks=function(e,a){var t=this.lastReplacedBlocks.length!=0;for(var s=0;s<e.length;s++){var r=e[s];BX.onCustomEvent("onBeforeDynamicBlockUpdate",[r,a]);if(r.PROPS.AUTO_UPDATE===false){continue}var i=false;if(t){for(var n=0;n<this.lastReplacedBlocks.length;n++){if(this.lastReplacedBlocks[n].ID==r.ID&&this.lastReplacedBlocks[n].HASH==r.HASH){i=true;break}}}if(!i){this.processData(r)}}BX.onCustomEvent("onFrameDataProcessed",[e,a]);this.lastReplacedBlocks=e};BX.frameCache.writeCache=function(e){for(var a=0;a<e.length;a++){if(e[a].PROPS.USE_BROWSER_STORAGE===true){this.writeCacheWithID(e[a].ID,e[a].CONTENT,e[a].HASH,JSON.stringify(e[a].PROPS))}}};BX.frameCache.openDatabase=function(){if(this.cacheDataBase){return}this.cacheDataBase=new BX.dataBase({name:"Database",displayName:"BXCacheBase",capacity:1024*1024*4,version:"1.0"});this.cacheDataBase.createTable(this.tableParams)};BX.frameCache.writeCacheWithID=function(e,a,t,s){BX.frameCache.openDatabase();if(typeof s=="object"){s=JSON.stringify(s)}this.cacheDataBase.getRows({tableName:this.tableParams.tableName,filter:{id:e},success:BX.proxy(function(r){if(r.items.length>0){this.cacheDataBase.updateRows({tableName:this.tableParams.tableName,updateFields:{content:a,hash:t,props:s},filter:{id:e},fail:function(e){}})}else{this.cacheDataBase.addRow({tableName:this.tableParams.tableName,insertFields:{id:e,content:a,hash:t,props:s}})}},this),fail:BX.proxy(function(r){this.cacheDataBase.addRow({tableName:this.tableParams.tableName,insertFields:{id:e,content:a,hash:t,props:s},fail:function(e){}})},this)})};BX.frameCache.readCacheWithID=function(e,a){BX.frameCache.openDatabase();this.cacheDataBase.getRows({tableName:this.tableParams.tableName,filter:{id:e},success:BX.proxy(a,this)})};BX.frameCache.insertBanner=function(){if(!this.vars.banner||!BX.type.isNotEmptyString(this.vars.banner.text)){return}BX.ready(BX.proxy(function(){var e=BX.create("a",{props:{className:"bx-composite-btn"+(BX.type.isNotEmptyString(this.vars.banner.style)?" bx-btn-"+this.vars.banner.style:""),href:this.vars.banner.url},attrs:{target:"_blank"},text:this.vars.banner.text});if(BX.type.isNotEmptyString(this.vars.banner.bgcolor)){e.style.backgroundColor=this.vars.banner.bgcolor;if(BX.util.in_array(this.vars.banner.bgcolor.toUpperCase(),["#FFF","#FFFFFF","WHITE"])){BX.addClass(e,"bx-btn-border")}}var a=BX("bx-composite-banner");if(a){a.appendChild(e)}else{BX.addClass(e,"bx-composite-btn-fixed");document.body.appendChild(BX.create("div",{style:{position:"relative"},children:[e]}))}},this))};BX.frameCache.tryUpdateSessid=function(){if(sessidWasUpdated){return}var e="bitrix_sessid";var a=false;if(typeof BX.message[e]!="undefined"){a=BX.message[e]}else{var t=BX.frameCache.localStorage.get(localStorageKey)||{};if(typeof t[e]!="undefined"){a=t[e]}}if(a!==false){sessidWasUpdated=true;this.updateSessid(a)}};BX.frameCache.updateSessid=function(e){var a=document.getElementsByName("sessid");for(var t=0;t<a.length;t++){a[t].value=e}};BX.frameCache.init()})(window);
//# sourceMappingURL=core_frame_cache.map.js