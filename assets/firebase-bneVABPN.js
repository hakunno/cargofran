const Zg=()=>{};var Nl={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Md=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},e_=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],o=r[t++],c=r[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|c&63)-65536;e[n++]=String.fromCharCode(55296+(u>>10)),e[n++]=String.fromCharCode(56320+(u&1023))}else{const i=r[t++],o=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Fd={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,c=o?r[s+1]:0,u=s+2<r.length,h=u?r[s+2]:0,f=i>>2,m=(i&3)<<4|c>>4;let _=(c&15)<<2|h>>6,R=h&63;u||(R=64,o||(_=64)),n.push(t[f],t[m],t[_],t[R])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(Md(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):e_(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],c=s<r.length?t[r.charAt(s)]:0;++s;const h=s<r.length?t[r.charAt(s)]:64;++s;const m=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||c==null||h==null||m==null)throw new t_;const _=i<<2|c>>4;if(n.push(_),h!==64){const R=c<<4&240|h>>2;if(n.push(R),m!==64){const C=h<<6&192|m;n.push(C)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class t_ extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const n_=function(r){const e=Md(r);return Fd.encodeByteArray(e,!0)},Vi=function(r){return n_(r).replace(/\./g,"")},Ud=function(r){try{return Fd.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r_(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const s_=()=>r_().__FIREBASE_DEFAULTS__,i_=()=>{if(typeof process>"u"||typeof Nl>"u")return;const r=Nl.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},o_=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Ud(r[1]);return e&&JSON.parse(e)},ho=()=>{try{return Zg()||s_()||i_()||o_()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Bd=r=>{var e,t;return(t=(e=ho())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},pc=r=>{const e=Bd(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},qd=()=>{var r;return(r=ho())===null||r===void 0?void 0:r.config},jd=r=>{var e;return(e=ho())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a_{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $d(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},r);return[Vi(JSON.stringify(t)),Vi(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function c_(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ge())}function u_(){var r;const e=(r=ho())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function l_(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function h_(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function d_(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function f_(){const r=ge();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function zd(){return!u_()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Kd(){try{return typeof indexedDB=="object"}catch{return!1}}function p_(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m_="FirebaseError";class Xe extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=m_,Object.setPrototypeOf(this,Xe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ss.prototype.create)}}class Ss{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?g_(i,n):"Error",c=`${this.serviceName}: ${o} (${s}).`;return new Xe(s,c,n)}}function g_(r,e){return r.replace(__,(t,n)=>{const s=e[n];return s!=null?String(s):`<${n}?>`})}const __=/\{\$([^}]+)}/g;function y_(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function En(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],o=e[s];if(xl(i)&&xl(o)){if(!En(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function xl(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ps(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Yr(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Jr(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function I_(r,e){const t=new T_(r,e);return t.subscribe.bind(t)}class T_{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");E_(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=ma),s.error===void 0&&(s.error=ma),s.complete===void 0&&(s.complete=ma);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function E_(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function ma(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function re(r){return r&&r._delegate?r._delegate:r}class gt{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v_{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new a_;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(A_(e))try{this.getOrInitializeService({instanceIdentifier:cn})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=cn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=cn){return this.instances.has(e)}getOptions(e=cn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);n===c&&o.resolve(s)}return s}onInit(e,t){var n;const s=this.normalizeInstanceIdentifier(t),i=(n=this.onInitCallbacks.get(s))!==null&&n!==void 0?n:new Set;i.add(e),this.onInitCallbacks.set(s,i);const o=this.instances.get(s);return o&&e(o,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:w_(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=cn){return this.component?this.component.multipleInstances?e:cn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function w_(r){return r===cn?void 0:r}function A_(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R_{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new v_(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var W;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(W||(W={}));const b_={debug:W.DEBUG,verbose:W.VERBOSE,info:W.INFO,warn:W.WARN,error:W.ERROR,silent:W.SILENT},S_=W.INFO,P_={[W.DEBUG]:"log",[W.VERBOSE]:"log",[W.INFO]:"info",[W.WARN]:"warn",[W.ERROR]:"error"},C_=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=P_[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class mc{constructor(e){this.name=e,this._logLevel=S_,this._logHandler=C_,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in W))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?b_[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,W.DEBUG,...e),this._logHandler(this,W.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,W.VERBOSE,...e),this._logHandler(this,W.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,W.INFO,...e),this._logHandler(this,W.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,W.WARN,...e),this._logHandler(this,W.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,W.ERROR,...e),this._logHandler(this,W.ERROR,...e)}}const k_=(r,e)=>e.some(t=>r instanceof t);let Ol,Ll;function D_(){return Ol||(Ol=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function V_(){return Ll||(Ll=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Gd=new WeakMap,Va=new WeakMap,Hd=new WeakMap,ga=new WeakMap,gc=new WeakMap;function N_(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{t(jt(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Gd.set(t,r)}).catch(()=>{}),gc.set(e,r),e}function x_(r){if(Va.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});Va.set(r,e)}let Na={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Va.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Hd.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return jt(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function O_(r){Na=r(Na)}function L_(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(_a(this),e,...t);return Hd.set(n,e.sort?e.sort():[e]),jt(n)}:V_().includes(r)?function(...e){return r.apply(_a(this),e),jt(Gd.get(this))}:function(...e){return jt(r.apply(_a(this),e))}}function M_(r){return typeof r=="function"?L_(r):(r instanceof IDBTransaction&&x_(r),k_(r,D_())?new Proxy(r,Na):r)}function jt(r){if(r instanceof IDBRequest)return N_(r);if(ga.has(r))return ga.get(r);const e=M_(r);return e!==r&&(ga.set(r,e),gc.set(e,r)),e}const _a=r=>gc.get(r);function F_(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,e),c=jt(o);return n&&o.addEventListener("upgradeneeded",u=>{n(jt(o.result),u.oldVersion,u.newVersion,jt(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),c}const U_=["get","getKey","getAll","getAllKeys","count"],B_=["put","add","delete","clear"],ya=new Map;function Ml(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(ya.get(e))return ya.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=B_.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||U_.includes(t)))return;const i=async function(o,...c){const u=this.transaction(o,s?"readwrite":"readonly");let h=u.store;return n&&(h=h.index(c.shift())),(await Promise.all([h[t](...c),s&&u.done]))[0]};return ya.set(e,i),i}O_(r=>({...r,get:(e,t,n)=>Ml(e,t)||r.get(e,t,n),has:(e,t)=>!!Ml(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(j_(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function j_(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const xa="@firebase/app",Fl="0.11.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _t=new mc("@firebase/app"),$_="@firebase/app-compat",z_="@firebase/analytics-compat",K_="@firebase/analytics",G_="@firebase/app-check-compat",H_="@firebase/app-check",W_="@firebase/auth",Q_="@firebase/auth-compat",Y_="@firebase/database",J_="@firebase/data-connect",X_="@firebase/database-compat",Z_="@firebase/functions",ey="@firebase/functions-compat",ty="@firebase/installations",ny="@firebase/installations-compat",ry="@firebase/messaging",sy="@firebase/messaging-compat",iy="@firebase/performance",oy="@firebase/performance-compat",ay="@firebase/remote-config",cy="@firebase/remote-config-compat",uy="@firebase/storage",ly="@firebase/storage-compat",hy="@firebase/firestore",dy="@firebase/vertexai",fy="@firebase/firestore-compat",py="firebase",my="11.4.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oa="[DEFAULT]",gy={[xa]:"fire-core",[$_]:"fire-core-compat",[K_]:"fire-analytics",[z_]:"fire-analytics-compat",[H_]:"fire-app-check",[G_]:"fire-app-check-compat",[W_]:"fire-auth",[Q_]:"fire-auth-compat",[Y_]:"fire-rtdb",[J_]:"fire-data-connect",[X_]:"fire-rtdb-compat",[Z_]:"fire-fn",[ey]:"fire-fn-compat",[ty]:"fire-iid",[ny]:"fire-iid-compat",[ry]:"fire-fcm",[sy]:"fire-fcm-compat",[iy]:"fire-perf",[oy]:"fire-perf-compat",[ay]:"fire-rc",[cy]:"fire-rc-compat",[uy]:"fire-gcs",[ly]:"fire-gcs-compat",[hy]:"fire-fst",[fy]:"fire-fst-compat",[dy]:"fire-vertex","fire-js":"fire-js",[py]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ni=new Map,_y=new Map,La=new Map;function Ul(r,e){try{r.container.addComponent(e)}catch(t){_t.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Ht(r){const e=r.name;if(La.has(e))return _t.debug(`There were multiple attempts to register component ${e}.`),!1;La.set(e,r);for(const t of Ni.values())Ul(t,r);for(const t of _y.values())Ul(t,r);return!0}function Cs(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Oe(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yy={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},$t=new Ss("app","Firebase",yy);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iy{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new gt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw $t.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nn=my;function Ty(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n=Object.assign({name:Oa,automaticDataCollectionEnabled:!1},e),s=n.name;if(typeof s!="string"||!s)throw $t.create("bad-app-name",{appName:String(s)});if(t||(t=qd()),!t)throw $t.create("no-options");const i=Ni.get(s);if(i){if(En(t,i.options)&&En(n,i.config))return i;throw $t.create("duplicate-app",{appName:s})}const o=new R_(s);for(const u of La.values())o.addComponent(u);const c=new Iy(t,n,o);return Ni.set(s,c),c}function fo(r=Oa){const e=Ni.get(r);if(!e&&r===Oa&&qd())return Ty();if(!e)throw $t.create("no-app",{appName:r});return e}function He(r,e,t){var n;let s=(n=gy[r])!==null&&n!==void 0?n:r;t&&(s+=`-${t}`);const i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const c=[`Unable to register library "${s}" with version "${e}":`];i&&c.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&c.push("and"),o&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),_t.warn(c.join(" "));return}Ht(new gt(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ey="firebase-heartbeat-database",vy=1,ds="firebase-heartbeat-store";let Ia=null;function Wd(){return Ia||(Ia=F_(Ey,vy,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(ds)}catch(t){console.warn(t)}}}}).catch(r=>{throw $t.create("idb-open",{originalErrorMessage:r.message})})),Ia}async function wy(r){try{const t=(await Wd()).transaction(ds),n=await t.objectStore(ds).get(Qd(r));return await t.done,n}catch(e){if(e instanceof Xe)_t.warn(e.message);else{const t=$t.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});_t.warn(t.message)}}}async function Bl(r,e){try{const n=(await Wd()).transaction(ds,"readwrite");await n.objectStore(ds).put(e,Qd(r)),await n.done}catch(t){if(t instanceof Xe)_t.warn(t.message);else{const n=$t.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});_t.warn(n.message)}}}function Qd(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ay=1024,Ry=30;class by{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Py(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=ql();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>Ry){const o=Cy(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){_t.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ql(),{heartbeatsToSend:n,unsentEntries:s}=Sy(this._heartbeatsCache.heartbeats),i=Vi(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return _t.warn(t),""}}}function ql(){return new Date().toISOString().substring(0,10)}function Sy(r,e=Ay){const t=[];let n=r.slice();for(const s of r){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),jl(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),jl(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class Py{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Kd()?p_().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await wy(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Bl(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Bl(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function jl(r){return Vi(JSON.stringify({version:2,heartbeats:r})).length}function Cy(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ky(r){Ht(new gt("platform-logger",e=>new q_(e),"PRIVATE")),Ht(new gt("heartbeat",e=>new by(e),"PRIVATE")),He(xa,Fl,r),He(xa,Fl,"esm2017"),He("fire-js","")}ky("");var Dy="firebase",Vy="11.4.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */He(Dy,Vy,"app");function _c(r,e){var t={};for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.indexOf(n)<0&&(t[n]=r[n]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,n=Object.getOwnPropertySymbols(r);s<n.length;s++)e.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(r,n[s])&&(t[n[s]]=r[n[s]]);return t}function Yd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ny=Yd,Jd=new Ss("auth","Firebase",Yd());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xi=new mc("@firebase/auth");function xy(r,...e){xi.logLevel<=W.WARN&&xi.warn(`Auth (${Nn}): ${r}`,...e)}function _i(r,...e){xi.logLevel<=W.ERROR&&xi.error(`Auth (${Nn}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function We(r,...e){throw Ic(r,...e)}function Je(r,...e){return Ic(r,...e)}function yc(r,e,t){const n=Object.assign(Object.assign({},Ny()),{[e]:t});return new Ss("auth","Firebase",n).create(e,{appName:r.name})}function mt(r){return yc(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Oy(r,e,t){const n=t;if(!(e instanceof n))throw n.name!==e.constructor.name&&We(r,"argument-error"),yc(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Ic(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return Jd.create(r,...e)}function z(r,e,...t){if(!r)throw Ic(e,...t)}function ht(r){const e="INTERNAL ASSERTION FAILED: "+r;throw _i(e),new Error(e)}function yt(r,e){r||ht(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ma(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function Ly(){return $l()==="http:"||$l()==="https:"}function $l(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function My(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ly()||h_()||"connection"in navigator)?navigator.onLine:!0}function Fy(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ks{constructor(e,t){this.shortDelay=e,this.longDelay=t,yt(t>e,"Short delay should be less than long delay!"),this.isMobile=c_()||d_()}get(){return My()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tc(r,e){yt(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ht("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ht("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ht("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uy={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const By=new ks(3e4,6e4);function Et(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function vt(r,e,t,n,s={}){return Zd(r,s,async()=>{let i={},o={};n&&(e==="GET"?o=n:i={body:JSON.stringify(n)});const c=Ps(Object.assign({key:r.config.apiKey},o)).slice(1),u=await r._getAdditionalHeaders();u["Content-Type"]="application/json",r.languageCode&&(u["X-Firebase-Locale"]=r.languageCode);const h=Object.assign({method:e,headers:u},i);return l_()||(h.referrerPolicy="no-referrer"),Xd.fetch()(ef(r,r.config.apiHost,t,c),h)})}async function Zd(r,e,t){r._canInitEmulator=!1;const n=Object.assign(Object.assign({},Uy),e);try{const s=new jy(r),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw ai(r,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const c=i.ok?o.errorMessage:o.error.message,[u,h]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw ai(r,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw ai(r,"email-already-in-use",o);if(u==="USER_DISABLED")throw ai(r,"user-disabled",o);const f=n[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw yc(r,f,h);We(r,f)}}catch(s){if(s instanceof Xe)throw s;We(r,"network-request-failed",{message:String(s)})}}async function Ds(r,e,t,n,s={}){const i=await vt(r,e,t,n,s);return"mfaPendingCredential"in i&&We(r,"multi-factor-auth-required",{_serverResponse:i}),i}function ef(r,e,t,n){const s=`${e}${t}?${n}`;return r.config.emulator?Tc(r.config,s):`${r.config.apiScheme}://${s}`}function qy(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class jy{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(Je(this.auth,"network-request-failed")),By.get())})}}function ai(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const s=Je(r,e,n);return s.customData._tokenResponse=t,s}function zl(r){return r!==void 0&&r.enterprise!==void 0}class $y{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return qy(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function zy(r,e){return vt(r,"GET","/v2/recaptchaConfig",Et(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ky(r,e){return vt(r,"POST","/v1/accounts:delete",e)}async function tf(r,e){return vt(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rs(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Gy(r,e=!1){const t=re(r),n=await t.getIdToken(e),s=Ec(n);z(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:n,authTime:rs(Ta(s.auth_time)),issuedAtTime:rs(Ta(s.iat)),expirationTime:rs(Ta(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Ta(r){return Number(r)*1e3}function Ec(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return _i("JWT malformed, contained fewer than 3 sections"),null;try{const s=Ud(t);return s?JSON.parse(s):(_i("Failed to decode base64 JWT payload"),null)}catch(s){return _i("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Kl(r){const e=Ec(r);return z(e,"internal-error"),z(typeof e.exp<"u","internal-error"),z(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fs(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof Xe&&Hy(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function Hy({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fa{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=rs(this.lastLoginAt),this.creationTime=rs(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oi(r){var e;const t=r.auth,n=await r.getIdToken(),s=await fs(r,tf(t,{idToken:n}));z(s==null?void 0:s.users.length,t,"internal-error");const i=s.users[0];r._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?nf(i.providerUserInfo):[],c=Yy(r.providerData,o),u=r.isAnonymous,h=!(r.email&&i.passwordHash)&&!(c!=null&&c.length),f=u?h:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:c,metadata:new Fa(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(r,m)}async function Qy(r){const e=re(r);await Oi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Yy(r,e){return[...r.filter(n=>!e.some(s=>s.providerId===n.providerId)),...e]}function nf(r){return r.map(e=>{var{providerId:t}=e,n=_c(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jy(r,e){const t=await Zd(r,{},async()=>{const n=Ps({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=r.config,o=ef(r,s,"/v1/token",`key=${i}`),c=await r._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",Xd.fetch()(o,{method:"POST",headers:c,body:n})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Xy(r,e){return vt(r,"POST","/v2/accounts:revokeToken",Et(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){z(e.idToken,"internal-error"),z(typeof e.idToken<"u","internal-error"),z(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Kl(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){z(e.length!==0,"internal-error");const t=Kl(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(z(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:s,expiresIn:i}=await Jy(e,t);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:s,expirationTime:i}=t,o=new Yn;return n&&(z(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),s&&(z(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(z(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Yn,this.toJSON())}_performRefresh(){return ht("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dt(r,e){z(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class dt{constructor(e){var{uid:t,auth:n,stsTokenManager:s}=e,i=_c(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Wy(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Fa(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await fs(this,this.stsTokenManager.getToken(this.auth,e));return z(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Gy(this,e)}reload(){return Qy(this)}_assign(e){this!==e&&(z(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new dt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){z(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Oi(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Oe(this.auth.app))return Promise.reject(mt(this.auth));const e=await this.getIdToken();return await fs(this,Ky(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,s,i,o,c,u,h,f;const m=(n=t.displayName)!==null&&n!==void 0?n:void 0,_=(s=t.email)!==null&&s!==void 0?s:void 0,R=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,C=(o=t.photoURL)!==null&&o!==void 0?o:void 0,V=(c=t.tenantId)!==null&&c!==void 0?c:void 0,k=(u=t._redirectEventId)!==null&&u!==void 0?u:void 0,j=(h=t.createdAt)!==null&&h!==void 0?h:void 0,B=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:L,emailVerified:$,isAnonymous:Y,providerData:G,stsTokenManager:T}=t;z(L&&T,e,"internal-error");const g=Yn.fromJSON(this.name,T);z(typeof L=="string",e,"internal-error"),Dt(m,e.name),Dt(_,e.name),z(typeof $=="boolean",e,"internal-error"),z(typeof Y=="boolean",e,"internal-error"),Dt(R,e.name),Dt(C,e.name),Dt(V,e.name),Dt(k,e.name),Dt(j,e.name),Dt(B,e.name);const I=new dt({uid:L,auth:e,email:_,emailVerified:$,displayName:m,isAnonymous:Y,photoURL:C,phoneNumber:R,tenantId:V,stsTokenManager:g,createdAt:j,lastLoginAt:B});return G&&Array.isArray(G)&&(I.providerData=G.map(E=>Object.assign({},E))),k&&(I._redirectEventId=k),I}static async _fromIdTokenResponse(e,t,n=!1){const s=new Yn;s.updateFromServerResponse(t);const i=new dt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await Oi(i),i}static async _fromGetAccountInfoResponse(e,t,n){const s=t.users[0];z(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?nf(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),c=new Yn;c.updateFromIdToken(n);const u=new dt({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:o}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Fa(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gl=new Map;function ft(r){yt(r instanceof Function,"Expected a class definition");let e=Gl.get(r);return e?(yt(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Gl.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rf{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}rf.type="NONE";const Hl=rf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yi(r,e,t){return`firebase:${r}:${e}:${t}`}class Jn{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=yi(this.userKey,s.apiKey,i),this.fullPersistenceKey=yi("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?dt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Jn(ft(Hl),e,n);const s=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let i=s[0]||ft(Hl);const o=yi(n,e.config.apiKey,e.name);let c=null;for(const h of t)try{const f=await h._get(o);if(f){const m=dt._fromJSON(e,f);h!==i&&(c=m),i=h;break}}catch{}const u=s.filter(h=>h._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new Jn(i,e,n):(i=u[0],c&&await i._set(o,c.toJSON()),await Promise.all(t.map(async h=>{if(h!==i)try{await h._remove(o)}catch{}})),new Jn(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wl(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(cf(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(sf(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(lf(e))return"Blackberry";if(hf(e))return"Webos";if(of(e))return"Safari";if((e.includes("chrome/")||af(e))&&!e.includes("edge/"))return"Chrome";if(uf(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function sf(r=ge()){return/firefox\//i.test(r)}function of(r=ge()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function af(r=ge()){return/crios\//i.test(r)}function cf(r=ge()){return/iemobile/i.test(r)}function uf(r=ge()){return/android/i.test(r)}function lf(r=ge()){return/blackberry/i.test(r)}function hf(r=ge()){return/webos/i.test(r)}function vc(r=ge()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function Zy(r=ge()){var e;return vc(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function eI(){return f_()&&document.documentMode===10}function df(r=ge()){return vc(r)||uf(r)||hf(r)||lf(r)||/windows phone/i.test(r)||cf(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ff(r,e=[]){let t;switch(r){case"Browser":t=Wl(ge());break;case"Worker":t=`${Wl(ge())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Nn}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tI{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=i=>new Promise((o,c)=>{try{const u=e(i);o(u)}catch(u){c(u)}});n.onAbort=t,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nI(r,e={}){return vt(r,"GET","/v2/passwordPolicy",Et(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rI=6;class sI{constructor(e){var t,n,s,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:rI,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,s,i,o,c;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(t=u.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),u.isValid&&(u.isValid=(n=u.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(s=u.containsLowercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(i=u.containsUppercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(c=u.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),u}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iI{constructor(e,t,n,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ql(this),this.idTokenSubscription=new Ql(this),this.beforeStateQueue=new tI(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Jd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ft(t)),this._initializationPromise=this.queue(async()=>{var n,s;if(!this._deleted&&(this.persistenceManager=await Jn.create(this,e),!this._deleted)){if(!((n=this._popupRedirectResolver)===null||n===void 0)&&n._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await tf(this,{idToken:e}),n=await dt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Oe(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(c,c))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let s=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=s==null?void 0:s._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===c)&&(u!=null&&u.user)&&(s=u.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return z(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Oi(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Fy()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Oe(this.app))return Promise.reject(mt(this));const t=e?re(e):null;return t&&z(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&z(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Oe(this.app)?Promise.reject(mt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Oe(this.app)?Promise.reject(mt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ft(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await nI(this),t=new sI(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ss("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await Xy(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&ft(e)||this._popupRedirectResolver;z(t,this,"argument-error"),this.redirectPersistenceManager=await Jn.create(this,[ft(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let o=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(z(c,this,"internal-error"),c.then(()=>{o||i(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,n,s);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return z(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ff(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;if(Oe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&xy(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function wt(r){return re(r)}class Ql{constructor(e){this.auth=e,this.observer=null,this.addObserver=I_(t=>this.observer=t)}get next(){return z(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let po={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function oI(r){po=r}function pf(r){return po.loadJS(r)}function aI(){return po.recaptchaEnterpriseScript}function cI(){return po.gapiScript}function uI(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class lI{constructor(){this.enterprise=new hI}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class hI{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const dI="recaptcha-enterprise",mf="NO_RECAPTCHA";class fI{constructor(e){this.type=dI,this.auth=wt(e)}async verify(e="verify",t=!1){async function n(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,c)=>{zy(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const h=new $y(u);return i.tenantId==null?i._agentRecaptchaConfig=h:i._tenantRecaptchaConfigs[i.tenantId]=h,o(h.siteKey)}}).catch(u=>{c(u)})})}function s(i,o,c){const u=window.grecaptcha;zl(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(h=>{o(h)}).catch(()=>{o(mf)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new lI().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{n(this.auth).then(c=>{if(!t&&zl(window.grecaptcha))s(c,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=aI();u.length!==0&&(u+=c),pf(u).then(()=>{s(c,i,o)}).catch(h=>{o(h)})}}).catch(c=>{o(c)})})}}async function Yl(r,e,t,n=!1,s=!1){const i=new fI(r);let o;if(s)o=mf;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}const c=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){const u=c.phoneEnrollmentInfo.phoneNumber,h=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:h,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){const u=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return n?Object.assign(c,{captchaResp:o}):Object.assign(c,{captchaResponse:o}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function Li(r,e,t,n,s){var i;if(!((i=r._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=await Yl(r,e,t,t==="getOobCode");return n(r,o)}else return n(r,e).catch(async o=>{if(o.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const c=await Yl(r,e,t,t==="getOobCode");return n(r,c)}else return Promise.reject(o)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pI(r,e){const t=Cs(r,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(En(i,e??{}))return s;We(s,"already-initialized")}return t.initialize({options:e})}function mI(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(ft);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function gI(r,e,t){const n=wt(r);z(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const s=!1,i=gf(e),{host:o,port:c}=_I(e),u=c===null?"":`:${c}`,h={url:`${i}//${o}${u}/`},f=Object.freeze({host:o,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!n._canInitEmulator){z(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),z(En(h,n.config.emulator)&&En(f,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=h,n.emulatorConfig=f,n.settings.appVerificationDisabledForTesting=!0,yI()}function gf(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function _I(r){const e=gf(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:Jl(n.substr(i.length+1))}}else{const[i,o]=n.split(":");return{host:i,port:Jl(o)}}}function Jl(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function yI(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wc{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return ht("not implemented")}_getIdTokenResponse(e){return ht("not implemented")}_linkToIdToken(e,t){return ht("not implemented")}_getReauthenticationResolver(e){return ht("not implemented")}}async function II(r,e){return vt(r,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function TI(r,e){return Ds(r,"POST","/v1/accounts:signInWithPassword",Et(r,e))}async function EI(r,e){return vt(r,"POST","/v1/accounts:sendOobCode",Et(r,e))}async function vI(r,e){return EI(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wI(r,e){return Ds(r,"POST","/v1/accounts:signInWithEmailLink",Et(r,e))}async function AI(r,e){return Ds(r,"POST","/v1/accounts:signInWithEmailLink",Et(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ps extends wc{constructor(e,t,n,s=null){super("password",n),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new ps(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new ps(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Li(e,t,"signInWithPassword",TI);case"emailLink":return wI(e,{email:this._email,oobCode:this._password});default:We(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Li(e,n,"signUpPassword",II);case"emailLink":return AI(e,{idToken:t,email:this._email,oobCode:this._password});default:We(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xn(r,e){return Ds(r,"POST","/v1/accounts:signInWithIdp",Et(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RI="http://localhost";class vn extends wc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new vn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):We("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s}=t,i=_c(t,["providerId","signInMethod"]);if(!n||!s)return null;const o=new vn(n,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Xn(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Xn(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Xn(e,t)}buildRequest(){const e={requestUri:RI,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ps(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bI(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function SI(r){const e=Yr(Jr(r)).link,t=e?Yr(Jr(e)).deep_link_id:null,n=Yr(Jr(r)).deep_link_id;return(n?Yr(Jr(n)).link:null)||n||t||e||r}class Ac{constructor(e){var t,n,s,i,o,c;const u=Yr(Jr(e)),h=(t=u.apiKey)!==null&&t!==void 0?t:null,f=(n=u.oobCode)!==null&&n!==void 0?n:null,m=bI((s=u.mode)!==null&&s!==void 0?s:null);z(h&&f&&m,"argument-error"),this.apiKey=h,this.operation=m,this.code=f,this.continueUrl=(i=u.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(o=u.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(c=u.tenantId)!==null&&c!==void 0?c:null}static parseLink(e){const t=SI(e);try{return new Ac(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr{constructor(){this.providerId=Tr.PROVIDER_ID}static credential(e,t){return ps._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=Ac.parseLink(t);return z(n,"argument-error"),ps._fromEmailAndCode(e,n.code,n.tenantId)}}Tr.PROVIDER_ID="password";Tr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Tr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vs extends Rc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot extends Vs{constructor(){super("facebook.com")}static credential(e){return vn._fromParams({providerId:Ot.PROVIDER_ID,signInMethod:Ot.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ot.credentialFromTaggedObject(e)}static credentialFromError(e){return Ot.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ot.credential(e.oauthAccessToken)}catch{return null}}}Ot.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ot.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt extends Vs{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return vn._fromParams({providerId:Lt.PROVIDER_ID,signInMethod:Lt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Lt.credentialFromTaggedObject(e)}static credentialFromError(e){return Lt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Lt.credential(t,n)}catch{return null}}}Lt.GOOGLE_SIGN_IN_METHOD="google.com";Lt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt extends Vs{constructor(){super("github.com")}static credential(e){return vn._fromParams({providerId:Mt.PROVIDER_ID,signInMethod:Mt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Mt.credentialFromTaggedObject(e)}static credentialFromError(e){return Mt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Mt.credential(e.oauthAccessToken)}catch{return null}}}Mt.GITHUB_SIGN_IN_METHOD="github.com";Mt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft extends Vs{constructor(){super("twitter.com")}static credential(e,t){return vn._fromParams({providerId:Ft.PROVIDER_ID,signInMethod:Ft.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ft.credentialFromTaggedObject(e)}static credentialFromError(e){return Ft.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Ft.credential(t,n)}catch{return null}}}Ft.TWITTER_SIGN_IN_METHOD="twitter.com";Ft.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function PI(r,e){return Ds(r,"POST","/v1/accounts:signUp",Et(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,s=!1){const i=await dt._fromIdTokenResponse(e,n,s),o=Xl(n);return new wn({user:i,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const s=Xl(n);return new wn({user:e,providerId:s,_tokenResponse:n,operationType:t})}}function Xl(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi extends Xe{constructor(e,t,n,s){var i;super(t.code,t.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,Mi.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,s){return new Mi(e,t,n,s)}}function _f(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Mi._fromErrorAndOperation(r,i,e,n):i})}async function CI(r,e,t=!1){const n=await fs(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return wn._forOperation(r,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kI(r,e,t=!1){const{auth:n}=r;if(Oe(n.app))return Promise.reject(mt(n));const s="reauthenticate";try{const i=await fs(r,_f(n,s,e,r),t);z(i.idToken,n,"internal-error");const o=Ec(i.idToken);z(o,n,"internal-error");const{sub:c}=o;return z(r.uid===c,n,"user-mismatch"),wn._forOperation(r,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&We(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yf(r,e,t=!1){if(Oe(r.app))return Promise.reject(mt(r));const n="signIn",s=await _f(r,n,e),i=await wn._fromIdTokenResponse(r,n,s);return t||await r._updateCurrentUser(i.user),i}async function DI(r,e){return yf(wt(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function If(r){const e=wt(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function zR(r,e,t){const n=wt(r);await Li(n,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",vI)}async function KR(r,e,t){if(Oe(r.app))return Promise.reject(mt(r));const n=wt(r),o=await Li(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",PI).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&If(r),u}),c=await wn._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(c.user),c}function GR(r,e,t){return Oe(r.app)?Promise.reject(mt(r)):DI(re(r),Tr.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&If(r),n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function HR(r,e){return re(r).setPersistence(e)}function VI(r,e,t,n){return re(r).onIdTokenChanged(e,t,n)}function NI(r,e,t){return re(r).beforeAuthStateChanged(e,t)}function WR(r,e,t,n){return re(r).onAuthStateChanged(e,t,n)}function QR(r){return re(r).signOut()}const Fi="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tf{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Fi,"1"),this.storage.removeItem(Fi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xI=1e3,OI=10;class Ef extends Tf{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=df(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),s=this.localCache[t];n!==s&&e(t,s,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}const n=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},i=this.storage.getItem(n);eI()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,OI):s()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},xI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ef.type="LOCAL";const LI=Ef;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vf extends Tf{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}vf.type="SESSION";const wf=vf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MI(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mo{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const n=new mo(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const c=Array.from(o).map(async h=>h(t.origin,i)),u=await MI(c);t.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}mo.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bc(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FI{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((c,u)=>{const h=bc("",20);s.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},n);o={messageChannel:s,onMessage(m){const _=m;if(_.data.eventId===h)switch(_.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(_.data.response);break;default:clearTimeout(f),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(){return window}function UI(r){st().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Af(){return typeof st().WorkerGlobalScope<"u"&&typeof st().importScripts=="function"}async function BI(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function qI(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function jI(){return Af()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rf="firebaseLocalStorageDb",$I=1,Ui="firebaseLocalStorage",bf="fbase_key";class Ns{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function go(r,e){return r.transaction([Ui],e?"readwrite":"readonly").objectStore(Ui)}function zI(){const r=indexedDB.deleteDatabase(Rf);return new Ns(r).toPromise()}function Ua(){const r=indexedDB.open(Rf,$I);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(Ui,{keyPath:bf})}catch(s){t(s)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(Ui)?e(n):(n.close(),await zI(),e(await Ua()))})})}async function Zl(r,e,t){const n=go(r,!0).put({[bf]:e,value:t});return new Ns(n).toPromise()}async function KI(r,e){const t=go(r,!1).get(e),n=await new Ns(t).toPromise();return n===void 0?null:n.value}function eh(r,e){const t=go(r,!0).delete(e);return new Ns(t).toPromise()}const GI=800,HI=3;class Sf{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Ua(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>HI)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Af()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=mo._getInstance(jI()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await BI(),!this.activeServiceWorker)return;this.sender=new FI(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((e=n[0])===null||e===void 0)&&e.fulfilled&&!((t=n[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||qI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Ua();return await Zl(e,Fi,"1"),await eh(e,Fi),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Zl(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>KI(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>eh(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=go(s,!1).getAll();return new Ns(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),GI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Sf.type="LOCAL";const WI=Sf;new ks(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pf(r,e){return e?ft(e):(z(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sc extends wc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Xn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Xn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Xn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function QI(r){return yf(r.auth,new Sc(r),r.bypassAuthState)}function YI(r){const{auth:e,user:t}=r;return z(t,e,"internal-error"),kI(t,new Sc(r),r.bypassAuthState)}async function JI(r){const{auth:e,user:t}=r;return z(t,e,"internal-error"),CI(t,new Sc(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cf{constructor(e,t,n,s,i=!1){this.auth=e,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:s,tenantId:i,error:o,type:c}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return QI;case"linkViaPopup":case"linkViaRedirect":return JI;case"reauthViaPopup":case"reauthViaRedirect":return YI;default:We(this.auth,"internal-error")}}resolve(e){yt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){yt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XI=new ks(2e3,1e4);async function YR(r,e,t){if(Oe(r.app))return Promise.reject(Je(r,"operation-not-supported-in-this-environment"));const n=wt(r);Oy(r,e,Rc);const s=Pf(n,t);return new mn(n,"signInViaPopup",e,s).executeNotNull()}class mn extends Cf{constructor(e,t,n,s,i){super(e,t,s,i),this.provider=n,this.authWindow=null,this.pollId=null,mn.currentPopupAction&&mn.currentPopupAction.cancel(),mn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return z(e,this.auth,"internal-error"),e}async onExecution(){yt(this.filter.length===1,"Popup operations only handle one event");const e=bc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Je(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Je(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,mn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if(!((n=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||n===void 0)&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Je(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,XI.get())};e()}}mn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZI="pendingRedirect",Ii=new Map;class eT extends Cf{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Ii.get(this.auth._key());if(!e){try{const n=await tT(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}Ii.set(this.auth._key(),e)}return this.bypassAuthState||Ii.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function tT(r,e){const t=sT(e),n=rT(r);if(!await n._isAvailable())return!1;const s=await n._get(t)==="true";return await n._remove(t),s}function nT(r,e){Ii.set(r._key(),e)}function rT(r){return ft(r._redirectPersistence)}function sT(r){return yi(ZI,r.config.apiKey,r.name)}async function iT(r,e,t=!1){if(Oe(r.app))return Promise.reject(mt(r));const n=wt(r),s=Pf(n,e),o=await new eT(n,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oT=10*60*1e3;class aT{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!cT(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!kf(e)){const s=((n=e.error.code)===null||n===void 0?void 0:n.split("auth/")[1])||"internal-error";t.onError(Je(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=oT&&this.cachedEventUids.clear(),this.cachedEventUids.has(th(e))}saveEventToCache(e){this.cachedEventUids.add(th(e)),this.lastProcessedEventTime=Date.now()}}function th(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function kf({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function cT(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return kf(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uT(r,e={}){return vt(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lT=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,hT=/^https?/;async function dT(r){if(r.config.emulator)return;const{authorizedDomains:e}=await uT(r);for(const t of e)try{if(fT(t))return}catch{}We(r,"unauthorized-domain")}function fT(r){const e=Ma(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!hT.test(t))return!1;if(lT.test(r))return n===r;const s=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pT=new ks(3e4,6e4);function nh(){const r=st().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function mT(r){return new Promise((e,t)=>{var n,s,i;function o(){nh(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{nh(),t(Je(r,"network-request-failed"))},timeout:pT.get()})}if(!((s=(n=st().gapi)===null||n===void 0?void 0:n.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=st().gapi)===null||i===void 0)&&i.load)o();else{const c=uI("iframefcb");return st()[c]=()=>{gapi.load?o():t(Je(r,"network-request-failed"))},pf(`${cI()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw Ti=null,e})}let Ti=null;function gT(r){return Ti=Ti||mT(r),Ti}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _T=new ks(5e3,15e3),yT="__/auth/iframe",IT="emulator/auth/iframe",TT={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ET=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function vT(r){const e=r.config;z(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?Tc(e,IT):`https://${r.config.authDomain}/${yT}`,n={apiKey:e.apiKey,appName:r.name,v:Nn},s=ET.get(r.config.apiHost);s&&(n.eid=s);const i=r._getFrameworks();return i.length&&(n.fw=i.join(",")),`${t}?${Ps(n).slice(1)}`}async function wT(r){const e=await gT(r),t=st().gapi;return z(t,r,"internal-error"),e.open({where:document.body,url:vT(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:TT,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const o=Je(r,"network-request-failed"),c=st().setTimeout(()=>{i(o)},_T.get());function u(){st().clearTimeout(c),s(n)}n.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AT={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},RT=500,bT=600,ST="_blank",PT="http://localhost";class rh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function CT(r,e,t,n=RT,s=bT){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let c="";const u=Object.assign(Object.assign({},AT),{width:n.toString(),height:s.toString(),top:i,left:o}),h=ge().toLowerCase();t&&(c=af(h)?ST:t),sf(h)&&(e=e||PT,u.scrollbars="yes");const f=Object.entries(u).reduce((_,[R,C])=>`${_}${R}=${C},`,"");if(Zy(h)&&c!=="_self")return kT(e||"",c),new rh(null);const m=window.open(e||"",c,f);z(m,r,"popup-blocked");try{m.focus()}catch{}return new rh(m)}function kT(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DT="__/auth/handler",VT="emulator/auth/handler",NT=encodeURIComponent("fac");async function sh(r,e,t,n,s,i){z(r.config.authDomain,r,"auth-domain-config-required"),z(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:Nn,eventId:s};if(e instanceof Rc){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",y_(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))o[f]=m}if(e instanceof Vs){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(o.scopes=f.join(","))}r.tenantId&&(o.tid=r.tenantId);const c=o;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const u=await r._getAppCheckToken(),h=u?`#${NT}=${encodeURIComponent(u)}`:"";return`${xT(r)}?${Ps(c).slice(1)}${h}`}function xT({config:r}){return r.emulator?Tc(r,VT):`https://${r.authDomain}/${DT}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ea="webStorageSupport";class OT{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=wf,this._completeRedirectFn=iT,this._overrideRedirectResult=nT}async _openPopup(e,t,n,s){var i;yt((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await sh(e,t,n,Ma(),s);return CT(e,o,bc())}async _openRedirect(e,t,n,s){await this._originValidation(e);const i=await sh(e,t,n,Ma(),s);return UI(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(yt(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await wT(e),n=new aT(e);return t.register("authEvent",s=>(z(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ea,{type:Ea},s=>{var i;const o=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[Ea];o!==void 0&&t(!!o),We(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=dT(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return df()||of()||vc()}}const LT=OT;var ih="@firebase/auth",oh="1.9.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MT{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){z(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FT(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function UT(r){Ht(new gt("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=n.options;z(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const u={apiKey:o,authDomain:c,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ff(r)},h=new iI(n,s,i,u);return mI(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Ht(new gt("auth-internal",e=>{const t=wt(e.getProvider("auth").getImmediate());return(n=>new MT(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),He(ih,oh,FT(r)),He(ih,oh,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const BT=5*60,qT=jd("authIdTokenMaxAge")||BT;let ah=null;const jT=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>qT)return;const s=t==null?void 0:t.token;ah!==s&&(ah=s,await fetch(r,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function JR(r=fo()){const e=Cs(r,"auth");if(e.isInitialized())return e.getImmediate();const t=pI(r,{popupRedirectResolver:LT,persistence:[WI,LI,wf]}),n=jd("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const o=jT(i.toString());NI(t,o,()=>o(t.currentUser)),VI(t,c=>o(c))}}const s=Bd("auth");return s&&gI(t,`http://${s}`),t}function $T(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}oI({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=s=>{const i=Je("internal-error");i.customData=s,t(i)},n.type="text/javascript",n.charset="UTF-8",$T().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});UT("Browser");var ch=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var zt,Df;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,g){function I(){}I.prototype=g.prototype,T.D=g.prototype,T.prototype=new I,T.prototype.constructor=T,T.C=function(E,v,b){for(var y=Array(arguments.length-2),ct=2;ct<arguments.length;ct++)y[ct-2]=arguments[ct];return g.prototype[v].apply(E,y)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(n,t),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,g,I){I||(I=0);var E=Array(16);if(typeof g=="string")for(var v=0;16>v;++v)E[v]=g.charCodeAt(I++)|g.charCodeAt(I++)<<8|g.charCodeAt(I++)<<16|g.charCodeAt(I++)<<24;else for(v=0;16>v;++v)E[v]=g[I++]|g[I++]<<8|g[I++]<<16|g[I++]<<24;g=T.g[0],I=T.g[1],v=T.g[2];var b=T.g[3],y=g+(b^I&(v^b))+E[0]+3614090360&4294967295;g=I+(y<<7&4294967295|y>>>25),y=b+(v^g&(I^v))+E[1]+3905402710&4294967295,b=g+(y<<12&4294967295|y>>>20),y=v+(I^b&(g^I))+E[2]+606105819&4294967295,v=b+(y<<17&4294967295|y>>>15),y=I+(g^v&(b^g))+E[3]+3250441966&4294967295,I=v+(y<<22&4294967295|y>>>10),y=g+(b^I&(v^b))+E[4]+4118548399&4294967295,g=I+(y<<7&4294967295|y>>>25),y=b+(v^g&(I^v))+E[5]+1200080426&4294967295,b=g+(y<<12&4294967295|y>>>20),y=v+(I^b&(g^I))+E[6]+2821735955&4294967295,v=b+(y<<17&4294967295|y>>>15),y=I+(g^v&(b^g))+E[7]+4249261313&4294967295,I=v+(y<<22&4294967295|y>>>10),y=g+(b^I&(v^b))+E[8]+1770035416&4294967295,g=I+(y<<7&4294967295|y>>>25),y=b+(v^g&(I^v))+E[9]+2336552879&4294967295,b=g+(y<<12&4294967295|y>>>20),y=v+(I^b&(g^I))+E[10]+4294925233&4294967295,v=b+(y<<17&4294967295|y>>>15),y=I+(g^v&(b^g))+E[11]+2304563134&4294967295,I=v+(y<<22&4294967295|y>>>10),y=g+(b^I&(v^b))+E[12]+1804603682&4294967295,g=I+(y<<7&4294967295|y>>>25),y=b+(v^g&(I^v))+E[13]+4254626195&4294967295,b=g+(y<<12&4294967295|y>>>20),y=v+(I^b&(g^I))+E[14]+2792965006&4294967295,v=b+(y<<17&4294967295|y>>>15),y=I+(g^v&(b^g))+E[15]+1236535329&4294967295,I=v+(y<<22&4294967295|y>>>10),y=g+(v^b&(I^v))+E[1]+4129170786&4294967295,g=I+(y<<5&4294967295|y>>>27),y=b+(I^v&(g^I))+E[6]+3225465664&4294967295,b=g+(y<<9&4294967295|y>>>23),y=v+(g^I&(b^g))+E[11]+643717713&4294967295,v=b+(y<<14&4294967295|y>>>18),y=I+(b^g&(v^b))+E[0]+3921069994&4294967295,I=v+(y<<20&4294967295|y>>>12),y=g+(v^b&(I^v))+E[5]+3593408605&4294967295,g=I+(y<<5&4294967295|y>>>27),y=b+(I^v&(g^I))+E[10]+38016083&4294967295,b=g+(y<<9&4294967295|y>>>23),y=v+(g^I&(b^g))+E[15]+3634488961&4294967295,v=b+(y<<14&4294967295|y>>>18),y=I+(b^g&(v^b))+E[4]+3889429448&4294967295,I=v+(y<<20&4294967295|y>>>12),y=g+(v^b&(I^v))+E[9]+568446438&4294967295,g=I+(y<<5&4294967295|y>>>27),y=b+(I^v&(g^I))+E[14]+3275163606&4294967295,b=g+(y<<9&4294967295|y>>>23),y=v+(g^I&(b^g))+E[3]+4107603335&4294967295,v=b+(y<<14&4294967295|y>>>18),y=I+(b^g&(v^b))+E[8]+1163531501&4294967295,I=v+(y<<20&4294967295|y>>>12),y=g+(v^b&(I^v))+E[13]+2850285829&4294967295,g=I+(y<<5&4294967295|y>>>27),y=b+(I^v&(g^I))+E[2]+4243563512&4294967295,b=g+(y<<9&4294967295|y>>>23),y=v+(g^I&(b^g))+E[7]+1735328473&4294967295,v=b+(y<<14&4294967295|y>>>18),y=I+(b^g&(v^b))+E[12]+2368359562&4294967295,I=v+(y<<20&4294967295|y>>>12),y=g+(I^v^b)+E[5]+4294588738&4294967295,g=I+(y<<4&4294967295|y>>>28),y=b+(g^I^v)+E[8]+2272392833&4294967295,b=g+(y<<11&4294967295|y>>>21),y=v+(b^g^I)+E[11]+1839030562&4294967295,v=b+(y<<16&4294967295|y>>>16),y=I+(v^b^g)+E[14]+4259657740&4294967295,I=v+(y<<23&4294967295|y>>>9),y=g+(I^v^b)+E[1]+2763975236&4294967295,g=I+(y<<4&4294967295|y>>>28),y=b+(g^I^v)+E[4]+1272893353&4294967295,b=g+(y<<11&4294967295|y>>>21),y=v+(b^g^I)+E[7]+4139469664&4294967295,v=b+(y<<16&4294967295|y>>>16),y=I+(v^b^g)+E[10]+3200236656&4294967295,I=v+(y<<23&4294967295|y>>>9),y=g+(I^v^b)+E[13]+681279174&4294967295,g=I+(y<<4&4294967295|y>>>28),y=b+(g^I^v)+E[0]+3936430074&4294967295,b=g+(y<<11&4294967295|y>>>21),y=v+(b^g^I)+E[3]+3572445317&4294967295,v=b+(y<<16&4294967295|y>>>16),y=I+(v^b^g)+E[6]+76029189&4294967295,I=v+(y<<23&4294967295|y>>>9),y=g+(I^v^b)+E[9]+3654602809&4294967295,g=I+(y<<4&4294967295|y>>>28),y=b+(g^I^v)+E[12]+3873151461&4294967295,b=g+(y<<11&4294967295|y>>>21),y=v+(b^g^I)+E[15]+530742520&4294967295,v=b+(y<<16&4294967295|y>>>16),y=I+(v^b^g)+E[2]+3299628645&4294967295,I=v+(y<<23&4294967295|y>>>9),y=g+(v^(I|~b))+E[0]+4096336452&4294967295,g=I+(y<<6&4294967295|y>>>26),y=b+(I^(g|~v))+E[7]+1126891415&4294967295,b=g+(y<<10&4294967295|y>>>22),y=v+(g^(b|~I))+E[14]+2878612391&4294967295,v=b+(y<<15&4294967295|y>>>17),y=I+(b^(v|~g))+E[5]+4237533241&4294967295,I=v+(y<<21&4294967295|y>>>11),y=g+(v^(I|~b))+E[12]+1700485571&4294967295,g=I+(y<<6&4294967295|y>>>26),y=b+(I^(g|~v))+E[3]+2399980690&4294967295,b=g+(y<<10&4294967295|y>>>22),y=v+(g^(b|~I))+E[10]+4293915773&4294967295,v=b+(y<<15&4294967295|y>>>17),y=I+(b^(v|~g))+E[1]+2240044497&4294967295,I=v+(y<<21&4294967295|y>>>11),y=g+(v^(I|~b))+E[8]+1873313359&4294967295,g=I+(y<<6&4294967295|y>>>26),y=b+(I^(g|~v))+E[15]+4264355552&4294967295,b=g+(y<<10&4294967295|y>>>22),y=v+(g^(b|~I))+E[6]+2734768916&4294967295,v=b+(y<<15&4294967295|y>>>17),y=I+(b^(v|~g))+E[13]+1309151649&4294967295,I=v+(y<<21&4294967295|y>>>11),y=g+(v^(I|~b))+E[4]+4149444226&4294967295,g=I+(y<<6&4294967295|y>>>26),y=b+(I^(g|~v))+E[11]+3174756917&4294967295,b=g+(y<<10&4294967295|y>>>22),y=v+(g^(b|~I))+E[2]+718787259&4294967295,v=b+(y<<15&4294967295|y>>>17),y=I+(b^(v|~g))+E[9]+3951481745&4294967295,T.g[0]=T.g[0]+g&4294967295,T.g[1]=T.g[1]+(v+(y<<21&4294967295|y>>>11))&4294967295,T.g[2]=T.g[2]+v&4294967295,T.g[3]=T.g[3]+b&4294967295}n.prototype.u=function(T,g){g===void 0&&(g=T.length);for(var I=g-this.blockSize,E=this.B,v=this.h,b=0;b<g;){if(v==0)for(;b<=I;)s(this,T,b),b+=this.blockSize;if(typeof T=="string"){for(;b<g;)if(E[v++]=T.charCodeAt(b++),v==this.blockSize){s(this,E),v=0;break}}else for(;b<g;)if(E[v++]=T[b++],v==this.blockSize){s(this,E),v=0;break}}this.h=v,this.o+=g},n.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var g=1;g<T.length-8;++g)T[g]=0;var I=8*this.o;for(g=T.length-8;g<T.length;++g)T[g]=I&255,I/=256;for(this.u(T),T=Array(16),g=I=0;4>g;++g)for(var E=0;32>E;E+=8)T[I++]=this.g[g]>>>E&255;return T};function i(T,g){var I=c;return Object.prototype.hasOwnProperty.call(I,T)?I[T]:I[T]=g(T)}function o(T,g){this.h=g;for(var I=[],E=!0,v=T.length-1;0<=v;v--){var b=T[v]|0;E&&b==g||(I[v]=b,E=!1)}this.g=I}var c={};function u(T){return-128<=T&&128>T?i(T,function(g){return new o([g|0],0>g?-1:0)}):new o([T|0],0>T?-1:0)}function h(T){if(isNaN(T)||!isFinite(T))return m;if(0>T)return k(h(-T));for(var g=[],I=1,E=0;T>=I;E++)g[E]=T/I|0,I*=4294967296;return new o(g,0)}function f(T,g){if(T.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(T.charAt(0)=="-")return k(f(T.substring(1),g));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var I=h(Math.pow(g,8)),E=m,v=0;v<T.length;v+=8){var b=Math.min(8,T.length-v),y=parseInt(T.substring(v,v+b),g);8>b?(b=h(Math.pow(g,b)),E=E.j(b).add(h(y))):(E=E.j(I),E=E.add(h(y)))}return E}var m=u(0),_=u(1),R=u(16777216);r=o.prototype,r.m=function(){if(V(this))return-k(this).m();for(var T=0,g=1,I=0;I<this.g.length;I++){var E=this.i(I);T+=(0<=E?E:4294967296+E)*g,g*=4294967296}return T},r.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(C(this))return"0";if(V(this))return"-"+k(this).toString(T);for(var g=h(Math.pow(T,6)),I=this,E="";;){var v=$(I,g).g;I=j(I,v.j(g));var b=((0<I.g.length?I.g[0]:I.h)>>>0).toString(T);if(I=v,C(I))return b+E;for(;6>b.length;)b="0"+b;E=b+E}},r.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function C(T){if(T.h!=0)return!1;for(var g=0;g<T.g.length;g++)if(T.g[g]!=0)return!1;return!0}function V(T){return T.h==-1}r.l=function(T){return T=j(this,T),V(T)?-1:C(T)?0:1};function k(T){for(var g=T.g.length,I=[],E=0;E<g;E++)I[E]=~T.g[E];return new o(I,~T.h).add(_)}r.abs=function(){return V(this)?k(this):this},r.add=function(T){for(var g=Math.max(this.g.length,T.g.length),I=[],E=0,v=0;v<=g;v++){var b=E+(this.i(v)&65535)+(T.i(v)&65535),y=(b>>>16)+(this.i(v)>>>16)+(T.i(v)>>>16);E=y>>>16,b&=65535,y&=65535,I[v]=y<<16|b}return new o(I,I[I.length-1]&-2147483648?-1:0)};function j(T,g){return T.add(k(g))}r.j=function(T){if(C(this)||C(T))return m;if(V(this))return V(T)?k(this).j(k(T)):k(k(this).j(T));if(V(T))return k(this.j(k(T)));if(0>this.l(R)&&0>T.l(R))return h(this.m()*T.m());for(var g=this.g.length+T.g.length,I=[],E=0;E<2*g;E++)I[E]=0;for(E=0;E<this.g.length;E++)for(var v=0;v<T.g.length;v++){var b=this.i(E)>>>16,y=this.i(E)&65535,ct=T.i(v)>>>16,Sr=T.i(v)&65535;I[2*E+2*v]+=y*Sr,B(I,2*E+2*v),I[2*E+2*v+1]+=b*Sr,B(I,2*E+2*v+1),I[2*E+2*v+1]+=y*ct,B(I,2*E+2*v+1),I[2*E+2*v+2]+=b*ct,B(I,2*E+2*v+2)}for(E=0;E<g;E++)I[E]=I[2*E+1]<<16|I[2*E];for(E=g;E<2*g;E++)I[E]=0;return new o(I,0)};function B(T,g){for(;(T[g]&65535)!=T[g];)T[g+1]+=T[g]>>>16,T[g]&=65535,g++}function L(T,g){this.g=T,this.h=g}function $(T,g){if(C(g))throw Error("division by zero");if(C(T))return new L(m,m);if(V(T))return g=$(k(T),g),new L(k(g.g),k(g.h));if(V(g))return g=$(T,k(g)),new L(k(g.g),g.h);if(30<T.g.length){if(V(T)||V(g))throw Error("slowDivide_ only works with positive integers.");for(var I=_,E=g;0>=E.l(T);)I=Y(I),E=Y(E);var v=G(I,1),b=G(E,1);for(E=G(E,2),I=G(I,2);!C(E);){var y=b.add(E);0>=y.l(T)&&(v=v.add(I),b=y),E=G(E,1),I=G(I,1)}return g=j(T,v.j(g)),new L(v,g)}for(v=m;0<=T.l(g);){for(I=Math.max(1,Math.floor(T.m()/g.m())),E=Math.ceil(Math.log(I)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),b=h(I),y=b.j(g);V(y)||0<y.l(T);)I-=E,b=h(I),y=b.j(g);C(b)&&(b=_),v=v.add(b),T=j(T,y)}return new L(v,T)}r.A=function(T){return $(this,T).h},r.and=function(T){for(var g=Math.max(this.g.length,T.g.length),I=[],E=0;E<g;E++)I[E]=this.i(E)&T.i(E);return new o(I,this.h&T.h)},r.or=function(T){for(var g=Math.max(this.g.length,T.g.length),I=[],E=0;E<g;E++)I[E]=this.i(E)|T.i(E);return new o(I,this.h|T.h)},r.xor=function(T){for(var g=Math.max(this.g.length,T.g.length),I=[],E=0;E<g;E++)I[E]=this.i(E)^T.i(E);return new o(I,this.h^T.h)};function Y(T){for(var g=T.g.length+1,I=[],E=0;E<g;E++)I[E]=T.i(E)<<1|T.i(E-1)>>>31;return new o(I,T.h)}function G(T,g){var I=g>>5;g%=32;for(var E=T.g.length-I,v=[],b=0;b<E;b++)v[b]=0<g?T.i(b+I)>>>g|T.i(b+I+1)<<32-g:T.i(b+I);return new o(v,T.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,Df=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,zt=o}).apply(typeof ch<"u"?ch:typeof self<"u"?self:typeof window<"u"?window:{});var ci=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Vf,Xr,Nf,Ei,Ba,xf,Of,Lf;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,l,d){return a==Array.prototype||a==Object.prototype||(a[l]=d.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof ci=="object"&&ci];for(var l=0;l<a.length;++l){var d=a[l];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=t(this);function s(a,l){if(l)e:{var d=n;a=a.split(".");for(var p=0;p<a.length-1;p++){var A=a[p];if(!(A in d))break e;d=d[A]}a=a[a.length-1],p=d[a],l=l(p),l!=p&&l!=null&&e(d,a,{configurable:!0,writable:!0,value:l})}}function i(a,l){a instanceof String&&(a+="");var d=0,p=!1,A={next:function(){if(!p&&d<a.length){var S=d++;return{value:l(S,a[S]),done:!1}}return p=!0,{done:!0,value:void 0}}};return A[Symbol.iterator]=function(){return A},A}s("Array.prototype.values",function(a){return a||function(){return i(this,function(l,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},c=this||self;function u(a){var l=typeof a;return l=l!="object"?l:a?Array.isArray(a)?"array":l:"null",l=="array"||l=="object"&&typeof a.length=="number"}function h(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function f(a,l,d){return a.call.apply(a.bind,arguments)}function m(a,l,d){if(!a)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var A=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(A,p),a.apply(l,A)}}return function(){return a.apply(l,arguments)}}function _(a,l,d){return _=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,_.apply(null,arguments)}function R(a,l){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function C(a,l){function d(){}d.prototype=l.prototype,a.aa=l.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(p,A,S){for(var x=Array(arguments.length-2),ne=2;ne<arguments.length;ne++)x[ne-2]=arguments[ne];return l.prototype[A].apply(p,x)}}function V(a){const l=a.length;if(0<l){const d=Array(l);for(let p=0;p<l;p++)d[p]=a[p];return d}return[]}function k(a,l){for(let d=1;d<arguments.length;d++){const p=arguments[d];if(u(p)){const A=a.length||0,S=p.length||0;a.length=A+S;for(let x=0;x<S;x++)a[A+x]=p[x]}else a.push(p)}}class j{constructor(l,d){this.i=l,this.j=d,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function B(a){return/^[\s\xa0]*$/.test(a)}function L(){var a=c.navigator;return a&&(a=a.userAgent)?a:""}function $(a){return $[" "](a),a}$[" "]=function(){};var Y=L().indexOf("Gecko")!=-1&&!(L().toLowerCase().indexOf("webkit")!=-1&&L().indexOf("Edge")==-1)&&!(L().indexOf("Trident")!=-1||L().indexOf("MSIE")!=-1)&&L().indexOf("Edge")==-1;function G(a,l,d){for(const p in a)l.call(d,a[p],p,a)}function T(a,l){for(const d in a)l.call(void 0,a[d],d,a)}function g(a){const l={};for(const d in a)l[d]=a[d];return l}const I="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(a,l){let d,p;for(let A=1;A<arguments.length;A++){p=arguments[A];for(d in p)a[d]=p[d];for(let S=0;S<I.length;S++)d=I[S],Object.prototype.hasOwnProperty.call(p,d)&&(a[d]=p[d])}}function v(a){var l=1;a=a.split(":");const d=[];for(;0<l&&a.length;)d.push(a.shift()),l--;return a.length&&d.push(a.join(":")),d}function b(a){c.setTimeout(()=>{throw a},0)}function y(){var a=Ko;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class ct{constructor(){this.h=this.g=null}add(l,d){const p=Sr.get();p.set(l,d),this.h?this.h.next=p:this.g=p,this.h=p}}var Sr=new j(()=>new yg,a=>a.reset());class yg{constructor(){this.next=this.g=this.h=null}set(l,d){this.h=l,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Pr,Cr=!1,Ko=new ct,Nu=()=>{const a=c.Promise.resolve(void 0);Pr=()=>{a.then(Ig)}};var Ig=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(d){b(d)}var l=Sr;l.j(a),100>l.h&&(l.h++,a.next=l.g,l.g=a)}Cr=!1};function St(){this.s=this.s,this.C=this.C}St.prototype.s=!1,St.prototype.ma=function(){this.s||(this.s=!0,this.N())},St.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ve(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}ve.prototype.h=function(){this.defaultPrevented=!0};var Tg=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};c.addEventListener("test",d,l),c.removeEventListener("test",d,l)}catch{}return a}();function kr(a,l){if(ve.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget){if(Y){e:{try{$(l.nodeName);var A=!0;break e}catch{}A=!1}A||(l=null)}}else d=="mouseover"?l=a.fromElement:d=="mouseout"&&(l=a.toElement);this.relatedTarget=l,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Eg[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&kr.aa.h.call(this)}}C(kr,ve);var Eg={2:"touch",3:"pen",4:"mouse"};kr.prototype.h=function(){kr.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var js="closure_listenable_"+(1e6*Math.random()|0),vg=0;function wg(a,l,d,p,A){this.listener=a,this.proxy=null,this.src=l,this.type=d,this.capture=!!p,this.ha=A,this.key=++vg,this.da=this.fa=!1}function $s(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function zs(a){this.src=a,this.g={},this.h=0}zs.prototype.add=function(a,l,d,p,A){var S=a.toString();a=this.g[S],a||(a=this.g[S]=[],this.h++);var x=Ho(a,l,p,A);return-1<x?(l=a[x],d||(l.fa=!1)):(l=new wg(l,this.src,S,!!p,A),l.fa=d,a.push(l)),l};function Go(a,l){var d=l.type;if(d in a.g){var p=a.g[d],A=Array.prototype.indexOf.call(p,l,void 0),S;(S=0<=A)&&Array.prototype.splice.call(p,A,1),S&&($s(l),a.g[d].length==0&&(delete a.g[d],a.h--))}}function Ho(a,l,d,p){for(var A=0;A<a.length;++A){var S=a[A];if(!S.da&&S.listener==l&&S.capture==!!d&&S.ha==p)return A}return-1}var Wo="closure_lm_"+(1e6*Math.random()|0),Qo={};function xu(a,l,d,p,A){if(Array.isArray(l)){for(var S=0;S<l.length;S++)xu(a,l[S],d,p,A);return null}return d=Mu(d),a&&a[js]?a.K(l,d,h(p)?!!p.capture:!1,A):Ag(a,l,d,!1,p,A)}function Ag(a,l,d,p,A,S){if(!l)throw Error("Invalid event type");var x=h(A)?!!A.capture:!!A,ne=Jo(a);if(ne||(a[Wo]=ne=new zs(a)),d=ne.add(l,d,p,x,S),d.proxy)return d;if(p=Rg(),d.proxy=p,p.src=a,p.listener=d,a.addEventListener)Tg||(A=x),A===void 0&&(A=!1),a.addEventListener(l.toString(),p,A);else if(a.attachEvent)a.attachEvent(Lu(l.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Rg(){function a(d){return l.call(a.src,a.listener,d)}const l=bg;return a}function Ou(a,l,d,p,A){if(Array.isArray(l))for(var S=0;S<l.length;S++)Ou(a,l[S],d,p,A);else p=h(p)?!!p.capture:!!p,d=Mu(d),a&&a[js]?(a=a.i,l=String(l).toString(),l in a.g&&(S=a.g[l],d=Ho(S,d,p,A),-1<d&&($s(S[d]),Array.prototype.splice.call(S,d,1),S.length==0&&(delete a.g[l],a.h--)))):a&&(a=Jo(a))&&(l=a.g[l.toString()],a=-1,l&&(a=Ho(l,d,p,A)),(d=-1<a?l[a]:null)&&Yo(d))}function Yo(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[js])Go(l.i,a);else{var d=a.type,p=a.proxy;l.removeEventListener?l.removeEventListener(d,p,a.capture):l.detachEvent?l.detachEvent(Lu(d),p):l.addListener&&l.removeListener&&l.removeListener(p),(d=Jo(l))?(Go(d,a),d.h==0&&(d.src=null,l[Wo]=null)):$s(a)}}}function Lu(a){return a in Qo?Qo[a]:Qo[a]="on"+a}function bg(a,l){if(a.da)a=!0;else{l=new kr(l,this);var d=a.listener,p=a.ha||a.src;a.fa&&Yo(a),a=d.call(p,l)}return a}function Jo(a){return a=a[Wo],a instanceof zs?a:null}var Xo="__closure_events_fn_"+(1e9*Math.random()>>>0);function Mu(a){return typeof a=="function"?a:(a[Xo]||(a[Xo]=function(l){return a.handleEvent(l)}),a[Xo])}function we(){St.call(this),this.i=new zs(this),this.M=this,this.F=null}C(we,St),we.prototype[js]=!0,we.prototype.removeEventListener=function(a,l,d,p){Ou(this,a,l,d,p)};function Ve(a,l){var d,p=a.F;if(p)for(d=[];p;p=p.F)d.push(p);if(a=a.M,p=l.type||l,typeof l=="string")l=new ve(l,a);else if(l instanceof ve)l.target=l.target||a;else{var A=l;l=new ve(p,a),E(l,A)}if(A=!0,d)for(var S=d.length-1;0<=S;S--){var x=l.g=d[S];A=Ks(x,p,!0,l)&&A}if(x=l.g=a,A=Ks(x,p,!0,l)&&A,A=Ks(x,p,!1,l)&&A,d)for(S=0;S<d.length;S++)x=l.g=d[S],A=Ks(x,p,!1,l)&&A}we.prototype.N=function(){if(we.aa.N.call(this),this.i){var a=this.i,l;for(l in a.g){for(var d=a.g[l],p=0;p<d.length;p++)$s(d[p]);delete a.g[l],a.h--}}this.F=null},we.prototype.K=function(a,l,d,p){return this.i.add(String(a),l,!1,d,p)},we.prototype.L=function(a,l,d,p){return this.i.add(String(a),l,!0,d,p)};function Ks(a,l,d,p){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();for(var A=!0,S=0;S<l.length;++S){var x=l[S];if(x&&!x.da&&x.capture==d){var ne=x.listener,Te=x.ha||x.src;x.fa&&Go(a.i,x),A=ne.call(Te,p)!==!1&&A}}return A&&!p.defaultPrevented}function Fu(a,l,d){if(typeof a=="function")d&&(a=_(a,d));else if(a&&typeof a.handleEvent=="function")a=_(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:c.setTimeout(a,l||0)}function Uu(a){a.g=Fu(()=>{a.g=null,a.i&&(a.i=!1,Uu(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class Sg extends St{constructor(l,d){super(),this.m=l,this.l=d,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Uu(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Dr(a){St.call(this),this.h=a,this.g={}}C(Dr,St);var Bu=[];function qu(a){G(a.g,function(l,d){this.g.hasOwnProperty(d)&&Yo(l)},a),a.g={}}Dr.prototype.N=function(){Dr.aa.N.call(this),qu(this)},Dr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Zo=c.JSON.stringify,Pg=c.JSON.parse,Cg=class{stringify(a){return c.JSON.stringify(a,void 0)}parse(a){return c.JSON.parse(a,void 0)}};function ea(){}ea.prototype.h=null;function ju(a){return a.h||(a.h=a.i())}function $u(){}var Vr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ta(){ve.call(this,"d")}C(ta,ve);function na(){ve.call(this,"c")}C(na,ve);var nn={},zu=null;function Gs(){return zu=zu||new we}nn.La="serverreachability";function Ku(a){ve.call(this,nn.La,a)}C(Ku,ve);function Nr(a){const l=Gs();Ve(l,new Ku(l))}nn.STAT_EVENT="statevent";function Gu(a,l){ve.call(this,nn.STAT_EVENT,a),this.stat=l}C(Gu,ve);function Ne(a){const l=Gs();Ve(l,new Gu(l,a))}nn.Ma="timingevent";function Hu(a,l){ve.call(this,nn.Ma,a),this.size=l}C(Hu,ve);function xr(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){a()},l)}function Or(){this.g=!0}Or.prototype.xa=function(){this.g=!1};function kg(a,l,d,p,A,S){a.info(function(){if(a.g)if(S)for(var x="",ne=S.split("&"),Te=0;Te<ne.length;Te++){var X=ne[Te].split("=");if(1<X.length){var Ae=X[0];X=X[1];var Re=Ae.split("_");x=2<=Re.length&&Re[1]=="type"?x+(Ae+"="+X+"&"):x+(Ae+"=redacted&")}}else x=null;else x=S;return"XMLHTTP REQ ("+p+") [attempt "+A+"]: "+l+`
`+d+`
`+x})}function Dg(a,l,d,p,A,S,x){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+A+"]: "+l+`
`+d+`
`+S+" "+x})}function On(a,l,d,p){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+Ng(a,d)+(p?" "+p:"")})}function Vg(a,l){a.info(function(){return"TIMEOUT: "+l})}Or.prototype.info=function(){};function Ng(a,l){if(!a.g)return l;if(!l)return null;try{var d=JSON.parse(l);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var p=d[a];if(!(2>p.length)){var A=p[1];if(Array.isArray(A)&&!(1>A.length)){var S=A[0];if(S!="noop"&&S!="stop"&&S!="close")for(var x=1;x<A.length;x++)A[x]=""}}}}return Zo(d)}catch{return l}}var Hs={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Wu={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ra;function Ws(){}C(Ws,ea),Ws.prototype.g=function(){return new XMLHttpRequest},Ws.prototype.i=function(){return{}},ra=new Ws;function Pt(a,l,d,p){this.j=a,this.i=l,this.l=d,this.R=p||1,this.U=new Dr(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Qu}function Qu(){this.i=null,this.g="",this.h=!1}var Yu={},sa={};function ia(a,l,d){a.L=1,a.v=Xs(ut(l)),a.m=d,a.P=!0,Ju(a,null)}function Ju(a,l){a.F=Date.now(),Qs(a),a.A=ut(a.v);var d=a.A,p=a.R;Array.isArray(p)||(p=[String(p)]),hl(d.i,"t",p),a.C=0,d=a.j.J,a.h=new Qu,a.g=Cl(a.j,d?l:null,!a.m),0<a.O&&(a.M=new Sg(_(a.Y,a,a.g),a.O)),l=a.U,d=a.g,p=a.ca;var A="readystatechange";Array.isArray(A)||(A&&(Bu[0]=A.toString()),A=Bu);for(var S=0;S<A.length;S++){var x=xu(d,A[S],p||l.handleEvent,!1,l.h||l);if(!x)break;l.g[x.key]=x}l=a.H?g(a.H):{},a.m?(a.u||(a.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,l)):(a.u="GET",a.g.ea(a.A,a.u,null,l)),Nr(),kg(a.i,a.u,a.A,a.l,a.R,a.m)}Pt.prototype.ca=function(a){a=a.target;const l=this.M;l&&lt(a)==3?l.j():this.Y(a)},Pt.prototype.Y=function(a){try{if(a==this.g)e:{const Re=lt(this.g);var l=this.g.Ba();const Fn=this.g.Z();if(!(3>Re)&&(Re!=3||this.g&&(this.h.h||this.g.oa()||yl(this.g)))){this.J||Re!=4||l==7||(l==8||0>=Fn?Nr(3):Nr(2)),oa(this);var d=this.g.Z();this.X=d;t:if(Xu(this)){var p=yl(this.g);a="";var A=p.length,S=lt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){rn(this),Lr(this);var x="";break t}this.h.i=new c.TextDecoder}for(l=0;l<A;l++)this.h.h=!0,a+=this.h.i.decode(p[l],{stream:!(S&&l==A-1)});p.length=0,this.h.g+=a,this.C=0,x=this.h.g}else x=this.g.oa();if(this.o=d==200,Dg(this.i,this.u,this.A,this.l,this.R,Re,d),this.o){if(this.T&&!this.K){t:{if(this.g){var ne,Te=this.g;if((ne=Te.g?Te.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!B(ne)){var X=ne;break t}}X=null}if(d=X)On(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,aa(this,d);else{this.o=!1,this.s=3,Ne(12),rn(this),Lr(this);break e}}if(this.P){d=!0;let Qe;for(;!this.J&&this.C<x.length;)if(Qe=xg(this,x),Qe==sa){Re==4&&(this.s=4,Ne(14),d=!1),On(this.i,this.l,null,"[Incomplete Response]");break}else if(Qe==Yu){this.s=4,Ne(15),On(this.i,this.l,x,"[Invalid Chunk]"),d=!1;break}else On(this.i,this.l,Qe,null),aa(this,Qe);if(Xu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Re!=4||x.length!=0||this.h.h||(this.s=1,Ne(16),d=!1),this.o=this.o&&d,!d)On(this.i,this.l,x,"[Invalid Chunked Response]"),rn(this),Lr(this);else if(0<x.length&&!this.W){this.W=!0;var Ae=this.j;Ae.g==this&&Ae.ba&&!Ae.M&&(Ae.j.info("Great, no buffering proxy detected. Bytes received: "+x.length),fa(Ae),Ae.M=!0,Ne(11))}}else On(this.i,this.l,x,null),aa(this,x);Re==4&&rn(this),this.o&&!this.J&&(Re==4?Rl(this.j,this):(this.o=!1,Qs(this)))}else Jg(this.g),d==400&&0<x.indexOf("Unknown SID")?(this.s=3,Ne(12)):(this.s=0,Ne(13)),rn(this),Lr(this)}}}catch{}finally{}};function Xu(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function xg(a,l){var d=a.C,p=l.indexOf(`
`,d);return p==-1?sa:(d=Number(l.substring(d,p)),isNaN(d)?Yu:(p+=1,p+d>l.length?sa:(l=l.slice(p,p+d),a.C=p+d,l)))}Pt.prototype.cancel=function(){this.J=!0,rn(this)};function Qs(a){a.S=Date.now()+a.I,Zu(a,a.I)}function Zu(a,l){if(a.B!=null)throw Error("WatchDog timer not null");a.B=xr(_(a.ba,a),l)}function oa(a){a.B&&(c.clearTimeout(a.B),a.B=null)}Pt.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(Vg(this.i,this.A),this.L!=2&&(Nr(),Ne(17)),rn(this),this.s=2,Lr(this)):Zu(this,this.S-a)};function Lr(a){a.j.G==0||a.J||Rl(a.j,a)}function rn(a){oa(a);var l=a.M;l&&typeof l.ma=="function"&&l.ma(),a.M=null,qu(a.U),a.g&&(l=a.g,a.g=null,l.abort(),l.ma())}function aa(a,l){try{var d=a.j;if(d.G!=0&&(d.g==a||ca(d.h,a))){if(!a.K&&ca(d.h,a)&&d.G==3){try{var p=d.Da.g.parse(l)}catch{p=null}if(Array.isArray(p)&&p.length==3){var A=p;if(A[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)si(d),ni(d);else break e;da(d),Ne(18)}}else d.za=A[1],0<d.za-d.T&&37500>A[2]&&d.F&&d.v==0&&!d.C&&(d.C=xr(_(d.Za,d),6e3));if(1>=nl(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else on(d,11)}else if((a.K||d.g==a)&&si(d),!B(l))for(A=d.Da.g.parse(l),l=0;l<A.length;l++){let X=A[l];if(d.T=X[0],X=X[1],d.G==2)if(X[0]=="c"){d.K=X[1],d.ia=X[2];const Ae=X[3];Ae!=null&&(d.la=Ae,d.j.info("VER="+d.la));const Re=X[4];Re!=null&&(d.Aa=Re,d.j.info("SVER="+d.Aa));const Fn=X[5];Fn!=null&&typeof Fn=="number"&&0<Fn&&(p=1.5*Fn,d.L=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const Qe=a.g;if(Qe){const oi=Qe.g?Qe.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(oi){var S=p.h;S.g||oi.indexOf("spdy")==-1&&oi.indexOf("quic")==-1&&oi.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(ua(S,S.h),S.h=null))}if(p.D){const pa=Qe.g?Qe.g.getResponseHeader("X-HTTP-Session-Id"):null;pa&&(p.ya=pa,ie(p.I,p.D,pa))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),p=d;var x=a;if(p.qa=Pl(p,p.J?p.ia:null,p.W),x.K){rl(p.h,x);var ne=x,Te=p.L;Te&&(ne.I=Te),ne.B&&(oa(ne),Qs(ne)),p.g=x}else wl(p);0<d.i.length&&ri(d)}else X[0]!="stop"&&X[0]!="close"||on(d,7);else d.G==3&&(X[0]=="stop"||X[0]=="close"?X[0]=="stop"?on(d,7):ha(d):X[0]!="noop"&&d.l&&d.l.ta(X),d.v=0)}}Nr(4)}catch{}}var Og=class{constructor(a,l){this.g=a,this.map=l}};function el(a){this.l=a||10,c.PerformanceNavigationTiming?(a=c.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function tl(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function nl(a){return a.h?1:a.g?a.g.size:0}function ca(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function ua(a,l){a.g?a.g.add(l):a.h=l}function rl(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}el.prototype.cancel=function(){if(this.i=sl(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function sl(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const d of a.g.values())l=l.concat(d.D);return l}return V(a.i)}function Lg(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var l=[],d=a.length,p=0;p<d;p++)l.push(a[p]);return l}l=[],d=0;for(p in a)l[d++]=a[p];return l}function Mg(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var l=[];a=a.length;for(var d=0;d<a;d++)l.push(d);return l}l=[],d=0;for(const p in a)l[d++]=p;return l}}}function il(a,l){if(a.forEach&&typeof a.forEach=="function")a.forEach(l,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,l,void 0);else for(var d=Mg(a),p=Lg(a),A=p.length,S=0;S<A;S++)l.call(void 0,p[S],d&&d[S],a)}var ol=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Fg(a,l){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var p=a[d].indexOf("="),A=null;if(0<=p){var S=a[d].substring(0,p);A=a[d].substring(p+1)}else S=a[d];l(S,A?decodeURIComponent(A.replace(/\+/g," ")):"")}}}function sn(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof sn){this.h=a.h,Ys(this,a.j),this.o=a.o,this.g=a.g,Js(this,a.s),this.l=a.l;var l=a.i,d=new Ur;d.i=l.i,l.g&&(d.g=new Map(l.g),d.h=l.h),al(this,d),this.m=a.m}else a&&(l=String(a).match(ol))?(this.h=!1,Ys(this,l[1]||"",!0),this.o=Mr(l[2]||""),this.g=Mr(l[3]||"",!0),Js(this,l[4]),this.l=Mr(l[5]||"",!0),al(this,l[6]||"",!0),this.m=Mr(l[7]||"")):(this.h=!1,this.i=new Ur(null,this.h))}sn.prototype.toString=function(){var a=[],l=this.j;l&&a.push(Fr(l,cl,!0),":");var d=this.g;return(d||l=="file")&&(a.push("//"),(l=this.o)&&a.push(Fr(l,cl,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(Fr(d,d.charAt(0)=="/"?qg:Bg,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",Fr(d,$g)),a.join("")};function ut(a){return new sn(a)}function Ys(a,l,d){a.j=d?Mr(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function Js(a,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);a.s=l}else a.s=null}function al(a,l,d){l instanceof Ur?(a.i=l,zg(a.i,a.h)):(d||(l=Fr(l,jg)),a.i=new Ur(l,a.h))}function ie(a,l,d){a.i.set(l,d)}function Xs(a){return ie(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Mr(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Fr(a,l,d){return typeof a=="string"?(a=encodeURI(a).replace(l,Ug),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Ug(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var cl=/[#\/\?@]/g,Bg=/[#\?:]/g,qg=/[#\?]/g,jg=/[#\?@]/g,$g=/#/g;function Ur(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function Ct(a){a.g||(a.g=new Map,a.h=0,a.i&&Fg(a.i,function(l,d){a.add(decodeURIComponent(l.replace(/\+/g," ")),d)}))}r=Ur.prototype,r.add=function(a,l){Ct(this),this.i=null,a=Ln(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(l),this.h+=1,this};function ul(a,l){Ct(a),l=Ln(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function ll(a,l){return Ct(a),l=Ln(a,l),a.g.has(l)}r.forEach=function(a,l){Ct(this),this.g.forEach(function(d,p){d.forEach(function(A){a.call(l,A,p,this)},this)},this)},r.na=function(){Ct(this);const a=Array.from(this.g.values()),l=Array.from(this.g.keys()),d=[];for(let p=0;p<l.length;p++){const A=a[p];for(let S=0;S<A.length;S++)d.push(l[p])}return d},r.V=function(a){Ct(this);let l=[];if(typeof a=="string")ll(this,a)&&(l=l.concat(this.g.get(Ln(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)l=l.concat(a[d])}return l},r.set=function(a,l){return Ct(this),this.i=null,a=Ln(this,a),ll(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=this.V(a),0<a.length?String(a[0]):l):l};function hl(a,l,d){ul(a,l),0<d.length&&(a.i=null,a.g.set(Ln(a,l),V(d)),a.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(var d=0;d<l.length;d++){var p=l[d];const S=encodeURIComponent(String(p)),x=this.V(p);for(p=0;p<x.length;p++){var A=S;x[p]!==""&&(A+="="+encodeURIComponent(String(x[p]))),a.push(A)}}return this.i=a.join("&")};function Ln(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function zg(a,l){l&&!a.j&&(Ct(a),a.i=null,a.g.forEach(function(d,p){var A=p.toLowerCase();p!=A&&(ul(this,p),hl(this,A,d))},a)),a.j=l}function Kg(a,l){const d=new Or;if(c.Image){const p=new Image;p.onload=R(kt,d,"TestLoadImage: loaded",!0,l,p),p.onerror=R(kt,d,"TestLoadImage: error",!1,l,p),p.onabort=R(kt,d,"TestLoadImage: abort",!1,l,p),p.ontimeout=R(kt,d,"TestLoadImage: timeout",!1,l,p),c.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else l(!1)}function Gg(a,l){const d=new Or,p=new AbortController,A=setTimeout(()=>{p.abort(),kt(d,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:p.signal}).then(S=>{clearTimeout(A),S.ok?kt(d,"TestPingServer: ok",!0,l):kt(d,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(A),kt(d,"TestPingServer: error",!1,l)})}function kt(a,l,d,p,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),p(d)}catch{}}function Hg(){this.g=new Cg}function Wg(a,l,d){const p=d||"";try{il(a,function(A,S){let x=A;h(A)&&(x=Zo(A)),l.push(p+S+"="+encodeURIComponent(x))})}catch(A){throw l.push(p+"type="+encodeURIComponent("_badmap")),A}}function Zs(a){this.l=a.Ub||null,this.j=a.eb||!1}C(Zs,ea),Zs.prototype.g=function(){return new ei(this.l,this.j)},Zs.prototype.i=function(a){return function(){return a}}({});function ei(a,l){we.call(this),this.D=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(ei,we),r=ei.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=l,this.readyState=1,qr(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(l.body=a),(this.D||c).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Br(this)),this.readyState=0},r.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,qr(this)),this.g&&(this.readyState=3,qr(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;dl(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function dl(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}r.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?Br(this):qr(this),this.readyState==3&&dl(this)}},r.Ra=function(a){this.g&&(this.response=this.responseText=a,Br(this))},r.Qa=function(a){this.g&&(this.response=a,Br(this))},r.ga=function(){this.g&&Br(this)};function Br(a){a.readyState=4,a.l=null,a.j=null,a.v=null,qr(a)}r.setRequestHeader=function(a,l){this.u.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var d=l.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=l.next();return a.join(`\r
`)};function qr(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(ei.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function fl(a){let l="";return G(a,function(d,p){l+=p,l+=":",l+=d,l+=`\r
`}),l}function la(a,l,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=fl(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):ie(a,l,d))}function ue(a){we.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(ue,we);var Qg=/^https?$/i,Yg=["POST","PUT"];r=ue.prototype,r.Ha=function(a){this.J=a},r.ea=function(a,l,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ra.g(),this.v=this.o?ju(this.o):ju(ra),this.g.onreadystatechange=_(this.Ea,this);try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(S){pl(this,S);return}if(a=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var A in p)d.set(A,p[A]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const S of p.keys())d.set(S,p.get(S));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(S=>S.toLowerCase()=="content-type"),A=c.FormData&&a instanceof c.FormData,!(0<=Array.prototype.indexOf.call(Yg,l,void 0))||p||A||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,x]of d)this.g.setRequestHeader(S,x);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{_l(this),this.u=!0,this.g.send(a),this.u=!1}catch(S){pl(this,S)}};function pl(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.m=5,ml(a),ti(a)}function ml(a){a.A||(a.A=!0,Ve(a,"complete"),Ve(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,Ve(this,"complete"),Ve(this,"abort"),ti(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ti(this,!0)),ue.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?gl(this):this.bb())},r.bb=function(){gl(this)};function gl(a){if(a.h&&typeof o<"u"&&(!a.v[1]||lt(a)!=4||a.Z()!=2)){if(a.u&&lt(a)==4)Fu(a.Ea,0,a);else if(Ve(a,"readystatechange"),lt(a)==4){a.h=!1;try{const x=a.Z();e:switch(x){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var d;if(!(d=l)){var p;if(p=x===0){var A=String(a.D).match(ol)[1]||null;!A&&c.self&&c.self.location&&(A=c.self.location.protocol.slice(0,-1)),p=!Qg.test(A?A.toLowerCase():"")}d=p}if(d)Ve(a,"complete"),Ve(a,"success");else{a.m=6;try{var S=2<lt(a)?a.g.statusText:""}catch{S=""}a.l=S+" ["+a.Z()+"]",ml(a)}}finally{ti(a)}}}}function ti(a,l){if(a.g){_l(a);const d=a.g,p=a.v[0]?()=>{}:null;a.g=null,a.v=null,l||Ve(a,"ready");try{d.onreadystatechange=p}catch{}}}function _l(a){a.I&&(c.clearTimeout(a.I),a.I=null)}r.isActive=function(){return!!this.g};function lt(a){return a.g?a.g.readyState:0}r.Z=function(){try{return 2<lt(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),Pg(l)}};function yl(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Jg(a){const l={};a=(a.g&&2<=lt(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(B(a[p]))continue;var d=v(a[p]);const A=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const S=l[A]||[];l[A]=S,S.push(d)}T(l,function(p){return p.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function jr(a,l,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||l}function Il(a){this.Aa=0,this.i=[],this.j=new Or,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=jr("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=jr("baseRetryDelayMs",5e3,a),this.cb=jr("retryDelaySeedMs",1e4,a),this.Wa=jr("forwardChannelMaxRetries",2,a),this.wa=jr("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new el(a&&a.concurrentRequestLimit),this.Da=new Hg,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=Il.prototype,r.la=8,r.G=1,r.connect=function(a,l,d,p){Ne(0),this.W=a,this.H=l||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.I=Pl(this,null,this.W),ri(this)};function ha(a){if(Tl(a),a.G==3){var l=a.U++,d=ut(a.I);if(ie(d,"SID",a.K),ie(d,"RID",l),ie(d,"TYPE","terminate"),$r(a,d),l=new Pt(a,a.j,l),l.L=2,l.v=Xs(ut(d)),d=!1,c.navigator&&c.navigator.sendBeacon)try{d=c.navigator.sendBeacon(l.v.toString(),"")}catch{}!d&&c.Image&&(new Image().src=l.v,d=!0),d||(l.g=Cl(l.j,null),l.g.ea(l.v)),l.F=Date.now(),Qs(l)}Sl(a)}function ni(a){a.g&&(fa(a),a.g.cancel(),a.g=null)}function Tl(a){ni(a),a.u&&(c.clearTimeout(a.u),a.u=null),si(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&c.clearTimeout(a.s),a.s=null)}function ri(a){if(!tl(a.h)&&!a.s){a.s=!0;var l=a.Ga;Pr||Nu(),Cr||(Pr(),Cr=!0),Ko.add(l,a),a.B=0}}function Xg(a,l){return nl(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=l.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=xr(_(a.Ga,a,l),bl(a,a.B)),a.B++,!0)}r.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const A=new Pt(this,this.j,a);let S=this.o;if(this.S&&(S?(S=g(S),E(S,this.S)):S=this.S),this.m!==null||this.O||(A.H=S,S=null),this.P)e:{for(var l=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(l+=p,4096<l){l=d;break e}if(l===4096||d===this.i.length-1){l=d+1;break e}}l=1e3}else l=1e3;l=vl(this,A,l),d=ut(this.I),ie(d,"RID",a),ie(d,"CVER",22),this.D&&ie(d,"X-HTTP-Session-Id",this.D),$r(this,d),S&&(this.O?l="headers="+encodeURIComponent(String(fl(S)))+"&"+l:this.m&&la(d,this.m,S)),ua(this.h,A),this.Ua&&ie(d,"TYPE","init"),this.P?(ie(d,"$req",l),ie(d,"SID","null"),A.T=!0,ia(A,d,null)):ia(A,d,l),this.G=2}}else this.G==3&&(a?El(this,a):this.i.length==0||tl(this.h)||El(this))};function El(a,l){var d;l?d=l.l:d=a.U++;const p=ut(a.I);ie(p,"SID",a.K),ie(p,"RID",d),ie(p,"AID",a.T),$r(a,p),a.m&&a.o&&la(p,a.m,a.o),d=new Pt(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),l&&(a.i=l.D.concat(a.i)),l=vl(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),ua(a.h,d),ia(d,p,l)}function $r(a,l){a.H&&G(a.H,function(d,p){ie(l,p,d)}),a.l&&il({},function(d,p){ie(l,p,d)})}function vl(a,l,d){d=Math.min(a.i.length,d);var p=a.l?_(a.l.Na,a.l,a):null;e:{var A=a.i;let S=-1;for(;;){const x=["count="+d];S==-1?0<d?(S=A[0].g,x.push("ofs="+S)):S=0:x.push("ofs="+S);let ne=!0;for(let Te=0;Te<d;Te++){let X=A[Te].g;const Ae=A[Te].map;if(X-=S,0>X)S=Math.max(0,A[Te].g-100),ne=!1;else try{Wg(Ae,x,"req"+X+"_")}catch{p&&p(Ae)}}if(ne){p=x.join("&");break e}}}return a=a.i.splice(0,d),l.D=a,p}function wl(a){if(!a.g&&!a.u){a.Y=1;var l=a.Fa;Pr||Nu(),Cr||(Pr(),Cr=!0),Ko.add(l,a),a.v=0}}function da(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=xr(_(a.Fa,a),bl(a,a.v)),a.v++,!0)}r.Fa=function(){if(this.u=null,Al(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=xr(_(this.ab,this),a)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ne(10),ni(this),Al(this))};function fa(a){a.A!=null&&(c.clearTimeout(a.A),a.A=null)}function Al(a){a.g=new Pt(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var l=ut(a.qa);ie(l,"RID","rpc"),ie(l,"SID",a.K),ie(l,"AID",a.T),ie(l,"CI",a.F?"0":"1"),!a.F&&a.ja&&ie(l,"TO",a.ja),ie(l,"TYPE","xmlhttp"),$r(a,l),a.m&&a.o&&la(l,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=Xs(ut(l)),d.m=null,d.P=!0,Ju(d,a)}r.Za=function(){this.C!=null&&(this.C=null,ni(this),da(this),Ne(19))};function si(a){a.C!=null&&(c.clearTimeout(a.C),a.C=null)}function Rl(a,l){var d=null;if(a.g==l){si(a),fa(a),a.g=null;var p=2}else if(ca(a.h,l))d=l.D,rl(a.h,l),p=1;else return;if(a.G!=0){if(l.o)if(p==1){d=l.m?l.m.length:0,l=Date.now()-l.F;var A=a.B;p=Gs(),Ve(p,new Hu(p,d)),ri(a)}else wl(a);else if(A=l.s,A==3||A==0&&0<l.X||!(p==1&&Xg(a,l)||p==2&&da(a)))switch(d&&0<d.length&&(l=a.h,l.i=l.i.concat(d)),A){case 1:on(a,5);break;case 4:on(a,10);break;case 3:on(a,6);break;default:on(a,2)}}}function bl(a,l){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*l}function on(a,l){if(a.j.info("Error code "+l),l==2){var d=_(a.fb,a),p=a.Xa;const A=!p;p=new sn(p||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||Ys(p,"https"),Xs(p),A?Kg(p.toString(),d):Gg(p.toString(),d)}else Ne(2);a.G=0,a.l&&a.l.sa(l),Sl(a),Tl(a)}r.fb=function(a){a?(this.j.info("Successfully pinged google.com"),Ne(2)):(this.j.info("Failed to ping google.com"),Ne(1))};function Sl(a){if(a.G=0,a.ka=[],a.l){const l=sl(a.h);(l.length!=0||a.i.length!=0)&&(k(a.ka,l),k(a.ka,a.i),a.h.i.length=0,V(a.i),a.i.length=0),a.l.ra()}}function Pl(a,l,d){var p=d instanceof sn?ut(d):new sn(d);if(p.g!="")l&&(p.g=l+"."+p.g),Js(p,p.s);else{var A=c.location;p=A.protocol,l=l?l+"."+A.hostname:A.hostname,A=+A.port;var S=new sn(null);p&&Ys(S,p),l&&(S.g=l),A&&Js(S,A),d&&(S.l=d),p=S}return d=a.D,l=a.ya,d&&l&&ie(p,d,l),ie(p,"VER",a.la),$r(a,p),p}function Cl(a,l,d){if(l&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Ca&&!a.pa?new ue(new Zs({eb:d})):new ue(a.pa),l.Ha(a.J),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function kl(){}r=kl.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function ii(){}ii.prototype.g=function(a,l){return new qe(a,l)};function qe(a,l){we.call(this),this.g=new Il(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(a?a["X-WebChannel-Client-Profile"]=l.va:a={"X-WebChannel-Client-Profile":l.va}),this.g.S=a,(a=l&&l.Sb)&&!B(a)&&(this.g.m=a),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!B(l)&&(this.g.D=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new Mn(this)}C(qe,we),qe.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},qe.prototype.close=function(){ha(this.g)},qe.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=Zo(a),a=d);l.i.push(new Og(l.Ya++,a)),l.G==3&&ri(l)},qe.prototype.N=function(){this.g.l=null,delete this.j,ha(this.g),delete this.g,qe.aa.N.call(this)};function Dl(a){ta.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){e:{for(const d in l){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}C(Dl,ta);function Vl(){na.call(this),this.status=1}C(Vl,na);function Mn(a){this.g=a}C(Mn,kl),Mn.prototype.ua=function(){Ve(this.g,"a")},Mn.prototype.ta=function(a){Ve(this.g,new Dl(a))},Mn.prototype.sa=function(a){Ve(this.g,new Vl)},Mn.prototype.ra=function(){Ve(this.g,"b")},ii.prototype.createWebChannel=ii.prototype.g,qe.prototype.send=qe.prototype.o,qe.prototype.open=qe.prototype.m,qe.prototype.close=qe.prototype.close,Lf=function(){return new ii},Of=function(){return Gs()},xf=nn,Ba={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Hs.NO_ERROR=0,Hs.TIMEOUT=8,Hs.HTTP_ERROR=6,Ei=Hs,Wu.COMPLETE="complete",Nf=Wu,$u.EventType=Vr,Vr.OPEN="a",Vr.CLOSE="b",Vr.ERROR="c",Vr.MESSAGE="d",we.prototype.listen=we.prototype.K,Xr=$u,ue.prototype.listenOnce=ue.prototype.L,ue.prototype.getLastError=ue.prototype.Ka,ue.prototype.getLastErrorCode=ue.prototype.Ba,ue.prototype.getStatus=ue.prototype.Z,ue.prototype.getResponseJson=ue.prototype.Oa,ue.prototype.getResponseText=ue.prototype.oa,ue.prototype.send=ue.prototype.ea,ue.prototype.setWithCredentials=ue.prototype.Ha,Vf=ue}).apply(typeof ci<"u"?ci:typeof self<"u"?self:typeof window<"u"?window:{});const uh="@firebase/firestore",lh="4.7.9";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ie.UNAUTHENTICATED=new Ie(null),Ie.GOOGLE_CREDENTIALS=new Ie("google-credentials-uid"),Ie.FIRST_PARTY=new Ie("first-party-uid"),Ie.MOCK_USER=new Ie("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Er="11.4.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const An=new mc("@firebase/firestore");function Kn(){return An.logLevel}function D(r,...e){if(An.logLevel<=W.DEBUG){const t=e.map(Pc);An.debug(`Firestore (${Er}): ${r}`,...t)}}function fe(r,...e){if(An.logLevel<=W.ERROR){const t=e.map(Pc);An.error(`Firestore (${Er}): ${r}`,...t)}}function Rn(r,...e){if(An.logLevel<=W.WARN){const t=e.map(Pc);An.warn(`Firestore (${Er}): ${r}`,...t)}}function Pc(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(r="Unexpected state"){const e=`FIRESTORE (${Er}) INTERNAL ASSERTION FAILED: `+r;throw fe(e),new Error(e)}function U(r,e){r||M()}function F(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends Xe{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mf{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class zT{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Ie.UNAUTHENTICATED))}shutdown(){}}class KT{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class GT{constructor(e){this.t=e,this.currentUser=Ie.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){U(this.o===void 0);let n=this.i;const s=u=>this.i!==n?(n=this.i,t(u)):Promise.resolve();let i=new it;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new it,e.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const u=i;e.enqueueRetryable(async()=>{await u.promise,await s(this.currentUser)})},c=u=>{D("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>c(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?c(u):(D("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new it)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(n=>this.i!==e?(D("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(U(typeof n.accessToken=="string"),new Mf(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return U(e===null||typeof e=="string"),new Ie(e)}}class HT{constructor(e,t,n){this.l=e,this.h=t,this.P=n,this.type="FirstParty",this.user=Ie.FIRST_PARTY,this.T=new Map}I(){return this.P?this.P():null}get headers(){this.T.set("X-Goog-AuthUser",this.l);const e=this.I();return e&&this.T.set("Authorization",e),this.h&&this.T.set("X-Goog-Iam-Authorization-Token",this.h),this.T}}class WT{constructor(e,t,n){this.l=e,this.h=t,this.P=n}getToken(){return Promise.resolve(new HT(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Ie.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class hh{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class QT{constructor(e,t){this.A=t,this.forceRefresh=!1,this.appCheck=null,this.R=null,this.V=null,Oe(e)&&e.settings.appCheckToken&&(this.V=e.settings.appCheckToken)}start(e,t){U(this.o===void 0);const n=i=>{i.error!=null&&D("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.R;return this.R=i.token,D("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>n(i))};const s=i=>{D("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):D("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.V)return Promise.resolve(new hh(this.V));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(U(typeof t.token=="string"),this.R=t.token,new hh(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YT(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ff{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=YT(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function K(r,e){return r<e?-1:r>e?1:0}function er(r,e,t){return r.length===e.length&&r.every((n,s)=>t(n,e[s]))}function Uf(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dh=-62135596800,fh=1e6;class ce{static now(){return ce.fromMillis(Date.now())}static fromDate(e){return ce.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*fh);return new ce(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<dh)throw new N(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/fh}_compareTo(e){return this.seconds===e.seconds?K(this.nanoseconds,e.nanoseconds):K(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds-dh;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{static fromTimestamp(e){return new q(e)}static min(){return new q(new ce(0,0))}static max(){return new q(new ce(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ph="__name__";class Ze{constructor(e,t,n){t===void 0?t=0:t>e.length&&M(),n===void 0?n=e.length-t:n>e.length-t&&M(),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Ze.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ze?e.forEach(n=>{t.push(n)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=Ze.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return Math.sign(e.length-t.length)}static compareSegments(e,t){const n=Ze.isNumericId(e),s=Ze.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?Ze.extractNumericId(e).compare(Ze.extractNumericId(t)):e<t?-1:e>t?1:0}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return zt.fromString(e.substring(4,e.length-2))}}class Z extends Ze{construct(e,t,n){return new Z(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new N(P.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(s=>s.length>0))}return new Z(t)}static emptyPath(){return new Z([])}}const JT=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ae extends Ze{construct(e,t,n){return new ae(e,t,n)}static isValidIdentifier(e){return JT.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ae.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===ph}static keyField(){return new ae([ph])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new N(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new N(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new N(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else c==="`"?(o=!o,s++):c!=="."||o?(n+=c,s++):(i(),s++)}if(i(),o)throw new N(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ae(t)}static emptyPath(){return new ae([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e){this.path=e}static fromPath(e){return new O(Z.fromString(e))}static fromName(e){return new O(Z.fromString(e).popFirst(5))}static empty(){return new O(Z.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Z.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Z.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new O(new Z(e.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tr=-1;class Bi{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function qa(r){return r.fields.find(e=>e.kind===2)}function un(r){return r.fields.filter(e=>e.kind!==2)}Bi.UNKNOWN_ID=-1;class vi{constructor(e,t){this.fieldPath=e,this.kind=t}}class ms{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new ms(0,Ge.min())}}function Bf(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=q.fromTimestamp(n===1e9?new ce(t+1,0):new ce(t,n));return new Ge(s,O.empty(),e)}function qf(r){return new Ge(r.readTime,r.key,tr)}class Ge{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Ge(q.min(),O.empty(),tr)}static max(){return new Ge(q.max(),O.empty(),tr)}}function Cc(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=O.comparator(r.documentKey,e.documentKey),t!==0?t:K(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jf="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class $f{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xt(r){if(r.code!==P.FAILED_PRECONDITION||r.message!==jf)throw r;D("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&M(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new w((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof w?t:w.resolve(t)}catch(t){return w.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):w.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):w.reject(t)}static resolve(e){return new w((t,n)=>{t(e)})}static reject(e){return new w((t,n)=>{n(e)})}static waitFor(e){return new w((t,n)=>{let s=0,i=0,o=!1;e.forEach(c=>{++s,c.next(()=>{++i,o&&i===s&&t()},u=>n(u))}),o=!0,i===s&&t()})}static or(e){let t=w.resolve(!1);for(const n of e)t=t.next(s=>s?w.resolve(s):n());return t}static forEach(e,t){const n=[];return e.forEach((s,i)=>{n.push(t.call(this,s,i))}),this.waitFor(n)}static mapArray(e,t){return new w((n,s)=>{const i=e.length,o=new Array(i);let c=0;for(let u=0;u<i;u++){const h=u;t(e[h]).next(f=>{o[h]=f,++c,c===i&&n(o)},f=>s(f))}})}static doWhile(e,t){return new w((n,s)=>{const i=()=>{e()===!0?t().next(()=>{i()},s):n()};i()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const je="SimpleDb";class _o{static open(e,t,n,s){try{return new _o(t,e.transaction(s,n))}catch(i){throw new ss(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.m=new it,this.transaction.oncomplete=()=>{this.m.resolve()},this.transaction.onabort=()=>{t.error?this.m.reject(new ss(e,t.error)):this.m.resolve()},this.transaction.onerror=n=>{const s=kc(n.target.error);this.m.reject(new ss(e,s))}}get p(){return this.m.promise}abort(e){e&&this.m.reject(e),this.aborted||(D(je,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}S(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new ZT(t)}}class Kt{static delete(e){return D(je,"Removing database:",e),hn(window.indexedDB.deleteDatabase(e)).toPromise()}static D(){if(!Kd())return!1;if(Kt.v())return!0;const e=ge(),t=Kt.C(e),n=0<t&&t<10,s=zf(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static v(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.F)==="YES"}static M(e,t){return e.store(t)}static C(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.O=n,Kt.C(ge())===12.2&&fe("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async N(e){return this.db||(D(je,"Opening database:",this.name),this.db=await new Promise((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new ss(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new N(P.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new N(P.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new ss(e,o))},s.onupgradeneeded=i=>{D(je,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.O.B(o,s.transaction,i.oldVersion,this.version).next(()=>{D(je,"Database upgrade to version "+this.version+" complete")})}})),this.L&&(this.db.onversionchange=t=>this.L(t)),this.db}k(e){this.L=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.N(e);const c=_o.open(this.db,e,i?"readonly":"readwrite",n),u=s(c).next(h=>(c.S(),h)).catch(h=>(c.abort(h),w.reject(h))).toPromise();return u.catch(()=>{}),await c.p,u}catch(c){const u=c,h=u.name!=="FirebaseError"&&o<3;if(D(je,"Transaction failed with error:",u.message,"Retrying:",h),this.close(),!h)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function zf(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class XT{constructor(e){this.q=e,this.$=!1,this.K=null}get isDone(){return this.$}get U(){return this.K}set cursor(e){this.q=e}done(){this.$=!0}W(e){this.K=e}delete(){return hn(this.q.delete())}}class ss extends N{constructor(e,t){super(P.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Zt(r){return r.name==="IndexedDbTransactionError"}class ZT{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(D(je,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(D(je,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),hn(n)}add(e){return D(je,"ADD",this.store.name,e,e),hn(this.store.add(e))}get(e){return hn(this.store.get(e)).next(t=>(t===void 0&&(t=null),D(je,"GET",this.store.name,e,t),t))}delete(e){return D(je,"DELETE",this.store.name,e),hn(this.store.delete(e))}count(){return D(je,"COUNT",this.store.name),hn(this.store.count())}G(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new w((o,c)=>{i.onerror=u=>{c(u.target.error)},i.onsuccess=u=>{o(u.target.result)}})}{const i=this.cursor(n),o=[];return this.j(i,(c,u)=>{o.push(u)}).next(()=>o)}}H(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new w((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}})}J(e,t){D(je,"DELETE ALL",this.store.name);const n=this.options(e,t);n.Y=!1;const s=this.cursor(n);return this.j(s,(i,o,c)=>c.delete())}Z(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.j(s,t)}X(e){const t=this.cursor({});return new w((n,s)=>{t.onerror=i=>{const o=kc(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next(c=>{c?o.continue():n()}):n()}})}j(e,t){const n=[];return new w((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const c=o.target.result;if(!c)return void s();const u=new XT(c),h=t(c.primaryKey,c.value,u);if(h instanceof w){const f=h.catch(m=>(u.done(),w.reject(m)));n.push(f)}u.isDone?s():u.U===null?c.continue():c.continue(u.U)}}).next(()=>w.waitFor(n))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.Y?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function hn(r){return new w((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=kc(n.target.error);t(s)}})}let mh=!1;function kc(r){const e=Kt.C(ge());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new N("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return mh||(mh=!0,setTimeout(()=>{throw n},0)),n}}return r}const is="IndexBackfiller";class eE{constructor(e,t){this.asyncQueue=e,this.ee=t,this.task=null}start(){this.te(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}te(e){D(is,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{const t=await this.ee.ne();D(is,`Documents written: ${t}`)}catch(t){Zt(t)?D(is,"Ignoring IndexedDB error during index backfill: ",t):await Xt(t)}await this.te(6e4)})}}class tE{constructor(e,t){this.localStore=e,this.persistence=t}async ne(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.re(t,e))}re(e,t){const n=new Set;let s=t,i=!0;return w.doWhile(()=>i===!0&&s>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(o=>{if(o!==null&&!n.has(o))return D(is,`Processing collection: ${o}`),this.ie(e,o,s).next(c=>{s-=c,n.add(o)});i=!1})).next(()=>t-s)}ie(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next(i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next(()=>this.se(s,i)).next(c=>(D(is,`Updating offset: ${c}`),this.localStore.indexManager.updateCollectionGroup(e,t,c))).next(()=>o.size)}))}se(e,t){let n=e;return t.changes.forEach((s,i)=>{const o=qf(i);Cc(o,n)>0&&(n=o)}),new Ge(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.oe(n),this._e=n=>t.writeSequenceNumber(n))}oe(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this._e&&this._e(e),e}}Fe.ae=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _n=-1;function yo(r){return r==null}function gs(r){return r===0&&1/r==-1/0}function Kf(r){return typeof r=="number"&&Number.isInteger(r)&&!gs(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qi="";function ke(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=gh(e)),e=nE(r.get(t),e);return gh(e)}function nE(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case qi:t+="";break;default:t+=i}}return t}function gh(r){return r+qi+""}function tt(r){const e=r.length;if(U(e>=2),e===2)return U(r.charAt(0)===qi&&r.charAt(1)===""),Z.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf(qi,i);switch((o<0||o>t)&&M(),r.charAt(o+1)){case"":const c=r.substring(i,o);let u;s.length===0?u=c:(s+=c,u=s,s=""),n.push(u);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:M()}i=o+2}return new Z(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ln="remoteDocuments",xs="owner",Un="owner",_s="mutationQueues",rE="userId",Ye="mutations",_h="batchId",gn="userMutationsIndex",yh=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wi(r,e){return[r,ke(e)]}function Gf(r,e,t){return[r,ke(e),t]}const sE={},nr="documentMutations",ji="remoteDocumentsV14",iE=["prefixPath","collectionGroup","readTime","documentId"],Ai="documentKeyIndex",oE=["prefixPath","collectionGroup","documentId"],Hf="collectionGroupIndex",aE=["collectionGroup","readTime","prefixPath","documentId"],ys="remoteDocumentGlobal",ja="remoteDocumentGlobalKey",rr="targets",Wf="queryTargetsIndex",cE=["canonicalId","targetId"],sr="targetDocuments",uE=["targetId","path"],Dc="documentTargetsIndex",lE=["path","targetId"],$i="targetGlobalKey",yn="targetGlobal",Is="collectionParents",hE=["collectionId","parent"],ir="clientMetadata",dE="clientId",Io="bundles",fE="bundleId",To="namedQueries",pE="name",Vc="indexConfiguration",mE="indexId",$a="collectionGroupIndex",gE="collectionGroup",zi="indexState",_E=["indexId","uid"],Qf="sequenceNumberIndex",yE=["uid","sequenceNumber"],Ki="indexEntries",IE=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Yf="documentKeyIndex",TE=["indexId","uid","orderedDocumentKey"],Eo="documentOverlays",EE=["userId","collectionPath","documentId"],za="collectionPathOverlayIndex",vE=["userId","collectionPath","largestBatchId"],Jf="collectionGroupOverlayIndex",wE=["userId","collectionGroup","largestBatchId"],Nc="globals",AE="name",Xf=[_s,Ye,nr,ln,rr,xs,yn,sr,ir,ys,Is,Io,To],RE=[...Xf,Eo],Zf=[_s,Ye,nr,ji,rr,xs,yn,sr,ir,ys,Is,Io,To,Eo],ep=Zf,xc=[...ep,Vc,zi,Ki],bE=xc,SE=[...xc,Nc];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ka extends $f{constructor(e,t){super(),this.ue=e,this.currentSequenceNumber=t}}function _e(r,e){const t=F(r);return Kt.M(t.ue,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ih(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function en(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function tp(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(e,t){this.comparator=e,this.root=t||Ee.EMPTY}insert(e,t){return new se(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ee.BLACK,null,null))}remove(e){return new se(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ee.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ui(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ui(this.root,e,this.comparator,!1)}getReverseIterator(){return new ui(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ui(this.root,e,this.comparator,!0)}}class ui{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ee{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??Ee.RED,this.left=s??Ee.EMPTY,this.right=i??Ee.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new Ee(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Ee.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Ee.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ee.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ee.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw M();const e=this.left.check();if(e!==this.right.check())throw M();return e+(this.isRed()?0:1)}}Ee.EMPTY=null,Ee.RED=!0,Ee.BLACK=!1;Ee.EMPTY=new class{constructor(){this.size=0}get key(){throw M()}get value(){throw M()}get color(){throw M()}get left(){throw M()}get right(){throw M()}copy(e,t,n,s,i){return this}insert(e,t,n){return new Ee(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(e){this.comparator=e,this.data=new se(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Th(this.data.getIterator())}getIteratorFrom(e){return new Th(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(n=>{t=t.add(n)}),t}isEqual(e){if(!(e instanceof te)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new te(this.comparator);return t.data=e,t}}class Th{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Bn(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e){this.fields=e,e.sort(ae.comparator)}static empty(){return new Ue([])}unionWith(e){let t=new te(ae.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Ue(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return er(this.fields,e.fields,(t,n)=>t.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new np("Invalid base64 string: "+i):i}}(e);return new pe(t)}static fromUint8Array(e){const t=function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i}(e);return new pe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return K(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}pe.EMPTY_BYTE_STRING=new pe("");const PE=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function It(r){if(U(!!r),typeof r=="string"){let e=0;const t=PE.exec(r);if(U(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:oe(r.seconds),nanos:oe(r.nanos)}}function oe(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Tt(r){return typeof r=="string"?pe.fromBase64String(r):pe.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rp="server_timestamp",sp="__type__",ip="__previous_value__",op="__local_write_time__";function Oc(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[sp])===null||t===void 0?void 0:t.stringValue)===rp}function vo(r){const e=r.mapValue.fields[ip];return Oc(e)?vo(e):e}function Ts(r){const e=It(r.mapValue.fields[op].timestampValue);return new ce(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CE{constructor(e,t,n,s,i,o,c,u,h){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=h}}const Gi="(default)";class bn{constructor(e,t){this.projectId=e,this.database=t||Gi}static empty(){return new bn("","")}get isDefaultDatabase(){return this.database===Gi}isEqual(e){return e instanceof bn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lc="__type__",ap="__max__",qt={mapValue:{fields:{__type__:{stringValue:ap}}}},Mc="__vector__",or="value",Ri={nullValue:"NULL_VALUE"};function Wt(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Oc(r)?4:cp(r)?9007199254740991:wo(r)?10:11:M()}function ot(r,e){if(r===e)return!0;const t=Wt(r);if(t!==Wt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Ts(r).isEqual(Ts(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=It(s.timestampValue),c=It(i.timestampValue);return o.seconds===c.seconds&&o.nanos===c.nanos}(r,e);case 5:return r.stringValue===e.stringValue;case 6:return function(s,i){return Tt(s.bytesValue).isEqual(Tt(i.bytesValue))}(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return function(s,i){return oe(s.geoPointValue.latitude)===oe(i.geoPointValue.latitude)&&oe(s.geoPointValue.longitude)===oe(i.geoPointValue.longitude)}(r,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return oe(s.integerValue)===oe(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=oe(s.doubleValue),c=oe(i.doubleValue);return o===c?gs(o)===gs(c):isNaN(o)&&isNaN(c)}return!1}(r,e);case 9:return er(r.arrayValue.values||[],e.arrayValue.values||[],ot);case 10:case 11:return function(s,i){const o=s.mapValue.fields||{},c=i.mapValue.fields||{};if(Ih(o)!==Ih(c))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(c[u]===void 0||!ot(o[u],c[u])))return!1;return!0}(r,e);default:return M()}}function Es(r,e){return(r.values||[]).find(t=>ot(t,e))!==void 0}function Qt(r,e){if(r===e)return 0;const t=Wt(r),n=Wt(e);if(t!==n)return K(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return K(r.booleanValue,e.booleanValue);case 2:return function(i,o){const c=oe(i.integerValue||i.doubleValue),u=oe(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1}(r,e);case 3:return Eh(r.timestampValue,e.timestampValue);case 4:return Eh(Ts(r),Ts(e));case 5:return K(r.stringValue,e.stringValue);case 6:return function(i,o){const c=Tt(i),u=Tt(o);return c.compareTo(u)}(r.bytesValue,e.bytesValue);case 7:return function(i,o){const c=i.split("/"),u=o.split("/");for(let h=0;h<c.length&&h<u.length;h++){const f=K(c[h],u[h]);if(f!==0)return f}return K(c.length,u.length)}(r.referenceValue,e.referenceValue);case 8:return function(i,o){const c=K(oe(i.latitude),oe(o.latitude));return c!==0?c:K(oe(i.longitude),oe(o.longitude))}(r.geoPointValue,e.geoPointValue);case 9:return vh(r.arrayValue,e.arrayValue);case 10:return function(i,o){var c,u,h,f;const m=i.fields||{},_=o.fields||{},R=(c=m[or])===null||c===void 0?void 0:c.arrayValue,C=(u=_[or])===null||u===void 0?void 0:u.arrayValue,V=K(((h=R==null?void 0:R.values)===null||h===void 0?void 0:h.length)||0,((f=C==null?void 0:C.values)===null||f===void 0?void 0:f.length)||0);return V!==0?V:vh(R,C)}(r.mapValue,e.mapValue);case 11:return function(i,o){if(i===qt.mapValue&&o===qt.mapValue)return 0;if(i===qt.mapValue)return 1;if(o===qt.mapValue)return-1;const c=i.fields||{},u=Object.keys(c),h=o.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let m=0;m<u.length&&m<f.length;++m){const _=K(u[m],f[m]);if(_!==0)return _;const R=Qt(c[u[m]],h[f[m]]);if(R!==0)return R}return K(u.length,f.length)}(r.mapValue,e.mapValue);default:throw M()}}function Eh(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return K(r,e);const t=It(r),n=It(e),s=K(t.seconds,n.seconds);return s!==0?s:K(t.nanos,n.nanos)}function vh(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=Qt(t[s],n[s]);if(i)return i}return K(t.length,n.length)}function ar(r){return Ga(r)}function Ga(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(t){const n=It(t);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(t){return Tt(t).toBase64()}(r.bytesValue):"referenceValue"in r?function(t){return O.fromName(t).toString()}(r.referenceValue):"geoPointValue"in r?function(t){return`geo(${t.latitude},${t.longitude})`}(r.geoPointValue):"arrayValue"in r?function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=Ga(i);return n+"]"}(r.arrayValue):"mapValue"in r?function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${Ga(t.fields[o])}`;return s+"}"}(r.mapValue):M()}function bi(r){switch(Wt(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=vo(r);return e?16+bi(e):16;case 5:return 2*r.stringValue.length;case 6:return Tt(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return function(n){return(n.values||[]).reduce((s,i)=>s+bi(i),0)}(r.arrayValue);case 10:case 11:return function(n){let s=0;return en(n.fields,(i,o)=>{s+=i.length+bi(o)}),s}(r.mapValue);default:throw M()}}function vs(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Ha(r){return!!r&&"integerValue"in r}function ws(r){return!!r&&"arrayValue"in r}function wh(r){return!!r&&"nullValue"in r}function Ah(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Si(r){return!!r&&"mapValue"in r}function wo(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[Lc])===null||t===void 0?void 0:t.stringValue)===Mc}function os(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return en(r.mapValue.fields,(t,n)=>e.mapValue.fields[t]=os(n)),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=os(r.arrayValue.values[t]);return e}return Object.assign({},r)}function cp(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===ap}const up={mapValue:{fields:{[Lc]:{stringValue:Mc},[or]:{arrayValue:{}}}}};function kE(r){return"nullValue"in r?Ri:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?vs(bn.empty(),O.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?wo(r)?up:{mapValue:{}}:M()}function DE(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?vs(bn.empty(),O.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?up:"mapValue"in r?wo(r)?{mapValue:{}}:qt:M()}function Rh(r,e){const t=Qt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function bh(r,e){const t=Qt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e){this.value=e}static empty(){return new Pe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Si(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=os(t)}setAll(e){let t=ae.emptyPath(),n={},s=[];e.forEach((o,c)=>{if(!t.isImmediateParentOf(c)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=c.popLast()}o?n[c.lastSegment()]=os(o):s.push(c.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());Si(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ot(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];Si(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){en(t,(s,i)=>e[s]=i);for(const s of n)delete e[s]}clone(){return new Pe(os(this.value))}}function lp(r){const e=[];return en(r.fields,(t,n)=>{const s=new ae([t]);if(Si(n)){const i=lp(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)}),new Ue(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(e,t,n,s,i,o,c){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=c}static newInvalidDocument(e){return new le(e,0,q.min(),q.min(),q.min(),Pe.empty(),0)}static newFoundDocument(e,t,n,s){return new le(e,1,t,q.min(),n,s,0)}static newNoDocument(e,t){return new le(e,2,t,q.min(),q.min(),Pe.empty(),0)}static newUnknownDocument(e,t){return new le(e,3,t,q.min(),q.min(),Pe.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Pe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Pe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof le&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new le(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr{constructor(e,t){this.position=e,this.inclusive=t}}function Sh(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=O.comparator(O.fromName(o.referenceValue),t.key):n=Qt(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function Ph(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!ot(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class As{constructor(e,t="asc"){this.field=e,this.dir=t}}function VE(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hp{}class Q extends hp{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new NE(e,t,n):t==="array-contains"?new LE(e,n):t==="in"?new _p(e,n):t==="not-in"?new ME(e,n):t==="array-contains-any"?new FE(e,n):new Q(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new xE(e,n):new OE(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Qt(t,this.value)):t!==null&&Wt(this.value)===Wt(t)&&this.matchesComparison(Qt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return M()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ee extends hp{constructor(e,t){super(),this.filters=e,this.op=t,this.ce=null}static create(e,t){return new ee(e,t)}matches(e){return ur(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ce!==null||(this.ce=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ce}getFilters(){return Object.assign([],this.filters)}}function ur(r){return r.op==="and"}function Wa(r){return r.op==="or"}function Fc(r){return dp(r)&&ur(r)}function dp(r){for(const e of r.filters)if(e instanceof ee)return!1;return!0}function Qa(r){if(r instanceof Q)return r.field.canonicalString()+r.op.toString()+ar(r.value);if(Fc(r))return r.filters.map(e=>Qa(e)).join(",");{const e=r.filters.map(t=>Qa(t)).join(",");return`${r.op}(${e})`}}function fp(r,e){return r instanceof Q?function(n,s){return s instanceof Q&&n.op===s.op&&n.field.isEqual(s.field)&&ot(n.value,s.value)}(r,e):r instanceof ee?function(n,s){return s instanceof ee&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce((i,o,c)=>i&&fp(o,s.filters[c]),!0):!1}(r,e):void M()}function pp(r,e){const t=r.filters.concat(e);return ee.create(t,r.op)}function mp(r){return r instanceof Q?function(t){return`${t.field.canonicalString()} ${t.op} ${ar(t.value)}`}(r):r instanceof ee?function(t){return t.op.toString()+" {"+t.getFilters().map(mp).join(" ,")+"}"}(r):"Filter"}class NE extends Q{constructor(e,t,n){super(e,t,n),this.key=O.fromName(n.referenceValue)}matches(e){const t=O.comparator(e.key,this.key);return this.matchesComparison(t)}}class xE extends Q{constructor(e,t){super(e,"in",t),this.keys=gp("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class OE extends Q{constructor(e,t){super(e,"not-in",t),this.keys=gp("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function gp(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(n=>O.fromName(n.referenceValue))}class LE extends Q{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ws(t)&&Es(t.arrayValue,this.value)}}class _p extends Q{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Es(this.value.arrayValue,t)}}class ME extends Q{constructor(e,t){super(e,"not-in",t)}matches(e){if(Es(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Es(this.value.arrayValue,t)}}class FE extends Q{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ws(t)||!t.arrayValue.values)&&t.arrayValue.values.some(n=>Es(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UE{constructor(e,t=null,n=[],s=[],i=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=c,this.le=null}}function Ya(r,e=null,t=[],n=[],s=null,i=null,o=null){return new UE(r,e,t,n,s,i,o)}function Sn(r){const e=F(r);if(e.le===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(n=>Qa(n)).join(","),t+="|ob:",t+=e.orderBy.map(n=>function(i){return i.field.canonicalString()+i.dir}(n)).join(","),yo(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(n=>ar(n)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(n=>ar(n)).join(",")),e.le=t}return e.le}function Os(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!VE(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!fp(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Ph(r.startAt,e.startAt)&&Ph(r.endAt,e.endAt)}function Hi(r){return O.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Wi(r,e){return r.filters.filter(t=>t instanceof Q&&t.field.isEqual(e))}function Ch(r,e,t){let n=Ri,s=!0;for(const i of Wi(r,e)){let o=Ri,c=!0;switch(i.op){case"<":case"<=":o=kE(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,c=!1;break;case"!=":case"not-in":o=Ri}Rh({value:n,inclusive:s},{value:o,inclusive:c})<0&&(n=o,s=c)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];Rh({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function kh(r,e,t){let n=qt,s=!0;for(const i of Wi(r,e)){let o=qt,c=!0;switch(i.op){case">=":case">":o=DE(i.value),c=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,c=!1;break;case"!=":case"not-in":o=qt}bh({value:n,inclusive:s},{value:o,inclusive:c})>0&&(n=o,s=c)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];bh({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr{constructor(e,t=null,n=[],s=[],i=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=c,this.endAt=u,this.he=null,this.Pe=null,this.Te=null,this.startAt,this.endAt}}function yp(r,e,t,n,s,i,o,c){return new vr(r,e,t,n,s,i,o,c)}function Ls(r){return new vr(r)}function Dh(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Ip(r){return r.collectionGroup!==null}function as(r){const e=F(r);if(e.he===null){e.he=[];const t=new Set;for(const i of e.explicitOrderBy)e.he.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new te(ae.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(h=>{h.isInequality()&&(c=c.add(h.field))})}),c})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.he.push(new As(i,n))}),t.has(ae.keyField().canonicalString())||e.he.push(new As(ae.keyField(),n))}return e.he}function Ke(r){const e=F(r);return e.Pe||(e.Pe=BE(e,as(r))),e.Pe}function BE(r,e){if(r.limitType==="F")return Ya(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new As(s.field,i)});const t=r.endAt?new cr(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new cr(r.startAt.position,r.startAt.inclusive):null;return Ya(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function Ja(r,e){const t=r.filters.concat([e]);return new vr(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function Qi(r,e,t){return new vr(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Ao(r,e){return Os(Ke(r),Ke(e))&&r.limitType===e.limitType}function Tp(r){return`${Sn(Ke(r))}|lt:${r.limitType}`}function Gn(r){return`Query(target=${function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(s=>mp(s)).join(", ")}]`),yo(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(s=>ar(s)).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(s=>ar(s)).join(",")),`Target(${n})`}(Ke(r))}; limitType=${r.limitType})`}function Ms(r,e){return e.isFoundDocument()&&function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):O.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)}(r,e)&&function(n,s){for(const i of as(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(r,e)&&function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0}(r,e)&&function(n,s){return!(n.startAt&&!function(o,c,u){const h=Sh(o,c,u);return o.inclusive?h<=0:h<0}(n.startAt,as(n),s)||n.endAt&&!function(o,c,u){const h=Sh(o,c,u);return o.inclusive?h>=0:h>0}(n.endAt,as(n),s))}(r,e)}function Ep(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function vp(r){return(e,t)=>{let n=!1;for(const s of as(r)){const i=qE(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function qE(r,e,t){const n=r.field.isKeyField()?O.comparator(e.key,t.key):function(i,o,c){const u=o.data.field(i),h=c.data.field(i);return u!==null&&h!==null?Qt(u,h):M()}(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return M()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){en(this.inner,(t,n)=>{for(const[s,i]of n)e(s,i)})}isEmpty(){return tp(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jE=new se(O.comparator);function $e(){return jE}const wp=new se(O.comparator);function Zr(...r){let e=wp;for(const t of r)e=e.insert(t.key,t);return e}function Ap(r){let e=wp;return r.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function nt(){return cs()}function Rp(){return cs()}function cs(){return new At(r=>r.toString(),(r,e)=>r.isEqual(e))}const $E=new se(O.comparator),zE=new te(O.comparator);function H(...r){let e=zE;for(const t of r)e=e.add(t);return e}const KE=new te(K);function Uc(){return KE}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bc(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:gs(e)?"-0":e}}function bp(r){return{integerValue:""+r}}function GE(r,e){return Kf(e)?bp(e):Bc(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ro{constructor(){this._=void 0}}function HE(r,e,t){return r instanceof lr?function(s,i){const o={fields:{[sp]:{stringValue:rp},[op]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Oc(i)&&(i=vo(i)),i&&(o.fields[ip]=i),{mapValue:o}}(t,e):r instanceof hr?Pp(r,e):r instanceof dr?Cp(r,e):function(s,i){const o=Sp(s,i),c=Vh(o)+Vh(s.Ie);return Ha(o)&&Ha(s.Ie)?bp(c):Bc(s.serializer,c)}(r,e)}function WE(r,e,t){return r instanceof hr?Pp(r,e):r instanceof dr?Cp(r,e):t}function Sp(r,e){return r instanceof Rs?function(n){return Ha(n)||function(i){return!!i&&"doubleValue"in i}(n)}(e)?e:{integerValue:0}:null}class lr extends Ro{}class hr extends Ro{constructor(e){super(),this.elements=e}}function Pp(r,e){const t=kp(e);for(const n of r.elements)t.some(s=>ot(s,n))||t.push(n);return{arrayValue:{values:t}}}class dr extends Ro{constructor(e){super(),this.elements=e}}function Cp(r,e){let t=kp(e);for(const n of r.elements)t=t.filter(s=>!ot(s,n));return{arrayValue:{values:t}}}class Rs extends Ro{constructor(e,t){super(),this.serializer=e,this.Ie=t}}function Vh(r){return oe(r.integerValue||r.doubleValue)}function kp(r){return ws(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dp{constructor(e,t){this.field=e,this.transform=t}}function QE(r,e){return r.field.isEqual(e.field)&&function(n,s){return n instanceof hr&&s instanceof hr||n instanceof dr&&s instanceof dr?er(n.elements,s.elements,ot):n instanceof Rs&&s instanceof Rs?ot(n.Ie,s.Ie):n instanceof lr&&s instanceof lr}(r.transform,e.transform)}class YE{constructor(e,t){this.version=e,this.transformResults=t}}class Ce{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Ce}static exists(e){return new Ce(void 0,e)}static updateTime(e){return new Ce(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Pi(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class bo{}function Vp(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new So(r.key,Ce.none()):new wr(r.key,r.data,Ce.none());{const t=r.data,n=Pe.empty();let s=new te(ae.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new Rt(r.key,n,new Ue(s.toArray()),Ce.none())}}function JE(r,e,t){r instanceof wr?function(s,i,o){const c=s.value.clone(),u=xh(s.fieldTransforms,i,o.transformResults);c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(r,e,t):r instanceof Rt?function(s,i,o){if(!Pi(s.precondition,i))return void i.convertToUnknownDocument(o.version);const c=xh(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(Np(s)),u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(r,e,t):function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function us(r,e,t,n){return r instanceof wr?function(i,o,c,u){if(!Pi(i.precondition,o))return c;const h=i.value.clone(),f=Oh(i.fieldTransforms,u,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(r,e,t,n):r instanceof Rt?function(i,o,c,u){if(!Pi(i.precondition,o))return c;const h=Oh(i.fieldTransforms,u,o),f=o.data;return f.setAll(Np(i)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(r,e,t,n):function(i,o,c){return Pi(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c}(r,e,t)}function XE(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=Sp(n.transform,s||null);i!=null&&(t===null&&(t=Pe.empty()),t.set(n.field,i))}return t||null}function Nh(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&er(n,s,(i,o)=>QE(i,o))}(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class wr extends bo{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Rt extends bo{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Np(r){const e=new Map;return r.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}}),e}function xh(r,e,t){const n=new Map;U(r.length===t.length);for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,c=e.data.field(i.field);n.set(i.field,WE(o,c,t[s]))}return n}function Oh(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,HE(i,o,e))}return n}class So extends bo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class xp extends bo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qc{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&JE(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=us(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=us(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Rp();return this.mutations.forEach(s=>{const i=e.get(s.key),o=i.overlayedDocument;let c=this.applyToLocalView(o,i.mutatedFields);c=t.has(s.key)?null:c;const u=Vp(o,c);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(q.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),H())}isEqual(e){return this.batchId===e.batchId&&er(this.mutations,e.mutations,(t,n)=>Nh(t,n))&&er(this.baseMutations,e.baseMutations,(t,n)=>Nh(t,n))}}class jc{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){U(e.mutations.length===n.length);let s=function(){return $E}();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new jc(e,t,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $c{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZE{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var me,J;function ev(r){switch(r){case P.OK:return M();case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return M()}}function Op(r){if(r===void 0)return fe("GRPC error has no .code"),P.UNKNOWN;switch(r){case me.OK:return P.OK;case me.CANCELLED:return P.CANCELLED;case me.UNKNOWN:return P.UNKNOWN;case me.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case me.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case me.INTERNAL:return P.INTERNAL;case me.UNAVAILABLE:return P.UNAVAILABLE;case me.UNAUTHENTICATED:return P.UNAUTHENTICATED;case me.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case me.NOT_FOUND:return P.NOT_FOUND;case me.ALREADY_EXISTS:return P.ALREADY_EXISTS;case me.PERMISSION_DENIED:return P.PERMISSION_DENIED;case me.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case me.ABORTED:return P.ABORTED;case me.OUT_OF_RANGE:return P.OUT_OF_RANGE;case me.UNIMPLEMENTED:return P.UNIMPLEMENTED;case me.DATA_LOSS:return P.DATA_LOSS;default:return M()}}(J=me||(me={}))[J.OK=0]="OK",J[J.CANCELLED=1]="CANCELLED",J[J.UNKNOWN=2]="UNKNOWN",J[J.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",J[J.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",J[J.NOT_FOUND=5]="NOT_FOUND",J[J.ALREADY_EXISTS=6]="ALREADY_EXISTS",J[J.PERMISSION_DENIED=7]="PERMISSION_DENIED",J[J.UNAUTHENTICATED=16]="UNAUTHENTICATED",J[J.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",J[J.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",J[J.ABORTED=10]="ABORTED",J[J.OUT_OF_RANGE=11]="OUT_OF_RANGE",J[J.UNIMPLEMENTED=12]="UNIMPLEMENTED",J[J.INTERNAL=13]="INTERNAL",J[J.UNAVAILABLE=14]="UNAVAILABLE",J[J.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tv(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nv=new zt([4294967295,4294967295],0);function Lh(r){const e=tv().encode(r),t=new Df;return t.update(e),new Uint8Array(t.digest())}function Mh(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new zt([t,n],0),new zt([s,i],0)]}class zc{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new es(`Invalid padding: ${t}`);if(n<0)throw new es(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new es(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new es(`Invalid padding when bitmap length is 0: ${t}`);this.Ee=8*e.length-t,this.de=zt.fromNumber(this.Ee)}Ae(e,t,n){let s=e.add(t.multiply(zt.fromNumber(n)));return s.compare(nv)===1&&(s=new zt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.de).toNumber()}Re(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.Ee===0)return!1;const t=Lh(e),[n,s]=Mh(t);for(let i=0;i<this.hashCount;i++){const o=this.Ae(n,s,i);if(!this.Re(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new zc(i,s,t);return n.forEach(c=>o.insert(c)),o}insert(e){if(this.Ee===0)return;const t=Lh(e),[n,s]=Mh(t);for(let i=0;i<this.hashCount;i++){const o=this.Ae(n,s,i);this.Ve(o)}}Ve(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class es extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(e,t,n,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,Us.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new Fs(q.min(),s,new se(K),$e(),H())}}class Us{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Us(n,t,H(),H(),H())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ci{constructor(e,t,n,s){this.me=e,this.removedTargetIds=t,this.key=n,this.fe=s}}class Lp{constructor(e,t){this.targetId=e,this.ge=t}}class Mp{constructor(e,t,n=pe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class Fh{constructor(){this.pe=0,this.ye=Uh(),this.we=pe.EMPTY_BYTE_STRING,this.be=!1,this.Se=!0}get current(){return this.be}get resumeToken(){return this.we}get De(){return this.pe!==0}get ve(){return this.Se}Ce(e){e.approximateByteSize()>0&&(this.Se=!0,this.we=e)}Fe(){let e=H(),t=H(),n=H();return this.ye.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:M()}}),new Us(this.we,this.be,e,t,n)}Me(){this.Se=!1,this.ye=Uh()}xe(e,t){this.Se=!0,this.ye=this.ye.insert(e,t)}Oe(e){this.Se=!0,this.ye=this.ye.remove(e)}Ne(){this.pe+=1}Be(){this.pe-=1,U(this.pe>=0)}Le(){this.Se=!0,this.be=!0}}class rv{constructor(e){this.ke=e,this.qe=new Map,this.Qe=$e(),this.$e=li(),this.Ke=li(),this.Ue=new se(K)}We(e){for(const t of e.me)e.fe&&e.fe.isFoundDocument()?this.Ge(t,e.fe):this.ze(t,e.key,e.fe);for(const t of e.removedTargetIds)this.ze(t,e.key,e.fe)}je(e){this.forEachTarget(e,t=>{const n=this.He(t);switch(e.state){case 0:this.Je(t)&&n.Ce(e.resumeToken);break;case 1:n.Be(),n.De||n.Me(),n.Ce(e.resumeToken);break;case 2:n.Be(),n.De||this.removeTarget(t);break;case 3:this.Je(t)&&(n.Le(),n.Ce(e.resumeToken));break;case 4:this.Je(t)&&(this.Ye(t),n.Ce(e.resumeToken));break;default:M()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.qe.forEach((n,s)=>{this.Je(s)&&t(s)})}Ze(e){const t=e.targetId,n=e.ge.count,s=this.Xe(t);if(s){const i=s.target;if(Hi(i))if(n===0){const o=new O(i.path);this.ze(t,o,le.newNoDocument(o,q.min()))}else U(n===1);else{const o=this.et(t);if(o!==n){const c=this.tt(e),u=c?this.nt(c,e,o):1;if(u!==0){this.Ye(t);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ue=this.Ue.insert(t,h)}}}}}tt(e){const t=e.ge.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,c;try{o=Tt(n).toUint8Array()}catch(u){if(u instanceof np)return Rn("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new zc(o,s,i)}catch(u){return Rn(u instanceof es?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.Ee===0?null:c}nt(e,t,n){return t.ge.count===n-this.st(e,t.targetId)?0:2}st(e,t){const n=this.ke.getRemoteKeysForTarget(t);let s=0;return n.forEach(i=>{const o=this.ke.it(),c=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.ze(t,i,null),s++)}),s}ot(e){const t=new Map;this.qe.forEach((i,o)=>{const c=this.Xe(o);if(c){if(i.current&&Hi(c.target)){const u=new O(c.target.path);this._t(u).has(o)||this.ut(o,u)||this.ze(o,u,le.newNoDocument(u,e))}i.ve&&(t.set(o,i.Fe()),i.Me())}});let n=H();this.Ke.forEach((i,o)=>{let c=!0;o.forEachWhile(u=>{const h=this.Xe(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(n=n.add(i))}),this.Qe.forEach((i,o)=>o.setReadTime(e));const s=new Fs(e,t,this.Ue,this.Qe,n);return this.Qe=$e(),this.$e=li(),this.Ke=li(),this.Ue=new se(K),s}Ge(e,t){if(!this.Je(e))return;const n=this.ut(e,t.key)?2:0;this.He(e).xe(t.key,n),this.Qe=this.Qe.insert(t.key,t),this.$e=this.$e.insert(t.key,this._t(t.key).add(e)),this.Ke=this.Ke.insert(t.key,this.ct(t.key).add(e))}ze(e,t,n){if(!this.Je(e))return;const s=this.He(e);this.ut(e,t)?s.xe(t,1):s.Oe(t),this.Ke=this.Ke.insert(t,this.ct(t).delete(e)),this.Ke=this.Ke.insert(t,this.ct(t).add(e)),n&&(this.Qe=this.Qe.insert(t,n))}removeTarget(e){this.qe.delete(e)}et(e){const t=this.He(e).Fe();return this.ke.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ne(e){this.He(e).Ne()}He(e){let t=this.qe.get(e);return t||(t=new Fh,this.qe.set(e,t)),t}ct(e){let t=this.Ke.get(e);return t||(t=new te(K),this.Ke=this.Ke.insert(e,t)),t}_t(e){let t=this.$e.get(e);return t||(t=new te(K),this.$e=this.$e.insert(e,t)),t}Je(e){const t=this.Xe(e)!==null;return t||D("WatchChangeAggregator","Detected inactive target",e),t}Xe(e){const t=this.qe.get(e);return t&&t.De?null:this.ke.lt(e)}Ye(e){this.qe.set(e,new Fh),this.ke.getRemoteKeysForTarget(e).forEach(t=>{this.ze(e,t,null)})}ut(e,t){return this.ke.getRemoteKeysForTarget(e).has(t)}}function li(){return new se(O.comparator)}function Uh(){return new se(O.comparator)}const sv={asc:"ASCENDING",desc:"DESCENDING"},iv={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},ov={and:"AND",or:"OR"};class av{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Xa(r,e){return r.useProto3Json||yo(e)?e:{value:e}}function fr(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Fp(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function cv(r,e){return fr(r,e.toTimestamp())}function Le(r){return U(!!r),q.fromTimestamp(function(t){const n=It(t);return new ce(n.seconds,n.nanos)}(r))}function Kc(r,e){return Za(r,e).canonicalString()}function Za(r,e){const t=function(s){return new Z(["projects",s.projectId,"databases",s.database])}(r).child("documents");return e===void 0?t:t.child(e)}function Up(r){const e=Z.fromString(r);return U(Wp(e)),e}function Yi(r,e){return Kc(r.databaseId,e.path)}function In(r,e){const t=Up(e);if(t.get(1)!==r.databaseId.projectId)throw new N(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new N(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new O(jp(t))}function Bp(r,e){return Kc(r.databaseId,e)}function qp(r){const e=Up(r);return e.length===4?Z.emptyPath():jp(e)}function ec(r){return new Z(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function jp(r){return U(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}function Bh(r,e,t){return{name:Yi(r,e),fields:t.value.mapValue.fields}}function uv(r,e,t){const n=In(r,e.name),s=Le(e.updateTime),i=e.createTime?Le(e.createTime):q.min(),o=new Pe({mapValue:{fields:e.fields}}),c=le.newFoundDocument(n,s,i,o);return t&&c.setHasCommittedMutations(),t?c.setHasCommittedMutations():c}function lv(r,e){let t;if("targetChange"in e){e.targetChange;const n=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:M()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(h,f){return h.useProto3Json?(U(f===void 0||typeof f=="string"),pe.fromBase64String(f||"")):(U(f===void 0||f instanceof Buffer||f instanceof Uint8Array),pe.fromUint8Array(f||new Uint8Array))}(r,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&function(h){const f=h.code===void 0?P.UNKNOWN:Op(h.code);return new N(f,h.message||"")}(o);t=new Mp(n,s,i,c||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=In(r,n.document.name),i=Le(n.document.updateTime),o=n.document.createTime?Le(n.document.createTime):q.min(),c=new Pe({mapValue:{fields:n.document.fields}}),u=le.newFoundDocument(s,i,o,c),h=n.targetIds||[],f=n.removedTargetIds||[];t=new Ci(h,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=In(r,n.document),i=n.readTime?Le(n.readTime):q.min(),o=le.newNoDocument(s,i),c=n.removedTargetIds||[];t=new Ci([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=In(r,n.document),i=n.removedTargetIds||[];t=new Ci([],i,s,null)}else{if(!("filter"in e))return M();{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new ZE(s,i),c=n.targetId;t=new Lp(c,o)}}return t}function Ji(r,e){let t;if(e instanceof wr)t={update:Bh(r,e.key,e.value)};else if(e instanceof So)t={delete:Yi(r,e.key)};else if(e instanceof Rt)t={update:Bh(r,e.key,e.data),updateMask:gv(e.fieldMask)};else{if(!(e instanceof xp))return M();t={verify:Yi(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(n=>function(i,o){const c=o.transform;if(c instanceof lr)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof hr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof dr)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof Rs)return{fieldPath:o.field.canonicalString(),increment:c.Ie};throw M()}(0,n))),e.precondition.isNone||(t.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:cv(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:M()}(r,e.precondition)),t}function tc(r,e){const t=e.currentDocument?function(i){return i.updateTime!==void 0?Ce.updateTime(Le(i.updateTime)):i.exists!==void 0?Ce.exists(i.exists):Ce.none()}(e.currentDocument):Ce.none(),n=e.updateTransforms?e.updateTransforms.map(s=>function(o,c){let u=null;if("setToServerValue"in c)U(c.setToServerValue==="REQUEST_TIME"),u=new lr;else if("appendMissingElements"in c){const f=c.appendMissingElements.values||[];u=new hr(f)}else if("removeAllFromArray"in c){const f=c.removeAllFromArray.values||[];u=new dr(f)}else"increment"in c?u=new Rs(o,c.increment):M();const h=ae.fromServerFormat(c.fieldPath);return new Dp(h,u)}(r,s)):[];if(e.update){e.update.name;const s=In(r,e.update.name),i=new Pe({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=function(u){const h=u.fieldPaths||[];return new Ue(h.map(f=>ae.fromServerFormat(f)))}(e.updateMask);return new Rt(s,i,o,t,n)}return new wr(s,i,t,n)}if(e.delete){const s=In(r,e.delete);return new So(s,t)}if(e.verify){const s=In(r,e.verify);return new xp(s,t)}return M()}function hv(r,e){return r&&r.length>0?(U(e!==void 0),r.map(t=>function(s,i){let o=s.updateTime?Le(s.updateTime):Le(i);return o.isEqual(q.min())&&(o=Le(i)),new YE(o,s.transformResults||[])}(t,e))):[]}function $p(r,e){return{documents:[Bp(r,e.path)]}}function zp(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Bp(r,s);const i=function(h){if(h.length!==0)return Hp(ee.create(h,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const o=function(h){if(h.length!==0)return h.map(f=>function(_){return{field:Hn(_.field),direction:fv(_.dir)}}(f))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const c=Xa(r,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{ht:t,parent:s}}function Kp(r){let e=qp(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){U(n===1);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=function(m){const _=Gp(m);return _ instanceof ee&&Fc(_)?_.getFilters():[_]}(t.where));let o=[];t.orderBy&&(o=function(m){return m.map(_=>function(C){return new As(Wn(C.field),function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(C.direction))}(_))}(t.orderBy));let c=null;t.limit&&(c=function(m){let _;return _=typeof m=="object"?m.value:m,yo(_)?null:_}(t.limit));let u=null;t.startAt&&(u=function(m){const _=!!m.before,R=m.values||[];return new cr(R,_)}(t.startAt));let h=null;return t.endAt&&(h=function(m){const _=!m.before,R=m.values||[];return new cr(R,_)}(t.endAt)),yp(e,s,o,i,c,"F",u,h)}function dv(r,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Gp(r){return r.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Wn(t.unaryFilter.field);return Q.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Wn(t.unaryFilter.field);return Q.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Wn(t.unaryFilter.field);return Q.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Wn(t.unaryFilter.field);return Q.create(o,"!=",{nullValue:"NULL_VALUE"});default:return M()}}(r):r.fieldFilter!==void 0?function(t){return Q.create(Wn(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return M()}}(t.fieldFilter.op),t.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(t){return ee.create(t.compositeFilter.filters.map(n=>Gp(n)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return M()}}(t.compositeFilter.op))}(r):M()}function fv(r){return sv[r]}function pv(r){return iv[r]}function mv(r){return ov[r]}function Hn(r){return{fieldPath:r.canonicalString()}}function Wn(r){return ae.fromServerFormat(r.fieldPath)}function Hp(r){return r instanceof Q?function(t){if(t.op==="=="){if(Ah(t.value))return{unaryFilter:{field:Hn(t.field),op:"IS_NAN"}};if(wh(t.value))return{unaryFilter:{field:Hn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ah(t.value))return{unaryFilter:{field:Hn(t.field),op:"IS_NOT_NAN"}};if(wh(t.value))return{unaryFilter:{field:Hn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Hn(t.field),op:pv(t.op),value:t.value}}}(r):r instanceof ee?function(t){const n=t.getFilters().map(s=>Hp(s));return n.length===1?n[0]:{compositeFilter:{op:mv(t.op),filters:n}}}(r):M()}function gv(r){const e=[];return r.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Wp(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(e,t,n,s,i=q.min(),o=q.min(),c=pe.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new pt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new pt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new pt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new pt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{constructor(e){this.Tt=e}}function _v(r,e){let t;if(e.document)t=uv(r.Tt,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=O.fromSegments(e.noDocument.path),s=Cn(e.noDocument.readTime);t=le.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return M();{const n=O.fromSegments(e.unknownDocument.path),s=Cn(e.unknownDocument.version);t=le.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime(function(s){const i=new ce(s[0],s[1]);return q.fromTimestamp(i)}(e.readTime)),t}function qh(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Xi(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=function(i,o){return{name:Yi(i,o.key),fields:o.data.value.mapValue.fields,updateTime:fr(i,o.version.toTimestamp()),createTime:fr(i,o.createTime.toTimestamp())}}(r.Tt,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:Pn(e.version)};else{if(!e.isUnknownDocument())return M();n.unknownDocument={path:t.path.toArray(),version:Pn(e.version)}}return n}function Xi(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function Pn(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Cn(r){const e=new ce(r.seconds,r.nanoseconds);return q.fromTimestamp(e)}function dn(r,e){const t=(e.baseMutations||[]).map(i=>tc(r.Tt,i));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const c=e.mutations[i+1];o.updateTransforms=c.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map(i=>tc(r.Tt,i)),s=ce.fromMillis(e.localWriteTimeMs);return new qc(e.batchId,s,t,n)}function ts(r){const e=Cn(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?Cn(r.lastLimboFreeSnapshotVersion):q.min();let n;return n=function(i){return i.documents!==void 0}(r.query)?function(i){return U(i.documents.length===1),Ke(Ls(qp(i.documents[0])))}(r.query):function(i){return Ke(Kp(i))}(r.query),new pt(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,pe.fromBase64String(r.resumeToken))}function Yp(r,e){const t=Pn(e.snapshotVersion),n=Pn(e.lastLimboFreeSnapshotVersion);let s;s=Hi(e.target)?$p(r.Tt,e.target):zp(r.Tt,e.target).ht;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:Sn(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function Jp(r){const e=Kp({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Qi(e,e.limit,"L"):e}function va(r,e){return new $c(e.largestBatchId,tc(r.Tt,e.overlayMutation))}function jh(r,e){const t=e.path.lastSegment();return[r,ke(e.path.popLast()),t]}function $h(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:Pn(n.readTime),documentKey:ke(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yv{getBundleMetadata(e,t){return zh(e).get(t).next(n=>{if(n)return function(i){return{id:i.bundleId,createTime:Cn(i.createTime),version:i.version}}(n)})}saveBundleMetadata(e,t){return zh(e).put(function(s){return{bundleId:s.id,createTime:Pn(Le(s.createTime)),version:s.version}}(t))}getNamedQuery(e,t){return Kh(e).get(t).next(n=>{if(n)return function(i){return{name:i.name,query:Jp(i.bundledQuery),readTime:Cn(i.readTime)}}(n)})}saveNamedQuery(e,t){return Kh(e).put(function(s){return{name:s.name,readTime:Pn(Le(s.readTime)),bundledQuery:s.bundledQuery}}(t))}}function zh(r){return _e(r,Io)}function Kh(r){return _e(r,To)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Po{constructor(e,t){this.serializer=e,this.userId=t}static It(e,t){const n=t.uid||"";return new Po(e,n)}getOverlay(e,t){return zr(e).get(jh(this.userId,t)).next(n=>n?va(this.serializer,n):null)}getOverlays(e,t){const n=nt();return w.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}saveOverlays(e,t,n){const s=[];return n.forEach((i,o)=>{const c=new $c(t,o);s.push(this.Et(e,c))}),w.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach(o=>s.add(ke(o.getCollectionPath())));const i=[];return s.forEach(o=>{const c=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(zr(e).J(za,c))}),w.waitFor(i)}getOverlaysForCollection(e,t,n){const s=nt(),i=ke(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return zr(e).G(za,o).next(c=>{for(const u of c){const h=va(this.serializer,u);s.set(h.getKey(),h)}return s})}getOverlaysForCollectionGroup(e,t,n,s){const i=nt();let o;const c=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return zr(e).Z({index:Jf,range:c},(u,h,f)=>{const m=va(this.serializer,h);i.size()<s||m.largestBatchId===o?(i.set(m.getKey(),m),o=m.largestBatchId):f.done()}).next(()=>i)}Et(e,t){return zr(e).put(function(s,i,o){const[c,u,h]=jh(i,o.mutation.key);return{userId:i,collectionPath:u,documentId:h,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:Ji(s.Tt,o.mutation)}}(this.serializer,this.userId,t))}}function zr(r){return _e(r,Eo)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iv{dt(e){return _e(e,Nc)}getSessionToken(e){return this.dt(e).get("sessionToken").next(t=>{const n=t==null?void 0:t.value;return n?pe.fromUint8Array(n):pe.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.dt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(){}At(e,t){this.Rt(e,t),t.Vt()}Rt(e,t){if("nullValue"in e)this.ft(t,5);else if("booleanValue"in e)this.ft(t,10),t.gt(e.booleanValue?1:0);else if("integerValue"in e)this.ft(t,15),t.gt(oe(e.integerValue));else if("doubleValue"in e){const n=oe(e.doubleValue);isNaN(n)?this.ft(t,13):(this.ft(t,15),gs(n)?t.gt(0):t.gt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.ft(t,20),typeof n=="string"&&(n=It(n)),t.yt(`${n.seconds||""}`),t.gt(n.nanos||0)}else if("stringValue"in e)this.wt(e.stringValue,t),this.bt(t);else if("bytesValue"in e)this.ft(t,30),t.St(Tt(e.bytesValue)),this.bt(t);else if("referenceValue"in e)this.Dt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.ft(t,45),t.gt(n.latitude||0),t.gt(n.longitude||0)}else"mapValue"in e?cp(e)?this.ft(t,Number.MAX_SAFE_INTEGER):wo(e)?this.vt(e.mapValue,t):(this.Ct(e.mapValue,t),this.bt(t)):"arrayValue"in e?(this.Ft(e.arrayValue,t),this.bt(t)):M()}wt(e,t){this.ft(t,25),this.Mt(e,t)}Mt(e,t){t.yt(e)}Ct(e,t){const n=e.fields||{};this.ft(t,55);for(const s of Object.keys(n))this.wt(s,t),this.Rt(n[s],t)}vt(e,t){var n,s;const i=e.fields||{};this.ft(t,53);const o=or,c=((s=(n=i[o].arrayValue)===null||n===void 0?void 0:n.values)===null||s===void 0?void 0:s.length)||0;this.ft(t,15),t.gt(oe(c)),this.wt(o,t),this.Rt(i[o],t)}Ft(e,t){const n=e.values||[];this.ft(t,50);for(const s of n)this.Rt(s,t)}Dt(e,t){this.ft(t,37),O.fromName(e).path.forEach(n=>{this.ft(t,60),this.Mt(n,t)})}ft(e,t){e.gt(t)}bt(e){e.gt(2)}}fn.xt=new fn;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qn=255;function Tv(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function Gh(r){const e=64-function(n){let s=0;for(let i=0;i<8;++i){const o=Tv(255&n[i]);if(s+=o,o!==8)break}return s}(r);return Math.ceil(e/8)}class Ev{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ot(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Nt(n.value),n=t.next();this.Bt()}Lt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.kt(n.value),n=t.next();this.qt()}Qt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Nt(n);else if(n<2048)this.Nt(960|n>>>6),this.Nt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Nt(480|n>>>12),this.Nt(128|63&n>>>6),this.Nt(128|63&n);else{const s=t.codePointAt(0);this.Nt(240|s>>>18),this.Nt(128|63&s>>>12),this.Nt(128|63&s>>>6),this.Nt(128|63&s)}}this.Bt()}$t(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.kt(n);else if(n<2048)this.kt(960|n>>>6),this.kt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.kt(480|n>>>12),this.kt(128|63&n>>>6),this.kt(128|63&n);else{const s=t.codePointAt(0);this.kt(240|s>>>18),this.kt(128|63&s>>>12),this.kt(128|63&s>>>6),this.kt(128|63&s)}}this.qt()}Kt(e){const t=this.Ut(e),n=Gh(t);this.Wt(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}Gt(e){const t=this.Ut(e),n=Gh(t);this.Wt(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}zt(){this.jt(qn),this.jt(255)}Ht(){this.Jt(qn),this.Jt(255)}reset(){this.position=0}seed(e){this.Wt(e.length),this.buffer.set(e,this.position),this.position+=e.length}Yt(){return this.buffer.slice(0,this.position)}Ut(e){const t=function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Nt(e){const t=255&e;t===0?(this.jt(0),this.jt(255)):t===qn?(this.jt(qn),this.jt(0)):this.jt(t)}kt(e){const t=255&e;t===0?(this.Jt(0),this.Jt(255)):t===qn?(this.Jt(qn),this.Jt(0)):this.Jt(e)}Bt(){this.jt(0),this.jt(1)}qt(){this.Jt(0),this.Jt(1)}jt(e){this.Wt(1),this.buffer[this.position++]=e}Jt(e){this.Wt(1),this.buffer[this.position++]=~e}Wt(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class vv{constructor(e){this.Zt=e}St(e){this.Zt.Ot(e)}yt(e){this.Zt.Qt(e)}gt(e){this.Zt.Kt(e)}Vt(){this.Zt.zt()}}class wv{constructor(e){this.Zt=e}St(e){this.Zt.Lt(e)}yt(e){this.Zt.$t(e)}gt(e){this.Zt.Gt(e)}Vt(){this.Zt.Ht()}}class Kr{constructor(){this.Zt=new Ev,this.Xt=new vv(this.Zt),this.en=new wv(this.Zt)}seed(e){this.Zt.seed(e)}tn(e){return e===0?this.Xt:this.en}Yt(){return this.Zt.Yt()}reset(){this.Zt.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(e,t,n,s){this.indexId=e,this.documentKey=t,this.arrayValue=n,this.directionalValue=s}nn(){const e=this.directionalValue.length,t=e===0||this.directionalValue[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.directionalValue,0),t!==e?n.set([0],this.directionalValue.length):++n[n.length-1],new pn(this.indexId,this.documentKey,this.arrayValue,n)}}function Vt(r,e){let t=r.indexId-e.indexId;return t!==0?t:(t=Hh(r.arrayValue,e.arrayValue),t!==0?t:(t=Hh(r.directionalValue,e.directionalValue),t!==0?t:O.comparator(r.documentKey,e.documentKey)))}function Hh(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wh{constructor(e){this.rn=new te((t,n)=>ae.comparator(t.field,n.field)),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.sn=e.orderBy,this._n=[];for(const t of e.filters){const n=t;n.isInequality()?this.rn=this.rn.add(n):this._n.push(n)}}get an(){return this.rn.size>1}un(e){if(U(e.collectionGroup===this.collectionId),this.an)return!1;const t=qa(e);if(t!==void 0&&!this.cn(t))return!1;const n=un(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.cn(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.rn.size>0){const c=this.rn.getIterator().getNext();if(!s.has(c.field.canonicalString())){const u=n[i];if(!this.ln(c,u)||!this.hn(this.sn[o++],u))return!1}++i}for(;i<n.length;++i){const c=n[i];if(o>=this.sn.length||!this.hn(this.sn[o++],c))return!1}return!0}Pn(){if(this.an)return null;let e=new te(ae.comparator);const t=[];for(const n of this._n)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new vi(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new vi(n.field,0))}for(const n of this.sn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new vi(n.field,n.dir==="asc"?0:1)));return new Bi(Bi.UNKNOWN_ID,this.collectionId,t,ms.empty())}cn(e){for(const t of this._n)if(this.ln(t,e))return!0;return!1}ln(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}hn(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xp(r){var e,t;if(U(r instanceof Q||r instanceof ee),r instanceof Q){if(r instanceof _p){const s=((t=(e=r.value.arrayValue)===null||e===void 0?void 0:e.values)===null||t===void 0?void 0:t.map(i=>Q.create(r.field,"==",i)))||[];return ee.create(s,"or")}return r}const n=r.filters.map(s=>Xp(s));return ee.create(n,r.op)}function Av(r){if(r.getFilters().length===0)return[];const e=sc(Xp(r));return U(Zp(e)),nc(e)||rc(e)?[e]:e.getFilters()}function nc(r){return r instanceof Q}function rc(r){return r instanceof ee&&Fc(r)}function Zp(r){return nc(r)||rc(r)||function(t){if(t instanceof ee&&Wa(t)){for(const n of t.getFilters())if(!nc(n)&&!rc(n))return!1;return!0}return!1}(r)}function sc(r){if(U(r instanceof Q||r instanceof ee),r instanceof Q)return r;if(r.filters.length===1)return sc(r.filters[0]);const e=r.filters.map(n=>sc(n));let t=ee.create(e,r.op);return t=Zi(t),Zp(t)?t:(U(t instanceof ee),U(ur(t)),U(t.filters.length>1),t.filters.reduce((n,s)=>Gc(n,s)))}function Gc(r,e){let t;return U(r instanceof Q||r instanceof ee),U(e instanceof Q||e instanceof ee),t=r instanceof Q?e instanceof Q?function(s,i){return ee.create([s,i],"and")}(r,e):Qh(r,e):e instanceof Q?Qh(e,r):function(s,i){if(U(s.filters.length>0&&i.filters.length>0),ur(s)&&ur(i))return pp(s,i.getFilters());const o=Wa(s)?s:i,c=Wa(s)?i:s,u=o.filters.map(h=>Gc(h,c));return ee.create(u,"or")}(r,e),Zi(t)}function Qh(r,e){if(ur(e))return pp(e,r.getFilters());{const t=e.filters.map(n=>Gc(r,n));return ee.create(t,"or")}}function Zi(r){if(U(r instanceof Q||r instanceof ee),r instanceof Q)return r;const e=r.getFilters();if(e.length===1)return Zi(e[0]);if(dp(r))return r;const t=e.map(s=>Zi(s)),n=[];return t.forEach(s=>{s instanceof Q?n.push(s):s instanceof ee&&(s.op===r.op?n.push(...s.filters):n.push(s))}),n.length===1?n[0]:ee.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rv{constructor(){this.Tn=new Hc}addToCollectionParentIndex(e,t){return this.Tn.add(t),w.resolve()}getCollectionParents(e,t){return w.resolve(this.Tn.getEntries(t))}addFieldIndex(e,t){return w.resolve()}deleteFieldIndex(e,t){return w.resolve()}deleteAllFieldIndexes(e){return w.resolve()}createTargetIndexes(e,t){return w.resolve()}getDocumentsMatchingTarget(e,t){return w.resolve(null)}getIndexType(e,t){return w.resolve(0)}getFieldIndexes(e,t){return w.resolve([])}getNextCollectionGroupToUpdate(e){return w.resolve(null)}getMinOffset(e,t){return w.resolve(Ge.min())}getMinOffsetFromCollectionGroup(e,t){return w.resolve(Ge.min())}updateCollectionGroup(e,t,n){return w.resolve()}updateIndexEntries(e,t){return w.resolve()}}class Hc{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new te(Z.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new te(Z.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yh="IndexedDbIndexManager",hi=new Uint8Array(0);class bv{constructor(e,t){this.databaseId=t,this.In=new Hc,this.En=new At(n=>Sn(n),(n,s)=>Os(n,s)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.In.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener(()=>{this.In.add(t)});const i={collectionId:n,parent:ke(s)};return Jh(e).put(i)}return w.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[Uf(t),""],!1,!0);return Jh(e).G(s).next(i=>{for(const o of i){if(o.collectionId!==t)break;n.push(tt(o.parent))}return n})}addFieldIndex(e,t){const n=Gr(e),s=function(c){return{indexId:c.indexId,collectionGroup:c.collectionGroup,fields:c.fields.map(u=>[u.fieldPath.canonicalString(),u.kind])}}(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=$n(e);return i.next(c=>{o.put($h(c,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return i.next()}deleteFieldIndex(e,t){const n=Gr(e),s=$n(e),i=jn(e);return n.delete(t.indexId).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=Gr(e),n=jn(e),s=$n(e);return t.J().next(()=>n.J()).next(()=>s.J())}createTargetIndexes(e,t){return w.forEach(this.dn(t),n=>this.getIndexType(e,n).next(s=>{if(s===0||s===1){const i=new Wh(n).Pn();if(i!=null)return this.addFieldIndex(e,i)}}))}getDocumentsMatchingTarget(e,t){const n=jn(e);let s=!0;const i=new Map;return w.forEach(this.dn(t),o=>this.An(e,o).next(c=>{s&&(s=!!c),i.set(o,c)})).next(()=>{if(s){let o=H();const c=[];return w.forEach(i,(u,h)=>{D(Yh,`Using index ${function(L){return`id=${L.indexId}|cg=${L.collectionGroup}|f=${L.fields.map($=>`${$.fieldPath}:${$.kind}`).join(",")}`}(u)} to execute ${Sn(t)}`);const f=function(L,$){const Y=qa($);if(Y===void 0)return null;for(const G of Wi(L,Y.fieldPath))switch(G.op){case"array-contains-any":return G.value.arrayValue.values||[];case"array-contains":return[G.value]}return null}(h,u),m=function(L,$){const Y=new Map;for(const G of un($))for(const T of Wi(L,G.fieldPath))switch(T.op){case"==":case"in":Y.set(G.fieldPath.canonicalString(),T.value);break;case"not-in":case"!=":return Y.set(G.fieldPath.canonicalString(),T.value),Array.from(Y.values())}return null}(h,u),_=function(L,$){const Y=[];let G=!0;for(const T of un($)){const g=T.kind===0?Ch(L,T.fieldPath,L.startAt):kh(L,T.fieldPath,L.startAt);Y.push(g.value),G&&(G=g.inclusive)}return new cr(Y,G)}(h,u),R=function(L,$){const Y=[];let G=!0;for(const T of un($)){const g=T.kind===0?kh(L,T.fieldPath,L.endAt):Ch(L,T.fieldPath,L.endAt);Y.push(g.value),G&&(G=g.inclusive)}return new cr(Y,G)}(h,u),C=this.Rn(u,h,_),V=this.Rn(u,h,R),k=this.Vn(u,h,m),j=this.mn(u.indexId,f,C,_.inclusive,V,R.inclusive,k);return w.forEach(j,B=>n.H(B,t.limit).next(L=>{L.forEach($=>{const Y=O.fromSegments($.documentKey);o.has(Y)||(o=o.add(Y),c.push(Y))})}))}).next(()=>c)}return w.resolve(null)})}dn(e){let t=this.En.get(e);return t||(e.filters.length===0?t=[e]:t=Av(ee.create(e.filters,"and")).map(n=>Ya(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt)),this.En.set(e,t),t)}mn(e,t,n,s,i,o,c){const u=(t!=null?t.length:1)*Math.max(n.length,i.length),h=u/(t!=null?t.length:1),f=[];for(let m=0;m<u;++m){const _=t?this.fn(t[m/h]):hi,R=this.gn(e,_,n[m%h],s),C=this.pn(e,_,i[m%h],o),V=c.map(k=>this.gn(e,_,k,!0));f.push(...this.createRange(R,C,V))}return f}gn(e,t,n,s){const i=new pn(e,O.empty(),t,n);return s?i:i.nn()}pn(e,t,n,s){const i=new pn(e,O.empty(),t,n);return s?i.nn():i}An(e,t){const n=new Wh(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next(i=>{let o=null;for(const c of i)n.un(c)&&(!o||c.fields.length>o.fields.length)&&(o=c);return o})}getIndexType(e,t){let n=2;const s=this.dn(t);return w.forEach(s,i=>this.An(e,i).next(o=>{o?n!==0&&o.fields.length<function(u){let h=new te(ae.comparator),f=!1;for(const m of u.filters)for(const _ of m.getFlattenedFilters())_.field.isKeyField()||(_.op==="array-contains"||_.op==="array-contains-any"?f=!0:h=h.add(_.field));for(const m of u.orderBy)m.field.isKeyField()||(h=h.add(m.field));return h.size+(f?1:0)}(i)&&(n=1):n=0})).next(()=>function(o){return o.limit!==null}(t)&&s.length>1&&n===2?1:n)}yn(e,t){const n=new Kr;for(const s of un(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.tn(s.kind);fn.xt.At(i,o)}return n.Yt()}fn(e){const t=new Kr;return fn.xt.At(e,t.tn(0)),t.Yt()}wn(e,t){const n=new Kr;return fn.xt.At(vs(this.databaseId,t),n.tn(function(i){const o=un(i);return o.length===0?0:o[o.length-1].kind}(e))),n.Yt()}Vn(e,t,n){if(n===null)return[];let s=[];s.push(new Kr);let i=0;for(const o of un(e)){const c=n[i++];for(const u of s)if(this.bn(t,o.fieldPath)&&ws(c))s=this.Sn(s,o,c);else{const h=u.tn(o.kind);fn.xt.At(c,h)}}return this.Dn(s)}Rn(e,t,n){return this.Vn(e,t,n.position)}Dn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].Yt();return t}Sn(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const c of s){const u=new Kr;u.seed(c.Yt()),fn.xt.At(o,u.tn(t.kind)),i.push(u)}return i}bn(e,t){return!!e.filters.find(n=>n instanceof Q&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in"))}getFieldIndexes(e,t){const n=Gr(e),s=$n(e);return(t?n.G($a,IDBKeyRange.bound(t,t)):n.G()).next(i=>{const o=[];return w.forEach(i,c=>s.get([c.indexId,this.uid]).next(u=>{o.push(function(f,m){const _=m?new ms(m.sequenceNumber,new Ge(Cn(m.readTime),new O(tt(m.documentKey)),m.largestBatchId)):ms.empty(),R=f.fields.map(([C,V])=>new vi(ae.fromServerFormat(C),V));return new Bi(f.indexId,f.collectionGroup,R,_)}(c,u))})).next(()=>o)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(t=>t.length===0?null:(t.sort((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:K(n.collectionGroup,s.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(e,t,n){const s=Gr(e),i=$n(e);return this.vn(e).next(o=>s.G($a,IDBKeyRange.bound(t,t)).next(c=>w.forEach(c,u=>i.put($h(u.indexId,this.uid,o,n)))))}updateIndexEntries(e,t){const n=new Map;return w.forEach(t,(s,i)=>{const o=n.get(s.collectionGroup);return(o?w.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next(c=>(n.set(s.collectionGroup,c),w.forEach(c,u=>this.Cn(e,s,u).next(h=>{const f=this.Fn(i,u);return h.isEqual(f)?w.resolve():this.Mn(e,i,u,h,f)}))))})}xn(e,t,n,s){return jn(e).put({indexId:s.indexId,uid:this.uid,arrayValue:s.arrayValue,directionalValue:s.directionalValue,orderedDocumentKey:this.wn(n,t.key),documentKey:t.key.path.toArray()})}On(e,t,n,s){return jn(e).delete([s.indexId,this.uid,s.arrayValue,s.directionalValue,this.wn(n,t.key),t.key.path.toArray()])}Cn(e,t,n){const s=jn(e);let i=new te(Vt);return s.Z({index:Yf,range:IDBKeyRange.only([n.indexId,this.uid,this.wn(n,t)])},(o,c)=>{i=i.add(new pn(n.indexId,t,c.arrayValue,c.directionalValue))}).next(()=>i)}Fn(e,t){let n=new te(Vt);const s=this.yn(t,e);if(s==null)return n;const i=qa(t);if(i!=null){const o=e.data.field(i.fieldPath);if(ws(o))for(const c of o.arrayValue.values||[])n=n.add(new pn(t.indexId,e.key,this.fn(c),s))}else n=n.add(new pn(t.indexId,e.key,hi,s));return n}Mn(e,t,n,s,i){D(Yh,"Updating index entries for document '%s'",t.key);const o=[];return function(u,h,f,m,_){const R=u.getIterator(),C=h.getIterator();let V=Bn(R),k=Bn(C);for(;V||k;){let j=!1,B=!1;if(V&&k){const L=f(V,k);L<0?B=!0:L>0&&(j=!0)}else V!=null?B=!0:j=!0;j?(m(k),k=Bn(C)):B?(_(V),V=Bn(R)):(V=Bn(R),k=Bn(C))}}(s,i,Vt,c=>{o.push(this.xn(e,t,n,c))},c=>{o.push(this.On(e,t,n,c))}),w.waitFor(o)}vn(e){let t=1;return $n(e).Z({index:Qf,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(n,s,i)=>{i.done(),t=s.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((o,c)=>Vt(o,c)).filter((o,c,u)=>!c||Vt(o,u[c-1])!==0);const s=[];s.push(e);for(const o of n){const c=Vt(o,e),u=Vt(o,t);if(c===0)s[0]=e.nn();else if(c>0&&u<0)s.push(o),s.push(o.nn());else if(u>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.Nn(s[o],s[o+1]))return[];const c=[s[o].indexId,this.uid,s[o].arrayValue,s[o].directionalValue,hi,[]],u=[s[o+1].indexId,this.uid,s[o+1].arrayValue,s[o+1].directionalValue,hi,[]];i.push(IDBKeyRange.bound(c,u))}return i}Nn(e,t){return Vt(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Xh)}getMinOffset(e,t){return w.mapArray(this.dn(t),n=>this.An(e,n).next(s=>s||M())).next(Xh)}}function Jh(r){return _e(r,Is)}function jn(r){return _e(r,Ki)}function Gr(r){return _e(r,Vc)}function $n(r){return _e(r,zi)}function Xh(r){U(r.length!==0);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;Cc(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new Ge(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zh={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},em=41943040;class Se{static withCacheSize(e){return new Se(e,Se.DEFAULT_COLLECTION_PERCENTILE,Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tm(r,e,t){const n=r.store(Ye),s=r.store(nr),i=[],o=IDBKeyRange.only(t.batchId);let c=0;const u=n.Z({range:o},(f,m,_)=>(c++,_.delete()));i.push(u.next(()=>{U(c===1)}));const h=[];for(const f of t.mutations){const m=Gf(e,f.key.path,t.batchId);i.push(s.delete(m)),h.push(f.key)}return w.waitFor(i).next(()=>h)}function eo(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw M();e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Se.DEFAULT_COLLECTION_PERCENTILE=10,Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Se.DEFAULT=new Se(em,Se.DEFAULT_COLLECTION_PERCENTILE,Se.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Se.DISABLED=new Se(-1,0,0);class Co{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.Bn={}}static It(e,t,n,s){U(e.uid!=="");const i=e.isAuthenticated()?e.uid:"";return new Co(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Nt(e).Z({index:gn,range:n},(s,i,o)=>{t=!1,o.done()}).next(()=>t)}addMutationBatch(e,t,n,s){const i=Qn(e),o=Nt(e);return o.add({}).next(c=>{U(typeof c=="number");const u=new qc(c,t,n,s),h=function(R,C,V){const k=V.baseMutations.map(B=>Ji(R.Tt,B)),j=V.mutations.map(B=>Ji(R.Tt,B));return{userId:C,batchId:V.batchId,localWriteTimeMs:V.localWriteTime.toMillis(),baseMutations:k,mutations:j}}(this.serializer,this.userId,u),f=[];let m=new te((_,R)=>K(_.canonicalString(),R.canonicalString()));for(const _ of s){const R=Gf(this.userId,_.key.path,c);m=m.add(_.key.path.popLast()),f.push(o.put(h)),f.push(i.put(R,sE))}return m.forEach(_=>{f.push(this.indexManager.addToCollectionParentIndex(e,_))}),e.addOnCommittedListener(()=>{this.Bn[c]=u.keys()}),w.waitFor(f).next(()=>u)})}lookupMutationBatch(e,t){return Nt(e).get(t).next(n=>n?(U(n.userId===this.userId),dn(this.serializer,n)):null)}Ln(e,t){return this.Bn[t]?w.resolve(this.Bn[t]):this.lookupMutationBatch(e,t).next(n=>{if(n){const s=n.keys();return this.Bn[t]=s,s}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Nt(e).Z({index:gn,range:s},(o,c,u)=>{c.userId===this.userId&&(U(c.batchId>=n),i=dn(this.serializer,c)),u.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=_n;return Nt(e).Z({index:gn,range:t,reverse:!0},(s,i,o)=>{n=i.batchId,o.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,_n],[this.userId,Number.POSITIVE_INFINITY]);return Nt(e).G(gn,t).next(n=>n.map(s=>dn(this.serializer,s)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=wi(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return Qn(e).Z({range:s},(o,c,u)=>{const[h,f,m]=o,_=tt(f);if(h===this.userId&&t.path.isEqual(_))return Nt(e).get(m).next(R=>{if(!R)throw M();U(R.userId===this.userId),i.push(dn(this.serializer,R))});u.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new te(K);const s=[];return t.forEach(i=>{const o=wi(this.userId,i.path),c=IDBKeyRange.lowerBound(o),u=Qn(e).Z({range:c},(h,f,m)=>{const[_,R,C]=h,V=tt(R);_===this.userId&&i.path.isEqual(V)?n=n.add(C):m.done()});s.push(u)}),w.waitFor(s).next(()=>this.kn(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=wi(this.userId,n),o=IDBKeyRange.lowerBound(i);let c=new te(K);return Qn(e).Z({range:o},(u,h,f)=>{const[m,_,R]=u,C=tt(_);m===this.userId&&n.isPrefixOf(C)?C.length===s&&(c=c.add(R)):f.done()}).next(()=>this.kn(e,c))}kn(e,t){const n=[],s=[];return t.forEach(i=>{s.push(Nt(e).get(i).next(o=>{if(o===null)throw M();U(o.userId===this.userId),n.push(dn(this.serializer,o))}))}),w.waitFor(s).next(()=>n)}removeMutationBatch(e,t){return tm(e.ue,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.qn(t.batchId)}),w.forEach(n,s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))}qn(e){delete this.Bn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return w.resolve();const n=IDBKeyRange.lowerBound(function(o){return[o]}(this.userId)),s=[];return Qn(e).Z({range:n},(i,o,c)=>{if(i[0]===this.userId){const u=tt(i[1]);s.push(u)}else c.done()}).next(()=>{U(s.length===0)})})}containsKey(e,t){return nm(e,this.userId,t)}Qn(e){return rm(e).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:_n,lastStreamToken:""})}}function nm(r,e,t){const n=wi(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return Qn(r).Z({range:i,Y:!0},(c,u,h)=>{const[f,m,_]=c;f===e&&m===s&&(o=!0),h.done()}).next(()=>o)}function Nt(r){return _e(r,Ye)}function Qn(r){return _e(r,nr)}function rm(r){return _e(r,_s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(e){this.$n=e}next(){return this.$n+=2,this.$n}static Kn(){return new kn(0)}static Un(){return new kn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sv{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.Wn(e).next(t=>{const n=new kn(t.highestTargetId);return t.highestTargetId=n.next(),this.Gn(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.Wn(e).next(t=>q.fromTimestamp(new ce(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.Wn(e).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.Wn(e).next(s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.Gn(e,s)))}addTargetData(e,t){return this.zn(e,t).next(()=>this.Wn(e).next(n=>(n.targetCount+=1,this.jn(t,n),this.Gn(e,n))))}updateTargetData(e,t){return this.zn(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>zn(e).delete(t.targetId)).next(()=>this.Wn(e)).next(n=>(U(n.targetCount>0),n.targetCount-=1,this.Gn(e,n)))}removeTargets(e,t,n){let s=0;const i=[];return zn(e).Z((o,c)=>{const u=ts(c);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(e,u)))}).next(()=>w.waitFor(i)).next(()=>s)}forEachTarget(e,t){return zn(e).Z((n,s)=>{const i=ts(s);t(i)})}Wn(e){return ed(e).get($i).next(t=>(U(t!==null),t))}Gn(e,t){return ed(e).put($i,t)}zn(e,t){return zn(e).put(Yp(this.serializer,t))}jn(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.Wn(e).next(t=>t.targetCount)}getTargetData(e,t){const n=Sn(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return zn(e).Z({range:s,index:Wf},(o,c,u)=>{const h=ts(c);Os(t,h.target)&&(i=h,u.done())}).next(()=>i)}addMatchingKeys(e,t,n){const s=[],i=Ut(e);return t.forEach(o=>{const c=ke(o.path);s.push(i.put({targetId:n,path:c})),s.push(this.referenceDelegate.addReference(e,n,o))}),w.waitFor(s)}removeMatchingKeys(e,t,n){const s=Ut(e);return w.forEach(t,i=>{const o=ke(i.path);return w.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])})}removeMatchingKeysForTargetId(e,t){const n=Ut(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=Ut(e);let i=H();return s.Z({range:n,Y:!0},(o,c,u)=>{const h=tt(o[1]),f=new O(h);i=i.add(f)}).next(()=>i)}containsKey(e,t){const n=ke(t.path),s=IDBKeyRange.bound([n],[Uf(n)],!1,!0);let i=0;return Ut(e).Z({index:Dc,Y:!0,range:s},([o,c],u,h)=>{o!==0&&(i++,h.done())}).next(()=>i>0)}lt(e,t){return zn(e).get(t).next(n=>n?ts(n):null)}}function zn(r){return _e(r,rr)}function ed(r){return _e(r,yn)}function Ut(r){return _e(r,sr)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const td="LruGarbageCollector",Pv=1048576;function nd([r,e],[t,n]){const s=K(r,t);return s===0?K(e,n):s}class Cv{constructor(e){this.Hn=e,this.buffer=new te(nd),this.Jn=0}Yn(){return++this.Jn}Zn(e){const t=[e,this.Yn()];if(this.buffer.size<this.Hn)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();nd(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class sm{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Xn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.er(6e4)}stop(){this.Xn&&(this.Xn.cancel(),this.Xn=null)}get started(){return this.Xn!==null}er(e){D(td,`Garbage collection scheduled in ${e}ms`),this.Xn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Xn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Zt(t)?D(td,"Ignoring IndexedDB error during garbage collection: ",t):await Xt(t)}await this.er(3e5)})}}class kv{constructor(e,t){this.tr=e,this.params=t}calculateTargetCount(e,t){return this.tr.nr(e).next(n=>Math.floor(t/100*n))}nthSequenceNumber(e,t){if(t===0)return w.resolve(Fe.ae);const n=new Cv(t);return this.tr.forEachTarget(e,s=>n.Zn(s.sequenceNumber)).next(()=>this.tr.rr(e,s=>n.Zn(s))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.tr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.tr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(D("LruGarbageCollector","Garbage collection skipped; disabled"),w.resolve(Zh)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(D("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Zh):this.ir(e,t))}getCacheSize(e){return this.tr.getCacheSize(e)}ir(e,t){let n,s,i,o,c,u,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(m=>(m>this.params.maximumSequenceNumbersToCollect?(D("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,o=Date.now(),this.nthSequenceNumber(e,s))).next(m=>(n=m,c=Date.now(),this.removeTargets(e,n,t))).next(m=>(i=m,u=Date.now(),this.removeOrphanedDocuments(e,n))).next(m=>(h=Date.now(),Kn()<=W.DEBUG&&D("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${s} in `+(c-o)+`ms
	Removed ${i} targets in `+(u-c)+`ms
	Removed ${m} documents in `+(h-u)+`ms
Total Duration: ${h-f}ms`),w.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:m})))}}function im(r,e){return new kv(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dv{constructor(e,t){this.db=e,this.garbageCollector=im(this,t)}nr(e){const t=this.sr(e);return this.db.getTargetCache().getTargetCount(e).next(n=>t.next(s=>n+s))}sr(e){let t=0;return this.rr(e,n=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}rr(e,t){return this._r(e,(n,s)=>t(s))}addReference(e,t,n){return di(e,n)}removeReference(e,t,n){return di(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return di(e,t)}ar(e,t){return function(s,i){let o=!1;return rm(s).X(c=>nm(s,c,i).next(u=>(u&&(o=!0),w.resolve(!u)))).next(()=>o)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this._r(e,(o,c)=>{if(c<=t){const u=this.ar(e,o).next(h=>{if(!h)return i++,n.getEntry(e,o).next(()=>(n.removeEntry(o,q.min()),Ut(e).delete(function(m){return[0,ke(m.path)]}(o))))});s.push(u)}}).next(()=>w.waitFor(s)).next(()=>n.apply(e)).next(()=>i)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return di(e,t)}_r(e,t){const n=Ut(e);let s,i=Fe.ae;return n.Z({index:Dc},([o,c],{path:u,sequenceNumber:h})=>{o===0?(i!==Fe.ae&&t(new O(tt(s)),i),i=h,s=u):i=Fe.ae}).next(()=>{i!==Fe.ae&&t(new O(tt(s)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function di(r,e){return Ut(r).put(function(n,s){return{targetId:0,path:ke(n.path),sequenceNumber:s}}(e,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class om{constructor(){this.changes=new At(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,le.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?w.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vv{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return an(e).put(n)}removeEntry(e,t,n){return an(e).delete(function(i,o){const c=i.path.toArray();return[c.slice(0,c.length-2),c[c.length-2],Xi(o),c[c.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.ur(e,n)))}getEntry(e,t){let n=le.newInvalidDocument(t);return an(e).Z({index:Ai,range:IDBKeyRange.only(Hr(t))},(s,i)=>{n=this.cr(t,i)}).next(()=>n)}lr(e,t){let n={size:0,document:le.newInvalidDocument(t)};return an(e).Z({index:Ai,range:IDBKeyRange.only(Hr(t))},(s,i)=>{n={document:this.cr(t,i),size:eo(i)}}).next(()=>n)}getEntries(e,t){let n=$e();return this.hr(e,t,(s,i)=>{const o=this.cr(s,i);n=n.insert(s,o)}).next(()=>n)}Pr(e,t){let n=$e(),s=new se(O.comparator);return this.hr(e,t,(i,o)=>{const c=this.cr(i,o);n=n.insert(i,c),s=s.insert(i,eo(o))}).next(()=>({documents:n,Tr:s}))}hr(e,t,n){if(t.isEmpty())return w.resolve();let s=new te(id);t.forEach(u=>s=s.add(u));const i=IDBKeyRange.bound(Hr(s.first()),Hr(s.last())),o=s.getIterator();let c=o.getNext();return an(e).Z({index:Ai,range:i},(u,h,f)=>{const m=O.fromSegments([...h.prefixPath,h.collectionGroup,h.documentId]);for(;c&&id(c,m)<0;)n(c,null),c=o.getNext();c&&c.isEqual(m)&&(n(c,h),c=o.hasNext()?o.getNext():null),c?f.W(Hr(c)):f.done()}).next(()=>{for(;c;)n(c,null),c=o.hasNext()?o.getNext():null})}getDocumentsMatchingQuery(e,t,n,s,i){const o=t.path,c=[o.popLast().toArray(),o.lastSegment(),Xi(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return an(e).G(IDBKeyRange.bound(c,u,!0)).next(h=>{i==null||i.incrementDocumentReadCount(h.length);let f=$e();for(const m of h){const _=this.cr(O.fromSegments(m.prefixPath.concat(m.collectionGroup,m.documentId)),m);_.isFoundDocument()&&(Ms(t,_)||s.has(_.key))&&(f=f.insert(_.key,_))}return f})}getAllFromCollectionGroup(e,t,n,s){let i=$e();const o=sd(t,n),c=sd(t,Ge.max());return an(e).Z({index:Hf,range:IDBKeyRange.bound(o,c,!0)},(u,h,f)=>{const m=this.cr(O.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);i=i.insert(m.key,m),i.size===s&&f.done()}).next(()=>i)}newChangeBuffer(e){return new Nv(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(t=>t.byteSize)}getMetadata(e){return rd(e).get(ja).next(t=>(U(!!t),t))}ur(e,t){return rd(e).put(ja,t)}cr(e,t){if(t){const n=_v(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(q.min())))return n}return le.newInvalidDocument(e)}}function am(r){return new Vv(r)}class Nv extends om{constructor(e,t){super(),this.Ir=e,this.trackRemovals=t,this.Er=new At(n=>n.toString(),(n,s)=>n.isEqual(s))}applyChanges(e){const t=[];let n=0,s=new te((i,o)=>K(i.canonicalString(),o.canonicalString()));return this.changes.forEach((i,o)=>{const c=this.Er.get(i);if(t.push(this.Ir.removeEntry(e,i,c.readTime)),o.isValidDocument()){const u=qh(this.Ir.serializer,o);s=s.add(i.path.popLast());const h=eo(u);n+=h-c.size,t.push(this.Ir.addEntry(e,i,u))}else if(n-=c.size,this.trackRemovals){const u=qh(this.Ir.serializer,o.convertToNoDocument(q.min()));t.push(this.Ir.addEntry(e,i,u))}}),s.forEach(i=>{t.push(this.Ir.indexManager.addToCollectionParentIndex(e,i))}),t.push(this.Ir.updateMetadata(e,n)),w.waitFor(t)}getFromCache(e,t){return this.Ir.lr(e,t).next(n=>(this.Er.set(t,{size:n.size,readTime:n.document.readTime}),n.document))}getAllFromCache(e,t){return this.Ir.Pr(e,t).next(({documents:n,Tr:s})=>(s.forEach((i,o)=>{this.Er.set(i,{size:o,readTime:n.get(i).readTime})}),n))}}function rd(r){return _e(r,ys)}function an(r){return _e(r,ji)}function Hr(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function sd(r,e){const t=e.documentKey.path.toArray();return[r,Xi(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function id(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=K(t[i],n[i]),s)return s;return s=K(t.length,n.length),s||(s=K(t[t.length-2],n[n.length-2]),s||K(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xv{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cm{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(n=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(n!==null&&us(n.mutation,s,Ue.empty(),ce.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.getLocalViewOfDocuments(e,n,H()).next(()=>n))}getLocalViewOfDocuments(e,t,n=H()){const s=nt();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,n).next(i=>{let o=Zr();return i.forEach((c,u)=>{o=o.insert(c,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const n=nt();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,H()))}populateOverlays(e,t,n){const s=[];return n.forEach(i=>{t.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((o,c)=>{t.set(o,c)})})}computeViews(e,t,n,s){let i=$e();const o=cs(),c=function(){return cs()}();return t.forEach((u,h)=>{const f=n.get(h.key);s.has(h.key)&&(f===void 0||f.mutation instanceof Rt)?i=i.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),us(f.mutation,h,f.mutation.getFieldMask(),ce.now())):o.set(h.key,Ue.empty())}),this.recalculateAndSaveOverlays(e,i).next(u=>(u.forEach((h,f)=>o.set(h,f)),t.forEach((h,f)=>{var m;return c.set(h,new xv(f,(m=o.get(h))!==null&&m!==void 0?m:null))}),c))}recalculateAndSaveOverlays(e,t){const n=cs();let s=new se((o,c)=>o-c),i=H();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const c of o)c.keys().forEach(u=>{const h=t.get(u);if(h===null)return;let f=n.get(u)||Ue.empty();f=c.applyToLocalView(h,f),n.set(u,f);const m=(s.get(c.batchId)||H()).add(u);s=s.insert(c.batchId,m)})}).next(()=>{const o=[],c=s.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),h=u.key,f=u.value,m=Rp();f.forEach(_=>{if(!i.has(_)){const R=Vp(t.get(_),n.get(_));R!==null&&m.set(_,R),i=i.add(_)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,m))}return w.waitFor(o)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.recalculateAndSaveOverlays(e,n))}getDocumentsMatchingQuery(e,t,n,s){return function(o){return O.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Ip(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next(i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):w.resolve(nt());let c=tr,u=i;return o.next(h=>w.forEach(h,(f,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),i.get(f)?w.resolve():this.remoteDocumentCache.getEntry(e,f).next(_=>{u=u.insert(f,_)}))).next(()=>this.populateOverlays(e,h,i)).next(()=>this.computeViews(e,u,h,H())).next(f=>({batchId:c,changes:Ap(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new O(t)).next(n=>{let s=Zr();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=Zr();return this.indexManager.getCollectionParents(e,i).next(c=>w.forEach(c,u=>{const h=function(m,_){return new vr(_,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,n,s).next(f=>{f.forEach((m,_)=>{o=o.insert(m,_)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s))).next(o=>{i.forEach((u,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,le.newInvalidDocument(f)))});let c=Zr();return o.forEach((u,h)=>{const f=i.get(u);f!==void 0&&us(f.mutation,h,Ue.empty(),ce.now()),Ms(t,h)&&(c=c.insert(u,h))}),c})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ov{constructor(e){this.serializer=e,this.dr=new Map,this.Ar=new Map}getBundleMetadata(e,t){return w.resolve(this.dr.get(t))}saveBundleMetadata(e,t){return this.dr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Le(s.createTime)}}(t)),w.resolve()}getNamedQuery(e,t){return w.resolve(this.Ar.get(t))}saveNamedQuery(e,t){return this.Ar.set(t.name,function(s){return{name:s.name,query:Jp(s.bundledQuery),readTime:Le(s.readTime)}}(t)),w.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lv{constructor(){this.overlays=new se(O.comparator),this.Rr=new Map}getOverlay(e,t){return w.resolve(this.overlays.get(t))}getOverlays(e,t){const n=nt();return w.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((s,i)=>{this.Et(e,t,i)}),w.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Rr.get(n);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Rr.delete(n)),w.resolve()}getOverlaysForCollection(e,t,n){const s=nt(),i=t.length+1,o=new O(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){const u=c.getNext().value,h=u.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return w.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new se((h,f)=>h-f);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>n){let f=i.get(h.largestBatchId);f===null&&(f=nt(),i=i.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const c=nt(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((h,f)=>c.set(h,f)),!(c.size()>=s)););return w.resolve(c)}Et(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Rr.get(s.largestBatchId).delete(n.key);this.Rr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new $c(t,n));let i=this.Rr.get(t);i===void 0&&(i=H(),this.Rr.set(t,i)),this.Rr.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mv{constructor(){this.sessionToken=pe.EMPTY_BYTE_STRING}getSessionToken(e){return w.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,w.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wc{constructor(){this.Vr=new te(ye.mr),this.gr=new te(ye.pr)}isEmpty(){return this.Vr.isEmpty()}addReference(e,t){const n=new ye(e,t);this.Vr=this.Vr.add(n),this.gr=this.gr.add(n)}yr(e,t){e.forEach(n=>this.addReference(n,t))}removeReference(e,t){this.wr(new ye(e,t))}br(e,t){e.forEach(n=>this.removeReference(n,t))}Sr(e){const t=new O(new Z([])),n=new ye(t,e),s=new ye(t,e+1),i=[];return this.gr.forEachInRange([n,s],o=>{this.wr(o),i.push(o.key)}),i}Dr(){this.Vr.forEach(e=>this.wr(e))}wr(e){this.Vr=this.Vr.delete(e),this.gr=this.gr.delete(e)}vr(e){const t=new O(new Z([])),n=new ye(t,e),s=new ye(t,e+1);let i=H();return this.gr.forEachInRange([n,s],o=>{i=i.add(o.key)}),i}containsKey(e){const t=new ye(e,0),n=this.Vr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class ye{constructor(e,t){this.key=e,this.Cr=t}static mr(e,t){return O.comparator(e.key,t.key)||K(e.Cr,t.Cr)}static pr(e,t){return K(e.Cr,t.Cr)||O.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fv{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Fr=1,this.Mr=new te(ye.mr)}checkEmpty(e){return w.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Fr;this.Fr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new qc(i,t,n,s);this.mutationQueue.push(o);for(const c of s)this.Mr=this.Mr.add(new ye(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return w.resolve(o)}lookupMutationBatch(e,t){return w.resolve(this.Or(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.Nr(n),i=s<0?0:s;return w.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return w.resolve(this.mutationQueue.length===0?_n:this.Fr-1)}getAllMutationBatches(e){return w.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new ye(t,0),s=new ye(t,Number.POSITIVE_INFINITY),i=[];return this.Mr.forEachInRange([n,s],o=>{const c=this.Or(o.Cr);i.push(c)}),w.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new te(K);return t.forEach(s=>{const i=new ye(s,0),o=new ye(s,Number.POSITIVE_INFINITY);this.Mr.forEachInRange([i,o],c=>{n=n.add(c.Cr)})}),w.resolve(this.Br(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;O.isDocumentKey(i)||(i=i.child(""));const o=new ye(new O(i),0);let c=new te(K);return this.Mr.forEachWhile(u=>{const h=u.key.path;return!!n.isPrefixOf(h)&&(h.length===s&&(c=c.add(u.Cr)),!0)},o),w.resolve(this.Br(c))}Br(e){const t=[];return e.forEach(n=>{const s=this.Or(n);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){U(this.Lr(t.batchId,"removed")===0),this.mutationQueue.shift();let n=this.Mr;return w.forEach(t.mutations,s=>{const i=new ye(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.Mr=n})}qn(e){}containsKey(e,t){const n=new ye(t,0),s=this.Mr.firstAfterOrEqual(n);return w.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,w.resolve()}Lr(e,t){return this.Nr(e)}Nr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Or(e){const t=this.Nr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uv{constructor(e){this.kr=e,this.docs=function(){return new se(O.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.kr(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return w.resolve(n?n.document.mutableCopy():le.newInvalidDocument(t))}getEntries(e,t){let n=$e();return t.forEach(s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():le.newInvalidDocument(s))}),w.resolve(n)}getDocumentsMatchingQuery(e,t,n,s){let i=$e();const o=t.path,c=new O(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(c);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||Cc(qf(f),n)<=0||(s.has(f.key)||Ms(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return w.resolve(i)}getAllFromCollectionGroup(e,t,n,s){M()}qr(e,t){return w.forEach(this.docs,n=>t(n))}newChangeBuffer(e){return new Bv(this)}getSize(e){return w.resolve(this.size)}}class Bv extends om{constructor(e){super(),this.Ir=e}applyChanges(e){const t=[];return this.changes.forEach((n,s)=>{s.isValidDocument()?t.push(this.Ir.addEntry(e,s)):this.Ir.removeEntry(n)}),w.waitFor(t)}getFromCache(e,t){return this.Ir.getEntry(e,t)}getAllFromCache(e,t){return this.Ir.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qv{constructor(e){this.persistence=e,this.Qr=new At(t=>Sn(t),Os),this.lastRemoteSnapshotVersion=q.min(),this.highestTargetId=0,this.$r=0,this.Kr=new Wc,this.targetCount=0,this.Ur=kn.Kn()}forEachTarget(e,t){return this.Qr.forEach((n,s)=>t(s)),w.resolve()}getLastRemoteSnapshotVersion(e){return w.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return w.resolve(this.$r)}allocateTargetId(e){return this.highestTargetId=this.Ur.next(),w.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.$r&&(this.$r=t),w.resolve()}zn(e){this.Qr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.Ur=new kn(t),this.highestTargetId=t),e.sequenceNumber>this.$r&&(this.$r=e.sequenceNumber)}addTargetData(e,t){return this.zn(t),this.targetCount+=1,w.resolve()}updateTargetData(e,t){return this.zn(t),w.resolve()}removeTargetData(e,t){return this.Qr.delete(t.target),this.Kr.Sr(t.targetId),this.targetCount-=1,w.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.Qr.forEach((o,c)=>{c.sequenceNumber<=t&&n.get(c.targetId)===null&&(this.Qr.delete(o),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)}),w.waitFor(i).next(()=>s)}getTargetCount(e){return w.resolve(this.targetCount)}getTargetData(e,t){const n=this.Qr.get(t)||null;return w.resolve(n)}addMatchingKeys(e,t,n){return this.Kr.yr(t,n),w.resolve()}removeMatchingKeys(e,t,n){this.Kr.br(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach(o=>{i.push(s.markPotentiallyOrphaned(e,o))}),w.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Kr.Sr(t),w.resolve()}getMatchingKeysForTargetId(e,t){const n=this.Kr.vr(t);return w.resolve(n)}containsKey(e,t){return w.resolve(this.Kr.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qc{constructor(e,t){this.Wr={},this.overlays={},this.Gr=new Fe(0),this.zr=!1,this.zr=!0,this.jr=new Mv,this.referenceDelegate=e(this),this.Hr=new qv(this),this.indexManager=new Rv,this.remoteDocumentCache=function(s){return new Uv(s)}(n=>this.referenceDelegate.Jr(n)),this.serializer=new Qp(t),this.Yr=new Ov(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.zr=!1,Promise.resolve()}get started(){return this.zr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Lv,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.Wr[e.toKey()];return n||(n=new Fv(t,this.referenceDelegate),this.Wr[e.toKey()]=n),n}getGlobalsCache(){return this.jr}getTargetCache(){return this.Hr}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Yr}runTransaction(e,t,n){D("MemoryPersistence","Starting transaction:",e);const s=new jv(this.Gr.next());return this.referenceDelegate.Zr(),n(s).next(i=>this.referenceDelegate.Xr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}ei(e,t){return w.or(Object.values(this.Wr).map(n=>()=>n.containsKey(e,t)))}}class jv extends $f{constructor(e){super(),this.currentSequenceNumber=e}}class ko{constructor(e){this.persistence=e,this.ti=new Wc,this.ni=null}static ri(e){return new ko(e)}get ii(){if(this.ni)return this.ni;throw M()}addReference(e,t,n){return this.ti.addReference(n,t),this.ii.delete(n.toString()),w.resolve()}removeReference(e,t,n){return this.ti.removeReference(n,t),this.ii.add(n.toString()),w.resolve()}markPotentiallyOrphaned(e,t){return this.ii.add(t.toString()),w.resolve()}removeTarget(e,t){this.ti.Sr(t.targetId).forEach(s=>this.ii.add(s.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(i=>this.ii.add(i.toString()))}).next(()=>n.removeTargetData(e,t))}Zr(){this.ni=new Set}Xr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return w.forEach(this.ii,n=>{const s=O.fromPath(n);return this.si(e,s).next(i=>{i||t.removeEntry(s,q.min())})}).next(()=>(this.ni=null,t.apply(e)))}updateLimboDocument(e,t){return this.si(e,t).next(n=>{n?this.ii.delete(t.toString()):this.ii.add(t.toString())})}Jr(e){return 0}si(e,t){return w.or([()=>w.resolve(this.ti.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.ei(e,t)])}}class to{constructor(e,t){this.persistence=e,this.oi=new At(n=>ke(n.path),(n,s)=>n.isEqual(s)),this.garbageCollector=im(this,t)}static ri(e,t){return new to(e,t)}Zr(){}Xr(e){return w.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}nr(e){const t=this.sr(e);return this.persistence.getTargetCache().getTargetCount(e).next(n=>t.next(s=>n+s))}sr(e){let t=0;return this.rr(e,n=>{t++}).next(()=>t)}rr(e,t){return w.forEach(this.oi,(n,s)=>this.ar(e,n,s).next(i=>i?w.resolve():t(s)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.qr(e,o=>this.ar(e,o,t).next(c=>{c||(n++,i.removeEntry(o,q.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.oi.set(t,e.currentSequenceNumber),w.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.oi.set(n,e.currentSequenceNumber),w.resolve()}removeReference(e,t,n){return this.oi.set(n,e.currentSequenceNumber),w.resolve()}updateLimboDocument(e,t){return this.oi.set(t,e.currentSequenceNumber),w.resolve()}Jr(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=bi(e.data.value)),t}ar(e,t,n){return w.or([()=>this.persistence.ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.oi.get(t);return w.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $v{constructor(e){this.serializer=e}B(e,t,n,s){const i=new _o("createOrUpgrade",t);n<1&&s>=1&&(function(u){u.createObjectStore(xs)}(e),function(u){u.createObjectStore(_s,{keyPath:rE}),u.createObjectStore(Ye,{keyPath:_h,autoIncrement:!0}).createIndex(gn,yh,{unique:!0}),u.createObjectStore(nr)}(e),od(e),function(u){u.createObjectStore(ln)}(e));let o=w.resolve();return n<3&&s>=3&&(n!==0&&(function(u){u.deleteObjectStore(sr),u.deleteObjectStore(rr),u.deleteObjectStore(yn)}(e),od(e)),o=o.next(()=>function(u){const h=u.store(yn),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:q.min().toTimestamp(),targetCount:0};return h.put($i,f)}(i))),n<4&&s>=4&&(n!==0&&(o=o.next(()=>function(u,h){return h.store(Ye).G().next(m=>{u.deleteObjectStore(Ye),u.createObjectStore(Ye,{keyPath:_h,autoIncrement:!0}).createIndex(gn,yh,{unique:!0});const _=h.store(Ye),R=m.map(C=>_.put(C));return w.waitFor(R)})}(e,i))),o=o.next(()=>{(function(u){u.createObjectStore(ir,{keyPath:dE})})(e)})),n<5&&s>=5&&(o=o.next(()=>this._i(i))),n<6&&s>=6&&(o=o.next(()=>(function(u){u.createObjectStore(ys)}(e),this.ai(i)))),n<7&&s>=7&&(o=o.next(()=>this.ui(i))),n<8&&s>=8&&(o=o.next(()=>this.ci(e,i))),n<9&&s>=9&&(o=o.next(()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)})),n<10&&s>=10&&(o=o.next(()=>this.li(i))),n<11&&s>=11&&(o=o.next(()=>{(function(u){u.createObjectStore(Io,{keyPath:fE})})(e),function(u){u.createObjectStore(To,{keyPath:pE})}(e)})),n<12&&s>=12&&(o=o.next(()=>{(function(u){const h=u.createObjectStore(Eo,{keyPath:EE});h.createIndex(za,vE,{unique:!1}),h.createIndex(Jf,wE,{unique:!1})})(e)})),n<13&&s>=13&&(o=o.next(()=>function(u){const h=u.createObjectStore(ji,{keyPath:iE});h.createIndex(Ai,oE),h.createIndex(Hf,aE)}(e)).next(()=>this.hi(e,i)).next(()=>e.deleteObjectStore(ln))),n<14&&s>=14&&(o=o.next(()=>this.Pi(e,i))),n<15&&s>=15&&(o=o.next(()=>function(u){u.createObjectStore(Vc,{keyPath:mE,autoIncrement:!0}).createIndex($a,gE,{unique:!1}),u.createObjectStore(zi,{keyPath:_E}).createIndex(Qf,yE,{unique:!1}),u.createObjectStore(Ki,{keyPath:IE}).createIndex(Yf,TE,{unique:!1})}(e))),n<16&&s>=16&&(o=o.next(()=>{t.objectStore(zi).clear()}).next(()=>{t.objectStore(Ki).clear()})),n<17&&s>=17&&(o=o.next(()=>{(function(u){u.createObjectStore(Nc,{keyPath:AE})})(e)})),o}ai(e){let t=0;return e.store(ln).Z((n,s)=>{t+=eo(s)}).next(()=>{const n={byteSize:t};return e.store(ys).put(ja,n)})}_i(e){const t=e.store(_s),n=e.store(Ye);return t.G().next(s=>w.forEach(s,i=>{const o=IDBKeyRange.bound([i.userId,_n],[i.userId,i.lastAcknowledgedBatchId]);return n.G(gn,o).next(c=>w.forEach(c,u=>{U(u.userId===i.userId);const h=dn(this.serializer,u);return tm(e,i.userId,h).next(()=>{})}))}))}ui(e){const t=e.store(sr),n=e.store(ln);return e.store(yn).get($i).next(s=>{const i=[];return n.Z((o,c)=>{const u=new Z(o),h=function(m){return[0,ke(m)]}(u);i.push(t.get(h).next(f=>f?w.resolve():(m=>t.put({targetId:0,path:ke(m),sequenceNumber:s.highestListenSequenceNumber}))(u)))}).next(()=>w.waitFor(i))})}ci(e,t){e.createObjectStore(Is,{keyPath:hE});const n=t.store(Is),s=new Hc,i=o=>{if(s.add(o)){const c=o.lastSegment(),u=o.popLast();return n.put({collectionId:c,parent:ke(u)})}};return t.store(ln).Z({Y:!0},(o,c)=>{const u=new Z(o);return i(u.popLast())}).next(()=>t.store(nr).Z({Y:!0},([o,c,u],h)=>{const f=tt(c);return i(f.popLast())}))}li(e){const t=e.store(rr);return t.Z((n,s)=>{const i=ts(s),o=Yp(this.serializer,i);return t.put(o)})}hi(e,t){const n=t.store(ln),s=[];return n.Z((i,o)=>{const c=t.store(ji),u=function(m){return m.document?new O(Z.fromString(m.document.name).popFirst(5)):m.noDocument?O.fromSegments(m.noDocument.path):m.unknownDocument?O.fromSegments(m.unknownDocument.path):M()}(o).path.toArray(),h={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(c.put(h))}).next(()=>w.waitFor(s))}Pi(e,t){const n=t.store(Ye),s=am(this.serializer),i=new Qc(ko.ri,this.serializer.Tt);return n.G().next(o=>{const c=new Map;return o.forEach(u=>{var h;let f=(h=c.get(u.userId))!==null&&h!==void 0?h:H();dn(this.serializer,u).keys().forEach(m=>f=f.add(m)),c.set(u.userId,f)}),w.forEach(c,(u,h)=>{const f=new Ie(h),m=Po.It(this.serializer,f),_=i.getIndexManager(f),R=Co.It(f,this.serializer,_,i.referenceDelegate);return new cm(s,R,m,_).recalculateAndSaveOverlaysForDocumentKeys(new Ka(t,Fe.ae),u).next()})})}}function od(r){r.createObjectStore(sr,{keyPath:uE}).createIndex(Dc,lE,{unique:!0}),r.createObjectStore(rr,{keyPath:"targetId"}).createIndex(Wf,cE,{unique:!0}),r.createObjectStore(yn)}const xt="IndexedDbPersistence",wa=18e5,Aa=5e3,Ra="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",zv="main";class Yc{constructor(e,t,n,s,i,o,c,u,h,f,m=17){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Ti=i,this.window=o,this.document=c,this.Ii=h,this.Ei=f,this.di=m,this.Gr=null,this.zr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Ai=null,this.inForeground=!1,this.Ri=null,this.Vi=null,this.mi=Number.NEGATIVE_INFINITY,this.fi=_=>Promise.resolve(),!Yc.D())throw new N(P.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Dv(this,s),this.gi=t+zv,this.serializer=new Qp(u),this.pi=new Kt(this.gi,this.di,new $v(this.serializer)),this.jr=new Iv,this.Hr=new Sv(this.referenceDelegate,this.serializer),this.remoteDocumentCache=am(this.serializer),this.Yr=new yv,this.window&&this.window.localStorage?this.yi=this.window.localStorage:(this.yi=null,f===!1&&fe(xt,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.wi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new N(P.FAILED_PRECONDITION,Ra);return this.bi(),this.Si(),this.Di(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Hr.getHighestSequenceNumber(e))}).then(e=>{this.Gr=new Fe(e,this.Ii)}).then(()=>{this.zr=!0}).catch(e=>(this.pi&&this.pi.close(),Promise.reject(e)))}Ci(e){return this.fi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.pi.k(async t=>{t.newVersion===null&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Ti.enqueueAndForget(async()=>{this.started&&await this.wi()}))}wi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>fi(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Fi(e).next(t=>{t||(this.isPrimary=!1,this.Ti.enqueueRetryable(()=>this.fi(!1)))})}).next(()=>this.Mi(e)).next(t=>this.isPrimary&&!t?this.xi(e).next(()=>!1):!!t&&this.Oi(e).next(()=>!0))).catch(e=>{if(Zt(e))return D(xt,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return D(xt,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Ti.enqueueRetryable(()=>this.fi(e)),this.isPrimary=e})}Fi(e){return Wr(e).get(Un).next(t=>w.resolve(this.Ni(t)))}Bi(e){return fi(e).delete(this.clientId)}async Li(){if(this.isPrimary&&!this.ki(this.mi,wa)){this.mi=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{const n=_e(t,ir);return n.G().next(s=>{const i=this.qi(s,wa),o=s.filter(c=>i.indexOf(c)===-1);return w.forEach(o,c=>n.delete(c.clientId)).next(()=>o)})}).catch(()=>[]);if(this.yi)for(const t of e)this.yi.removeItem(this.Qi(t.clientId))}}Di(){this.Vi=this.Ti.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.wi().then(()=>this.Li()).then(()=>this.Di()))}Ni(e){return!!e&&e.ownerId===this.clientId}Mi(e){return this.Ei?w.resolve(!0):Wr(e).get(Un).next(t=>{if(t!==null&&this.ki(t.leaseTimestampMs,Aa)&&!this.$i(t.ownerId)){if(this.Ni(t)&&this.networkEnabled)return!0;if(!this.Ni(t)){if(!t.allowTabSynchronization)throw new N(P.FAILED_PRECONDITION,Ra);return!1}}return!(!this.networkEnabled||!this.inForeground)||fi(e).G().next(n=>this.qi(n,Aa).find(s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,c=this.networkEnabled===s.networkEnabled;if(i||o&&c)return!0}return!1})===void 0)}).next(t=>(this.isPrimary!==t&&D(xt,`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.zr=!1,this.Ki(),this.Vi&&(this.Vi.cancel(),this.Vi=null),this.Ui(),this.Wi(),await this.pi.runTransaction("shutdown","readwrite",[xs,ir],e=>{const t=new Ka(e,Fe.ae);return this.xi(t).next(()=>this.Bi(t))}),this.pi.close(),this.Gi()}qi(e,t){return e.filter(n=>this.ki(n.updateTimeMs,t)&&!this.$i(n.clientId))}zi(){return this.runTransaction("getActiveClients","readonly",e=>fi(e).G().next(t=>this.qi(t,wa).map(n=>n.clientId)))}get started(){return this.zr}getGlobalsCache(){return this.jr}getMutationQueue(e,t){return Co.It(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Hr}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new bv(e,this.serializer.Tt.databaseId)}getDocumentOverlayCache(e){return Po.It(this.serializer,e)}getBundleCache(){return this.Yr}runTransaction(e,t,n){D(xt,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=function(u){return u===17?SE:u===16?bE:u===15?xc:u===14?ep:u===13?Zf:u===12?RE:u===11?Xf:void M()}(this.di);let o;return this.pi.runTransaction(e,s,i,c=>(o=new Ka(c,this.Gr?this.Gr.next():Fe.ae),t==="readwrite-primary"?this.Fi(o).next(u=>!!u||this.Mi(o)).next(u=>{if(!u)throw fe(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Ti.enqueueRetryable(()=>this.fi(!1)),new N(P.FAILED_PRECONDITION,jf);return n(o)}).next(u=>this.Oi(o).next(()=>u)):this.ji(o).next(()=>n(o)))).then(c=>(o.raiseOnCommittedEvent(),c))}ji(e){return Wr(e).get(Un).next(t=>{if(t!==null&&this.ki(t.leaseTimestampMs,Aa)&&!this.$i(t.ownerId)&&!this.Ni(t)&&!(this.Ei||this.allowTabSynchronization&&t.allowTabSynchronization))throw new N(P.FAILED_PRECONDITION,Ra)})}Oi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Wr(e).put(Un,t)}static D(){return Kt.D()}xi(e){const t=Wr(e);return t.get(Un).next(n=>this.Ni(n)?(D(xt,"Releasing primary lease."),t.delete(Un)):w.resolve())}ki(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(fe(`Detected an update time that is in the future: ${e} > ${n}`),!1))}bi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Ri=()=>{this.Ti.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.wi()))},this.document.addEventListener("visibilitychange",this.Ri),this.inForeground=this.document.visibilityState==="visible")}Ui(){this.Ri&&(this.document.removeEventListener("visibilitychange",this.Ri),this.Ri=null)}Si(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.Ai=()=>{this.Ki();const t=/(?:Version|Mobile)\/1[456]/;zd()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Ti.enterRestrictedMode(!0),this.Ti.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Ai))}Wi(){this.Ai&&(this.window.removeEventListener("pagehide",this.Ai),this.Ai=null)}$i(e){var t;try{const n=((t=this.yi)===null||t===void 0?void 0:t.getItem(this.Qi(e)))!==null;return D(xt,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return fe(xt,"Failed to get zombied client id.",n),!1}}Ki(){if(this.yi)try{this.yi.setItem(this.Qi(this.clientId),String(Date.now()))}catch(e){fe("Failed to set zombie client id.",e)}}Gi(){if(this.yi)try{this.yi.removeItem(this.Qi(this.clientId))}catch{}}Qi(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Wr(r){return _e(r,xs)}function fi(r){return _e(r,ir)}function um(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jc{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Hi=n,this.Ji=s}static Yi(e,t){let n=H(),s=H();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Jc(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kv{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lm{constructor(){this.Zi=!1,this.Xi=!1,this.es=100,this.ts=function(){return zd()?8:zf(ge())>0?6:4}()}initialize(e,t){this.ns=e,this.indexManager=t,this.Zi=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.rs(e,t).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.ss(e,t,s,n).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new Kv;return this._s(e,t,o).next(c=>{if(i.result=c,this.Xi)return this.us(e,t,o,c.size)})}).next(()=>i.result)}us(e,t,n,s){return n.documentReadCount<this.es?(Kn()<=W.DEBUG&&D("QueryEngine","SDK will not create cache indexes for query:",Gn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.es,"documents"),w.resolve()):(Kn()<=W.DEBUG&&D("QueryEngine","Query:",Gn(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.ts*s?(Kn()<=W.DEBUG&&D("QueryEngine","The SDK decides to create cache indexes for query:",Gn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ke(t))):w.resolve())}rs(e,t){if(Dh(t))return w.resolve(null);let n=Ke(t);return this.indexManager.getIndexType(e,n).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=Qi(t,null,"F"),n=Ke(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(i=>{const o=H(...i);return this.ns.getDocuments(e,o).next(c=>this.indexManager.getMinOffset(e,n).next(u=>{const h=this.cs(t,c);return this.ls(t,h,o,u.readTime)?this.rs(e,Qi(t,null,"F")):this.hs(e,h,t,u)}))})))}ss(e,t,n,s){return Dh(t)||s.isEqual(q.min())?w.resolve(null):this.ns.getDocuments(e,n).next(i=>{const o=this.cs(t,i);return this.ls(t,o,n,s)?w.resolve(null):(Kn()<=W.DEBUG&&D("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Gn(t)),this.hs(e,o,t,Bf(s,tr)).next(c=>c))})}cs(e,t){let n=new te(vp(e));return t.forEach((s,i)=>{Ms(e,i)&&(n=n.add(i))}),n}ls(e,t,n,s){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}_s(e,t,n){return Kn()<=W.DEBUG&&D("QueryEngine","Using full collection scan to execute query:",Gn(t)),this.ns.getDocumentsMatchingQuery(e,t,Ge.min(),n)}hs(e,t,n,s){return this.ns.getDocumentsMatchingQuery(e,n,s).next(i=>(t.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xc="LocalStore",Gv=3e8;class Hv{constructor(e,t,n,s){this.persistence=e,this.Ps=t,this.serializer=s,this.Ts=new se(K),this.Is=new At(i=>Sn(i),Os),this.Es=new Map,this.ds=e.getRemoteDocumentCache(),this.Hr=e.getTargetCache(),this.Yr=e.getBundleCache(),this.As(n)}As(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new cm(this.ds,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ds.setIndexManager(this.indexManager),this.Ps.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Ts))}}function hm(r,e,t,n){return new Hv(r,e,t,n)}async function dm(r,e){const t=F(r);return await t.persistence.runTransaction("Handle user change","readonly",n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next(i=>(s=i,t.As(e),t.mutationQueue.getAllMutationBatches(n))).next(i=>{const o=[],c=[];let u=H();for(const h of s){o.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of i){c.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(n,u).next(h=>({Rs:h,removedBatchIds:o,addedBatchIds:c}))})})}function Wv(r,e){const t=F(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const s=e.batch.keys(),i=t.ds.newChangeBuffer({trackRemovals:!0});return function(c,u,h,f){const m=h.batch,_=m.keys();let R=w.resolve();return _.forEach(C=>{R=R.next(()=>f.getEntry(u,C)).next(V=>{const k=h.docVersions.get(C);U(k!==null),V.version.compareTo(k)<0&&(m.applyToRemoteDocument(V,h),V.isValidDocument()&&(V.setReadTime(h.commitVersion),f.addEntry(V)))})}),R.next(()=>c.mutationQueue.removeMutationBatch(u,m))}(t,n,e,i).next(()=>i.apply(n)).next(()=>t.mutationQueue.performConsistencyCheck(n)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(c){let u=H();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(u=u.add(c.batch.mutations[h].key));return u}(e))).next(()=>t.localDocuments.getDocuments(n,s))})}function fm(r){const e=F(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Hr.getLastRemoteSnapshotVersion(t))}function Qv(r,e){const t=F(r),n=e.snapshotVersion;let s=t.Ts;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=t.ds.newChangeBuffer({trackRemovals:!0});s=t.Ts;const c=[];e.targetChanges.forEach((f,m)=>{const _=s.get(m);if(!_)return;c.push(t.Hr.removeMatchingKeys(i,f.removedDocuments,m).next(()=>t.Hr.addMatchingKeys(i,f.addedDocuments,m)));let R=_.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?R=R.withResumeToken(pe.EMPTY_BYTE_STRING,q.min()).withLastLimboFreeSnapshotVersion(q.min()):f.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(f.resumeToken,n)),s=s.insert(m,R),function(V,k,j){return V.resumeToken.approximateByteSize()===0||k.snapshotVersion.toMicroseconds()-V.snapshotVersion.toMicroseconds()>=Gv?!0:j.addedDocuments.size+j.modifiedDocuments.size+j.removedDocuments.size>0}(_,R,f)&&c.push(t.Hr.updateTargetData(i,R))});let u=$e(),h=H();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))}),c.push(Yv(i,o,e.documentUpdates).next(f=>{u=f.Vs,h=f.fs})),!n.isEqual(q.min())){const f=t.Hr.getLastRemoteSnapshotVersion(i).next(m=>t.Hr.setTargetsMetadata(i,i.currentSequenceNumber,n));c.push(f)}return w.waitFor(c).next(()=>o.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,u,h)).next(()=>u)}).then(i=>(t.Ts=s,i))}function Yv(r,e,t){let n=H(),s=H();return t.forEach(i=>n=n.add(i)),e.getEntries(r,n).next(i=>{let o=$e();return t.forEach((c,u)=>{const h=i.get(c);u.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual(q.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):D(Xc,"Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",u.version)}),{Vs:o,fs:s}})}function Jv(r,e){const t=F(r);return t.persistence.runTransaction("Get next mutation batch","readonly",n=>(e===void 0&&(e=_n),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e)))}function no(r,e){const t=F(r);return t.persistence.runTransaction("Allocate target","readwrite",n=>{let s;return t.Hr.getTargetData(n,e).next(i=>i?(s=i,w.resolve(s)):t.Hr.allocateTargetId(n).next(o=>(s=new pt(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.Hr.addTargetData(n,s).next(()=>s))))}).then(n=>{const s=t.Ts.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Ts=t.Ts.insert(n.targetId,n),t.Is.set(e,n.targetId)),n})}async function pr(r,e,t){const n=F(r),s=n.Ts.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,o=>n.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!Zt(o))throw o;D(Xc,`Failed to update sequence numbers for target ${e}: ${o}`)}n.Ts=n.Ts.remove(e),n.Is.delete(s.target)}function ic(r,e,t){const n=F(r);let s=q.min(),i=H();return n.persistence.runTransaction("Execute query","readwrite",o=>function(u,h,f){const m=F(u),_=m.Is.get(f);return _!==void 0?w.resolve(m.Ts.get(_)):m.Hr.getTargetData(h,f)}(n,o,Ke(e)).next(c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,n.Hr.getMatchingKeysForTargetId(o,c.targetId).next(u=>{i=u})}).next(()=>n.Ps.getDocumentsMatchingQuery(o,e,t?s:q.min(),t?i:H())).next(c=>(gm(n,Ep(e),c),{documents:c,gs:i})))}function pm(r,e){const t=F(r),n=F(t.Hr),s=t.Ts.get(e);return s?Promise.resolve(s.target):t.persistence.runTransaction("Get target data","readonly",i=>n.lt(i,e).next(o=>o?o.target:null))}function mm(r,e){const t=F(r),n=t.Es.get(e)||q.min();return t.persistence.runTransaction("Get new document changes","readonly",s=>t.ds.getAllFromCollectionGroup(s,e,Bf(n,tr),Number.MAX_SAFE_INTEGER)).then(s=>(gm(t,e,s),s))}function gm(r,e,t){let n=r.Es.get(e)||q.min();t.forEach((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)}),r.Es.set(e,n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _m="firestore_clients";function ad(r,e){return`${_m}_${r}_${e}`}const ym="firestore_mutations";function cd(r,e,t){let n=`${ym}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const Im="firestore_targets";function ba(r,e){return`${Im}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et="SharedClientState";class ro{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static bs(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new N(s.error.code,s.error.message))),o?new ro(e,t,s.state,i):(fe(et,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Ss(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class ls{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static bs(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new N(n.error.code,n.error.message))),i?new ls(e,n.state,s):(fe(et,`Failed to parse target state for ID '${e}': ${t}`),null)}Ss(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class so{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static bs(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=Uc();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=Kf(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new so(e,i):(fe(et,`Failed to parse client data for instance '${e}': ${t}`),null)}}class Zc{constructor(e,t){this.clientId=e,this.onlineState=t}static bs(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new Zc(t.clientId,t.onlineState):(fe(et,`Failed to parse online state: ${e}`),null)}}class oc{constructor(){this.activeTargetIds=Uc()}Ds(e){this.activeTargetIds=this.activeTargetIds.add(e)}vs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ss(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Sa{constructor(e,t,n,s,i){this.window=e,this.Ti=t,this.persistenceKey=n,this.Cs=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Fs=this.Ms.bind(this),this.xs=new se(K),this.started=!1,this.Os=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Ns=ad(this.persistenceKey,this.Cs),this.Bs=function(u){return`firestore_sequence_number_${u}`}(this.persistenceKey),this.xs=this.xs.insert(this.Cs,new oc),this.Ls=new RegExp(`^${_m}_${o}_([^_]*)$`),this.ks=new RegExp(`^${ym}_${o}_(\\d+)(?:_(.*))?$`),this.qs=new RegExp(`^${Im}_${o}_(\\d+)$`),this.Qs=function(u){return`firestore_online_state_${u}`}(this.persistenceKey),this.$s=function(u){return`firestore_bundle_loaded_v2_${u}`}(this.persistenceKey),this.window.addEventListener("storage",this.Fs)}static D(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.zi();for(const n of e){if(n===this.Cs)continue;const s=this.getItem(ad(this.persistenceKey,n));if(s){const i=so.bs(n,s);i&&(this.xs=this.xs.insert(i.clientId,i))}}this.Ks();const t=this.storage.getItem(this.Qs);if(t){const n=this.Us(t);n&&this.Ws(n)}for(const n of this.Os)this.Ms(n);this.Os=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.Bs,JSON.stringify(e))}getAllActiveQueryTargets(){return this.Gs(this.xs)}isActiveQueryTarget(e){let t=!1;return this.xs.forEach((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.zs(e,"pending")}updateMutationState(e,t,n){this.zs(e,t,n),this.js(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(ba(this.persistenceKey,e));if(s){const i=ls.bs(e,s);i&&(n=i.state)}}return t&&this.Hs.Ds(e),this.Ks(),n}removeLocalQueryTarget(e){this.Hs.vs(e),this.Ks()}isLocalQueryTarget(e){return this.Hs.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(ba(this.persistenceKey,e))}updateQueryState(e,t,n){this.Js(e,t,n)}handleUserChange(e,t,n){t.forEach(s=>{this.js(s)}),this.currentUser=e,n.forEach(s=>{this.addPendingMutation(s)})}setOnlineState(e){this.Ys(e)}notifyBundleLoaded(e){this.Zs(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.Fs),this.removeItem(this.Ns),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return D(et,"READ",e,t),t}setItem(e,t){D(et,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){D(et,"REMOVE",e),this.storage.removeItem(e)}Ms(e){const t=e;if(t.storageArea===this.storage){if(D(et,"EVENT",t.key,t.newValue),t.key===this.Ns)return void fe("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Ti.enqueueRetryable(async()=>{if(this.started){if(t.key!==null){if(this.Ls.test(t.key)){if(t.newValue==null){const n=this.Xs(t.key);return this.eo(n,null)}{const n=this.no(t.key,t.newValue);if(n)return this.eo(n.clientId,n)}}else if(this.ks.test(t.key)){if(t.newValue!==null){const n=this.ro(t.key,t.newValue);if(n)return this.io(n)}}else if(this.qs.test(t.key)){if(t.newValue!==null){const n=this.so(t.key,t.newValue);if(n)return this.oo(n)}}else if(t.key===this.Qs){if(t.newValue!==null){const n=this.Us(t.newValue);if(n)return this.Ws(n)}}else if(t.key===this.Bs){const n=function(i){let o=Fe.ae;if(i!=null)try{const c=JSON.parse(i);U(typeof c=="number"),o=c}catch(c){fe(et,"Failed to read sequence number from WebStorage",c)}return o}(t.newValue);n!==Fe.ae&&this.sequenceNumberHandler(n)}else if(t.key===this.$s){const n=this._o(t.newValue);await Promise.all(n.map(s=>this.syncEngine.ao(s)))}}}else this.Os.push(t)})}}get Hs(){return this.xs.get(this.Cs)}Ks(){this.setItem(this.Ns,this.Hs.Ss())}zs(e,t,n){const s=new ro(this.currentUser,e,t,n),i=cd(this.persistenceKey,this.currentUser,e);this.setItem(i,s.Ss())}js(e){const t=cd(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Ys(e){const t={clientId:this.Cs,onlineState:e};this.storage.setItem(this.Qs,JSON.stringify(t))}Js(e,t,n){const s=ba(this.persistenceKey,e),i=new ls(e,t,n);this.setItem(s,i.Ss())}Zs(e){const t=JSON.stringify(Array.from(e));this.setItem(this.$s,t)}Xs(e){const t=this.Ls.exec(e);return t?t[1]:null}no(e,t){const n=this.Xs(e);return so.bs(n,t)}ro(e,t){const n=this.ks.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return ro.bs(new Ie(i),s,t)}so(e,t){const n=this.qs.exec(e),s=Number(n[1]);return ls.bs(s,t)}Us(e){return Zc.bs(e)}_o(e){return JSON.parse(e)}async io(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.uo(e.batchId,e.state,e.error);D(et,`Ignoring mutation for non-active user ${e.user.uid}`)}oo(e){return this.syncEngine.co(e.targetId,e.state,e.error)}eo(e,t){const n=t?this.xs.insert(e,t):this.xs.remove(e),s=this.Gs(this.xs),i=this.Gs(n),o=[],c=[];return i.forEach(u=>{s.has(u)||o.push(u)}),s.forEach(u=>{i.has(u)||c.push(u)}),this.syncEngine.lo(o,c).then(()=>{this.xs=n})}Ws(e){this.xs.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}Gs(e){let t=Uc();return e.forEach((n,s)=>{t=t.unionWith(s.activeTargetIds)}),t}}class Tm{constructor(){this.ho=new oc,this.Po={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.ho.Ds(e),this.Po[e]||"not-current"}updateQueryState(e,t,n){this.Po[e]=t}removeLocalQueryTarget(e){this.ho.vs(e)}isLocalQueryTarget(e){return this.ho.activeTargetIds.has(e)}clearQueryState(e){delete this.Po[e]}getAllActiveQueryTargets(){return this.ho.activeTargetIds}isActiveQueryTarget(e){return this.ho.activeTargetIds.has(e)}start(){return this.ho=new oc,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xv{To(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud="ConnectivityMonitor";class ld{constructor(){this.Io=()=>this.Eo(),this.Ao=()=>this.Ro(),this.Vo=[],this.mo()}To(e){this.Vo.push(e)}shutdown(){window.removeEventListener("online",this.Io),window.removeEventListener("offline",this.Ao)}mo(){window.addEventListener("online",this.Io),window.addEventListener("offline",this.Ao)}Eo(){D(ud,"Network connectivity changed: AVAILABLE");for(const e of this.Vo)e(0)}Ro(){D(ud,"Network connectivity changed: UNAVAILABLE");for(const e of this.Vo)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pi=null;function ac(){return pi===null?pi=function(){return 268435456+Math.round(2147483648*Math.random())}():pi++,"0x"+pi.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pa="RestConnection",Zv={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class ew{get fo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.po=t+"://"+e.host,this.yo=`projects/${n}/databases/${s}`,this.wo=this.databaseId.database===Gi?`project_id=${n}`:`project_id=${n}&database_id=${s}`}bo(e,t,n,s,i){const o=ac(),c=this.So(e,t.toUriEncodedString());D(Pa,`Sending RPC '${e}' ${o}:`,c,n);const u={"google-cloud-resource-prefix":this.yo,"x-goog-request-params":this.wo};return this.Do(u,s,i),this.vo(e,c,u,n).then(h=>(D(Pa,`Received RPC '${e}' ${o}: `,h),h),h=>{throw Rn(Pa,`RPC '${e}' ${o} failed with error: `,h,"url: ",c,"request:",n),h})}Co(e,t,n,s,i,o){return this.bo(e,t,n,s,i)}Do(e,t,n){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Er}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((s,i)=>e[i]=s),n&&n.headers.forEach((s,i)=>e[i]=s)}So(e,t){const n=Zv[e];return`${this.po}/v1/${t}:${n}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tw{constructor(e){this.Fo=e.Fo,this.Mo=e.Mo}xo(e){this.Oo=e}No(e){this.Bo=e}Lo(e){this.ko=e}onMessage(e){this.qo=e}close(){this.Mo()}send(e){this.Fo(e)}Qo(){this.Oo()}$o(){this.Bo()}Ko(e){this.ko(e)}Uo(e){this.qo(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const be="WebChannelConnection";class nw extends ew{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}vo(e,t,n,s){const i=ac();return new Promise((o,c)=>{const u=new Vf;u.setWithCredentials(!0),u.listenOnce(Nf.COMPLETE,()=>{try{switch(u.getLastErrorCode()){case Ei.NO_ERROR:const f=u.getResponseJson();D(be,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(f)),o(f);break;case Ei.TIMEOUT:D(be,`RPC '${e}' ${i} timed out`),c(new N(P.DEADLINE_EXCEEDED,"Request time out"));break;case Ei.HTTP_ERROR:const m=u.getStatus();if(D(be,`RPC '${e}' ${i} failed with status:`,m,"response text:",u.getResponseText()),m>0){let _=u.getResponseJson();Array.isArray(_)&&(_=_[0]);const R=_==null?void 0:_.error;if(R&&R.status&&R.message){const C=function(k){const j=k.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(j)>=0?j:P.UNKNOWN}(R.status);c(new N(C,R.message))}else c(new N(P.UNKNOWN,"Server responded with status "+u.getStatus()))}else c(new N(P.UNAVAILABLE,"Connection failed."));break;default:M()}}finally{D(be,`RPC '${e}' ${i} completed.`)}});const h=JSON.stringify(s);D(be,`RPC '${e}' ${i} sending request:`,s),u.send(t,"POST",h,n,15)})}Wo(e,t,n){const s=ac(),i=[this.po,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Lf(),c=Of(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Do(u.initMessageHeaders,t,n),u.encodeInitMessageHeaders=!0;const f=i.join("");D(be,`Creating RPC '${e}' stream ${s}: ${f}`,u);const m=o.createWebChannel(f,u);let _=!1,R=!1;const C=new tw({Fo:k=>{R?D(be,`Not sending because RPC '${e}' stream ${s} is closed:`,k):(_||(D(be,`Opening RPC '${e}' stream ${s} transport.`),m.open(),_=!0),D(be,`RPC '${e}' stream ${s} sending:`,k),m.send(k))},Mo:()=>m.close()}),V=(k,j,B)=>{k.listen(j,L=>{try{B(L)}catch($){setTimeout(()=>{throw $},0)}})};return V(m,Xr.EventType.OPEN,()=>{R||(D(be,`RPC '${e}' stream ${s} transport opened.`),C.Qo())}),V(m,Xr.EventType.CLOSE,()=>{R||(R=!0,D(be,`RPC '${e}' stream ${s} transport closed`),C.Ko())}),V(m,Xr.EventType.ERROR,k=>{R||(R=!0,Rn(be,`RPC '${e}' stream ${s} transport errored:`,k),C.Ko(new N(P.UNAVAILABLE,"The operation could not be completed")))}),V(m,Xr.EventType.MESSAGE,k=>{var j;if(!R){const B=k.data[0];U(!!B);const L=B,$=(L==null?void 0:L.error)||((j=L[0])===null||j===void 0?void 0:j.error);if($){D(be,`RPC '${e}' stream ${s} received error:`,$);const Y=$.status;let G=function(I){const E=me[I];if(E!==void 0)return Op(E)}(Y),T=$.message;G===void 0&&(G=P.INTERNAL,T="Unknown error status: "+Y+" with message "+$.message),R=!0,C.Ko(new N(G,T)),m.close()}else D(be,`RPC '${e}' stream ${s} received:`,B),C.Uo(B)}}),V(c,xf.STAT_EVENT,k=>{k.stat===Ba.PROXY?D(be,`RPC '${e}' stream ${s} detected buffering proxy`):k.stat===Ba.NOPROXY&&D(be,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{C.$o()},0),C}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Em(){return typeof window<"u"?window:null}function ki(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Do(r){return new av(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vm{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Ti=e,this.timerId=t,this.Go=n,this.zo=s,this.jo=i,this.Ho=0,this.Jo=null,this.Yo=Date.now(),this.reset()}reset(){this.Ho=0}Zo(){this.Ho=this.jo}Xo(e){this.cancel();const t=Math.floor(this.Ho+this.e_()),n=Math.max(0,Date.now()-this.Yo),s=Math.max(0,t-n);s>0&&D("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ho} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.Jo=this.Ti.enqueueAfterDelay(this.timerId,s,()=>(this.Yo=Date.now(),e())),this.Ho*=this.zo,this.Ho<this.Go&&(this.Ho=this.Go),this.Ho>this.jo&&(this.Ho=this.jo)}t_(){this.Jo!==null&&(this.Jo.skipDelay(),this.Jo=null)}cancel(){this.Jo!==null&&(this.Jo.cancel(),this.Jo=null)}e_(){return(Math.random()-.5)*this.Ho}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hd="PersistentStream";class wm{constructor(e,t,n,s,i,o,c,u){this.Ti=e,this.n_=n,this.r_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.i_=0,this.s_=null,this.o_=null,this.stream=null,this.__=0,this.a_=new vm(e,t)}u_(){return this.state===1||this.state===5||this.c_()}c_(){return this.state===2||this.state===3}start(){this.__=0,this.state!==4?this.auth():this.l_()}async stop(){this.u_()&&await this.close(0)}h_(){this.state=0,this.a_.reset()}P_(){this.c_()&&this.s_===null&&(this.s_=this.Ti.enqueueAfterDelay(this.n_,6e4,()=>this.T_()))}I_(e){this.E_(),this.stream.send(e)}async T_(){if(this.c_())return this.close(0)}E_(){this.s_&&(this.s_.cancel(),this.s_=null)}d_(){this.o_&&(this.o_.cancel(),this.o_=null)}async close(e,t){this.E_(),this.d_(),this.a_.cancel(),this.i_++,e!==4?this.a_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(fe(t.toString()),fe("Using maximum backoff delay to prevent overloading the backend."),this.a_.Zo()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.A_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Lo(t)}A_(){}auth(){this.state=1;const e=this.R_(this.i_),t=this.i_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,s])=>{this.i_===t&&this.V_(n,s)},n=>{e(()=>{const s=new N(P.UNKNOWN,"Fetching auth token failed: "+n.message);return this.m_(s)})})}V_(e,t){const n=this.R_(this.i_);this.stream=this.f_(e,t),this.stream.xo(()=>{n(()=>this.listener.xo())}),this.stream.No(()=>{n(()=>(this.state=2,this.o_=this.Ti.enqueueAfterDelay(this.r_,1e4,()=>(this.c_()&&(this.state=3),Promise.resolve())),this.listener.No()))}),this.stream.Lo(s=>{n(()=>this.m_(s))}),this.stream.onMessage(s=>{n(()=>++this.__==1?this.g_(s):this.onNext(s))})}l_(){this.state=5,this.a_.Xo(async()=>{this.state=0,this.start()})}m_(e){return D(hd,`close with error: ${e}`),this.stream=null,this.close(4,e)}R_(e){return t=>{this.Ti.enqueueAndForget(()=>this.i_===e?t():(D(hd,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class rw extends wm{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}f_(e,t){return this.connection.Wo("Listen",e,t)}g_(e){return this.onNext(e)}onNext(e){this.a_.reset();const t=lv(this.serializer,e),n=function(i){if(!("targetChange"in i))return q.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?q.min():o.readTime?Le(o.readTime):q.min()}(e);return this.listener.p_(t,n)}y_(e){const t={};t.database=ec(this.serializer),t.addTarget=function(i,o){let c;const u=o.target;if(c=Hi(u)?{documents:$p(i,u)}:{query:zp(i,u).ht},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=Fp(i,o.resumeToken);const h=Xa(i,o.expectedCount);h!==null&&(c.expectedCount=h)}else if(o.snapshotVersion.compareTo(q.min())>0){c.readTime=fr(i,o.snapshotVersion.toTimestamp());const h=Xa(i,o.expectedCount);h!==null&&(c.expectedCount=h)}return c}(this.serializer,e);const n=dv(this.serializer,e);n&&(t.labels=n),this.I_(t)}w_(e){const t={};t.database=ec(this.serializer),t.removeTarget=e,this.I_(t)}}class sw extends wm{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get b_(){return this.__>0}start(){this.lastStreamToken=void 0,super.start()}A_(){this.b_&&this.S_([])}f_(e,t){return this.connection.Wo("Write",e,t)}g_(e){return U(!!e.streamToken),this.lastStreamToken=e.streamToken,U(!e.writeResults||e.writeResults.length===0),this.listener.D_()}onNext(e){U(!!e.streamToken),this.lastStreamToken=e.streamToken,this.a_.reset();const t=hv(e.writeResults,e.commitTime),n=Le(e.commitTime);return this.listener.v_(n,t)}C_(){const e={};e.database=ec(this.serializer),this.I_(e)}S_(e){const t={streamToken:this.lastStreamToken,writes:e.map(n=>Ji(this.serializer,n))};this.I_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iw{}class ow extends iw{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.F_=!1}M_(){if(this.F_)throw new N(P.FAILED_PRECONDITION,"The client has already been terminated.")}bo(e,t,n,s){return this.M_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.bo(e,Za(t,n),s,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new N(P.UNKNOWN,i.toString())})}Co(e,t,n,s,i){return this.M_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,c])=>this.connection.Co(e,Za(t,n),s,o,c,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(P.UNKNOWN,o.toString())})}terminate(){this.F_=!0,this.connection.terminate()}}class aw{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.x_=0,this.O_=null,this.N_=!0}B_(){this.x_===0&&(this.L_("Unknown"),this.O_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.O_=null,this.k_("Backend didn't respond within 10 seconds."),this.L_("Offline"),Promise.resolve())))}q_(e){this.state==="Online"?this.L_("Unknown"):(this.x_++,this.x_>=1&&(this.Q_(),this.k_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.L_("Offline")))}set(e){this.Q_(),this.x_=0,e==="Online"&&(this.N_=!1),this.L_(e)}L_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}k_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.N_?(fe(t),this.N_=!1):D("OnlineStateTracker",t)}Q_(){this.O_!==null&&(this.O_.cancel(),this.O_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dn="RemoteStore";class cw{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.K_=[],this.U_=new Map,this.W_=new Set,this.G_=[],this.z_=i,this.z_.To(o=>{n.enqueueAndForget(async()=>{xn(this)&&(D(Dn,"Restarting streams for network reachability change."),await async function(u){const h=F(u);h.W_.add(4),await Bs(h),h.j_.set("Unknown"),h.W_.delete(4),await Vo(h)}(this))})}),this.j_=new aw(n,s)}}async function Vo(r){if(xn(r))for(const e of r.G_)await e(!0)}async function Bs(r){for(const e of r.G_)await e(!1)}function No(r,e){const t=F(r);t.U_.has(e.targetId)||(t.U_.set(e.targetId,e),nu(t)?tu(t):Rr(t).c_()&&eu(t,e))}function mr(r,e){const t=F(r),n=Rr(t);t.U_.delete(e),n.c_()&&Am(t,e),t.U_.size===0&&(n.c_()?n.P_():xn(t)&&t.j_.set("Unknown"))}function eu(r,e){if(r.H_.Ne(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(q.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Rr(r).y_(e)}function Am(r,e){r.H_.Ne(e),Rr(r).w_(e)}function tu(r){r.H_=new rv({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),lt:e=>r.U_.get(e)||null,it:()=>r.datastore.serializer.databaseId}),Rr(r).start(),r.j_.B_()}function nu(r){return xn(r)&&!Rr(r).u_()&&r.U_.size>0}function xn(r){return F(r).W_.size===0}function Rm(r){r.H_=void 0}async function uw(r){r.j_.set("Online")}async function lw(r){r.U_.forEach((e,t)=>{eu(r,e)})}async function hw(r,e){Rm(r),nu(r)?(r.j_.q_(e),tu(r)):r.j_.set("Unknown")}async function dw(r,e,t){if(r.j_.set("Online"),e instanceof Mp&&e.state===2&&e.cause)try{await async function(s,i){const o=i.cause;for(const c of i.targetIds)s.U_.has(c)&&(await s.remoteSyncer.rejectListen(c,o),s.U_.delete(c),s.H_.removeTarget(c))}(r,e)}catch(n){D(Dn,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await io(r,n)}else if(e instanceof Ci?r.H_.We(e):e instanceof Lp?r.H_.Ze(e):r.H_.je(e),!t.isEqual(q.min()))try{const n=await fm(r.localStore);t.compareTo(n)>=0&&await function(i,o){const c=i.H_.ot(o);return c.targetChanges.forEach((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const f=i.U_.get(h);f&&i.U_.set(h,f.withResumeToken(u.resumeToken,o))}}),c.targetMismatches.forEach((u,h)=>{const f=i.U_.get(u);if(!f)return;i.U_.set(u,f.withResumeToken(pe.EMPTY_BYTE_STRING,f.snapshotVersion)),Am(i,u);const m=new pt(f.target,u,h,f.sequenceNumber);eu(i,m)}),i.remoteSyncer.applyRemoteEvent(c)}(r,t)}catch(n){D(Dn,"Failed to raise snapshot:",n),await io(r,n)}}async function io(r,e,t){if(!Zt(e))throw e;r.W_.add(1),await Bs(r),r.j_.set("Offline"),t||(t=()=>fm(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{D(Dn,"Retrying IndexedDB access"),await t(),r.W_.delete(1),await Vo(r)})}function bm(r,e){return e().catch(t=>io(r,t,e))}async function Ar(r){const e=F(r),t=Yt(e);let n=e.K_.length>0?e.K_[e.K_.length-1].batchId:_n;for(;fw(e);)try{const s=await Jv(e.localStore,n);if(s===null){e.K_.length===0&&t.P_();break}n=s.batchId,pw(e,s)}catch(s){await io(e,s)}Sm(e)&&Pm(e)}function fw(r){return xn(r)&&r.K_.length<10}function pw(r,e){r.K_.push(e);const t=Yt(r);t.c_()&&t.b_&&t.S_(e.mutations)}function Sm(r){return xn(r)&&!Yt(r).u_()&&r.K_.length>0}function Pm(r){Yt(r).start()}async function mw(r){Yt(r).C_()}async function gw(r){const e=Yt(r);for(const t of r.K_)e.S_(t.mutations)}async function _w(r,e,t){const n=r.K_.shift(),s=jc.from(n,e,t);await bm(r,()=>r.remoteSyncer.applySuccessfulWrite(s)),await Ar(r)}async function yw(r,e){e&&Yt(r).b_&&await async function(n,s){if(function(o){return ev(o)&&o!==P.ABORTED}(s.code)){const i=n.K_.shift();Yt(n).h_(),await bm(n,()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s)),await Ar(n)}}(r,e),Sm(r)&&Pm(r)}async function dd(r,e){const t=F(r);t.asyncQueue.verifyOperationInProgress(),D(Dn,"RemoteStore received new credentials");const n=xn(t);t.W_.add(3),await Bs(t),n&&t.j_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.W_.delete(3),await Vo(t)}async function cc(r,e){const t=F(r);e?(t.W_.delete(2),await Vo(t)):e||(t.W_.add(2),await Bs(t),t.j_.set("Unknown"))}function Rr(r){return r.J_||(r.J_=function(t,n,s){const i=F(t);return i.M_(),new rw(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{xo:uw.bind(null,r),No:lw.bind(null,r),Lo:hw.bind(null,r),p_:dw.bind(null,r)}),r.G_.push(async e=>{e?(r.J_.h_(),nu(r)?tu(r):r.j_.set("Unknown")):(await r.J_.stop(),Rm(r))})),r.J_}function Yt(r){return r.Y_||(r.Y_=function(t,n,s){const i=F(t);return i.M_(),new sw(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{xo:()=>Promise.resolve(),No:mw.bind(null,r),Lo:yw.bind(null,r),D_:gw.bind(null,r),v_:_w.bind(null,r)}),r.G_.push(async e=>{e?(r.Y_.h_(),await Ar(r)):(await r.Y_.stop(),r.K_.length>0&&(D(Dn,`Stopping write stream with ${r.K_.length} pending writes`),r.K_=[]))})),r.Y_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ru{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new it,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,c=new ru(e,t,o,s,i);return c.start(n),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function su(r,e){if(fe("AsyncQueue",`${e}: ${r}`),Zt(r))return new N(P.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn{static emptySet(e){return new Zn(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||O.comparator(t.key,n.key):(t,n)=>O.comparator(t.key,n.key),this.keyedMap=Zr(),this.sortedSet=new se(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Zn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Zn;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(){this.Z_=new se(O.comparator)}track(e){const t=e.doc.key,n=this.Z_.get(t);n?e.type!==0&&n.type===3?this.Z_=this.Z_.insert(t,e):e.type===3&&n.type!==1?this.Z_=this.Z_.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.Z_=this.Z_.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.Z_=this.Z_.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.Z_=this.Z_.remove(t):e.type===1&&n.type===2?this.Z_=this.Z_.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.Z_=this.Z_.insert(t,{type:2,doc:e.doc}):M():this.Z_=this.Z_.insert(t,e)}X_(){const e=[];return this.Z_.inorderTraversal((t,n)=>{e.push(n)}),e}}class gr{constructor(e,t,n,s,i,o,c,u,h){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach(c=>{o.push({type:0,doc:c})}),new gr(e,t,Zn.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ao(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iw{constructor(){this.ea=void 0,this.ta=[]}na(){return this.ta.some(e=>e.ra())}}class Tw{constructor(){this.queries=pd(),this.onlineState="Unknown",this.ia=new Set}terminate(){(function(t,n){const s=F(t),i=s.queries;s.queries=pd(),i.forEach((o,c)=>{for(const u of c.ta)u.onError(n)})})(this,new N(P.ABORTED,"Firestore shutting down"))}}function pd(){return new At(r=>Tp(r),Ao)}async function iu(r,e){const t=F(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.na()&&e.ra()&&(n=2):(i=new Iw,n=e.ra()?0:1);try{switch(n){case 0:i.ea=await t.onListen(s,!0);break;case 1:i.ea=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const c=su(o,`Initialization of query '${Gn(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.ta.push(e),e.sa(t.onlineState),i.ea&&e.oa(i.ea)&&au(t)}async function ou(r,e){const t=F(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.ta.indexOf(e);o>=0&&(i.ta.splice(o,1),i.ta.length===0?s=e.ra()?0:1:!i.na()&&e.ra()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Ew(r,e){const t=F(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const c of o.ta)c.oa(s)&&(n=!0);o.ea=s}}n&&au(t)}function vw(r,e,t){const n=F(r),s=n.queries.get(e);if(s)for(const i of s.ta)i.onError(t);n.queries.delete(e)}function au(r){r.ia.forEach(e=>{e.next()})}var uc,md;(md=uc||(uc={}))._a="default",md.Cache="cache";class cu{constructor(e,t,n){this.query=e,this.aa=t,this.ua=!1,this.ca=null,this.onlineState="Unknown",this.options=n||{}}oa(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new gr(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.ua?this.la(e)&&(this.aa.next(e),t=!0):this.ha(e,this.onlineState)&&(this.Pa(e),t=!0),this.ca=e,t}onError(e){this.aa.error(e)}sa(e){this.onlineState=e;let t=!1;return this.ca&&!this.ua&&this.ha(this.ca,e)&&(this.Pa(this.ca),t=!0),t}ha(e,t){if(!e.fromCache||!this.ra())return!0;const n=t!=="Offline";return(!this.options.Ta||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}la(e){if(e.docChanges.length>0)return!0;const t=this.ca&&this.ca.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Pa(e){e=gr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.ua=!0,this.aa.next(e)}ra(){return this.options.source!==uc.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cm{constructor(e){this.key=e}}class km{constructor(e){this.key=e}}class ww{constructor(e,t){this.query=e,this.fa=t,this.ga=null,this.hasCachedResults=!1,this.current=!1,this.pa=H(),this.mutatedKeys=H(),this.ya=vp(e),this.wa=new Zn(this.ya)}get ba(){return this.fa}Sa(e,t){const n=t?t.Da:new fd,s=t?t.wa:this.wa;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,c=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((f,m)=>{const _=s.get(f),R=Ms(this.query,m)?m:null,C=!!_&&this.mutatedKeys.has(_.key),V=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let k=!1;_&&R?_.data.isEqual(R.data)?C!==V&&(n.track({type:3,doc:R}),k=!0):this.va(_,R)||(n.track({type:2,doc:R}),k=!0,(u&&this.ya(R,u)>0||h&&this.ya(R,h)<0)&&(c=!0)):!_&&R?(n.track({type:0,doc:R}),k=!0):_&&!R&&(n.track({type:1,doc:_}),k=!0,(u||h)&&(c=!0)),k&&(R?(o=o.add(R),i=V?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),i=i.delete(f.key),n.track({type:1,doc:f})}return{wa:o,Da:n,ls:c,mutatedKeys:i}}va(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.wa;this.wa=e.wa,this.mutatedKeys=e.mutatedKeys;const o=e.Da.X_();o.sort((f,m)=>function(R,C){const V=k=>{switch(k){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M()}};return V(R)-V(C)}(f.type,m.type)||this.ya(f.doc,m.doc)),this.Ca(n),s=s!=null&&s;const c=t&&!s?this.Fa():[],u=this.pa.size===0&&this.current&&!s?1:0,h=u!==this.ga;return this.ga=u,o.length!==0||h?{snapshot:new gr(this.query,e.wa,i,o,e.mutatedKeys,u===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),Ma:c}:{Ma:c}}sa(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({wa:this.wa,Da:new fd,mutatedKeys:this.mutatedKeys,ls:!1},!1)):{Ma:[]}}xa(e){return!this.fa.has(e)&&!!this.wa.has(e)&&!this.wa.get(e).hasLocalMutations}Ca(e){e&&(e.addedDocuments.forEach(t=>this.fa=this.fa.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.fa=this.fa.delete(t)),this.current=e.current)}Fa(){if(!this.current)return[];const e=this.pa;this.pa=H(),this.wa.forEach(n=>{this.xa(n.key)&&(this.pa=this.pa.add(n.key))});const t=[];return e.forEach(n=>{this.pa.has(n)||t.push(new km(n))}),this.pa.forEach(n=>{e.has(n)||t.push(new Cm(n))}),t}Oa(e){this.fa=e.gs,this.pa=H();const t=this.Sa(e.documents);return this.applyChanges(t,!0)}Na(){return gr.fromInitialDocuments(this.query,this.wa,this.mutatedKeys,this.ga===0,this.hasCachedResults)}}const br="SyncEngine";class Aw{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Rw{constructor(e){this.key=e,this.Ba=!1}}class bw{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.La={},this.ka=new At(c=>Tp(c),Ao),this.qa=new Map,this.Qa=new Set,this.$a=new se(O.comparator),this.Ka=new Map,this.Ua=new Wc,this.Wa={},this.Ga=new Map,this.za=kn.Un(),this.onlineState="Unknown",this.ja=void 0}get isPrimaryClient(){return this.ja===!0}}async function Sw(r,e,t=!0){const n=xo(r);let s;const i=n.ka.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Na()):s=await Dm(n,e,t,!0),s}async function Pw(r,e){const t=xo(r);await Dm(t,e,!0,!1)}async function Dm(r,e,t,n){const s=await no(r.localStore,Ke(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let c;return n&&(c=await uu(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&No(r.remoteStore,s),c}async function uu(r,e,t,n,s){r.Ha=(m,_,R)=>async function(V,k,j,B){let L=k.view.Sa(j);L.ls&&(L=await ic(V.localStore,k.query,!1).then(({documents:T})=>k.view.Sa(T,L)));const $=B&&B.targetChanges.get(k.targetId),Y=B&&B.targetMismatches.get(k.targetId)!=null,G=k.view.applyChanges(L,V.isPrimaryClient,$,Y);return lc(V,k.targetId,G.Ma),G.snapshot}(r,m,_,R);const i=await ic(r.localStore,e,!0),o=new ww(e,i.gs),c=o.Sa(i.documents),u=Us.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),h=o.applyChanges(c,r.isPrimaryClient,u);lc(r,t,h.Ma);const f=new Aw(e,t,o);return r.ka.set(e,f),r.qa.has(t)?r.qa.get(t).push(e):r.qa.set(t,[e]),h.snapshot}async function Cw(r,e,t){const n=F(r),s=n.ka.get(e),i=n.qa.get(s.targetId);if(i.length>1)return n.qa.set(s.targetId,i.filter(o=>!Ao(o,e))),void n.ka.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await pr(n.localStore,s.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(s.targetId),t&&mr(n.remoteStore,s.targetId),_r(n,s.targetId)}).catch(Xt)):(_r(n,s.targetId),await pr(n.localStore,s.targetId,!0))}async function kw(r,e){const t=F(r),n=t.ka.get(e),s=t.qa.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),mr(t.remoteStore,n.targetId))}async function Dw(r,e,t){const n=fu(r);try{const s=await function(o,c){const u=F(o),h=ce.now(),f=c.reduce((R,C)=>R.add(C.key),H());let m,_;return u.persistence.runTransaction("Locally write mutations","readwrite",R=>{let C=$e(),V=H();return u.ds.getEntries(R,f).next(k=>{C=k,C.forEach((j,B)=>{B.isValidDocument()||(V=V.add(j))})}).next(()=>u.localDocuments.getOverlayedDocuments(R,C)).next(k=>{m=k;const j=[];for(const B of c){const L=XE(B,m.get(B.key).overlayedDocument);L!=null&&j.push(new Rt(B.key,L,lp(L.value.mapValue),Ce.exists(!0)))}return u.mutationQueue.addMutationBatch(R,h,j,c)}).next(k=>{_=k;const j=k.applyToLocalDocumentSet(m,V);return u.documentOverlayCache.saveOverlays(R,k.batchId,j)})}).then(()=>({batchId:_.batchId,changes:Ap(m)}))}(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),function(o,c,u){let h=o.Wa[o.currentUser.toKey()];h||(h=new se(K)),h=h.insert(c,u),o.Wa[o.currentUser.toKey()]=h}(n,s.batchId,t),await tn(n,s.changes),await Ar(n.remoteStore)}catch(s){const i=su(s,"Failed to persist write");t.reject(i)}}async function Vm(r,e){const t=F(r);try{const n=await Qv(t.localStore,e);e.targetChanges.forEach((s,i)=>{const o=t.Ka.get(i);o&&(U(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?o.Ba=!0:s.modifiedDocuments.size>0?U(o.Ba):s.removedDocuments.size>0&&(U(o.Ba),o.Ba=!1))}),await tn(t,n,e)}catch(n){await Xt(n)}}function gd(r,e,t){const n=F(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.ka.forEach((i,o)=>{const c=o.view.sa(e);c.snapshot&&s.push(c.snapshot)}),function(o,c){const u=F(o);u.onlineState=c;let h=!1;u.queries.forEach((f,m)=>{for(const _ of m.ta)_.sa(c)&&(h=!0)}),h&&au(u)}(n.eventManager,e),s.length&&n.La.p_(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function Vw(r,e,t){const n=F(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Ka.get(e),i=s&&s.key;if(i){let o=new se(O.comparator);o=o.insert(i,le.newNoDocument(i,q.min()));const c=H().add(i),u=new Fs(q.min(),new Map,new se(K),o,c);await Vm(n,u),n.$a=n.$a.remove(i),n.Ka.delete(e),du(n)}else await pr(n.localStore,e,!1).then(()=>_r(n,e,t)).catch(Xt)}async function Nw(r,e){const t=F(r),n=e.batch.batchId;try{const s=await Wv(t.localStore,e);hu(t,n,null),lu(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await tn(t,s)}catch(s){await Xt(s)}}async function xw(r,e,t){const n=F(r);try{const s=await function(o,c){const u=F(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let f;return u.mutationQueue.lookupMutationBatch(h,c).next(m=>(U(m!==null),f=m.keys(),u.mutationQueue.removeMutationBatch(h,m))).next(()=>u.mutationQueue.performConsistencyCheck(h)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,c)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f)).next(()=>u.localDocuments.getDocuments(h,f))})}(n.localStore,e);hu(n,e,t),lu(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await tn(n,s)}catch(s){await Xt(s)}}function lu(r,e){(r.Ga.get(e)||[]).forEach(t=>{t.resolve()}),r.Ga.delete(e)}function hu(r,e,t){const n=F(r);let s=n.Wa[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.Wa[n.currentUser.toKey()]=s}}function _r(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.qa.get(e))r.ka.delete(n),t&&r.La.Ja(n,t);r.qa.delete(e),r.isPrimaryClient&&r.Ua.Sr(e).forEach(n=>{r.Ua.containsKey(n)||Nm(r,n)})}function Nm(r,e){r.Qa.delete(e.path.canonicalString());const t=r.$a.get(e);t!==null&&(mr(r.remoteStore,t),r.$a=r.$a.remove(e),r.Ka.delete(t),du(r))}function lc(r,e,t){for(const n of t)n instanceof Cm?(r.Ua.addReference(n.key,e),Ow(r,n)):n instanceof km?(D(br,"Document no longer in limbo: "+n.key),r.Ua.removeReference(n.key,e),r.Ua.containsKey(n.key)||Nm(r,n.key)):M()}function Ow(r,e){const t=e.key,n=t.path.canonicalString();r.$a.get(t)||r.Qa.has(n)||(D(br,"New document in limbo: "+t),r.Qa.add(n),du(r))}function du(r){for(;r.Qa.size>0&&r.$a.size<r.maxConcurrentLimboResolutions;){const e=r.Qa.values().next().value;r.Qa.delete(e);const t=new O(Z.fromString(e)),n=r.za.next();r.Ka.set(n,new Rw(t)),r.$a=r.$a.insert(t,n),No(r.remoteStore,new pt(Ke(Ls(t.path)),n,"TargetPurposeLimboResolution",Fe.ae))}}async function tn(r,e,t){const n=F(r),s=[],i=[],o=[];n.ka.isEmpty()||(n.ka.forEach((c,u)=>{o.push(n.Ha(u,e,t).then(h=>{var f;if((h||t)&&n.isPrimaryClient){const m=h?!h.fromCache:(f=t==null?void 0:t.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;n.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(h){s.push(h);const m=Jc.Yi(u.targetId,h);i.push(m)}}))}),await Promise.all(o),n.La.p_(s),await async function(u,h){const f=F(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>w.forEach(h,_=>w.forEach(_.Hi,R=>f.persistence.referenceDelegate.addReference(m,_.targetId,R)).next(()=>w.forEach(_.Ji,R=>f.persistence.referenceDelegate.removeReference(m,_.targetId,R)))))}catch(m){if(!Zt(m))throw m;D(Xc,"Failed to update sequence numbers: "+m)}for(const m of h){const _=m.targetId;if(!m.fromCache){const R=f.Ts.get(_),C=R.snapshotVersion,V=R.withLastLimboFreeSnapshotVersion(C);f.Ts=f.Ts.insert(_,V)}}}(n.localStore,i))}async function Lw(r,e){const t=F(r);if(!t.currentUser.isEqual(e)){D(br,"User change. New user:",e.toKey());const n=await dm(t.localStore,e);t.currentUser=e,function(i,o){i.Ga.forEach(c=>{c.forEach(u=>{u.reject(new N(P.CANCELLED,o))})}),i.Ga.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await tn(t,n.Rs)}}function Mw(r,e){const t=F(r),n=t.Ka.get(e);if(n&&n.Ba)return H().add(n.key);{let s=H();const i=t.qa.get(e);if(!i)return s;for(const o of i){const c=t.ka.get(o);s=s.unionWith(c.view.ba)}return s}}async function Fw(r,e){const t=F(r),n=await ic(t.localStore,e.query,!0),s=e.view.Oa(n);return t.isPrimaryClient&&lc(t,e.targetId,s.Ma),s}async function Uw(r,e){const t=F(r);return mm(t.localStore,e).then(n=>tn(t,n))}async function Bw(r,e,t,n){const s=F(r),i=await function(c,u){const h=F(c),f=F(h.mutationQueue);return h.persistence.runTransaction("Lookup mutation documents","readonly",m=>f.Ln(m,u).next(_=>_?h.localDocuments.getDocuments(m,_):w.resolve(null)))}(s.localStore,e);i!==null?(t==="pending"?await Ar(s.remoteStore):t==="acknowledged"||t==="rejected"?(hu(s,e,n||null),lu(s,e),function(c,u){F(F(c).mutationQueue).qn(u)}(s.localStore,e)):M(),await tn(s,i)):D(br,"Cannot apply mutation batch with id: "+e)}async function qw(r,e){const t=F(r);if(xo(t),fu(t),e===!0&&t.ja!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await _d(t,n.toArray());t.ja=!0,await cc(t.remoteStore,!0);for(const i of s)No(t.remoteStore,i)}else if(e===!1&&t.ja!==!1){const n=[];let s=Promise.resolve();t.qa.forEach((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then(()=>(_r(t,o),pr(t.localStore,o,!0))),mr(t.remoteStore,o)}),await s,await _d(t,n),function(o){const c=F(o);c.Ka.forEach((u,h)=>{mr(c.remoteStore,h)}),c.Ua.Dr(),c.Ka=new Map,c.$a=new se(O.comparator)}(t),t.ja=!1,await cc(t.remoteStore,!1)}}async function _d(r,e,t){const n=F(r),s=[],i=[];for(const o of e){let c;const u=n.qa.get(o);if(u&&u.length!==0){c=await no(n.localStore,Ke(u[0]));for(const h of u){const f=n.ka.get(h),m=await Fw(n,f);m.snapshot&&i.push(m.snapshot)}}else{const h=await pm(n.localStore,o);c=await no(n.localStore,h),await uu(n,xm(h),o,!1,c.resumeToken)}s.push(c)}return n.La.p_(i),s}function xm(r){return yp(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function jw(r){return function(t){return F(F(t).persistence).zi()}(F(r).localStore)}async function $w(r,e,t,n){const s=F(r);if(s.ja)return void D(br,"Ignoring unexpected query state notification.");const i=s.qa.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{const o=await mm(s.localStore,Ep(i[0])),c=Fs.createSynthesizedRemoteEventForCurrentChange(e,t==="current",pe.EMPTY_BYTE_STRING);await tn(s,o,c);break}case"rejected":await pr(s.localStore,e,!0),_r(s,e,n);break;default:M()}}async function zw(r,e,t){const n=xo(r);if(n.ja){for(const s of e){if(n.qa.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){D(br,"Adding an already active target "+s);continue}const i=await pm(n.localStore,s),o=await no(n.localStore,i);await uu(n,xm(i),o.targetId,!1,o.resumeToken),No(n.remoteStore,o)}for(const s of t)n.qa.has(s)&&await pr(n.localStore,s,!1).then(()=>{mr(n.remoteStore,s),_r(n,s)}).catch(Xt)}}function xo(r){const e=F(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Vm.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Mw.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Vw.bind(null,e),e.La.p_=Ew.bind(null,e.eventManager),e.La.Ja=vw.bind(null,e.eventManager),e}function fu(r){const e=F(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Nw.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=xw.bind(null,e),e}class bs{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Do(e.databaseInfo.databaseId),this.sharedClientState=this.Za(e),this.persistence=this.Xa(e),await this.persistence.start(),this.localStore=this.eu(e),this.gcScheduler=this.tu(e,this.localStore),this.indexBackfillerScheduler=this.nu(e,this.localStore)}tu(e,t){return null}nu(e,t){return null}eu(e){return hm(this.persistence,new lm,e.initialUser,this.serializer)}Xa(e){return new Qc(ko.ri,this.serializer)}Za(e){return new Tm}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}bs.provider={build:()=>new bs};class Kw extends bs{constructor(e){super(),this.cacheSizeBytes=e}tu(e,t){U(this.persistence.referenceDelegate instanceof to);const n=this.persistence.referenceDelegate.garbageCollector;return new sm(n,e.asyncQueue,t)}Xa(e){const t=this.cacheSizeBytes!==void 0?Se.withCacheSize(this.cacheSizeBytes):Se.DEFAULT;return new Qc(n=>to.ri(n,t),this.serializer)}}class Gw extends bs{constructor(e,t,n){super(),this.ru=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.ru.initialize(this,e),await fu(this.ru.syncEngine),await Ar(this.ru.remoteStore),await this.persistence.Ci(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}eu(e){return hm(this.persistence,new lm,e.initialUser,this.serializer)}tu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new sm(n,e.asyncQueue,t)}nu(e,t){const n=new tE(t,this.persistence);return new eE(e.asyncQueue,n)}Xa(e){const t=um(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Se.withCacheSize(this.cacheSizeBytes):Se.DEFAULT;return new Yc(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,Em(),ki(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Za(e){return new Tm}}class Hw extends Gw{constructor(e,t){super(e,t,!1),this.ru=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.ru.syncEngine;this.sharedClientState instanceof Sa&&(this.sharedClientState.syncEngine={uo:Bw.bind(null,t),co:$w.bind(null,t),lo:zw.bind(null,t),zi:jw.bind(null,t),ao:Uw.bind(null,t)},await this.sharedClientState.start()),await this.persistence.Ci(async n=>{await qw(this.ru.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())})}Za(e){const t=Em();if(!Sa.D(t))throw new N(P.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=um(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Sa(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class oo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>gd(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=Lw.bind(null,this.syncEngine),await cc(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Tw}()}createDatastore(e){const t=Do(e.databaseInfo.databaseId),n=function(i){return new nw(i)}(e.databaseInfo);return function(i,o,c,u){return new ow(i,o,c,u)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(n,s,i,o,c){return new cw(n,s,i,o,c)}(this.localStore,this.datastore,e.asyncQueue,t=>gd(this.syncEngine,t,0),function(){return ld.D()?new ld:new Xv}())}createSyncEngine(e,t){return function(s,i,o,c,u,h,f){const m=new bw(s,i,o,c,u,h);return f&&(m.ja=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const i=F(s);D(Dn,"RemoteStore shutting down."),i.W_.add(5),await Bs(i),i.z_.shutdown(),i.j_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}oo.provider={build:()=>new oo};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pu{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.iu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.iu(this.observer.error,e):fe("Uncaught Error in snapshot listener:",e.toString()))}su(){this.muted=!0}iu(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jt="FirestoreClient";class Ww{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=s,this.user=Ie.UNAUTHENTICATED,this.clientId=Ff.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async o=>{D(Jt,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(n,o=>(D(Jt,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new it;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=su(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function Ca(r,e){r.asyncQueue.verifyOperationInProgress(),D(Jt,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener(async s=>{n.isEqual(s)||(await dm(e.localStore,s),n=s)}),e.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=e}async function yd(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Qw(r);D(Jt,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener(n=>dd(e.remoteStore,n)),r.setAppCheckTokenChangeListener((n,s)=>dd(e.remoteStore,s)),r._onlineComponents=e}async function Qw(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){D(Jt,"Using user provided OfflineComponentProvider");try{await Ca(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===P.FAILED_PRECONDITION||s.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;Rn("Error using user provided cache. Falling back to memory cache: "+t),await Ca(r,new bs)}}else D(Jt,"Using default OfflineComponentProvider"),await Ca(r,new Kw(void 0));return r._offlineComponents}async function Om(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(D(Jt,"Using user provided OnlineComponentProvider"),await yd(r,r._uninitializedComponentsProvider._online)):(D(Jt,"Using default OnlineComponentProvider"),await yd(r,new oo))),r._onlineComponents}function Yw(r){return Om(r).then(e=>e.syncEngine)}async function ao(r){const e=await Om(r),t=e.eventManager;return t.onListen=Sw.bind(null,e.syncEngine),t.onUnlisten=Cw.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Pw.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=kw.bind(null,e.syncEngine),t}function Jw(r,e,t={}){const n=new it;return r.asyncQueue.enqueueAndForget(async()=>function(i,o,c,u,h){const f=new pu({next:_=>{f.su(),o.enqueueAndForget(()=>ou(i,m));const R=_.docs.has(c);!R&&_.fromCache?h.reject(new N(P.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&_.fromCache&&u&&u.source==="server"?h.reject(new N(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(_)},error:_=>h.reject(_)}),m=new cu(Ls(c.path),f,{includeMetadataChanges:!0,Ta:!0});return iu(i,m)}(await ao(r),r.asyncQueue,e,t,n)),n.promise}function Xw(r,e,t={}){const n=new it;return r.asyncQueue.enqueueAndForget(async()=>function(i,o,c,u,h){const f=new pu({next:_=>{f.su(),o.enqueueAndForget(()=>ou(i,m)),_.fromCache&&u.source==="server"?h.reject(new N(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(_)},error:_=>h.reject(_)}),m=new cu(c,f,{includeMetadataChanges:!0,Ta:!0});return iu(i,m)}(await ao(r),r.asyncQueue,e,t,n)),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lm(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Id=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mm(r,e,t){if(!t)throw new N(P.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function Zw(r,e,t,n){if(e===!0&&n===!0)throw new N(P.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Td(r){if(!O.isDocumentKey(r))throw new N(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Ed(r){if(O.isDocumentKey(r))throw new N(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Oo(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":M()}function Me(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new N(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Oo(r);throw new N(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function eA(r,e){if(e<=0)throw new N(P.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fm="firestore.googleapis.com",vd=!0;class wd{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new N(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Fm,this.ssl=vd}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:vd;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=em;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Pv)throw new N(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Zw("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Lm((n=e.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new N(P.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new N(P.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new N(P.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,s){return n.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Lo{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new wd({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new wd(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new zT;switch(n.type){case"firstParty":return new WT(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new N(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const n=Id.get(t);n&&(D("ComponentProvider","Removing Datastore"),Id.delete(t),n.terminate())}(this),Promise.resolve()}}function tA(r,e,t,n={}){var s;const i=(r=Me(r,Lo))._getSettings(),o=Object.assign(Object.assign({},i),{emulatorOptions:r._getEmulatorOptions()}),c=`${e}:${t}`;i.host!==Fm&&i.host!==c&&Rn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u=Object.assign(Object.assign({},i),{host:c,ssl:!1,emulatorOptions:n});if(!En(u,o)&&(r._setSettings(u),n.mockUserToken)){let h,f;if(typeof n.mockUserToken=="string")h=n.mockUserToken,f=Ie.MOCK_USER;else{h=$d(n.mockUserToken,(s=r._app)===null||s===void 0?void 0:s.options.projectId);const m=n.mockUserToken.sub||n.mockUserToken.user_id;if(!m)throw new N(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");f=new Ie(m)}r._authCredentials=new KT(new Mf(h,f))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new bt(this.firestore,e,this._query)}}class De{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Gt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new De(this.firestore,e,this._key)}}class Gt extends bt{constructor(e,t,n){super(e,t,Ls(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new De(this.firestore,null,new O(e))}withConverter(e){return new Gt(this.firestore,e,this._path)}}function ZR(r,e,...t){if(r=re(r),Mm("collection","path",e),r instanceof Lo){const n=Z.fromString(e,...t);return Ed(n),new Gt(r,null,n)}{if(!(r instanceof De||r instanceof Gt))throw new N(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Z.fromString(e,...t));return Ed(n),new Gt(r.firestore,null,n)}}function nA(r,e,...t){if(r=re(r),arguments.length===1&&(e=Ff.newId()),Mm("doc","path",e),r instanceof Lo){const n=Z.fromString(e,...t);return Td(n),new De(r,null,new O(n))}{if(!(r instanceof De||r instanceof Gt))throw new N(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Z.fromString(e,...t));return Td(n),new De(r.firestore,r instanceof Gt?r.converter:null,new O(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ad="AsyncQueue";class Rd{constructor(e=Promise.resolve()){this.Vu=[],this.mu=!1,this.fu=[],this.gu=null,this.pu=!1,this.yu=!1,this.wu=[],this.a_=new vm(this,"async_queue_retry"),this.bu=()=>{const n=ki();n&&D(Ad,"Visibility state changed to "+n.visibilityState),this.a_.t_()},this.Su=e;const t=ki();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.bu)}get isShuttingDown(){return this.mu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Du(),this.vu(e)}enterRestrictedMode(e){if(!this.mu){this.mu=!0,this.yu=e||!1;const t=ki();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.bu)}}enqueue(e){if(this.Du(),this.mu)return new Promise(()=>{});const t=new it;return this.vu(()=>this.mu&&this.yu?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Vu.push(e),this.Cu()))}async Cu(){if(this.Vu.length!==0){try{await this.Vu[0](),this.Vu.shift(),this.a_.reset()}catch(e){if(!Zt(e))throw e;D(Ad,"Operation failed with retryable error: "+e)}this.Vu.length>0&&this.a_.Xo(()=>this.Cu())}}vu(e){const t=this.Su.then(()=>(this.pu=!0,e().catch(n=>{this.gu=n,this.pu=!1;const s=function(o){let c=o.message||"";return o.stack&&(c=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),c}(n);throw fe("INTERNAL UNHANDLED ERROR: ",s),n}).then(n=>(this.pu=!1,n))));return this.Su=t,t}enqueueAfterDelay(e,t,n){this.Du(),this.wu.indexOf(e)>-1&&(t=0);const s=ru.createAndSchedule(this,e,t,n,i=>this.Fu(i));return this.fu.push(s),s}Du(){this.gu&&M()}verifyOperationInProgress(){}async Mu(){let e;do e=this.Su,await e;while(e!==this.Su)}xu(e){for(const t of this.fu)if(t.timerId===e)return!0;return!1}Ou(e){return this.Mu().then(()=>{this.fu.sort((t,n)=>t.targetTimeMs-n.targetTimeMs);for(const t of this.fu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Mu()})}Nu(e){this.wu.push(e)}Fu(e){const t=this.fu.indexOf(e);this.fu.splice(t,1)}}function bd(r){return function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1}(r,["next","error","complete"])}class at extends Lo{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Rd,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Rd(e),this._firestoreClient=void 0,await e}}}function eb(r,e){const t=typeof r=="object"?r:fo(),n=typeof r=="string"?r:Gi,s=Cs(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=pc("firestore");i&&tA(s,...i)}return s}function Mo(r){if(r._terminated)throw new N(P.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Um(r),r._firestoreClient}function Um(r){var e,t,n;const s=r._freezeSettings(),i=function(c,u,h,f){return new CE(c,u,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Lm(f.experimentalLongPollingOptions),f.useFetchStreams)}(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,s);r._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((n=s.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(r._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),r._firestoreClient=new Ww(r._authCredentials,r._appCheckCredentials,r._queue,i,r._componentsProvider&&function(c){const u=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(u),_online:u}}(r._componentsProvider))}async function tb(r){Rn("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=r._freezeSettings();rA(r,oo.provider,{build:t=>new Hw(t,e.cacheSizeBytes)})}function rA(r,e,t){if((r=Me(r,at))._firestoreClient||r._terminated)throw new N(P.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(r._componentsProvider||r._getSettings().localCache)throw new N(P.FAILED_PRECONDITION,"SDK cache is already specified.");r._componentsProvider={_online:e,_offline:t},Um(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new yr(pe.fromBase64String(e))}catch(t){throw new N(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new yr(pe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ae(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uo{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mu{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return K(this._lat,e._lat)||K(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sA=/^__.*__$/;class iA{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Rt(e,this.data,this.fieldMask,t,this.fieldTransforms):new wr(e,this.data,t,this.fieldTransforms)}}class Bm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Rt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function qm(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M()}}class _u{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.Bu(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Lu(){return this.settings.Lu}ku(e){return new _u(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}qu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.ku({path:n,Qu:!1});return s.$u(e),s}Ku(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.ku({path:n,Qu:!1});return s.Bu(),s}Uu(e){return this.ku({path:void 0,Qu:!0})}Wu(e){return co(e,this.settings.methodName,this.settings.Gu||!1,this.path,this.settings.zu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}Bu(){if(this.path)for(let e=0;e<this.path.length;e++)this.$u(this.path.get(e))}$u(e){if(e.length===0)throw this.Wu("Document fields must not be empty");if(qm(this.Lu)&&sA.test(e))throw this.Wu('Document fields cannot begin and end with "__"')}}class oA{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Do(e)}ju(e,t,n,s=!1){return new _u({Lu:e,methodName:t,zu:n,path:ae.emptyPath(),Qu:!1,Gu:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Bo(r){const e=r._freezeSettings(),t=Do(r._databaseId);return new oA(r._databaseId,!!e.ignoreUndefinedProperties,t)}function jm(r,e,t,n,s,i={}){const o=r.ju(i.merge||i.mergeFields?2:0,e,t,s);Iu("Data must be an object, but it was:",o,n);const c=$m(n,o);let u,h;if(i.merge)u=new Ue(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const _=hc(e,m,t);if(!o.contains(_))throw new N(P.INVALID_ARGUMENT,`Field '${_}' is specified in your field mask but missing from your input data.`);Km(f,_)||f.push(_)}u=new Ue(f),h=o.fieldTransforms.filter(m=>u.covers(m.field))}else u=null,h=o.fieldTransforms;return new iA(new Pe(c),u,h)}class qo extends Uo{_toFieldTransform(e){if(e.Lu!==2)throw e.Lu===1?e.Wu(`${this._methodName}() can only appear at the top level of your update data`):e.Wu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof qo}}class yu extends Uo{_toFieldTransform(e){return new Dp(e.path,new lr)}isEqual(e){return e instanceof yu}}function aA(r,e,t,n){const s=r.ju(1,e,t);Iu("Data must be an object, but it was:",s,n);const i=[],o=Pe.empty();en(n,(u,h)=>{const f=Tu(e,u,t);h=re(h);const m=s.Ku(f);if(h instanceof qo)i.push(f);else{const _=qs(h,m);_!=null&&(i.push(f),o.set(f,_))}});const c=new Ue(i);return new Bm(o,c,s.fieldTransforms)}function cA(r,e,t,n,s,i){const o=r.ju(1,e,t),c=[hc(e,n,t)],u=[s];if(i.length%2!=0)throw new N(P.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let _=0;_<i.length;_+=2)c.push(hc(e,i[_])),u.push(i[_+1]);const h=[],f=Pe.empty();for(let _=c.length-1;_>=0;--_)if(!Km(h,c[_])){const R=c[_];let C=u[_];C=re(C);const V=o.Ku(R);if(C instanceof qo)h.push(R);else{const k=qs(C,V);k!=null&&(h.push(R),f.set(R,k))}}const m=new Ue(h);return new Bm(f,m,o.fieldTransforms)}function uA(r,e,t,n=!1){return qs(t,r.ju(n?4:3,e))}function qs(r,e){if(zm(r=re(r)))return Iu("Unsupported field value:",e,r),$m(r,e);if(r instanceof Uo)return function(n,s){if(!qm(s.Lu))throw s.Wu(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Wu(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.Qu&&e.Lu!==4)throw e.Wu("Nested arrays are not supported");return function(n,s){const i=[];let o=0;for(const c of n){let u=qs(c,s.Uu(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}}(r,e)}return function(n,s){if((n=re(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return GE(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=ce.fromDate(n);return{timestampValue:fr(s.serializer,i)}}if(n instanceof ce){const i=new ce(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:fr(s.serializer,i)}}if(n instanceof mu)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof yr)return{bytesValue:Fp(s.serializer,n._byteString)};if(n instanceof De){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.Wu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Kc(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof gu)return function(o,c){return{mapValue:{fields:{[Lc]:{stringValue:Mc},[or]:{arrayValue:{values:o.toArray().map(h=>{if(typeof h!="number")throw c.Wu("VectorValues must only contain numeric values.");return Bc(c.serializer,h)})}}}}}}(n,s);throw s.Wu(`Unsupported field value: ${Oo(n)}`)}(r,e)}function $m(r,e){const t={};return tp(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):en(r,(n,s)=>{const i=qs(s,e.qu(n));i!=null&&(t[n]=i)}),{mapValue:{fields:t}}}function zm(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof ce||r instanceof mu||r instanceof yr||r instanceof De||r instanceof Uo||r instanceof gu)}function Iu(r,e,t){if(!zm(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const n=Oo(t);throw n==="an object"?e.Wu(r+" a custom object"):e.Wu(r+" "+n)}}function hc(r,e,t){if((e=re(e))instanceof Fo)return e._internalPath;if(typeof e=="string")return Tu(r,e);throw co("Field path arguments must be of type string or ",r,!1,void 0,t)}const lA=new RegExp("[~\\*/\\[\\]]");function Tu(r,e,t){if(e.search(lA)>=0)throw co(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Fo(...e.split("."))._internalPath}catch{throw co(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function co(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new N(P.INVALID_ARGUMENT,c+r+u)}function Km(r,e){return r.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gm{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new De(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new hA(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(jo("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class hA extends Gm{data(){return super.data()}}function jo(r,e){return typeof e=="string"?Tu(r,e):e instanceof Fo?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hm(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new N(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Eu{}class vu extends Eu{}function nb(r,e,...t){let n=[];e instanceof Eu&&n.push(e),n=n.concat(t),function(i){const o=i.filter(u=>u instanceof wu).length,c=i.filter(u=>u instanceof $o).length;if(o>1||o>0&&c>0)throw new N(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const s of n)r=s._apply(r);return r}class $o extends vu{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new $o(e,t,n)}_apply(e){const t=this._parse(e);return Wm(e._query,t),new bt(e.firestore,e.converter,Ja(e._query,t))}_parse(e){const t=Bo(e.firestore);return function(i,o,c,u,h,f,m){let _;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new N(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Pd(m,f);const C=[];for(const V of m)C.push(Sd(u,i,V));_={arrayValue:{values:C}}}else _=Sd(u,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Pd(m,f),_=uA(c,o,m,f==="in"||f==="not-in");return Q.create(h,f,_)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function rb(r,e,t){const n=e,s=jo("where",r);return $o._create(s,n,t)}class wu extends Eu{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new wu(e,t)}_parse(e){const t=this._queryConstraints.map(n=>n._parse(e)).filter(n=>n.getFilters().length>0);return t.length===1?t[0]:ee.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(s,i){let o=s;const c=i.getFlattenedFilters();for(const u of c)Wm(o,u),o=Ja(o,u)}(e._query,t),new bt(e.firestore,e.converter,Ja(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Au extends vu{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Au(e,t)}_apply(e){const t=function(s,i,o){if(s.startAt!==null)throw new N(P.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new N(P.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new As(i,o)}(e._query,this._field,this._direction);return new bt(e.firestore,e.converter,function(s,i){const o=s.explicitOrderBy.concat([i]);return new vr(s.path,s.collectionGroup,o,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(e._query,t))}}function sb(r,e="asc"){const t=e,n=jo("orderBy",r);return Au._create(n,t)}class Ru extends vu{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Ru(e,t,n)}_apply(e){return new bt(e.firestore,e.converter,Qi(e._query,this._limit,this._limitType))}}function ib(r){return eA("limit",r),Ru._create("limit",r,"F")}function Sd(r,e,t){if(typeof(t=re(t))=="string"){if(t==="")throw new N(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ip(e)&&t.indexOf("/")!==-1)throw new N(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(Z.fromString(t));if(!O.isDocumentKey(n))throw new N(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return vs(r,new O(n))}if(t instanceof De)return vs(r,t._key);throw new N(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Oo(t)}.`)}function Pd(r,e){if(!Array.isArray(r)||r.length===0)throw new N(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Wm(r,e){const t=function(s,i){for(const o of s)for(const c of o.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null}(r.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new N(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new N(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class dA{convertValue(e,t="none"){switch(Wt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return oe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Tt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw M()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return en(e,(s,i)=>{n[s]=this.convertValue(i,t)}),n}convertVectorValue(e){var t,n,s;const i=(s=(n=(t=e.fields)===null||t===void 0?void 0:t[or].arrayValue)===null||n===void 0?void 0:n.values)===null||s===void 0?void 0:s.map(o=>oe(o.doubleValue));return new gu(i)}convertGeoPoint(e){return new mu(oe(e.latitude),oe(e.longitude))}convertArray(e,t){return(e.values||[]).map(n=>this.convertValue(n,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=vo(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Ts(e));default:return null}}convertTimestamp(e){const t=It(e);return new ce(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Z.fromString(e);U(Wp(n));const s=new bn(n.get(1),n.get(3)),i=new O(n.popFirst(5));return s.isEqual(t)||fe(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qm(r,e,t){let n;return n=r?r.toFirestore(e):e,n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Ym extends Gm{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Di(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(jo("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}}class Di extends Ym{data(e={}){return super.data(e)}}class Jm{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new ns(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new Di(this._firestore,this._userDataWriter,n.key,n,new ns(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map(c=>{const u=new Di(s._firestore,s._userDataWriter,c.doc.key,c.doc,new ns(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(c=>i||c.type!==3).map(c=>{const u=new Di(s._firestore,s._userDataWriter,c.doc.key,c.doc,new ns(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,f=-1;return c.type!==0&&(h=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),f=o.indexOf(c.doc.key)),{type:fA(c.type),doc:u,oldIndex:h,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function fA(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ob(r){r=Me(r,De);const e=Me(r.firestore,at);return Jw(Mo(e),r._key).then(t=>Xm(e,r,t))}class bu extends dA{constructor(e){super(),this.firestore=e}convertBytes(e){return new yr(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new De(this.firestore,null,t)}}function ab(r){r=Me(r,bt);const e=Me(r.firestore,at),t=Mo(e),n=new bu(e);return Hm(r._query),Xw(t,r._query).then(s=>new Jm(e,n,r,s))}function cb(r,e,t){r=Me(r,De);const n=Me(r.firestore,at),s=Qm(r.converter,e);return zo(n,[jm(Bo(n),"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,Ce.none())])}function ub(r,e,t,...n){r=Me(r,De);const s=Me(r.firestore,at),i=Bo(s);let o;return o=typeof(e=re(e))=="string"||e instanceof Fo?cA(i,"updateDoc",r._key,e,t,n):aA(i,"updateDoc",r._key,e),zo(s,[o.toMutation(r._key,Ce.exists(!0))])}function lb(r){return zo(Me(r.firestore,at),[new So(r._key,Ce.none())])}function hb(r,e){const t=Me(r.firestore,at),n=nA(r),s=Qm(r.converter,e);return zo(t,[jm(Bo(r.firestore),"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,Ce.exists(!1))]).then(()=>n)}function db(r,...e){var t,n,s;r=re(r);let i={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||bd(e[o])||(i=e[o],o++);const c={includeMetadataChanges:i.includeMetadataChanges,source:i.source};if(bd(e[o])){const m=e[o];e[o]=(t=m.next)===null||t===void 0?void 0:t.bind(m),e[o+1]=(n=m.error)===null||n===void 0?void 0:n.bind(m),e[o+2]=(s=m.complete)===null||s===void 0?void 0:s.bind(m)}let u,h,f;if(r instanceof De)h=Me(r.firestore,at),f=Ls(r._key.path),u={next:m=>{e[o]&&e[o](Xm(h,r,m))},error:e[o+1],complete:e[o+2]};else{const m=Me(r,bt);h=Me(m.firestore,at),f=m._query;const _=new bu(h);u={next:R=>{e[o]&&e[o](new Jm(h,_,m,R))},error:e[o+1],complete:e[o+2]},Hm(r._query)}return function(_,R,C,V){const k=new pu(V),j=new cu(R,k,C);return _.asyncQueue.enqueueAndForget(async()=>iu(await ao(_),j)),()=>{k.su(),_.asyncQueue.enqueueAndForget(async()=>ou(await ao(_),j))}}(Mo(h),f,c,u)}function zo(r,e){return function(n,s){const i=new it;return n.asyncQueue.enqueueAndForget(async()=>Dw(await Yw(n),s,i)),i.promise}(Mo(r),e)}function Xm(r,e,t){const n=t.docs.get(e._key),s=new bu(r);return new Ym(r,s,e._key,n,new ns(t.hasPendingWrites,t.fromCache),e.converter)}function fb(){return new yu("serverTimestamp")}(function(e,t=!0){(function(s){Er=s})(Nn),Ht(new gt("firestore",(n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),c=new at(new GT(n.getProvider("auth-internal")),new QT(o,n.getProvider("app-check-internal")),function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new N(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new bn(h.options.projectId,f)}(o,s),o);return i=Object.assign({useFetchStreams:t},i),c._setSettings(i),c},"PUBLIC").setMultipleInstances(!0)),He(uh,lh,e),He(uh,lh,"esm2017")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zm="firebasestorage.googleapis.com",eg="storageBucket",pA=2*60*1e3,mA=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de extends Xe{constructor(e,t,n=0){super(ka(e),`Firebase Storage: ${t} (${ka(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,de.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return ka(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var he;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(he||(he={}));function ka(r){return"storage/"+r}function Su(){const r="An unknown error occurred, please check the error payload for server response.";return new de(he.UNKNOWN,r)}function gA(r){return new de(he.OBJECT_NOT_FOUND,"Object '"+r+"' does not exist.")}function _A(r){return new de(he.QUOTA_EXCEEDED,"Quota for bucket '"+r+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function yA(){const r="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new de(he.UNAUTHENTICATED,r)}function IA(){return new de(he.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function TA(r){return new de(he.UNAUTHORIZED,"User does not have permission to access '"+r+"'.")}function EA(){return new de(he.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function vA(){return new de(he.CANCELED,"User canceled the upload/download.")}function wA(r){return new de(he.INVALID_URL,"Invalid URL '"+r+"'.")}function AA(r){return new de(he.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function RA(){return new de(he.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+eg+"' property when initializing the app?")}function bA(){return new de(he.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function SA(){return new de(he.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function PA(r){return new de(he.UNSUPPORTED_ENVIRONMENT,`${r} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function dc(r){return new de(he.INVALID_ARGUMENT,r)}function tg(){return new de(he.APP_DELETED,"The Firebase app was deleted.")}function CA(r){return new de(he.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function hs(r,e){return new de(he.INVALID_FORMAT,"String does not match format '"+r+"': "+e)}function Qr(r){throw new de(he.INTERNAL_ERROR,"Internal error: "+r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let n;try{n=ze.makeFromUrl(e,t)}catch{return new ze(e,"")}if(n.path==="")return n;throw AA(e)}static makeFromUrl(e,t){let n=null;const s="([A-Za-z0-9.\\-_]+)";function i($){$.path.charAt($.path.length-1)==="/"&&($.path_=$.path_.slice(0,-1))}const o="(/(.*))?$",c=new RegExp("^gs://"+s+o,"i"),u={bucket:1,path:3};function h($){$.path_=decodeURIComponent($.path)}const f="v[A-Za-z0-9_]+",m=t.replace(/[.]/g,"\\."),_="(/([^?#]*).*)?$",R=new RegExp(`^https?://${m}/${f}/b/${s}/o${_}`,"i"),C={bucket:1,path:3},V=t===Zm?"(?:storage.googleapis.com|storage.cloud.google.com)":t,k="([^?#]*)",j=new RegExp(`^https?://${V}/${s}/${k}`,"i"),L=[{regex:c,indices:u,postModify:i},{regex:R,indices:C,postModify:h},{regex:j,indices:{bucket:1,path:2},postModify:h}];for(let $=0;$<L.length;$++){const Y=L[$],G=Y.regex.exec(e);if(G){const T=G[Y.indices.bucket];let g=G[Y.indices.path];g||(g=""),n=new ze(T,g),Y.postModify(n);break}}if(n==null)throw wA(e);return n}}class kA{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DA(r,e,t){let n=1,s=null,i=null,o=!1,c=0;function u(){return c===2}let h=!1;function f(...k){h||(h=!0,e.apply(null,k))}function m(k){s=setTimeout(()=>{s=null,r(R,u())},k)}function _(){i&&clearTimeout(i)}function R(k,...j){if(h){_();return}if(k){_(),f.call(null,k,...j);return}if(u()||o){_(),f.call(null,k,...j);return}n<64&&(n*=2);let L;c===1?(c=2,L=0):L=(n+Math.random())*1e3,m(L)}let C=!1;function V(k){C||(C=!0,_(),!h&&(s!==null?(k||(c=2),clearTimeout(s),m(0)):k||(c=1)))}return m(0),i=setTimeout(()=>{o=!0,V(!0)},t),V}function VA(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NA(r){return r!==void 0}function xA(r){return typeof r=="object"&&!Array.isArray(r)}function Pu(r){return typeof r=="string"||r instanceof String}function Cd(r){return Cu()&&r instanceof Blob}function Cu(){return typeof Blob<"u"}function kd(r,e,t,n){if(n<e)throw dc(`Invalid value for '${r}'. Expected ${e} or greater.`);if(n>t)throw dc(`Invalid value for '${r}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ku(r,e,t){let n=e;return t==null&&(n=`https://${e}`),`${t}://${n}/v0${r}`}function ng(r){const e=encodeURIComponent;let t="?";for(const n in r)if(r.hasOwnProperty(n)){const s=e(n)+"="+e(r[n]);t=t+s+"&"}return t=t.slice(0,-1),t}var Tn;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(Tn||(Tn={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OA(r,e){const t=r>=500&&r<600,s=[408,429].indexOf(r)!==-1,i=e.indexOf(r)!==-1;return t||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LA{constructor(e,t,n,s,i,o,c,u,h,f,m,_=!0){this.url_=e,this.method_=t,this.headers_=n,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=c,this.errorCallback_=u,this.timeout_=h,this.progressCallback_=f,this.connectionFactory_=m,this.retry=_,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((R,C)=>{this.resolve_=R,this.reject_=C,this.start_()})}start_(){const e=(n,s)=>{if(s){n(!1,new mi(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const o=c=>{const u=c.loaded,h=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,h)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;const c=i.getErrorCode()===Tn.NO_ERROR,u=i.getStatus();if(!c||OA(u,this.additionalRetryCodes_)&&this.retry){const f=i.getErrorCode()===Tn.ABORT;n(!1,new mi(!1,null,f));return}const h=this.successCodes_.indexOf(u)!==-1;n(!0,new mi(h,i))})},t=(n,s)=>{const i=this.resolve_,o=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const u=this.callback_(c,c.getResponse());NA(u)?i(u):i()}catch(u){o(u)}else if(c!==null){const u=Su();u.serverResponse=c.getErrorText(),this.errorCallback_?o(this.errorCallback_(c,u)):o(u)}else if(s.canceled){const u=this.appDelete_?tg():vA();o(u)}else{const u=EA();o(u)}};this.canceled_?t(!1,new mi(!1,null,!0)):this.backoffId_=DA(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&VA(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class mi{constructor(e,t,n){this.wasSuccessCode=e,this.connection=t,this.canceled=!!n}}function MA(r,e){e!==null&&e.length>0&&(r.Authorization="Firebase "+e)}function FA(r,e){r["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function UA(r,e){e&&(r["X-Firebase-GMPID"]=e)}function BA(r,e){e!==null&&(r["X-Firebase-AppCheck"]=e)}function qA(r,e,t,n,s,i,o=!0){const c=ng(r.urlParams),u=r.url+c,h=Object.assign({},r.headers);return UA(h,e),MA(h,t),FA(h,i),BA(h,n),new LA(u,r.method,h,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,s,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jA(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function $A(...r){const e=jA();if(e!==void 0){const t=new e;for(let n=0;n<r.length;n++)t.append(r[n]);return t.getBlob()}else{if(Cu())return new Blob(r);throw new de(he.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function zA(r,e,t){return r.webkitSlice?r.webkitSlice(e,t):r.mozSlice?r.mozSlice(e,t):r.slice?r.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function KA(r){if(typeof atob>"u")throw PA("base-64");return atob(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rt={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Da{constructor(e,t){this.data=e,this.contentType=t||null}}function GA(r,e){switch(r){case rt.RAW:return new Da(rg(e));case rt.BASE64:case rt.BASE64URL:return new Da(sg(r,e));case rt.DATA_URL:return new Da(WA(e),QA(e))}throw Su()}function rg(r){const e=[];for(let t=0;t<r.length;t++){let n=r.charCodeAt(t);if(n<=127)e.push(n);else if(n<=2047)e.push(192|n>>6,128|n&63);else if((n&64512)===55296)if(!(t<r.length-1&&(r.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const i=n,o=r.charCodeAt(++t);n=65536|(i&1023)<<10|o&1023,e.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|n&63)}else(n&64512)===56320?e.push(239,191,189):e.push(224|n>>12,128|n>>6&63,128|n&63)}return new Uint8Array(e)}function HA(r){let e;try{e=decodeURIComponent(r)}catch{throw hs(rt.DATA_URL,"Malformed data URL.")}return rg(e)}function sg(r,e){switch(r){case rt.BASE64:{const s=e.indexOf("-")!==-1,i=e.indexOf("_")!==-1;if(s||i)throw hs(r,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case rt.BASE64URL:{const s=e.indexOf("+")!==-1,i=e.indexOf("/")!==-1;if(s||i)throw hs(r,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=KA(e)}catch(s){throw s.message.includes("polyfill")?s:hs(r,"Invalid character found")}const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n}class ig{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw hs(rt.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=t[1]||null;n!=null&&(this.base64=YA(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=e.substring(e.indexOf(",")+1)}}function WA(r){const e=new ig(r);return e.base64?sg(rt.BASE64,e.rest):HA(e.rest)}function QA(r){return new ig(r).contentType}function YA(r,e){return r.length>=e.length?r.substring(r.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(e,t){let n=0,s="";Cd(e)?(this.data_=e,n=e.size,s=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),n=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),n=e.length),this.size_=n,this.type_=s}size(){return this.size_}type(){return this.type_}slice(e,t){if(Cd(this.data_)){const n=this.data_,s=zA(n,e,t);return s===null?null:new Bt(s)}else{const n=new Uint8Array(this.data_.buffer,e,t-e);return new Bt(n,!0)}}static getBlob(...e){if(Cu()){const t=e.map(n=>n instanceof Bt?n.data_:n);return new Bt($A.apply(null,t))}else{const t=e.map(o=>Pu(o)?GA(rt.RAW,o).data:o.data_);let n=0;t.forEach(o=>{n+=o.byteLength});const s=new Uint8Array(n);let i=0;return t.forEach(o=>{for(let c=0;c<o.length;c++)s[i++]=o[c]}),new Bt(s,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function og(r){let e;try{e=JSON.parse(r)}catch{return null}return xA(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JA(r){if(r.length===0)return null;const e=r.lastIndexOf("/");return e===-1?"":r.slice(0,e)}function XA(r,e){const t=e.split("/").filter(n=>n.length>0).join("/");return r.length===0?t:r+"/"+t}function ag(r){const e=r.lastIndexOf("/",r.length-2);return e===-1?r:r.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ZA(r,e){return e}class xe{constructor(e,t,n,s){this.server=e,this.local=t||e,this.writable=!!n,this.xform=s||ZA}}let gi=null;function eR(r){return!Pu(r)||r.length<2?r:ag(r)}function cg(){if(gi)return gi;const r=[];r.push(new xe("bucket")),r.push(new xe("generation")),r.push(new xe("metageneration")),r.push(new xe("name","fullPath",!0));function e(i,o){return eR(o)}const t=new xe("name");t.xform=e,r.push(t);function n(i,o){return o!==void 0?Number(o):o}const s=new xe("size");return s.xform=n,r.push(s),r.push(new xe("timeCreated")),r.push(new xe("updated")),r.push(new xe("md5Hash",null,!0)),r.push(new xe("cacheControl",null,!0)),r.push(new xe("contentDisposition",null,!0)),r.push(new xe("contentEncoding",null,!0)),r.push(new xe("contentLanguage",null,!0)),r.push(new xe("contentType",null,!0)),r.push(new xe("metadata","customMetadata",!0)),gi=r,gi}function tR(r,e){function t(){const n=r.bucket,s=r.fullPath,i=new ze(n,s);return e._makeStorageReference(i)}Object.defineProperty(r,"ref",{get:t})}function nR(r,e,t){const n={};n.type="file";const s=t.length;for(let i=0;i<s;i++){const o=t[i];n[o.local]=o.xform(n,e[o.server])}return tR(n,r),n}function ug(r,e,t){const n=og(e);return n===null?null:nR(r,n,t)}function rR(r,e,t,n){const s=og(e);if(s===null||!Pu(s.downloadTokens))return null;const i=s.downloadTokens;if(i.length===0)return null;const o=encodeURIComponent;return i.split(",").map(h=>{const f=r.bucket,m=r.fullPath,_="/b/"+o(f)+"/o/"+o(m),R=ku(_,t,n),C=ng({alt:"media",token:h});return R+C})[0]}function sR(r,e){const t={},n=e.length;for(let s=0;s<n;s++){const i=e[s];i.writable&&(t[i.server]=r[i.local])}return JSON.stringify(t)}class lg{constructor(e,t,n,s){this.url=e,this.method=t,this.handler=n,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hg(r){if(!r)throw Su()}function iR(r,e){function t(n,s){const i=ug(r,s,e);return hg(i!==null),i}return t}function oR(r,e){function t(n,s){const i=ug(r,s,e);return hg(i!==null),rR(i,s,r.host,r._protocol)}return t}function dg(r){function e(t,n){let s;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?s=IA():s=yA():t.getStatus()===402?s=_A(r.bucket):t.getStatus()===403?s=TA(r.path):s=n,s.status=t.getStatus(),s.serverResponse=n.serverResponse,s}return e}function aR(r){const e=dg(r);function t(n,s){let i=e(n,s);return n.getStatus()===404&&(i=gA(r.path)),i.serverResponse=s.serverResponse,i}return t}function cR(r,e,t){const n=e.fullServerUrl(),s=ku(n,r.host,r._protocol),i="GET",o=r.maxOperationRetryTime,c=new lg(s,i,oR(r,t),o);return c.errorHandler=aR(e),c}function uR(r,e){return r&&r.contentType||e&&e.type()||"application/octet-stream"}function lR(r,e,t){const n=Object.assign({},t);return n.fullPath=r.path,n.size=e.size(),n.contentType||(n.contentType=uR(null,e)),n}function hR(r,e,t,n,s){const i=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function c(){let L="";for(let $=0;$<2;$++)L=L+Math.random().toString().slice(2);return L}const u=c();o["Content-Type"]="multipart/related; boundary="+u;const h=lR(e,n,s),f=sR(h,t),m="--"+u+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+f+`\r
--`+u+`\r
Content-Type: `+h.contentType+`\r
\r
`,_=`\r
--`+u+"--",R=Bt.getBlob(m,n,_);if(R===null)throw bA();const C={name:h.fullPath},V=ku(i,r.host,r._protocol),k="POST",j=r.maxUploadRetryTime,B=new lg(V,k,iR(r,t),j);return B.urlParams=C,B.headers=o,B.body=R.uploadData(),B.errorHandler=dg(e),B}class dR{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=Tn.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=Tn.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=Tn.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,n,s){if(this.sent_)throw Qr("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(t,e,!0),s!==void 0)for(const i in s)s.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,s[i].toString());return n!==void 0?this.xhr_.send(n):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Qr("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Qr("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw Qr("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Qr("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class fR extends dR{initXhr(){this.xhr_.responseType="text"}}function fg(){return new fR}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{constructor(e,t){this._service=e,t instanceof ze?this._location=t:this._location=ze.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Vn(e,t)}get root(){const e=new ze(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return ag(this._location.path)}get storage(){return this._service}get parent(){const e=JA(this._location.path);if(e===null)return null;const t=new ze(this._location.bucket,e);return new Vn(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw CA(e)}}function pR(r,e,t){r._throwIfRoot("uploadBytes");const n=hR(r.storage,r._location,cg(),new Bt(e,!0),t);return r.storage.makeRequestWithTokens(n,fg).then(s=>({metadata:s,ref:r}))}function mR(r){r._throwIfRoot("getDownloadURL");const e=cR(r.storage,r._location,cg());return r.storage.makeRequestWithTokens(e,fg).then(t=>{if(t===null)throw SA();return t})}function gR(r,e){const t=XA(r._location.path,e),n=new ze(r._location.bucket,t);return new Vn(r.storage,n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _R(r){return/^[A-Za-z]+:\/\//.test(r)}function yR(r,e){return new Vn(r,e)}function pg(r,e){if(r instanceof Du){const t=r;if(t._bucket==null)throw RA();const n=new Vn(t,t._bucket);return e!=null?pg(n,e):n}else return e!==void 0?gR(r,e):r}function IR(r,e){if(e&&_R(e)){if(r instanceof Du)return yR(r,e);throw dc("To use ref(service, url), the first argument must be a Storage instance.")}else return pg(r,e)}function Dd(r,e){const t=e==null?void 0:e[eg];return t==null?null:ze.makeFromBucketSpec(t,r)}function TR(r,e,t,n={}){r.host=`${e}:${t}`,r._protocol="http";const{mockUserToken:s}=n;s&&(r._overrideAuthToken=typeof s=="string"?s:$d(s,r.app.options.projectId))}class Du{constructor(e,t,n,s,i){this.app=e,this._authProvider=t,this._appCheckProvider=n,this._url=s,this._firebaseVersion=i,this._bucket=null,this._host=Zm,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=pA,this._maxUploadRetryTime=mA,this._requests=new Set,s!=null?this._bucket=ze.makeFromBucketSpec(s,this._host):this._bucket=Dd(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=ze.makeFromBucketSpec(this._url,e):this._bucket=Dd(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){kd("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){kd("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(Oe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Vn(this,e)}_makeRequest(e,t,n,s,i=!0){if(this._deleted)return new kA(tg());{const o=qA(e,this._appId,n,s,t,this._firebaseVersion,i);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,t){const[n,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,n,s).getPromise()}}const Vd="@firebase/storage",Nd="0.13.7";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mg="storage";function pb(r,e,t){return r=re(r),pR(r,e,t)}function mb(r){return r=re(r),mR(r)}function gb(r,e){return r=re(r),IR(r,e)}function _b(r=fo(),e){r=re(r);const n=Cs(r,mg).getImmediate({identifier:e}),s=pc("storage");return s&&ER(n,...s),n}function ER(r,e,t,n={}){TR(r,e,t,n)}function vR(r,{instanceIdentifier:e}){const t=r.getProvider("app").getImmediate(),n=r.getProvider("auth-internal"),s=r.getProvider("app-check-internal");return new Du(t,n,s,e,Nn)}function wR(){Ht(new gt(mg,vR,"PUBLIC").setMultipleInstances(!0)),He(Vd,Nd,""),He(Vd,Nd,"esm2017")}wR();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AR="type.googleapis.com/google.protobuf.Int64Value",RR="type.googleapis.com/google.protobuf.UInt64Value";function gg(r,e){const t={};for(const n in r)r.hasOwnProperty(n)&&(t[n]=e(r[n]));return t}function uo(r){if(r==null)return null;if(r instanceof Number&&(r=r.valueOf()),typeof r=="number"&&isFinite(r)||r===!0||r===!1||Object.prototype.toString.call(r)==="[object String]")return r;if(r instanceof Date)return r.toISOString();if(Array.isArray(r))return r.map(e=>uo(e));if(typeof r=="function"||typeof r=="object")return gg(r,e=>uo(e));throw new Error("Data cannot be encoded in JSON: "+r)}function Ir(r){if(r==null)return r;if(r["@type"])switch(r["@type"]){case AR:case RR:{const e=Number(r.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+r);return e}default:throw new Error("Data cannot be decoded from JSON: "+r)}return Array.isArray(r)?r.map(e=>Ir(e)):typeof r=="function"||typeof r=="object"?gg(r,e=>Ir(e)):r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vu="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xd={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Be extends Xe{constructor(e,t,n){super(`${Vu}/${e}`,t||""),this.details=n,Object.setPrototypeOf(this,Be.prototype)}}function bR(r){if(r>=200&&r<300)return"ok";switch(r){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function lo(r,e){let t=bR(r),n=t,s;try{const i=e&&e.error;if(i){const o=i.status;if(typeof o=="string"){if(!xd[o])return new Be("internal","internal");t=xd[o],n=o}const c=i.message;typeof c=="string"&&(n=c),s=i.details,s!==void 0&&(s=Ir(s))}}catch{}return t==="ok"?null:new Be(t,n,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SR{constructor(e,t,n,s){this.app=e,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,Oe(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.auth=t.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||t.get().then(i=>this.auth=i,()=>{}),this.messaging||n.get().then(i=>this.messaging=i,()=>{}),this.appCheck||s==null||s.get().then(i=>this.appCheck=i,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){const t=await this.getAuthToken(),n=await this.getMessagingToken(),s=await this.getAppCheckToken(e);return{authToken:t,messagingToken:n,appCheckToken:s}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fc="us-central1",PR=/^data: (.*?)(?:\n|$)/;function CR(r){let e=null;return{promise:new Promise((t,n)=>{e=setTimeout(()=>{n(new Be("deadline-exceeded","deadline-exceeded"))},r)}),cancel:()=>{e&&clearTimeout(e)}}}class kR{constructor(e,t,n,s,i=fc,o=(...c)=>fetch(...c)){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new SR(e,t,n,s),this.cancelAllRequests=new Promise(c=>{this.deleteService=()=>Promise.resolve(c())});try{const c=new URL(i);this.customDomain=c.origin+(c.pathname==="/"?"":c.pathname),this.region=fc}catch{this.customDomain=null,this.region=i}}_delete(){return this.deleteService()}_url(e){const t=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${t}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}}function DR(r,e,t){r.emulatorOrigin=`http://${e}:${t}`}function VR(r,e,t){const n=s=>xR(r,e,s,{});return n.stream=(s,i)=>LR(r,e,s,i),n}async function NR(r,e,t,n){t["Content-Type"]="application/json";let s;try{s=await n(r,{method:"POST",body:JSON.stringify(e),headers:t})}catch{return{status:0,json:null}}let i=null;try{i=await s.json()}catch{}return{status:s.status,json:i}}async function _g(r,e){const t={},n=await r.contextProvider.getContext(e.limitedUseAppCheckTokens);return n.authToken&&(t.Authorization="Bearer "+n.authToken),n.messagingToken&&(t["Firebase-Instance-ID-Token"]=n.messagingToken),n.appCheckToken!==null&&(t["X-Firebase-AppCheck"]=n.appCheckToken),t}function xR(r,e,t,n){const s=r._url(e);return OR(r,s,t,n)}async function OR(r,e,t,n){t=uo(t);const s={data:t},i=await _g(r,n),o=n.timeout||7e4,c=CR(o),u=await Promise.race([NR(e,s,i,r.fetchImpl),c.promise,r.cancelAllRequests]);if(c.cancel(),!u)throw new Be("cancelled","Firebase Functions instance was deleted.");const h=lo(u.status,u.json);if(h)throw h;if(!u.json)throw new Be("internal","Response is not valid JSON object.");let f=u.json.data;if(typeof f>"u"&&(f=u.json.result),typeof f>"u")throw new Be("internal","Response is missing data field.");return{data:Ir(f)}}function LR(r,e,t,n){const s=r._url(e);return MR(r,s,t,n||{})}async function MR(r,e,t,n){var s;t=uo(t);const i={data:t},o=await _g(r,n);o["Content-Type"]="application/json",o.Accept="text/event-stream";let c;try{c=await r.fetchImpl(e,{method:"POST",body:JSON.stringify(i),headers:o,signal:n==null?void 0:n.signal})}catch(R){if(R instanceof Error&&R.name==="AbortError"){const V=new Be("cancelled","Request was cancelled.");return{data:Promise.reject(V),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(V)}}}}}}const C=lo(0,null);return{data:Promise.reject(C),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(C)}}}}}}let u,h;const f=new Promise((R,C)=>{u=R,h=C});(s=n==null?void 0:n.signal)===null||s===void 0||s.addEventListener("abort",()=>{const R=new Be("cancelled","Request was cancelled.");h(R)});const m=c.body.getReader(),_=FR(m,u,h,n==null?void 0:n.signal);return{stream:{[Symbol.asyncIterator](){const R=_.getReader();return{async next(){const{value:C,done:V}=await R.read();return{value:C,done:V}},async return(){return await R.cancel(),{done:!0,value:void 0}}}}},data:f}}function FR(r,e,t,n){const s=(o,c)=>{const u=o.match(PR);if(!u)return;const h=u[1];try{const f=JSON.parse(h);if("result"in f){e(Ir(f.result));return}if("message"in f){c.enqueue(Ir(f.message));return}if("error"in f){const m=lo(0,f);c.error(m),t(m);return}}catch(f){if(f instanceof Be){c.error(f),t(f);return}}},i=new TextDecoder;return new ReadableStream({start(o){let c="";return u();async function u(){if(n!=null&&n.aborted){const h=new Be("cancelled","Request was cancelled");return o.error(h),t(h),Promise.resolve()}try{const{value:h,done:f}=await r.read();if(f){c.trim()&&s(c.trim(),o),o.close();return}if(n!=null&&n.aborted){const _=new Be("cancelled","Request was cancelled");o.error(_),t(_),await r.cancel();return}c+=i.decode(h,{stream:!0});const m=c.split(`
`);c=m.pop()||"";for(const _ of m)_.trim()&&s(_.trim(),o);return u()}catch(h){const f=h instanceof Be?h:lo(0,null);o.error(f),t(f)}}},cancel(){return r.cancel()}})}const Od="@firebase/functions",Ld="0.12.3";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UR="auth-internal",BR="app-check-internal",qR="messaging-internal";function jR(r){const e=(t,{instanceIdentifier:n})=>{const s=t.getProvider("app").getImmediate(),i=t.getProvider(UR),o=t.getProvider(qR),c=t.getProvider(BR);return new kR(s,i,o,c,n)};Ht(new gt(Vu,e,"PUBLIC").setMultipleInstances(!0)),He(Od,Ld,r),He(Od,Ld,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yb(r=fo(),e=fc){const n=Cs(re(r),Vu).getImmediate({identifier:e}),s=pc("functions");return s&&$R(n,...s),n}function $R(r,e,t){DR(re(r),e,t)}function Ib(r,e,t){return VR(re(r),e)}jR();export{WR as A,lb as B,ib as C,gb as D,pb as E,mb as F,Lt as G,eb as a,_b as b,yb as c,LI as d,tb as e,ob as f,JR as g,nA as h,Ty as i,hb as j,ZR as k,fb as l,db as m,zR as n,sb as o,GR as p,nb as q,YR as r,HR as s,cb as t,ub as u,KR as v,Ib as w,QR as x,ab as y,rb as z};
