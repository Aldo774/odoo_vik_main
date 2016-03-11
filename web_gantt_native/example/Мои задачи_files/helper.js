BX.namespace("BX.Helper");BX.Helper={frameOpenUrl:"",frameCloseUrl:"",isOpen:false,frameNode:null,popupNodeWrap:null,curtainNode:null,popupNode:null,closeBtn:null,openBtn:null,popupLoader:null,topBar:null,topBarHtml:null,langId:null,reloadPath:null,ajaxUrl:"",currentStepId:"",notifyBlock:null,notifyNum:"",notifyText:"",notifyId:0,notifyButton:"",topPaddingNode:null,isAdmin:"N",init:function(t){this.frameOpenUrl=t.frameOpenUrl||"";this.frameCloseUrl=t.frameCloseUrl||"";this.helpUpBtnText=t.helpUpBtnText||"";this.langId=t.langId||"";this.openBtn=t.helpBtn;this.notifyBlock=t.notifyBlock;this.reloadPath=t.reloadPath||"";this.ajaxUrl=t.ajaxUrl||"";this.currentStepId=t.currentStepId||"";this.notifyData=t.notifyData||null;this.runtimeUrl=t.runtimeUrl||null;this.notifyUrl=t.notifyUrl||"";this.helpUrl=t.helpUrl||"";this.notifyNum=t.notifyNum||"";this.topPaddingNode=t.topPaddingNode||null;this.isAdmin=t.isAdmin&&t.isAdmin=="Y"?"Y":"N";this.popupLoader=BX.create("div",{attrs:{className:"bx-help-popup-loader"},children:[BX.create("div",{attrs:{className:"bx-help-popup-loader-text"},text:BX.message("HELPER_LOADER")})]});this.topBarHtml='<div class="bx-help-menu-title" onclick="BX.Helper.reloadFrame(\''+this.reloadPath+"')\">"+BX.message("HELPER_TITLE")+'<span class="bx-help-blue">24</span></div>';this.topBar=BX.create("div",{attrs:{className:"bx-help-nav-wrap"},html:this.topBarHtml});this.createFrame();this.closeBtnHandler();this.createPopup();BX.bind(this.openBtn,"click",BX.proxy(this.show,this));BX.bind(this.openBtn,"click",BX.proxy(this.setBlueHeroView,this));BX.bind(window,"message",BX.proxy(function(t){t=t||window.event;if(typeof t.data.action=="undefined"){if(t.data.height&&this.isOpen)this.frameNode.style.height=t.data.height+"px";this.insertTopBar(typeof t.data=="object"?t.data.title:t.data);this._showContent()}if(t.data.action=="CloseHelper"){this.closePopup()}if(t.data.action=="ChangeHeight"){if(t.data.height>0){this.changeHeight(t.data.height)}}if(t.data.action=="SetCounter"){BX.Helper.showNotification(t.data.num)}},this));BX.addCustomEvent("onTopPanelCollapse",function(){if(BX.Helper.isOpen){BX.Helper.show()}});if(t.needCheckNotify=="Y"){this.checkNotification()}},setBlueHeroView:function(){if(!this.currentStepId)return;BX.ajax.post(this.ajaxUrl,{sessid:BX.bitrix_sessid(),action:"setView",currentStepId:this.currentStepId},function(){})},createFrame:function(){this.frameNode=BX.create("iframe",{attrs:{className:"bx-help-frame",frameborder:0,name:"help",id:"help-frame"}});BX.bind(this.frameNode,"load",BX.proxy(function(){this.popupNode.scrollTop=0},this))},_showContent:function(){this.frameNode.style.opacity=1;if(this.topBar.classList){this.topBar.classList.add("bx-help-nav-fixed");this.topBar.classList.add("bx-help-nav-show")}else{BX.addClass(this.topBar,"bx-help-nav-fixed");BX.addClass(this.topBar,"bx-help-nav-show")}this.popupLoader.classList.remove("bx-help-popup-loader-show")},_setPosFixed:function(){document.body.style.width=document.body.offsetWidth+"px";document.body.style.overflow="hidden"},_clearPosFixed:function(){document.body.style.width="auto";document.body.style.overflow=""},closeBtnHandler:function(){if(this.isAdmin=="N"){this.closeBtn=BX.create("div",{attrs:{className:"bx-help-close"},children:[BX.create("div",{attrs:{className:"bx-help-close-inner"}})]})}},insertTopBar:function(t){this.topBar.innerHTML=this.topBarHtml+t},createPopup:function(){this.curtainNode=BX.create("div",{attrs:{className:"bx-help-curtain"}});this.popupNode=BX.create("div",{children:[this.frameNode,this.topBar,this.popupLoader],attrs:{className:"bx-help-main"}});BX.bind(this.popupNode,"click",function(t){BX.PreventDefault(t)});document.body.appendChild(this.curtainNode);document.body.appendChild(this.popupNode);if(this.isAdmin=="N")document.body.appendChild(this.closeBtn)},closePopup:function(){clearTimeout(this.shadowTimer);clearTimeout(this.helpTimer);BX.unbind(this.popupNode,"transitionend",BX.proxy(this.loadFrame,this));BX.unbind(document,"keydown",BX.proxy(this._close,this));BX.unbind(document,"click",BX.proxy(this._close,this));if(this.popupNode.style.transition!==undefined)BX.bind(this.popupNode,"transitionend",BX.proxy(this._clearPosFixed,this));else this._clearPosFixed();this.popupNode.style.width=0;this.topBar.style.width=0;BX.removeClass(this.topBar,"bx-help-nav-fixed");if(this.isAdmin=="N")BX.removeClass(this.closeBtn,"bx-help-close-anim");this.topBar.style.top=this.getCord().top+"px";this.helpTimer=setTimeout(BX.proxy(function(){this.curtainNode.style.opacity=0;if(this.isAdmin=="N")this.closeBtn.style.display="none";BX.removeClass(this.openBtn,"help-block-active")},this),500);this.shadowTimer=setTimeout(BX.proxy(function(){this.frameNode.src=this.frameCloseUrl;this.popupNode.style.display="none";this.curtainNode.style.display="none";this.frameNode.style.opacity=0;this.frameNode.style.height=0;BX.removeClass(this.popupLoader,"bx-help-popup-loader-show");BX.unbind(this.popupNode,"transitionend",BX.proxy(this._clearPosFixed,this));if(this.topBar.classList)this.topBar.classList.remove("bx-help-nav-show");else BX.removeClass(this.topBar,"bx-help-nav-show");this.isOpen=false},this),800)},showContent:function(t){if(typeof t==="string"){this.frameOpenUrl=this.frameOpenUrl+"&"+t}var e=this.getCord().top;var i=this.getCord().right;clearTimeout(this.shadowTimer);clearTimeout(this.helpTimer);this._setPosFixed();this.curtainNode.style.top=e+"px";this.curtainNode.style.width=this.getCord().right+"px";this.curtainNode.style.display="block";this.popupNode.style.display="block";this.popupNode.style.paddingTop=e+"px";this.topBar.style.top=e+"px";this.popupLoader.style.top=e+"px";if(this.isAdmin=="N"){this.closeBtn.style.top=e-63+"px";this.closeBtn.style.left=i-63+"px";this.closeBtn.style.display="block"}BX.addClass(this.openBtn,"help-block-active");if(this.popupNode.style.transition!==undefined){BX.bind(this.popupNode,"transitionend",BX.proxy(this.loadFrame,this))}else{this.loadFrame(null)}this.shadowTimer=setTimeout(BX.proxy(function(){this.curtainNode.style.opacity=1;BX.addClass(this.closeBtn,"bx-help-close-anim")},this),25);this.helpTimer=setTimeout(BX.proxy(function(){this.popupNode.style.width=860+"px";this.topBar.style.width=860+"px";BX.addClass(this.popupLoader,"bx-help-popup-loader-show");BX.bind(document,"keydown",BX.proxy(this._close,this));BX.bind(document,"click",BX.proxy(this._close,this));this.isOpen=true},this),300)},show:function(t){var e=BX.GetWindowScrollPos();if(e.scrollTop!==0){new BX.easing({duration:500,start:{scroll:e.scrollTop},finish:{scroll:0},transition:BX.easing.makeEaseOut(BX.easing.transitions.quart),step:function(t){window.scrollTo(0,t.scroll)},complete:BX.proxy(function(){this.showContent(t)},this)}).animate()}else{this.showContent(t)}},_close:function(t){t=t||window.event;BX.PreventDefault(t);if(t.type=="click"||t.keyCode==27)this.closePopup()},loadFrame:function(t){if(t!==null){t=t||window.event;var e=t.target||t.srcElement;if(e==this.popupNode)this.frameNode.src=this.frameOpenUrl}else{this.frameNode.src=this.frameOpenUrl}},reloadFrame:function(t){this.frameNode.style.opacity=0;this.frameNode.src=t;if(this.topBar.classList)this.topBar.classList.remove("bx-help-nav-show");else BX.removeClass(this.topBar,"bx-help-nav-show");this.popupNode.scrollTop=0},getCord:function(){var t,e={top:0,right:0};if(this.topPaddingNode){t=BX.pos(this.topPaddingNode);e.top=t.bottom;e.right=t.right}else{t=BX.pos(document.body);e.right=t.right}return e},changeHeight:function(t){if(t>0)this.frameNode.style.height=t+"px"},showNotification:function(t){if(!isNaN(parseFloat(t))&&isFinite(t)&&t>0){var e='<div class="help-block-counter">'+(t>99?"99+":t)+"</div>"}else{e=""}this.setNotification(t)},showAnimateHero:function(url){if(!url)return;BX.ajax({method:"GET",dataType:"html",url:this.helpUrl+url,data:{},onsuccess:BX.proxy(function(res){if(res){BX.load([this.runtimeUrl],function(){eval(res)})}},this)})},setNotification:function(t,e){BX.ajax({method:"POST",dataType:"json",url:this.ajaxUrl,data:{sessid:BX.bitrix_sessid(),action:"setNotify",num:t,time:e},onsuccess:BX.proxy(function(t){},this)})},checkNotification:function(){BX.ajax({method:"POST",dataType:"json",url:this.notifyUrl,data:this.notifyData,onsuccess:BX.proxy(function(t){if(!isNaN(t.num)){this.showNotification(t.num);if(t.id){this.notifyId=t.id;this.notifyText=t.body;this.notifyButton=t.button}if(t.url)this.showAnimateHero(t.url)}else{this.setNotification("","hour")}},this),onfailure:BX.proxy(function(){this.setNotification("","hour")},this)})},showAnimatedHero:function(){if(!BX.browser.IsIE8()){BX.load(["/bitrix/js/main/helper/runtime.js","/bitrix/js/main/helper/hero_object.js"],function(){var t=BX.create("div",{attrs:{className:"bx-help-start",id:"bx-help-start"}});if(BX.admin&&BX.admin.panel){t.style.top=BX.admin.panel.DIV.offsetHeight+50+"px"}document.body.appendChild(t);var e=new swiffy.Stage(t,swiffyobject,{});e.setBackground(null);setTimeout(function(){e.start()},300);setTimeout(function(){t.style.display="none"},7300)})}}};
//# sourceMappingURL=helper.map.js