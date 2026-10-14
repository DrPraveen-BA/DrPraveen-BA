'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function harness(){
 const nodes=[],ids=new Map(),messages=[],captures=[],imports=[];
 function node(tag='div'){
  const n={tag,children:[],value:'',returnValue:'',options:[{},{}],files:[],listeners:{},append(...a){this.children.push(...a);},prepend(...a){this.children.unshift(...a);},after(){},setAttribute(){},replaceChildren(){this.children=[];},addEventListener(t,f){this.listeners[t]=f;},showModal(){this.open=true;},close(value){if(value!==undefined)this.returnValue=value;this.open=false;const cb=this.listeners.close;delete this.listeners.close;cb?.();},click(){this.clicked=true;return this.onclick?.();}};
  nodes.push(n);return n;
 }
 const document={createElement:node,body:node(),querySelector(s){if(!ids.has(s))ids.set(s,node());return ids.get(s);}};
 const desktop={sources:async()=>[{id:'screen:1',name:'Screen 1',thumbnail:'image'}],capture:async id=>{captures.push(id);return null;},onStopRecording(){},onCapture(){},onStatus(){},chooseRecordingSource:async()=>{}};
 const context={document,ClarioAdvanced:require('../advanced-core.js'),ClarioDesktop:desktop,$:s=>document.querySelector(s),show:t=>messages.push(t),recording:null,captureBusy:false,videoBlob:null,image:null,recordingDone:f=>imports.push(f),setCanvas:async()=>{},navigator:{},URL,Blob,console};context.window=context;
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../advanced.js'),'utf8'),context);
 return{context,nodes,messages,captures,imports,get:id=>nodes.find(n=>n.id===id),dialog:()=>nodes.find(n=>n.tag==='dialog'),run:s=>vm.runInContext(s,context)};
}
async function tick(){await new Promise(r=>setImmediate(r));}
test('native source picker Escape does not reuse a previously selected capture source',async()=>{
 const h=harness();h.context.$('#delay').value='0';
 const first=h.context.$('#captureBtn').onclick();await tick();
 const d=h.dialog();d.children[1].children[0].onclick();await first;
 assert.deepEqual(h.captures,['screen:1']);
 const second=h.context.$('#captureBtn').onclick();await tick();d.close();await second;
 assert.deepEqual(h.captures,['screen:1']);assert.equal(h.context.captureBusy,false);
});
test('video import while recording preserves active recorder and existing preview',async()=>{
 const h=harness(),recorder={active:true};h.context.recording=recorder;
 await h.get('openVideo').onclick();const input=h.run('videoImport');assert.equal(input.clicked,undefined);
 input.files=[{size:200,type:'video/mp4'}];input.value='clip.mp4';input.onchange();
 assert.equal(h.context.recording,recorder);assert.equal(h.imports.length,0);assert.equal(input.value,'');
 assert.match(h.messages.at(-1),/Stop your recording/);
});
test('video import after recording and oversized input recovery',()=>{
 const h=harness(),input=h.run('videoImport');input.files=[{size:101*1024*1024}];input.value='large.mp4';input.onchange();assert.equal(h.imports.length,0);assert.equal(input.value,'');
 const clip={size:200,type:'video/mp4'};input.files=[clip];input.value='clip.mp4';input.onchange();assert.deepEqual(h.imports,[clip]);assert.equal(input.value,'');
});
