import{Y as o,ab as u,ac as A,ad as f,ae as v,af as n,ai as l,ag as N,aj as w,ah as E,ak as C,al as c}from"./index-CVBD42mg.js";import{B as _}from"./baseSolanaAdapter.esm-zL7SUKNN.js";import{a as g}from"./solanaProvider.esm-3IFSvoAG.js";import"./baseProvider.esm--vBp5biM.js";import"./util-BLBo2_qY.js";import"./nacl-fast-BcyG6k9u.js";function p(r,t,i){return new Promise((e,a)=>{i>0?setTimeout(async()=>{const h=await r();h&&e(h),h||p(r,t,i-1).then(s=>(e(s),s)).catch(s=>a(s))},t):e(!1)})}const P=async function(){var r;let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{interval:1e3,count:3};return typeof window<"u"&&!!((r=window.solana)!==null&&r!==void 0&&r.isPhantom)||await p(()=>{var a;return(a=window.solana)===null||a===void 0?void 0:a.isPhantom},t.interval,t.count)?window.solana:null};class I extends _{constructor(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};super(),o(this,"name",u.PHANTOM),o(this,"adapterNamespace",A.SOLANA),o(this,"currentChainNamespace",f.SOLANA),o(this,"type",v.EXTERNAL),o(this,"status",n.NOT_READY),o(this,"_wallet",null),o(this,"phantomProvider",null),o(this,"rehydrated",!1),o(this,"_onDisconnect",()=>{this._wallet&&(this._wallet.off("disconnect",this._onDisconnect),this.rehydrated=!1,this.status=this.status===n.CONNECTED?n.READY:n.NOT_READY,this.emit(l.DISCONNECTED))}),this.chainConfig=t.chainConfig||null,this.sessionTime=t.sessionTime||86400}get isWalletConnected(){var t;return!!((t=this._wallet)!==null&&t!==void 0&&t.isConnected&&this.status===n.CONNECTED)}get provider(){var t;return((t=this.phantomProvider)===null||t===void 0?void 0:t.provider)||null}set provider(t){throw new Error("Not implemented")}setAdapterSettings(t){this.status!==n.READY&&t!=null&&t.sessionTime&&(this.sessionTime=t.sessionTime)}async init(t){if(super.checkInitializationRequirements(),this.chainConfig||(this.chainConfig=N(f.SOLANA,"0x1")),this._wallet=await P({interval:500,count:3}),!this._wallet)throw w.notInstalled();this.phantomProvider=new g({config:{chainConfig:this.chainConfig}}),this.status=n.READY,this.emit(l.READY,u.PHANTOM);try{E.debug("initializing phantom adapter"),t.autoConnect&&(this.rehydrated=!0,await this.connect())}catch(i){E.error("Failed to connect with cached phantom provider",i),this.emit("ERRORED",i)}}async connect(){var t=this;try{if(super.checkConnectionRequirements(),this.status=n.CONNECTING,this.emit(l.CONNECTING,{adapter:u.PHANTOM}),!this._wallet)throw w.notInstalled();if(this._wallet.isConnected)await this.connectWithProvider(this._wallet);else{const i=this._wallet._handleDisconnect;try{await new Promise((e,a)=>{const h=async()=>{await this.connectWithProvider(this._wallet),e(this.provider)};if(!this._wallet)return a(w.notInstalled());this._wallet.once("connect",h),this._wallet._handleDisconnect=function(){a(w.windowClosed());for(var s=arguments.length,m=new Array(s),d=0;d<s;d++)m[d]=arguments[d];return i.apply(t._wallet,m)},this._wallet.connect().catch(s=>{a(s)})})}catch(e){throw e instanceof C?e:c.connectionError(e==null?void 0:e.message)}finally{this._wallet._handleDisconnect=i}}if(!this._wallet.publicKey)throw c.connectionError();return this._wallet.on("disconnect",this._onDisconnect),this.provider}catch(i){throw this.status=n.READY,this.rehydrated=!1,this.emit(l.ERRORED,i),i}}async disconnect(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{cleanup:!1};await super.disconnect();try{var i;await((i=this._wallet)===null||i===void 0?void 0:i.disconnect()),t.cleanup&&(this.status=n.NOT_READY,this.phantomProvider=null,this._wallet=null),this.emit(l.DISCONNECTED)}catch(e){this.emit(l.ERRORED,c.disconnectionError(e==null?void 0:e.message))}}async getUserInfo(){if(!this.isWalletConnected)throw c.notConnectedError("Not connected with wallet, Please login/connect first");return{}}async connectWithProvider(t){if(!this.phantomProvider)throw c.connectionError("No phantom provider");return await this.phantomProvider.setupProvider(t),this.status=n.CONNECTED,this.emit(l.CONNECTED,{adapter:u.PHANTOM,reconnected:this.rehydrated}),this.provider}}export{I as PhantomAdapter};
