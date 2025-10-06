import{pN as Ie,pT as Ne,mI as De,pR as Ee,b1 as Ve,xw as $e,dj as Ce,gy as se,ip as Fe,qq as He,bX as Be,xz as oe,u8 as X,Y as We,ha as le,yD as Ge,i0 as qe,b2 as Ke,cO as Ye,yE as je,yF as ce,vL as Xe,yG as Qe,wd as Ze,yH as Je,pQ as K,yI as A,ny as N,lt as V,tf as et,tg as tt,yJ as it,yK as Le,yL as ue,yM as Q,t3 as H,yN as at,wx as O,wy as he,yO as de,yP as nt,yQ as _e,wp as C,pU as Ue,wv as G,yR as ae,yS as te,b8 as fe,s as rt,yT as st,yU as ot,cs as lt,Z as ct,a3 as ut,cB as ht,u as pe,r as $,m as B,b as dt}from"./index-BCRx-hwS.js";import{t as k}from"./Rect-BAnET0xx.js";import{u as _t}from"./rasterizingUtils-DkI5Zo_2.js";import{o as me}from"./StyleRepository-edHYiJ6T.js";import{l as ft}from"./LayerView3D-DHUO1o9J.js";import{p as pt}from"./TiledLayerView3D-F5x2XCdV.js";import{u as mt}from"./LayerView-B-ORu7tc.js";let gt=class{constructor(e,i,t){this._scale=e,this._shift=i,this._levelShift=t}getLevelRowColumn(e){const i=this.getLevelShift(e[0]),t=this._shift+i;return t?[e[0]-i,e[1]>>t,e[2]>>t]:e}getLevelShift(e){return Math.min(e,this._levelShift)}getOffset(e,i){let t=0,n=0;const a=this._shift+this.getLevelShift(e[0]);if(a){const s=(1<<a)-1,r=i/(this._scale*(1<<a-1));t=(e[2]&s)*r,n=(e[1]&s)*r}return[t,n]}getScale(e){return this._scale*(1<<this._shift+this.getLevelShift(e))}},Z=class{constructor(e,i){this._width=0,this._height=0,this._free=[],this._width=e,this._height=i,this._free.push(new k(0,0,e,i))}get width(){return this._width}get height(){return this._height}allocate(e,i){if(e>this._width||i>this._height)return new k;let t=null,n=-1;for(let a=0;a<this._free.length;++a){const s=this._free[a];e<=s.width&&i<=s.height&&(t===null||s.y<=t.y&&s.x<=t.x)&&(t=s,n=a)}return t===null?new k:(this._free.splice(n,1),t.width<t.height?(t.width>e&&this._free.push(new k(t.x+e,t.y,t.width-e,i)),t.height>i&&this._free.push(new k(t.x,t.y+i,t.width,t.height-i))):(t.width>e&&this._free.push(new k(t.x+e,t.y,t.width-e,t.height)),t.height>i&&this._free.push(new k(t.x,t.y+i,e,t.height-i))),new k(t.x,t.y,e,i))}release(e){for(let i=0;i<this._free.length;++i){const t=this._free[i];if(t.y===e.y&&t.height===e.height&&t.x+t.width===e.x)t.width+=e.width;else if(t.x===e.x&&t.width===e.width&&t.y+t.height===e.y)t.height+=e.height;else if(e.y===t.y&&e.height===t.height&&e.x+e.width===t.x)t.x=e.x,t.width+=e.width;else{if(e.x!==t.x||e.width!==t.width||e.y+e.height!==t.y)continue;t.y=e.y,t.height+=e.height}this._free.splice(i,1),this.release(e)}this._free.push(e)}},ge=class{constructor(e,i,t){this.width=0,this.height=0,this._dirties=[],this._glyphData=[],this._currentPage=0,this._glyphIndex={},this._textures=[],this._rangePromises=new Map,this.width=e,this.height=i,this._glyphSource=t,this._binPack=new Z(e-4,i-4),this._glyphData.push(new Uint8Array(e*i)),this._dirties.push(!0),this._textures.push(void 0)}getGlyphItems(e,i){const t=[],n=this._glyphSource,a=new Set,s=1/256;for(const o of i){const l=Math.floor(o*s);a.add(l)}const r=[];return a.forEach(o=>{const l=e+o;if(this._rangePromises.has(l))r.push(this._rangePromises.get(l));else{const u=n.getRange(e,o).then(()=>{this._rangePromises.delete(l)},()=>{this._rangePromises.delete(l)});this._rangePromises.set(l,u),r.push(u)}}),Promise.all(r).then(()=>{let o=this._glyphIndex[e];o||(o={},this._glyphIndex[e]=o);for(const l of i){const u=o[l];if(u){t[l]={sdf:!0,rect:u.rect,metrics:u.metrics,page:u.page,code:l};continue}const w=n.getGlyph(e,l);if(!(w!=null&&w.metrics))continue;const f=w.metrics;let x;if(f.width===0)x=new k(0,0,0,0);else{const d=f.width+6,g=f.height+2*3;let P=d%4?4-d%4:4,b=g%4?4-g%4:4;P===1&&(P=5),b===1&&(b=5),x=this._binPack.allocate(d+P,g+b),x.isEmpty&&(this._dirties[this._currentPage]||(this._glyphData[this._currentPage]=null),this._currentPage=this._glyphData.length,this._glyphData.push(new Uint8Array(this.width*this.height)),this._dirties.push(!0),this._textures.push(void 0),this._binPack=new Z(this.width-4,this.height-4),x=this._binPack.allocate(d+P,g+b));const m=this._glyphData[this._currentPage],S=w.bitmap;let _,h;if(S)for(let p=0;p<g;p++){_=d*p,h=this.width*(x.y+p+1)+x.x;for(let M=0;M<d;M++)m[h+M+1]=S.at(_+M)}}o[l]={rect:x,metrics:f,tileIDs:null,page:this._currentPage},t[l]={sdf:!0,rect:x,metrics:f,page:this._currentPage,code:l},this._dirties[this._currentPage]=!0}return t})}removeGlyphs(e){for(const i in this._glyphIndex){const t=this._glyphIndex[i];if(!t)continue;let n;for(const a in t)if(n=t[a],n.tileIDs.delete(e),n.tileIDs.size===0){const s=this._glyphData[n.page],r=n.rect;let o,l;for(let u=0;u<r.height;u++)for(o=this.width*(r.y+u)+r.x,l=0;l<r.width;l++)s[o+l]=0;delete t[a],this._dirties[n.page]=!0}}}bind(e,i,t,n=0){if(!this._textures[t]){const s=new Ie;s.pixelFormat=Ne.ALPHA,s.wrapMode=De.CLAMP_TO_EDGE,s.width=this.width,s.height=this.height,this._textures[t]=new Ee(e,s,new Uint8Array(this.width*this.height))}const a=this._textures[t];a.setSamplingMode(i),this._dirties[t]&&a.setData(this._glyphData[t]),e.bindTexture(a,n),this._dirties[t]=!1}destroy(){this.dispose()}dispose(){this._glyphData.length=0,this._binPack=null;for(const e of this._textures)e&&e.dispose();this._textures.length=0}},ne=class{constructor(e){if(this._metrics=[],!e)return void(this._allBitmaps=null);const i=new Map;let t=0;for(;e.next();)switch(e.tag()){case 1:{const s=e.getMessage();for(;s.next();)switch(s.tag()){case 3:{const r=s.getMessage();let o,l,u,w,f,x,y;for(;r.next();)switch(r.tag()){case 1:o=r.getUInt32();break;case 2:l=r.getBytes();break;case 3:u=r.getUInt32();break;case 4:w=r.getUInt32();break;case 5:f=r.getSInt32();break;case 6:x=r.getSInt32();break;case 7:y=r.getUInt32();break;default:r.skip()}if(r.release(),o){const d=(l==null?void 0:l.length)??0;this._metrics[o]={width:u,height:w,left:f,top:x,advance:y,startOffset:t,length:d},i.set(o,l),t+=d}break}default:s.skip()}s.release();break}default:e.skip()}const n=new Uint8Array(t),a=this._metrics;for(const[s,r]of i){const{startOffset:o,length:l}=a[s];if(r)for(let u=0;u<l;++u)n[o+u]=r[u]}this._allBitmaps=n}getMetrics(e){return this._metrics[e]}getBitmap(e){if(!this._allBitmaps)return;const i=this._metrics[e];if(i===void 0)return;const{startOffset:t,length:n}=i;return n!==0?new yt(this._allBitmaps,t,n):void 0}},vt=class{constructor(){this._ranges=[]}get ranges(){return this._ranges}getRange(e){return this._ranges[e]}addRange(e,i){this._ranges[e]=i}},ve=class{constructor(e){this._glyphInfo={},this._baseURL=e}getRange(e,i){const t=this._getFontStack(e);if(t.getRange(i))return Promise.resolve();const n=256*i,a=n+255;if(this._baseURL){const s=this._baseURL.replace("{fontstack}",e).replace("{range}",n+"-"+a);return Ve(s,{responseType:"array-buffer"}).then(r=>{t.addRange(i,new ne(new $e(new Uint8Array(r.data),new DataView(r.data))))}).catch(()=>{t.addRange(i,new ne)})}return t.addRange(i,new ne),Promise.resolve()}getGlyph(e,i){const t=this._getFontStack(e);if(!t)return;const n=Math.floor(i/256),a=t.getRange(n);return a?{metrics:a.getMetrics(i),bitmap:a.getBitmap(i)}:void 0}_getFontStack(e){let i=this._glyphInfo[e];return i||(i=this._glyphInfo[e]=new vt),i}},yt=class{constructor(e,i,t){this._array=e,this._start=i,this.length=t}at(e){return 0<=e&&e<this.length?this._array[this._start+e]:void 0}};const xt="dasharray-";let ye=class Ae{constructor(e,i,t=0){this._size=[],this._mosaicsData=[],this._textures=[],this._dirties=[],this._maxItemSize=0,this._currentPage=0,this._pageWidth=0,this._pageHeight=0,this._mosaicRects={},this.pixelRatio=1,i<=0&&console.error("Sprites mosaic defaultWidth and defaultHeight must be greater than zero!"),this._pageWidth=e,this._pageHeight=i,t>0&&(this._maxItemSize=t),this._binPack=new Z(e-4,i-4)}destroy(){this.dispose()}dispose(){this._binPack=null,this._mosaicsData.length=0,this._mosaicRects={};for(const e of this._textures)e&&e.dispose();this._textures.length=0}getWidth(e){return e>=this._size.length?-1:this._size[e][0]}getHeight(e){return e>=this._size.length?-1:this._size[e][1]}getPageSize(e){return e>=this._size.length?null:this._size[e]}setSpriteSource(e){if(this.dispose(),this.pixelRatio=e.devicePixelRatio,this._mosaicsData.length===0){this._binPack=new Z(this._pageWidth-4,this._pageHeight-4);const i=Math.floor(this._pageWidth),t=Math.floor(this._pageHeight),n=new Uint32Array(i*t);this._mosaicsData[0]=n,this._dirties.push(!0),this._size.push([this._pageWidth,this._pageHeight]),this._textures.push(void 0)}this._sprites=e}getSpriteItem(e,i=!1){let t,n,a=this._mosaicRects[e];if(a)return a;if(!this._sprites||this._sprites.loadStatus!=="loaded"||(e&&e.startsWith(xt)?([t,n]=this._rasterizeDash(e),i=!0):t=this._sprites.getSpriteInfo(e),!(t!=null&&t.width)||!t.height||t.width<0||t.height<0))return null;const s=t.width,r=t.height,[o,l,u]=this._allocateImage(s,r);return o.width<=0?null:(this._copy(o,t,l,u,i,n),a={type:"sprite",rect:o,width:s,height:r,sdf:t.sdf,simplePattern:!1,rasterizationScale:t.pixelRatio??1,samplingMode:"Linear",page:l},this._mosaicRects[e]=a,a)}getSpriteItems(e){const i={};for(const t of e)i[t.name]=this.getSpriteItem(t.name,t.repeat);return i}getMosaicItemPosition(e,i){const t=this.getSpriteItem(e,i),n=t==null?void 0:t.rect;if(!n)return null;n.width=t.width,n.height=t.height;const a=t.width,s=t.height,r=2;return{tl:[n.x+r,n.y+r],br:[n.x+r+a,n.y+r+s],page:t.page}}bind(e,i,t=0,n=0){if(t>=this._size.length||t>=this._mosaicsData.length)return;if(!this._textures[t]){const s=new Ie;s.wrapMode=De.CLAMP_TO_EDGE,s.width=this._size[t][0],s.height=this._size[t][1],this._textures[t]=new Ee(e,s,new Uint8Array(this._mosaicsData[t].buffer))}const a=this._textures[t];a.setSamplingMode(i),this._dirties[t]&&a.setData(new Uint8Array(this._mosaicsData[t].buffer)),e.bindTexture(a,n),this._dirties[t]=!1}static _copyBits(e,i,t,n,a,s,r,o,l,u,w){let f=n*i+t,x=o*s+r;if(w){x-=s;for(let y=-1;y<=u;y++,f=((y+u)%u+n)*i+t,x+=s)for(let d=-1;d<=l;d++)a[x+d]=e[f+(d+l)%l]}else for(let y=0;y<u;y++){for(let d=0;d<l;d++)a[x+d]=e[f+d];f+=i,x+=s}}_copy(e,i,t,n,a,s){if(!this._sprites||this._sprites.loadStatus!=="loaded"||t>=this._mosaicsData.length)return;const r=new Uint32Array(s?s.buffer:this._sprites.image.buffer),o=this._mosaicsData[t],l=2,u=s?i.width:this._sprites.width;Ae._copyBits(r,u,i.x,i.y,o,n[0],e.x+l,e.y+l,i.width,i.height,a),this._dirties[t]=!0}_allocateImage(e,i){e+=2,i+=2;const t=Math.max(e,i);if(this._maxItemSize&&this._maxItemSize<t){const r=new k(0,0,e,i);return this._mosaicsData.push(new Uint32Array(e*i)),this._dirties.push(!0),this._size.push([e,i]),this._textures.push(void 0),[r,this._mosaicsData.length-1,[e,i]]}let n=e%4?4-e%4:4,a=i%4?4-i%4:4;n===1&&(n=5),a===1&&(a=5);const s=this._binPack.allocate(e+n,i+a);return s.width<=0?(this._dirties[this._currentPage]||(this._mosaicsData[this._currentPage]=null),this._currentPage=this._mosaicsData.length,this._mosaicsData.push(new Uint32Array(this._pageWidth*this._pageHeight)),this._dirties.push(!0),this._size.push([this._pageWidth,this._pageHeight]),this._textures.push(void 0),this._binPack=new Z(this._pageWidth-4,this._pageHeight-4),this._allocateImage(e,i)):[s,this._currentPage,[this._pageWidth,this._pageHeight]]}_rasterizeDash(e){const i=/\[(.*?)\]/,t=e.match(i);if(!t)return null;const n=t[1].split(",").map(Number),a=e.slice(e.lastIndexOf("-")+1),[s,r,o]=_t(n,a);return[{x:0,y:0,width:r,height:o,sdf:!0,pixelRatio:1},new Uint8Array(s.buffer)]}},wt=class{constructor(e,i,t,n){this._layer=e,this._styleRepository=i,this.devicePixelRatio=t,this._sourceDataMaxLOD=n,this._spriteMosaic=null,this._glyphMosaic=null,this._connection=null,this._spriteSourceAbortController=null,this._startOptionsInputSignal=null,this._inputSignalEventListener=null}destroy(){var e,i,t;(e=this._connection)==null||e.close(),this._connection=null,this._styleRepository=null,this._layer=null,(i=this._spriteMosaic)==null||i.destroy(),this._spriteMosaic=null,this._glyphMosaic=null,this._spriteSourceAbortController=Ce(this._spriteSourceAbortController),this._spriteSourcePromise=null,this._inputSignalEventListener&&((t=this._startOptionsInputSignal)==null||t.removeEventListener("abort",this._inputSignalEventListener)),this._startOptionsInputSignal=null,this._inputSignalEventListener=null}get spriteMosaic(){return this._spriteSourcePromise.then(()=>this._spriteMosaic)}get glyphMosaic(){return this._glyphMosaic}async start(e){this._requestSprite(e);const i=this._layer.currentStyleInfo.glyphsUrl,t=new ve(i?se(i,{...this._layer.customParameters,token:this._layer.apiKey}):null);this._glyphMosaic=new ge(1024,1024,t),this._broadcastPromise=Fe("WorkerTileHandler",{client:this,schedule:e.schedule,signal:e.signal}).then(n=>{var a;if(this._layer&&((a=this._connection)==null||a.close(),this._connection=n,this._layer&&!this._connection.closed)){const s=n.broadcast("setStyle",{style:this._layer.currentStyleInfo.style,sourceDataMaxLOD:this._sourceDataMaxLOD},e);Promise.all(s).catch(r=>He(r))}})}_requestSprite(e){var s,r;(s=this._spriteSourceAbortController)==null||s.abort();const i=new AbortController;this._spriteSourceAbortController=i;const t=e==null?void 0:e.signal;this._inputSignalEventListener&&((r=this._startOptionsInputSignal)==null||r.removeEventListener("abort",this._inputSignalEventListener)),this._startOptionsInputSignal=null,t&&(this._inputSignalEventListener=St(i),t.addEventListener("abort",this._inputSignalEventListener,{once:!0}));const{signal:n}=i,a={...e,signal:n};this._spriteSourcePromise=this._layer.loadSpriteSource(this.devicePixelRatio,a),this._spriteSourcePromise.then(o=>{Be(n),this._spriteMosaic=new ye(1024,1024,250),this._spriteMosaic.setSpriteSource(o)})}async updateStyle(e){const i=[];for(const t of e)t.type===oe.SPRITES_CHANGED?i.push({type:oe.SPRITES_CHANGED,data:{spriteSource:null}}):i.push(t);return await this._broadcastPromise,this._broadcastPromise=Promise.all(this._connection.broadcast("updateStyle",i)),this._broadcastPromise}setSpriteSource(e){const i=new ye(1024,1024,250);return i.setSpriteSource(e),this._spriteMosaic=i,this._spriteSourcePromise=Promise.resolve(e),this._spriteSourceAbortController=null,i}async setStyle(e,i,t){await this._broadcastPromise,this._styleRepository=e,this._sourceDataMaxLOD=t,this._requestSprite();const n=new ve(this._layer.currentStyleInfo.glyphsUrl?se(this._layer.currentStyleInfo.glyphsUrl,{...this._layer.customParameters,token:this._layer.apiKey}):null);return this._glyphMosaic=new ge(1024,1024,n),this._broadcastPromise=Promise.all(this._connection.broadcast("setStyle",{style:i,sourceDataMaxLOD:this._sourceDataMaxLOD})),this._broadcastPromise}async fetchTileData(e,i){const t=await this._getRefKeys(e,i);return this._getSourcesData(Object.keys(this._layer.sourceNameToSource),t,i)}async fetchTilePBFs(e){const i=Object.keys(this._layer.sourceNameToSource),t={},n=await this._getRefKeys(e,t),a=[],s=[];for(let r=0;r<n.length;r++)if(n[r].value==null||i[r]==null)s.push(null);else{const o=n[r].value,l=this._getTilePayload(o,i[r],t);l.then(u=>{a.push({...u,key:o})}),s.push(l)}return Promise.all(s).then(()=>a)}async parseTileData(e,i){const t=e&&e.data;if(!t)return null;const{sourceName2DataAndRefKey:n,transferList:a}=t;return Object.keys(n).length===0?null:this._broadcastPromise.then(()=>this._connection.invoke("createTileAndParse",{key:e.key.id,sourceName2DataAndRefKey:n,styleLayerUIDs:e.styleLayerUIDs},{...i,transferList:a}))}async getSprites(e){return await this._spriteSourcePromise,this._spriteMosaic.getSpriteItems(e)}getGlyphs(e){return this._glyphMosaic.getGlyphItems(e.font,e.codePoints)}async _getTilePayload(e,i,t){const n=X.pool.acquire(e.id),a=this._layer.sourceNameToSource[i],{level:s,row:r,col:o}=n;X.pool.release(n);try{return{protobuff:await a.requestTile(s,r,o,t),sourceName:i}}catch(l){if(We(l))throw l;return{protobuff:null,sourceName:i}}}async _getRefKeys(e,i){const t=this._layer.sourceNameToSource,n=new Array;for(const a in t){const s=t[a].getRefKey(e,i);n.push(s)}return le(n)}_getSourcesData(e,i,t){const n=[];for(let a=0;a<i.length;a++)if(i[a].value==null||e[a]==null)n.push(null);else{const s=i[a].value,r=this._getTilePayload(s,e[a],t);n.push(r)}return le(n).then(a=>{const s={},r=[];for(let o=0;o<a.length;o++){const l=a[o].value;if(l&&l.protobuff&&l.protobuff.byteLength>0){const u=i[o].value.id;s[l.sourceName]={refKey:u,protobuff:l.protobuff},r.push(l.protobuff)}}return{sourceName2DataAndRefKey:s,transferList:r}})}};function St(c){return()=>c.abort()}let Mt=class extends Ge{constructor(){super(...arguments),this._fullCacheLodInfos=null,this._levelByScale={}}getTileParentId(e){const i=X.pool.acquire(e),t=i.level===0?null:X.getId(i.level-1,i.row>>1,i.col>>1,i.world);return X.pool.release(i),t}getTileCoverage(e,i,t=!0,n){const a=super.getTileCoverage(e,i,t,n);if(!a)return a;const s=1<<a.lodInfo.level;return a.spans=a.spans.filter(r=>r.row>=0&&r.row<s),a}scaleToLevel(e){if(this._fullCacheLodInfos||this._initializeFullCacheLODs(this._lodInfos),this._levelByScale[e])return this._levelByScale[e];{const i=this._fullCacheLodInfos;if(e>i[0].scale)return i[0].level;let t,n;for(let a=0;a<i.length-1;a++)if(n=i[a+1],e>n.scale)return t=i[a],t.level+(t.scale-e)/(t.scale-n.scale);return i[i.length-1].level}}_initializeFullCacheLODs(e){let i;if(e[0].level===0)i=e.map(t=>({level:t.level,resolution:t.resolution,scale:t.scale}));else{const t=this.tileInfo.size[0],n=this.tileInfo.spatialReference;i=qe.create({size:t,spatialReference:n}).lods.map(a=>({level:a.level,resolution:a.resolution,scale:a.scale}))}for(let t=0;t<i.length;t++)this._levelByScale[i[t].scale]=i[t].level;this._fullCacheLodInfos=i}},xe=class extends wt{constructor(e,i,t,n){super(e,i,t,e.tileInfo.lods.length-1),this._memCache=n,this._ongoingTileRequests=new Map,this._ongoingRequestToController=new Map,this._tileInfoView=new Mt(e.tileInfo,e.fullExtent)}destroy(){super.destroy(),this._ongoingRequestToController.forEach(e=>e.abort()),this._ongoingRequestToController.clear(),this._ongoingTileRequests.clear()}async getVectorTile(e,i){const t=new X(e[0],e[1],e[2],0);let n=this._memCache.get(t.id);if(n)return n.retain(),n;const a=await this._getVectorTileData(t);if(Ke(i),!this._layer)return null;if(n=this._memCache.get(t.id),n)return n.retain(),n;const s=this._layer.tileInfo.getTileBounds(Ye(),t),r=this._tileInfoView.getTileResolution(e[0]);return n=new je(t,r,s[0],s[3],ce,ce,this._styleRepository,this._memCache),n.setData(a),a&&(n.retain(),this._memCache.put(t.id,n,Xe)),n.neededForCoverage=!0,n.transforms.tileUnitsToPixels=Qe(1/8,0,0,0,1/8,0,0,0,1),n}_getVectorTileData(e){const i=e.id;if(this._ongoingTileRequests.has(i))return this._ongoingTileRequests.get(i);const t=new AbortController,n={signal:t.signal},a=this._getParsedVectorTileData(e,n).then(s=>(this._ongoingTileRequests.delete(i),this._ongoingRequestToController.delete(i),s)).catch(()=>(this._ongoingTileRequests.delete(i),this._ongoingRequestToController.delete(i),null));return this._ongoingTileRequests.set(i,a),this._ongoingRequestToController.set(i,t),a}_getParsedVectorTileData(e,i){return this.fetchTileData(e,i).then(t=>this.parseTileData({key:e,data:t},i))}},J=class{constructor(){this.name=this.constructor.name||"UnnamedBrush",this.brushEffect=null}prepareState(e,i){}draw(e,i,t){}drawMany(e,i,t){for(const n of i)n.visible&&this.draw(e,n,t)}},bt=class extends J{constructor(){super(...arguments),this._color=Ze(1,0,0,1),this._patternMatrix=Je(),this._programOptions={id:!1,pattern:!1}}dispose(){this._vao&&(this._vao.dispose(),this._vao=null)}drawMany(e,i){const{context:t,painter:n,requestRender:a,allowDelayedRender:s}=e;this._loadWGLResources(e);const r=e.displayLevel,o=e.styleLayer,l=o.backgroundMaterial,u=n.vectorTilesMaterialManager,w=o.getPaintValue("background-color",r),f=o.getPaintValue("background-opacity",r),x=o.getPaintValue("background-pattern",r),y=x!==void 0,d=1|window.devicePixelRatio,g=e.spriteMosaic;let P,b;const m=d>Le?2:1,S=this._programOptions;S.pattern=y;const _=u.getMaterialProgram(t,l,S);if(!s||a==null||_.compiled){if(t.bindVAO(this._vao),t.useProgram(_),y){const h=g.getMosaicItemPosition(x,!0);if(h!=null){const{tl:p,br:M,page:v}=h;P=M[0]-p[0],b=M[1]-p[1];const D=g.getPageSize(v);D!=null&&(g.bind(t,K.LINEAR,v,A),_.setUniform4f("u_tlbr",p[0],p[1],M[0],M[1]),_.setUniform2fv("u_mosaicSize",D),_.setUniform1i("u_texture",A))}_.setUniform1f("u_opacity",f)}else{const h=w[3]*f;this._color[0]=h*w[0],this._color[1]=h*w[1],this._color[2]=h*w[2],this._color[3]=h,_.setUniform4fv("u_color",this._color)}_.setUniform1f("u_depth",o.z||0);for(const h of i){if(_.setUniform1f("u_coord_range",h.rangeX),_.setUniformMatrix3fv("u_dvsMat3",h.transforms.displayViewScreenMat3),y){const p=Math.max(2**(Math.round(r)-h.key.level),1),M=m*h.width*p,v=M/ue(P),D=M/ue(b);this._patternMatrix[0]=v,this._patternMatrix[4]=D,_.setUniformMatrix3fv("u_pattern_matrix",this._patternMatrix)}t.setStencilFunction(N.EQUAL,0,255),t.drawArrays(V.TRIANGLE_STRIP,0,4)}}else a()}_loadWGLResources(e){if(this._vao)return;const{context:i,styleLayer:t}=e,n=t.backgroundMaterial,a=new Int8Array([0,0,1,0,0,1,1,1]),s=et.createVertex(i,tt.STATIC_DRAW,a),r=new it(i,n.getAttributeLocations(),n.getLayoutInfo(),new Map([["geometry",s]]));this._vao=r}},Pt=class extends J{constructor(){super(...arguments),this._programOptions={id:!1}}dispose(){}drawMany(e,i){const{context:t,displayLevel:n,requiredLevel:a,state:s,painter:r,spriteMosaic:o,styleLayerUID:l,requestRender:u,allowDelayedRender:w}=e;if(!i.some(_=>{var h;return((h=_.layerData.get(l))==null?void 0:h.circleIndexCount)??!1}))return;const f=e.styleLayer,x=f.circleMaterial,y=r.vectorTilesMaterialManager,d=1.2,g=f.getPaintValue("circle-translate",n),P=f.getPaintValue("circle-translate-anchor",n),b=this._programOptions,m=y.getMaterialProgram(t,x,b);if(w&&u!=null&&!m.compiled)return void u();t.useProgram(m),m.setUniformMatrix3fv("u_displayMat3",P===Q.VIEWPORT?s.displayMat3:s.displayViewMat3),m.setUniform2fv("u_circleTranslation",g),m.setUniform1f("u_depth",f.z),m.setUniform1f("u_antialiasingWidth",d);let S=-1;for(const _ of i){if(!_.layerData.has(l))continue;_.key.level!==S&&(S=_.key.level,x.setDataUniforms(m,n,f,S,o));const h=_.layerData.get(l);if(!h.circleIndexCount)continue;h.prepareForRendering(t);const p=h.vao;p!=null&&(t.bindVAO(p),m.setUniformMatrix3fv("u_dvsMat3",_.transforms.displayViewScreenMat3),a!==_.key.level?t.setStencilFunction(N.EQUAL,_.stencilRef,255):t.setStencilFunction(N.GREATER,255,255),t.drawElements(V.TRIANGLES,h.circleIndexCount,H.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*h.circleIndexStart),_.triangleCount+=h.circleIndexCount/3)}}};const we=1/65536;let Tt=class extends J{constructor(){super(...arguments),this._fillProgramOptions={id:!1,pattern:!1},this._outlineProgramOptions={id:!1}}dispose(){}drawMany(e,i){const{displayLevel:t,renderPass:n,spriteMosaic:a,styleLayerUID:s}=e;let r=!1;for(const m of i)if(m.layerData.has(s)){const S=m.layerData.get(s);if(S.fillIndexCount>0||S.outlineIndexCount>0){r=!0;break}}if(!r)return;const o=e.styleLayer,l=o.getPaintProperty("fill-pattern"),u=l!==void 0,w=u&&l.isDataDriven;let f;if(u&&!w){const m=l.getValue(t);f=a.getMosaicItemPosition(m,!0)}const x=!u&&o.getPaintValue("fill-antialias",t);let y=!0,d=1;if(!u){const m=o.getPaintProperty("fill-color"),S=o.getPaintProperty("fill-opacity");if(!(m!=null&&m.isDataDriven)&&!(S!=null&&S.isDataDriven)){const _=o.getPaintValue("fill-color",t);d=o.getPaintValue("fill-opacity",t)*_[3],d>=1&&(y=!1)}}if(y&&n==="opaque")return;const g=o.getPaintValue("fill-translate",t),P=o.getPaintValue("fill-translate-anchor",t);(y||n!=="translucent")&&this._drawFill(e,s,o,i,g,P,u,f,w);const b=!o.hasDataDrivenOutlineColor&&o.outlineUsesFillColor&&d<1;x&&n!=="opaque"&&!b&&this._drawOutline(e,s,o,i,g,P)}_drawFill(e,i,t,n,a,s,r,o,l){if(r&&!l&&o==null)return;const{context:u,displayLevel:w,state:f,painter:x,pixelRatio:y,spriteMosaic:d,requestRender:g,allowDelayedRender:P}=e,b=t.fillMaterial,m=x.vectorTilesMaterialManager,S=y>Le?2:1,_=this._fillProgramOptions;_.pattern=r;const h=m.getMaterialProgram(u,b,_);if(P&&g!=null&&!h.compiled)return void g();if(u.useProgram(h),o!=null){const{page:M}=o,v=d.getPageSize(M);v!=null&&(d.bind(u,K.LINEAR,M,A),h.setUniform2fv("u_mosaicSize",v),h.setUniform1i("u_texture",A))}h.setUniformMatrix3fv("u_displayMat3",s===Q.VIEWPORT?f.displayMat3:f.displayViewMat3),h.setUniform2fv("u_fillTranslation",a),h.setUniform1f("u_depth",t.z+we);let p=-1;for(const M of n){if(!M.layerData.has(i))continue;M.key.level!==p&&(p=M.key.level,b.setDataUniforms(h,w,t,p,d));const v=M.layerData.get(i);if(!v.fillIndexCount)continue;v.prepareForRendering(u);const D=v.fillVAO;if(D!=null){if(u.bindVAO(D),h.setUniformMatrix3fv("u_dvsMat3",M.transforms.displayViewScreenMat3),u.setStencilFunction(N.EQUAL,M.stencilRef,255),r){const T=Math.max(2**(Math.round(w)-M.key.level),1),I=M.rangeX/(S*M.width*T);h.setUniform1f("u_patternFactor",I)}if(l){const T=v.patternMap;if(!T)continue;for(const[I,E]of T){const W=d.getPageSize(I);W!=null&&(d.bind(u,K.LINEAR,I,A),h.setUniform2fv("u_mosaicSize",W),h.setUniform1i("u_texture",A),u.drawElements(V.TRIANGLES,E[1],H.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*E[0]))}}else u.drawElements(V.TRIANGLES,v.fillIndexCount,H.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*v.fillIndexStart);M.triangleCount+=v.fillIndexCount/3}}}_drawOutline(e,i,t,n,a,s){const{context:r,displayLevel:o,state:l,painter:u,pixelRatio:w,spriteMosaic:f,requestRender:x,allowDelayedRender:y}=e,d=t.outlineMaterial,g=u.vectorTilesMaterialManager,P=.75/w,b=this._outlineProgramOptions,m=g.getMaterialProgram(r,d,b);if(y&&x!=null&&!m.compiled)return void x();r.useProgram(m),m.setUniformMatrix3fv("u_displayMat3",s===Q.VIEWPORT?l.displayMat3:l.displayViewMat3),m.setUniform2fv("u_fillTranslation",a),m.setUniform1f("u_depth",t.z+we),m.setUniform1f("u_outline_width",P);let S=-1;for(const _ of n){if(!_.layerData.has(i))continue;_.key.level!==S&&(S=_.key.level,d.setDataUniforms(m,o,t,S,f));const h=_.layerData.get(i);if(h.prepareForRendering(r),!h.outlineIndexCount)continue;const p=h.outlineVAO;p!=null&&(r.bindVAO(p),m.setUniformMatrix3fv("u_dvsMat3",_.transforms.displayViewScreenMat3),r.setStencilFunction(N.EQUAL,_.stencilRef,255),r.drawElements(V.TRIANGLES,h.outlineIndexCount,H.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*h.outlineIndexStart),_.triangleCount+=h.outlineIndexCount/3)}}},Rt=class extends J{constructor(){super(...arguments),this._programOptions={id:!1,pattern:!1,sdf:!1}}dispose(){}drawMany(e,i){const{context:t,displayLevel:n,state:a,painter:s,pixelRatio:r,spriteMosaic:o,styleLayerUID:l,requestRender:u,allowDelayedRender:w}=e;if(!i.some(T=>{var I;return((I=T.layerData.get(l))==null?void 0:I.lineIndexCount)??!1}))return;const f=e.styleLayer,x=f.lineMaterial,y=s.vectorTilesMaterialManager,d=f.getPaintValue("line-translate",n),g=f.getPaintValue("line-translate-anchor",n),P=f.getPaintProperty("line-pattern"),b=P!==void 0,m=b&&P.isDataDriven;let S,_;if(b&&!m){const T=P.getValue(n);S=o.getMosaicItemPosition(T)}let h=!1;if(!b){const T=f.getPaintProperty("line-dasharray");if(_=T!==void 0,h=_&&T.isDataDriven,_&&!h){const I=T.getValue(n),E=f.getDashKey(I,f.getLayoutValue("line-cap",n));S=o.getMosaicItemPosition(E)}}const p=1/r,M=this._programOptions;M.pattern=b,M.sdf=_;const v=y.getMaterialProgram(t,x,M);if(w&&u!=null&&!v.compiled)return void u();if(t.useProgram(v),v.setUniformMatrix3fv("u_displayViewMat3",a.displayViewMat3),v.setUniformMatrix3fv("u_displayMat3",g===Q.VIEWPORT?a.displayMat3:a.displayViewMat3),v.setUniform2fv("u_lineTranslation",d),v.setUniform1f("u_depth",f.z),v.setUniform1f("u_antialiasing",p),S&&S!=null){const{page:T}=S,I=o.getPageSize(T);I!=null&&(o.bind(t,K.LINEAR,T,A),v.setUniform2fv("u_mosaicSize",I),v.setUniform1i("u_texture",A))}let D=-1;for(const T of i){if(!T.layerData.has(l))continue;T.key.level!==D&&(D=T.key.level,x.setDataUniforms(v,n,f,D,o));const I=2**(n-D)/r;v.setUniform1f("u_zoomFactor",I);const E=T.layerData.get(l);if(!E.lineIndexCount)continue;E.prepareForRendering(t);const W=E.vao;if(W!=null){if(t.bindVAO(W),v.setUniformMatrix3fv("u_dvsMat3",T.transforms.displayViewScreenMat3),t.setStencilFunction(N.EQUAL,T.stencilRef,255),m||h){const ee=E.patternMap;if(!ee)continue;for(const[R,Y]of ee){const U=o.getPageSize(R);U!=null&&(o.bind(t,K.LINEAR,R,A),v.setUniform2fv("u_mosaicSize",U),v.setUniform1i("u_texture",A),t.drawElements(V.TRIANGLES,Y[1],H.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*Y[0]))}}else t.drawElements(V.TRIANGLES,E.lineIndexCount,H.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*E.lineIndexStart);T.triangleCount+=E.lineIndexCount/3}}}};const It=256/360;function Dt(c,e){return(c%=e)>=0?c:c+e}function Se(c){return Dt(c*It,256)}const Et=1/65536;let Ct=class extends J{constructor(){super(...arguments),this._iconProgramOptions={id:!1,sdf:!1},this._sdfProgramOptions={id:!1},this._spritesTextureSize=at()}dispose(){}drawMany(e,i){const t=e.styleLayer;this._drawIcons(e,t,i),this._drawText(e,t,i)}_drawIcons(e,i,t){const{context:n,displayLevel:a,painter:s,spriteMosaic:r,state:o,styleLayerUID:l,requestRender:u,allowDelayedRender:w}=e,f=i.iconMaterial,x=s.vectorTilesMaterialManager;let y,d=!1;for(const v of t)if(v.layerData.has(l)&&(y=v.layerData.get(l),y.iconPerPageElementsMap.size>0)){d=!0;break}if(!d)return;const g=i.getPaintValue("icon-translate",a),P=i.getPaintValue("icon-translate-anchor",a);let b=i.getLayoutValue("icon-rotation-alignment",a);b===O.AUTO&&(b=i.getLayoutValue("symbol-placement",a)===he.POINT?O.VIEWPORT:O.MAP);const m=b===O.MAP,S=i.getLayoutValue("icon-keep-upright",a)&&m,_=y.isIconSDF,h=this._iconProgramOptions;h.sdf=_;const p=x.getMaterialProgram(n,f,h);if(w&&u!=null&&!p.compiled)return void u();n.useProgram(p),p.setUniformMatrix3fv("u_displayViewMat3",b===O.MAP?o.displayViewMat3:o.displayMat3),p.setUniformMatrix3fv("u_displayMat3",P===Q.VIEWPORT?o.displayMat3:o.displayViewMat3),p.setUniform2fv("u_iconTranslation",g),p.setUniform1f("u_depth",i.z),p.setUniform1f("u_mapRotation",Se(o.rotation)),p.setUniform1f("u_keepUpright",S?1:0),p.setUniform1f("u_level",10*a),p.setUniform1i("u_texture",A),p.setUniform1f("u_fadeDuration",de/1e3);let M=-1;for(const v of t){if(!v.layerData.has(l)||(v.key.level!==M&&(M=v.key.level,f.setDataUniforms(p,a,i,M,r)),y=v.layerData.get(l),y.iconPerPageElementsMap.size===0))continue;y.prepareForRendering(n),y.updateOpacityInfo();const D=y.iconVAO;if(D!=null){n.bindVAO(D),p.setUniformMatrix3fv("u_dvsMat3",v.transforms.displayViewScreenMat3),p.setUniform1f("u_time",(performance.now()-y.lastOpacityUpdate)/1e3);for(const[T,I]of y.iconPerPageElementsMap)this._renderIconRange(e,p,I,T,v)}}}_renderIconRange(e,i,t,n,a){const{context:s,spriteMosaic:r}=e;this._spritesTextureSize[0]=r.getWidth(n)/4,this._spritesTextureSize[1]=r.getHeight(n)/4,i.setUniform2fv("u_mosaicSize",this._spritesTextureSize),r.bind(s,K.LINEAR,n,A),this._setStencilState(e,a),s.drawElements(V.TRIANGLES,t[1],H.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*t[0]),a.triangleCount+=t[1]/3}_drawText(e,i,t){const{context:n,displayLevel:a,glyphMosaic:s,painter:r,pixelRatio:o,spriteMosaic:l,state:u,styleLayerUID:w,requestRender:f,allowDelayedRender:x}=e,y=i.textMaterial,d=r.vectorTilesMaterialManager;let g,P=!1;for(const U of t)if(U.layerData.has(w)&&(g=U.layerData.get(w),g.glyphPerPageElementsMap.size>0)){P=!0;break}if(!P)return;const b=i.getPaintProperty("text-opacity");if(b&&!b.isDataDriven&&b.getValue(a)===0)return;const m=i.getPaintProperty("text-color"),S=!m||m.isDataDriven||m.getValue(a)[3]>0,_=i.getPaintProperty("text-halo-width"),h=i.getPaintProperty("text-halo-color"),p=(!_||_.isDataDriven||_.getValue(a)>0)&&(!h||h.isDataDriven||h.getValue(a)[3]>0);if(!S&&!p)return;const M=24/8;let v=i.getLayoutValue("text-rotation-alignment",a);v===O.AUTO&&(v=i.getLayoutValue("symbol-placement",a)===he.POINT?O.VIEWPORT:O.MAP);const D=v===O.MAP,T=i.getLayoutValue("text-keep-upright",a)&&D,I=.8*M/o;this._glyphTextureSize||(this._glyphTextureSize=nt(s.width/4,s.height/4));const E=i.getPaintValue("text-translate",a),W=i.getPaintValue("text-translate-anchor",a),ee=this._sdfProgramOptions,R=d.getMaterialProgram(n,y,ee);if(x&&f!=null&&!R.compiled)return void f();n.useProgram(R),R.setUniformMatrix3fv("u_displayViewMat3",v===O.MAP?u.displayViewMat3:u.displayMat3),R.setUniformMatrix3fv("u_displayMat3",W===Q.VIEWPORT?u.displayMat3:u.displayViewMat3),R.setUniform2fv("u_textTranslation",E),R.setUniform1f("u_depth",i.z+Et),R.setUniform2fv("u_mosaicSize",this._glyphTextureSize),R.setUniform1f("u_mapRotation",Se(u.rotation)),R.setUniform1f("u_keepUpright",T?1:0),R.setUniform1f("u_level",10*a),R.setUniform1i("u_texture",_e),R.setUniform1f("u_antialiasingWidth",I),R.setUniform1f("u_fadeDuration",de/1e3);let Y=-1;for(const U of t){if(!U.layerData.has(w)||(U.key.level!==Y&&(Y=U.key.level,y.setDataUniforms(R,a,i,Y,l)),g=U.layerData.get(w),g.glyphPerPageElementsMap.size===0))continue;g.prepareForRendering(n),g.updateOpacityInfo();const re=g.textVAO;if(re==null)continue;n.bindVAO(re),R.setUniformMatrix3fv("u_dvsMat3",U.transforms.displayViewScreenMat3),this._setStencilState(e,U);const ze=(performance.now()-g.lastOpacityUpdate)/1e3;R.setUniform1f("u_time",ze),g.glyphPerPageElementsMap.forEach((Oe,ke)=>{this._renderGlyphRange(n,Oe,ke,s,R,p,S,U)})}}_renderGlyphRange(e,i,t,n,a,s,r,o){n.bind(e,K.LINEAR,t,_e),s&&(a.setUniform1f("u_halo",1),e.drawElements(V.TRIANGLES,i[1],H.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*i[0]),o.triangleCount+=i[1]/3),r&&(a.setUniform1f("u_halo",0),e.drawElements(V.TRIANGLES,i[1],H.UNSIGNED_INT,Uint32Array.BYTES_PER_ELEMENT*i[0]),o.triangleCount+=i[1]/3)}_setStencilState(e,i){const{context:t,is3D:n,stencilSymbols:a}=e;if(t.setStencilTestEnabled(!0),a)return t.setStencilWriteMask(255),void t.setStencilFunction(N.ALWAYS,i.stencilRef,255);t.setStencilWriteMask(0),n?t.setStencilFunction(N.EQUAL,i.stencilRef,255):t.setStencilFunction(N.GREATER,255,255)}};const q={vtlBackground:bt,vtlFill:Tt,vtlLine:Rt,vtlCircle:Pt,vtlSymbol:Ct},Lt={background:{"background.frag":`#ifdef PATTERN
uniform lowp float u_opacity;
uniform lowp sampler2D u_texture;
varying mediump vec4 v_tlbr;
varying mediump vec2 v_tileTextureCoord;
#else
uniform lowp vec4 u_color;
#endif
void main() {
#ifdef PATTERN
mediump vec2 normalizedTextureCoord = mod(v_tileTextureCoord, 1.0);
mediump vec2 samplePos = mix(v_tlbr.xy, v_tlbr.zw, normalizedTextureCoord);
lowp vec4 color = texture2D(u_texture, samplePos);
gl_FragColor = u_opacity * color;
#else
gl_FragColor = u_color;
#endif
}`,"background.vert":`precision mediump float;
attribute vec2 a_pos;
uniform highp mat3 u_dvsMat3;
uniform mediump float u_coord_range;
uniform mediump float u_depth;
#ifdef PATTERN
uniform mediump mat3 u_pattern_matrix;
varying mediump vec2 v_tileTextureCoord;
uniform mediump vec4 u_tlbr;
uniform mediump vec2 u_mosaicSize;
varying mediump vec4 v_tlbr;
#endif
void main() {
gl_Position = vec4((u_dvsMat3 * vec3(u_coord_range * a_pos, 1.0)).xy, u_depth, 1.0);
#ifdef PATTERN
v_tileTextureCoord = (u_pattern_matrix * vec3(a_pos, 1.0)).xy;
v_tlbr             = u_tlbr / u_mosaicSize.xyxy;
#endif
}`},circle:{"circle.frag":`precision lowp float;
varying lowp vec4 v_color;
varying lowp vec4 v_stroke_color;
varying mediump float v_blur;
varying mediump float v_stroke_width;
varying mediump float v_radius;
varying mediump vec2 v_offset;
void main()
{
mediump float dist = length(v_offset);
mediump float alpha = smoothstep(0.0, -v_blur, dist - 1.0);
lowp float color_mix_ratio = v_stroke_width < 0.01 ? 0.0 : smoothstep(-v_blur, 0.0, dist - v_radius / (v_radius + v_stroke_width));
gl_FragColor = alpha * mix(v_color, v_stroke_color, color_mix_ratio);
}`,"circle.vert":`precision mediump float;
attribute vec2 a_pos;
#pragma header
varying lowp vec4 v_color;
varying lowp vec4 v_stroke_color;
varying mediump float v_blur;
varying mediump float v_stroke_width;
varying mediump float v_radius;
varying mediump vec2 v_offset;
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform mediump vec2 u_circleTranslation;
uniform mediump float u_depth;
uniform mediump float u_antialiasingWidth;
void main()
{
#pragma main
v_color = color * opacity;
v_stroke_color = stroke_color * stroke_opacity;
v_stroke_width = stroke_width;
v_radius = radius;
v_blur = max(blur, u_antialiasingWidth / (radius + stroke_width));
mediump vec2 offset = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);
v_offset = offset;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos * 0.5, 1.0) + u_displayMat3 * vec3((v_radius + v_stroke_width) * offset + u_circleTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
}`},fill:{"fill.frag":`precision lowp float;
#ifdef PATTERN
uniform lowp sampler2D u_texture;
varying mediump vec2 v_tileTextureCoord;
varying mediump vec4 v_tlbr;
#endif
varying lowp vec4 v_color;
vec4 mixColors(vec4 color1, vec4 color2) {
float compositeAlpha = color2.a + color1.a * (1.0 - color2.a);
vec3 compositeColor = color2.rgb + color1.rgb * (1.0 - color2.a);
return vec4(compositeColor, compositeAlpha);
}
void main()
{
#ifdef PATTERN
mediump vec2 normalizedTextureCoord = fract(v_tileTextureCoord);
mediump vec2 samplePos = mix(v_tlbr.xy, v_tlbr.zw, normalizedTextureCoord);
lowp vec4 color = texture2D(u_texture, samplePos);
gl_FragColor = v_color[3] * color;
#else
gl_FragColor = v_color;
#endif
}`,"fill.vert":`precision mediump float;
attribute vec2 a_pos;
#pragma header
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform mediump float u_depth;
uniform mediump vec2 u_fillTranslation;
#ifdef PATTERN
#include <util/util.glsl>
uniform mediump vec2 u_mosaicSize;
uniform mediump float u_patternFactor;
varying mediump vec2 v_tileTextureCoord;
varying mediump vec4 v_tlbr;
#endif
varying lowp vec4 v_color;
void main()
{
#pragma main
v_color = color * opacity;
#ifdef PATTERN
float patternWidth = nextPOT(tlbr.z - tlbr.x);
float patternHeight = nextPOT(tlbr.w - tlbr.y);
float scaleX = 1.0 / (patternWidth * u_patternFactor);
float scaleY = 1.0 / (patternHeight * u_patternFactor);
mat3 patterMat = mat3(scaleX, 0.0,    0.0,
0.0,    -scaleY, 0.0,
0.0,    0.0,    1.0);
v_tileTextureCoord = (patterMat * vec3(a_pos, 1.0)).xy;
v_tlbr             = tlbr / u_mosaicSize.xyxy;
#endif
vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + u_displayMat3 * vec3(u_fillTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
}`},icon:{"icon.frag":`precision mediump float;
uniform lowp sampler2D u_texture;
#ifdef SDF
uniform lowp vec4 u_color;
uniform lowp vec4 u_outlineColor;
#endif
varying mediump vec2 v_tex;
varying lowp float v_opacity;
varying mediump vec2 v_size;
varying lowp vec4 v_color;
#ifdef SDF
varying mediump flaot v_halo_width;
#endif
#include <util/encoding.glsl>
vec4 mixColors(vec4 color1, vec4 color2) {
float compositeAlpha = color2.a + color1.a * (1.0 - color2.a);
vec3 compositeColor = color2.rgb + color1.rgb * (1.0 - color2.a);
return vec4(compositeColor, compositeAlpha);
}
void main()
{
#ifdef SDF
lowp vec4 fillPixelColor = v_color;
float d = rgba2float(texture2D(u_texture, v_tex)) - 0.5;
const float softEdgeRatio = 0.248062016;
float size = max(v_size.x, v_size.y);
float dist = d * softEdgeRatio * size;
fillPixelColor *= clamp(0.5 - dist, 0.0, 1.0);
if (v_halo_width > 0.25) {
lowp vec4 outlinePixelColor = u_outlineColor;
const float outlineLimitRatio = (16.0 / 86.0);
float clampedOutlineSize = softEdgeRatio * min(v_halo_width, outlineLimitRatio * max(v_size.x, v_size.y));
outlinePixelColor *= clamp(0.5 - (abs(dist) - clampedOutlineSize), 0.0, 1.0);
gl_FragColor = v_opacity * mixColors(fillPixelColor, outlinePixelColor);
}
else {
gl_FragColor = v_opacity * fillPixelColor;
}
#else
lowp vec4 texColor = texture2D(u_texture, v_tex);
gl_FragColor = v_opacity * texColor;
#endif
}`,"icon.vert":`attribute vec2 a_pos;
attribute vec2 a_vertexOffset;
attribute vec4 a_texAngleRange;
attribute vec4 a_levelInfo;
attribute float a_opacityInfo;
#pragma header
varying lowp vec4 v_color;
#ifdef SDF
varying mediump float v_halo_width;
#endif
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform highp mat3 u_displayViewMat3;
uniform mediump vec2 u_iconTranslation;
uniform vec2 u_mosaicSize;
uniform mediump float u_depth;
uniform mediump float u_mapRotation;
uniform mediump float u_level;
uniform lowp float u_keepUpright;
uniform mediump float u_fadeDuration;
varying mediump vec2 v_tex;
varying lowp float v_opacity;
varying mediump vec2 v_size;
const float C_OFFSET_PRECISION = 1.0 / 8.0;
const float C_256_TO_RAD = 3.14159265359 / 128.0;
const float C_DEG_TO_RAD = 3.14159265359 / 180.0;
const float tileCoordRatio = 1.0 / 8.0;
uniform highp float u_time;
void main()
{
#pragma main
v_color = color;
v_opacity = opacity;
#ifdef SDF
v_halo_width = halo_width;
#endif
float modded = mod(a_opacityInfo, 128.0);
float targetOpacity = (a_opacityInfo - modded) / 128.0;
float startOpacity = modded / 127.0;
float interpolatedOpacity = clamp(startOpacity + 2.0 * (targetOpacity - 0.5) * u_time / u_fadeDuration, 0.0, 1.0);
v_opacity *= interpolatedOpacity;
mediump float a_angle         = a_levelInfo[1];
mediump float a_minLevel      = a_levelInfo[2];
mediump float a_maxLevel      = a_levelInfo[3];
mediump vec2 a_tex            = a_texAngleRange.xy;
mediump float delta_z = 0.0;
mediump float rotated = mod(a_angle + u_mapRotation, 256.0);
delta_z += (1.0 - step(u_keepUpright, 0.0)) * step(64.0, rotated) * (1.0 - step(192.0, rotated));
delta_z += 1.0 - step(a_minLevel, u_level);
delta_z += step(a_maxLevel, u_level);
delta_z += step(v_opacity, 0.0);
vec2 offset = C_OFFSET_PRECISION * a_vertexOffset;
v_size = abs(offset);
#ifdef SDF
offset = (120.0 / 86.0) * offset;
#endif
mediump vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + u_displayViewMat3 * vec3(size * offset, 0.0) + u_displayMat3 * vec3(u_iconTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth + delta_z, 1.0);
v_tex = a_tex.xy / u_mosaicSize;
}`},line:{"line.frag":`precision lowp float;
varying mediump vec2 v_normal;
varying highp float v_accumulatedDistance;
varying mediump float v_lineHalfWidth;
varying lowp vec4 v_color;
varying mediump float v_blur;
#if defined (PATTERN) || defined(SDF)
varying mediump vec4 v_tlbr;
varying mediump vec2 v_patternSize;
varying mediump float v_widthRatio;
uniform sampler2D u_texture;
uniform mediump float u_antialiasing;
#endif
#ifdef SDF
#include <util/encoding.glsl>
#endif
void main()
{
mediump float fragDist = length(v_normal) * v_lineHalfWidth;
lowp float alpha = clamp((v_lineHalfWidth - fragDist) / v_blur, 0.0, 1.0);
#ifdef PATTERN
mediump float relativeTexX = fract(v_accumulatedDistance / (v_patternSize.x * v_widthRatio));
mediump float relativeTexY = 0.5 + v_normal.y * v_lineHalfWidth / (v_patternSize.y * v_widthRatio);
mediump vec2 texCoord = mix(v_tlbr.xy, v_tlbr.zw, vec2(relativeTexX, relativeTexY));
lowp vec4 color = texture2D(u_texture, texCoord);
gl_FragColor = alpha * v_color[3] * color;
#elif defined(SDF)
mediump float relativeTexX = fract((v_accumulatedDistance * 0.5) / (v_patternSize.x * v_widthRatio));
mediump float relativeTexY =  0.5 + 0.25 * v_normal.y;
mediump vec2 texCoord = mix(v_tlbr.xy, v_tlbr.zw, vec2(relativeTexX, relativeTexY));
mediump float d = rgba2float(texture2D(u_texture, texCoord)) - 0.5;
float dist = d * (v_lineHalfWidth + u_antialiasing / 2.0);
gl_FragColor = alpha * clamp(0.5 - dist, 0.0, 1.0) * v_color;
#else
gl_FragColor = alpha * v_color;
#endif
}`,"line.vert":`precision mediump float;
attribute vec2 a_pos;
attribute vec4 a_extrude_offset;
attribute vec4 a_dir_normal;
attribute vec2 a_accumulatedDistance;
#pragma header
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform highp mat3 u_displayViewMat3;
uniform mediump float u_zoomFactor;
uniform mediump vec2 u_lineTranslation;
uniform mediump float u_antialiasing;
uniform mediump float u_depth;
varying mediump vec2 v_normal;
varying highp float v_accumulatedDistance;
const float scale = 1.0 / 31.0;
const mediump float tileCoordRatio = 8.0;
#if defined (SDF)
const mediump float sdfPatternHalfWidth = 15.5;
#endif
#if defined (PATTERN) || defined(SDF)
uniform mediump vec2 u_mosaicSize;
varying mediump vec4 v_tlbr;
varying mediump vec2 v_patternSize;
varying mediump float v_widthRatio;
#endif
varying lowp vec4 v_color;
varying mediump float v_lineHalfWidth;
varying mediump float v_blur;
void main()
{
#pragma main
v_color = color * opacity;
v_blur = blur + u_antialiasing;
v_normal = a_dir_normal.zw * scale;
#if defined (PATTERN) || defined(SDF)
v_tlbr          = tlbr / u_mosaicSize.xyxy;
v_patternSize   = vec2(tlbr.z - tlbr.x, tlbr.y - tlbr.w);
#if defined (PATTERN)
v_widthRatio = width / v_patternSize.y;
#else
v_widthRatio = width / sdfPatternHalfWidth / 2.0;
#endif
#endif
v_lineHalfWidth = (width + u_antialiasing) * 0.5;
mediump vec2 dir = a_dir_normal.xy * scale;
mediump vec2 offset_ = a_extrude_offset.zw * scale * offset;
mediump vec2 dist = v_lineHalfWidth * scale * a_extrude_offset.xy;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos + offset_ * tileCoordRatio / u_zoomFactor, 1.0) + u_displayViewMat3 * vec3(dist, 0.0) + u_displayMat3 * vec3(u_lineTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
#if defined (PATTERN) || defined(SDF)
v_accumulatedDistance = a_accumulatedDistance.x * u_zoomFactor / tileCoordRatio + dot(dir, dist + offset_);
#endif
}`},outline:{"outline.frag":`varying lowp vec4 v_color;
varying mediump vec2 v_normal;
void main()
{
lowp float dist = abs(v_normal.y);
lowp float alpha = smoothstep(1.0, 0.0, dist);
gl_FragColor = alpha * v_color;
}`,"outline.vert":`attribute vec2 a_pos;
attribute vec2 a_offset;
attribute vec2 a_xnormal;
#pragma header
varying lowp vec4 v_color;
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform mediump vec2 u_fillTranslation;
uniform mediump float u_depth;
uniform mediump float u_outline_width;
varying lowp vec2 v_normal;
const float scale = 1.0 / 15.0;
void main()
{
#pragma main
v_color = color * opacity;
v_normal = a_xnormal;
mediump vec2 dist = u_outline_width * scale * a_offset;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + u_displayMat3 * vec3(dist + u_fillTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth, 1.0);
}`},text:{"text.frag":`uniform lowp sampler2D u_texture;
varying lowp vec2 v_tex;
varying lowp vec4 v_color;
varying mediump float v_edgeWidth;
varying mediump float v_edgeDistance;
void main()
{
lowp float dist = texture2D(u_texture, v_tex).a;
mediump float alpha = smoothstep(v_edgeDistance - v_edgeWidth, v_edgeDistance + v_edgeWidth, dist);
gl_FragColor = alpha * v_color;
}`,"text.vert":`attribute vec2 a_pos;
attribute vec2 a_vertexOffset;
attribute vec4 a_texAngleRange;
attribute vec4 a_levelInfo;
attribute float a_opacityInfo;
#pragma header
varying lowp vec4 v_color;
uniform highp mat3 u_dvsMat3;
uniform highp mat3 u_displayMat3;
uniform highp mat3 u_displayViewMat3;
uniform mediump vec2 u_textTranslation;
uniform vec2 u_mosaicSize;
uniform mediump float u_depth;
uniform mediump float u_mapRotation;
uniform mediump float u_level;
uniform lowp float u_keepUpright;
uniform mediump float u_fadeDuration;
varying lowp vec2 v_tex;
const float offsetPrecision = 1.0 / 8.0;
const mediump float edgePos = 0.75;
uniform mediump float u_antialiasingWidth;
varying mediump float v_edgeDistance;
varying mediump float v_edgeWidth;
uniform lowp float u_halo;
const float sdfFontScale = 1.0 / 24.0;
const float sdfPixel = 3.0;
uniform highp float u_time;
void main()
{
#pragma main
if (u_halo > 0.5)
{
v_color = halo_color * opacity;
halo_width *= sdfPixel;
halo_blur *= sdfPixel;
}
else
{
v_color = color * opacity;
halo_width = 0.0;
halo_blur = 0.0;
}
float modded = mod(a_opacityInfo, 128.0);
float targetOpacity = (a_opacityInfo - modded) / 128.0;
float startOpacity = modded / 127.0;
float interpolatedOpacity = clamp(startOpacity + 2.0 * (targetOpacity - 0.5) * u_time / u_fadeDuration, 0.0, 1.0);
v_color *= interpolatedOpacity;
mediump float a_angle       = a_levelInfo[1];
mediump float a_minLevel    = a_levelInfo[2];
mediump float a_maxLevel    = a_levelInfo[3];
mediump vec2 a_tex          = a_texAngleRange.xy;
mediump float a_visMinAngle    = a_texAngleRange.z;
mediump float a_visMaxAngle    = a_texAngleRange.w;
mediump float delta_z = 0.0;
mediump float angle = mod(a_angle + u_mapRotation, 256.0);
if (a_visMinAngle < a_visMaxAngle)
{
delta_z += (1.0 - step(u_keepUpright, 0.0)) * (step(a_visMaxAngle, angle) + (1.0 - step(a_visMinAngle, angle)));
}
else
{
delta_z += (1.0 - step(u_keepUpright, 0.0)) * (step(a_visMaxAngle, angle) * (1.0 - step(a_visMinAngle, angle)));
}
delta_z += 1.0 - step(a_minLevel, u_level);
delta_z += step(a_maxLevel, u_level);
delta_z += step(v_color[3], 0.0);
v_tex = a_tex.xy / u_mosaicSize;
v_edgeDistance = edgePos - halo_width / size;
v_edgeWidth = (u_antialiasingWidth + halo_blur) / size;
mediump vec3 pos = u_dvsMat3 * vec3(a_pos, 1.0) + sdfFontScale * u_displayViewMat3 * vec3(offsetPrecision * size * a_vertexOffset, 0.0) + u_displayMat3 * vec3(u_textTranslation, 0.0);
gl_Position = vec4(pos.xy, u_depth + delta_z, 1.0);
}`},util:{"encoding.glsl":`const vec4 rgba2float_factors = vec4(
255.0 / (256.0),
255.0 / (256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0 * 256.0)
);
float rgba2float(vec4 rgba) {
return dot(rgba, rgba2float_factors);
}`,"util.glsl":`float nextPOT(in float x) {
return pow(2.0, ceil(log2(abs(x))));
}`}};let Ut=class{constructor(e){this._readFile=e}resolveIncludes(e){return this._resolve(e)}_resolve(e,i=new Map){if(i.has(e))return i.get(e);const t=this._read(e);if(!t)throw new Error(`cannot find shader file ${e}`);const n=/^[^\S\n]*#include\s+<(\S+)>[^\S\n]?/gm;let a=n.exec(t);const s=[];for(;a!=null;)s.push({path:a[1],start:a.index,length:a[0].length}),a=n.exec(t);let r=0,o="";return s.forEach(l=>{o+=t.slice(r,l.start),o+=i.has(l.path)?"":this._resolve(l.path,i),r=l.start+l.length}),o+=t.slice(r),i.set(e,o),o}_read(e){return this._readFile(e)}};function At(c){let e=Lt;return c.split("/").forEach(i=>{e&&(e=e[i])}),e}const zt=new Ut(At);function L(c){return zt.resolveIncludes(c)}function Ot(c){const{options:e,value:i}=c;return typeof e[i]=="number"}function ie(c){let e="";for(const i in c){const t=c[i];if(typeof t=="boolean")t&&(e+=`#define ${i}
`);else if(typeof t=="number")e+=`#define ${i} ${t.toFixed()}
`;else if(typeof t=="object")if(Ot(t)){const{value:n,options:a,namespace:s}=t,r=s?`${s}_`:"";for(const o in a)e+=`#define ${r}${o} ${a[o].toFixed()}
`;e+=`#define ${i} ${r}${n}
`}else{const n=t.options;let a=0;for(const s in n)e+=`#define ${n[s]} ${(a++).toFixed()}
`;e+=`#define ${i} ${n[t.value]}
`}}return e}const Me=c=>ie({PATTERN:c.pattern}),kt={shaders:c=>({vertexShader:Me(c)+L("background/background.vert"),fragmentShader:Me(c)+L("background/background.frag")})},Nt={shaders:c=>({vertexShader:L("circle/circle.vert"),fragmentShader:L("circle/circle.frag")})},be=c=>ie({PATTERN:c.pattern}),Vt={shaders:c=>({vertexShader:be(c)+L("fill/fill.vert"),fragmentShader:be(c)+L("fill/fill.frag")})},$t={shaders:c=>({vertexShader:L("outline/outline.vert"),fragmentShader:L("outline/outline.frag")})},Pe=c=>ie({SDF:c.sdf}),Ft={shaders:c=>({vertexShader:Pe(c)+L("icon/icon.vert"),fragmentShader:Pe(c)+L("icon/icon.frag")})},Te=c=>ie({PATTERN:c.pattern,SDF:c.sdf}),Ht={shaders:c=>({vertexShader:Te(c)+L("line/line.vert"),fragmentShader:Te(c)+L("line/line.frag")})},Bt={shaders:c=>({vertexShader:L("text/text.vert"),fragmentShader:L("text/text.frag")})};class Wt{constructor(){this._programByKey=new Map}dispose(){this._programByKey.forEach(e=>e.dispose()),this._programByKey.clear()}getMaterialProgram(e,i,t){const n=i.key<<3|this._getMaterialOptionsValue(i.type,t);if(this._programByKey.has(n))return this._programByKey.get(n);const a=this._getProgramTemplate(i.type),{shaders:s}=a,{vertexShader:r,fragmentShader:o}=s(t),l=i.getShaderHeader(),u=i.getShaderMain(),w=r.replace("#pragma header",l).replace("#pragma main",u),f=e.programCache.acquire(w,o,i.getAttributeLocations());return this._programByKey.set(n,f),f}_getMaterialOptionsValue(e,i){switch(e){case C.BACKGROUND:return(i.pattern?1:0)<<1;case C.FILL:return(i.pattern?1:0)<<1;case C.OUTLINE:return 0;case C.LINE:{const t=i;return(t.sdf?1:0)<<2|(t.pattern?1:0)<<1}case C.ICON:return(i.sdf?1:0)<<1;case C.CIRCLE:case C.TEXT:default:return 0}}_getProgramTemplate(e){switch(e){case C.BACKGROUND:return kt;case C.CIRCLE:return Nt;case C.FILL:return Vt;case C.ICON:return Ft;case C.LINE:return Ht;case C.OUTLINE:return $t;case C.TEXT:return Bt;default:return null}}}const j=1e-6;class Re{constructor(e,i){this.spriteMosaic=e,this.glyphMosaic=i,this._brushCache={vtlBackground:null,vtlFill:null,vtlLine:null,vtlCircle:null,vtlSymbol:null},this._vtlMaterialManager=new Wt}dispose(){var e,i,t,n,a;(e=this._brushCache.vtlBackground)==null||e.dispose(),(i=this._brushCache.vtlFill)==null||i.dispose(),(t=this._brushCache.vtlLine)==null||t.dispose(),(n=this._brushCache.vtlCircle)==null||n.dispose(),(a=this._brushCache.vtlSymbol)==null||a.dispose(),this._brushCache=null,this._vtlMaterialManager=Ue(this._vtlMaterialManager),this.spriteMosaic.dispose(),this.glyphMosaic.dispose()}get vectorTilesMaterialManager(){return this._vtlMaterialManager}drawSymbols(e,i,t){const n=t.layers;e.renderPass="translucent";let a=this._brushCache.vtlSymbol;a==null&&(a=new q.vtlSymbol,this._brushCache.vtlSymbol=a),F[0]=i;for(let s=0;s<n.length;s++){const r=n[s];if(r.type!==G.SYMBOL)continue;const o=r.getLayoutProperty("visibility");if(o&&o.getValue()===ae.NONE)continue;const l=e.displayLevel;r.minzoom!==void 0&&r.minzoom>l+j||r.maxzoom!==void 0&&r.maxzoom<=l-j||(e.styleLayerUID=r.uid,e.styleLayer=r,a.drawMany(e,F))}F[0]=null}drawBackground(e,i,t){if(t.backgroundBucketIds.length===0)return;const{context:n,displayLevel:a,requiredLevel:s}=e;i.key.level=s,n.setBlendingEnabled(!0),n.setDepthTestEnabled(!1),n.setStencilTestEnabled(!1),e.renderPass="background";let r=this._brushCache.vtlBackground;r==null&&(r=new q.vtlBackground,this._brushCache.vtlBackground=r),F[0]=i,t.backgroundBucketIds.forEach(o=>{const l=t.getLayerById(o);if(l.type!==G.BACKGROUND)return;const u=l.getLayoutProperty("visibility");u&&u.getValue()===ae.NONE||l.minzoom!==void 0&&l.minzoom>a+j||l.maxzoom!==void 0&&l.maxzoom<=a-j||(e.styleLayerUID=l.uid,e.styleLayer=l,r.drawMany(e,F))}),F[0]=null}drawTile(e,i,t,n){const{context:a}=e,s=t.layers;a.setBlendingEnabled(!1),a.setDepthTestEnabled(!0),a.setDepthWriteEnabled(!0),a.setDepthFunction(N.LEQUAL);const r=s.filter(o=>{if(n!=null&&n!==o.type||!i.layerData.has(o.uid))return!1;const l=o.getLayoutProperty("visibility");return(l==null?void 0:l.getValue())!==ae.NONE});e.renderPass="opaque";for(let o=r.length-1;o>=0;--o)this._renderStyleLayer(r[o],e,i);a.setDepthWriteEnabled(!1),a.setBlendingEnabled(!0),a.setBlendFunctionSeparate(te.ONE,te.ONE_MINUS_SRC_ALPHA,te.ONE,te.ONE_MINUS_SRC_ALPHA),e.renderPass="translucent",r.forEach(o=>this._renderStyleLayer(o,e,i)),a.setDepthTestEnabled(!1),a.bindVAO()}_renderStyleLayer(e,i,t){const{renderPass:n}=i;let a;switch(e.type){case G.BACKGROUND:if(n!=="background")return;a=this._brushCache.vtlBackground,a||(a=new q.vtlBackground,this._brushCache.vtlBackground=a);break;case G.FILL:if(n!=="opaque"&&i.renderPass!=="translucent")return;a=this._brushCache.vtlFill,a==null&&(a=new q.vtlFill,this._brushCache.vtlFill=a);break;case G.LINE:if(n!=="translucent")return;a=this._brushCache.vtlLine,a==null&&(a=new q.vtlLine,this._brushCache.vtlLine=a);break;case G.CIRCLE:if(n!=="translucent")return;a=this._brushCache.vtlCircle,a==null&&(a=new q.vtlCircle,this._brushCache.vtlCircle=a);break;case G.SYMBOL:if(n!=="translucent")return;a=this._brushCache.vtlSymbol,a==null&&(a=new q.vtlSymbol,this._brushCache.vtlSymbol=a)}const{displayLevel:s}=i,{minzoom:r,maxzoom:o}=e;if(r!==void 0&&r>s+j||o!==void 0&&o<=s-j)return;const{context:l}=i;l.setStencilTestEnabled(!1),l.setStencilWriteMask(0),i.styleLayerUID=e.uid,i.styleLayer=e,F[0]=t,a.drawMany(i,F),F[0]=null}}const F=[null];let z=class extends pt(ft(mt)){constructor(){super(...arguments),this._tileHandlerController=null,this.type="vector-tile-3d",this.levelShift=fe("disable-feature:vtl-level-shift")?0:1}initialize(){if(this.layer.fullExtent==null)return void this.addResolvingPromise(Promise.reject(new rt("vectortilelayerview:full-extent-undefined","This layer view's layer does not define a fullExtent.")));const{basemapTerrain:c,spatialReference:e,state:i,viewingMode:t}=this.view,n=t==="local"&&!st(e)||ot.force512VTL?this.layer.tileInfo:this.layer.tileInfo.getCompatibleForVTL(256),a=this._getTileInfoSupportError(n,this.layer.fullExtent);if(a!=null)return this.addResolvingPromise(Promise.reject(a));const s=lt(()=>{var d,g;return(g=(d=this.view)==null?void 0:d.basemapTerrain)==null?void 0:g.tilingSchemeLocked}).then(()=>{var h,p;const d=c.tilingScheme,g=d.pixelSize,P=g===256?1:2,b=(h=c.spatialReference)!=null&&h.isGeographic&&g===256?1:0,m=(p=c.spatialReference)!=null&&p.isGeographic||g!==256?0:1;let S;this.schemaHelper=new gt(P,b,this.levelShift+m),S=g===256||g===512?this.layer.tileInfo.getCompatibleForVTL(g):this.layer.tileInfo;const _=this._getTileInfoCompatibilityError(S,d);if(_)throw _;this.tileInfo=S});this._tileHandlerController=new AbortController;const r=this.view.resourceController;this._memCache=r.memoryController.newCache(`vtl-${this.layer.uid}`,d=>d.release()),this.addHandles(ct(()=>this.view.qualitySettings.memoryLimit,d=>this._memCache.maxSize=Math.ceil(d/10*1048576),ut));const o=new me(this.layer.currentStyleInfo.style);this._tileHandler=new xe(this.layer,o,i.contentPixelRatio,this._memCache);const l=this._tileHandlerController.signal,u=Gt(r),w=this._tileHandler.start({signal:l,schedule:u}),f=this._tileHandler.spriteMosaic;f.then(d=>{!ht(l)&&this._tileHandler&&(this.painter=new Re(d,this._tileHandler.glyphMosaic))}),w.then(()=>this._tileHandlerController=null);const x=()=>{var _;this._tileHandlerController&&this._tileHandlerController.abort(),this._tileHandlerController=new AbortController,this._memCache.clear();const d=this.layer.currentStyleInfo.style,g=((_=this.view.state)==null?void 0:_.contentPixelRatio)??1,P=new me(d),b=new xe(this.layer,P,g,this._memCache),m=b.start({signal:this._tileHandlerController.signal,schedule:u}),S=b.spriteMosaic;m.then(()=>this._tileHandlerController=null),this._updatingHandles.addPromise(Promise.all([m,S]).then(([,h])=>{const p=this._tileHandler,M=this.painter;this.painter=new Re(h,b.glyphMosaic),this._tileHandler=b,this.emit("data-changed"),p.destroy(),M&&M.dispose()}))};this._updatingHandles.add(()=>{var d;return{style:this.layer.currentStyleInfo.style,pixelRatio:(d=this.view.state)==null?void 0:d.contentPixelRatio}},x),this.addHandles([this.layer.on("paint-change",()=>this.emit("data-changed")),this.layer.on("style-layer-change",x),this.layer.on("delete-style-layer",x),this.layer.on("spriteSource-change",()=>this.emit("data-changed")),this.layer.on("layout-change",()=>this.emit("data-changed")),this.layer.on("style-layer-visibility-change",()=>this.emit("data-changed"))]);const y=Promise.all([s,w,f]);this.addResolvingPromise(y)}destroy(){this.painter=Ue(this.painter),this._tileHandlerController=Ce(this._tileHandlerController),this._tileHandler=pe(this._tileHandler),this._memCache=pe(this._memCache)}get contentZoom(){return fe("disable-feature:vtl-level-shift")?1:this.view.qualitySettings.tiledSurface.vtlContentZoom}get displayLevelRange(){const c=this.tileInfo.lods,e=this.layer.minScale||c[0].scale,i=this.layer.maxScale||c[c.length-1].scale,t=this.levelRangeFromScaleRange(e,i);return this.layer.maxScale?t.maxLevel++:t.maxLevel+=this.levelShift,t}get dataScaleRange(){const c=this.tileInfo.lods;return{minScale:c[0].scale,maxScale:c[c.length-1].scale}}get dataLevelRange(){const{minScale:c,maxScale:e}=this.dataScaleRange,i=this.levelRangeFromScaleRange(c,e);return i.minLevel===1&&this.tileInfo.size[0]===256&&(i.minLevel=0),i.maxLevel+=this.levelShift,i}async fetchTile(c,e){const i=this.schemaHelper.getLevelRowColumn(c);return this._tileHandler.getVectorTile(i,e)}get hasVisibleFeatures(){return!0}};$([B()],z.prototype,"layer",void 0),$([B()],z.prototype,"levelShift",void 0),$([B()],z.prototype,"contentZoom",null),$([B()],z.prototype,"displayLevelRange",null),$([B()],z.prototype,"tileInfo",void 0),$([B()],z.prototype,"dataScaleRange",null),$([B()],z.prototype,"dataLevelRange",null),$([B()],z.prototype,"updatingProgressValue",void 0),z=$([dt("esri.views.3d.layers.VectorTileLayerView3D")],z);const mi=z;function Gt(c){return e=>c.immediate.schedule(e)}export{mi as default};
