// ===== Shopili overhaul motion library =====
var FPS=60, CW=1080, CH=1920, DUR=117;
var SP="C:/Users/ma267/Downloads/Shopili/overhaul2_build";
var LOG=[]; function log(s){LOG.push(String(s));}
function flush(name){var f=new File(SP+"/logs/"+name+".log");f.encoding="UTF-8";f.open("w");f.write(LOG.join("\n"));f.close();}
function hx(h){return [parseInt(h.substr(0,2),16)/255,parseInt(h.substr(2,2),16)/255,parseInt(h.substr(4,2),16)/255];}
var C={orange:hx("FB7C0B"),deep:hx("E94605"),yellow:hx("FDBD06"),ink:hx("14161C"),ink2:hx("23262F"),off:hx("F7F7F7"),white:[1,1,1],blue:hx("185FA5"),green:hx("1F8A50"),grey:hx("9AA0AA"),line:hx("E3E3E3"),side:hx("2C2F38")};
function item(n){for(var i=1;i<=app.project.numItems;i++){var it=app.project.item(i);if(it.name==n)return it;}return null;}
function folder(n){var f=item(n); if(f&&f instanceof FolderItem) return f; return app.project.items.addFolder(n);}
var FLD=null;
// ---- cue log: every move records (time, kind, layer) so the SFX track is timed from the real animation
var CUES=[], SCN="";
function cue(t,kind,info){CUES.push('{"t":'+(Math.round(t*1000)/1000)+',"kind":"'+kind+'","scene":"'+SCN+'","info":"'+String(info||"").replace(/"/g,"").replace(/[^\x20-\x7e]/g,"?")+'"}');}
function dumpCues(name){var f=new File(SP+"/cues/"+name+".json"); var d=new Folder(SP+"/cues"); if(!d.exists) d.create(); f.encoding="UTF-8"; f.open("w"); f.write("[\n"+CUES.join(",\n")+"\n]"); f.close();}
function newComp(n,w,h,d){var o=item(n); if(o&&o instanceof CompItem) o.remove(); var c=app.project.items.addComp(n,w||CW,h||CH,1,d||DUR,FPS); c.parentFolder=FLD; c.motionBlur=true; return c;}
function T(l){return l.property("ADBE Transform Group");}
function P(l,n){var m={pos:"ADBE Position",scale:"ADBE Scale",op:"ADBE Opacity",rot:"ADBE Rotate Z",rx:"ADBE Rotate X",ry:"ADBE Rotate Y",anchor:"ADBE Anchor Point"}; return T(l).property(m[n]);}
function dimsOf(p){var t=p.propertyValueType; if(t==PropertyValueType.TwoD) return 2; if(t==PropertyValueType.ThreeD) return 3; return 1;}
// keys(prop, [[t,v],...], mode)  mode: default ease | "hold" | "lin" | "soft"
function keys(p,arr,mode){
  for(var i=0;i<arr.length;i++) p.setValueAtTime(arr[i][0],arr[i][1]);
  var d=dimsOf(p);
  for(var i=0;i<arr.length;i++){var k=p.nearestKeyIndex(arr[i][0]);
    if(mode=="hold"){p.setInterpolationTypeAtKey(k,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);continue;}
    if(mode=="lin"){p.setInterpolationTypeAtKey(k,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);continue;}
    var ei=[],eo=[]; for(var q=0;q<d;q++){ei.push(new KeyframeEase(0,85)); eo.push(new KeyframeEase(0,mode=="soft"?60:18));}
    try{p.setTemporalEaseAtKey(k,ei,eo);}catch(e){}
  }
}
var BOUNCE="var amp=.06,freq=3.4,decay=6.5;var n=0;if(numKeys>0){n=nearestKey(time).index;if(key(n).time>time)n--;}if(n==0){value}else{var t=time-key(n).time;if(t>0&&t<1.2){var v=velocityAtTime(key(n).time-thisComp.frameDuration/10);value+v*(amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t));}else{value}}";
function bounce(p){p.expression=BOUNCE;}
function life(l,a,b){l.startTime=0; l.outPoint=DUR; l.inPoint=Math.max(0,a); l.outPoint=b;}
// ---- text ----
var AR_TPL=null;
function arTpl(){ if(AR_TPL) return AR_TPL; var s=item("V2_SUBS"); for(var j=1;j<=s.numLayers;j++){ if(/^SUB_\d\d$/.test(s.layer(j).name)){AR_TPL=s.layer(j);break;} } return AR_TPL; }
function styleText(l,str,o){
  var tp=l.property("ADBE Text Properties").property("ADBE Text Document"); var td=tp.value;
  td.text=str; td.font=o.font||"Cairo-Black"; td.fontSize=o.size||200; td.applyFill=true; td.fillColor=o.color||C.white; td.applyStroke=false;
  td.justification=ParagraphJustification.CENTER_JUSTIFY; td.tracking=o.track||0;
  try{td.autoLeading=false; td.leading=(o.size||200)*(o.lead||1.05);}catch(e){}
  tp.setValue(td);
}
function centerAnchor(l){ P(l,"anchor").expression="var r=sourceRectAtTime(time,false);[r.left+r.width/2,r.top+r.height/2]"; }
// txt(comp,"str",{size,color,font,x,y,ar,maxW,a,b})
function txt(c,str,o){
  var l; if(o.ar===false){ l=c.layers.addText(str); } else { var ids={}; for(var z=1;z<=c.numLayers;z++) ids[c.layer(z).id]=1; arTpl().copyToComp(c); l=null; for(var z=1;z<=c.numLayers;z++) if(!ids[c.layer(z).id]){l=c.layer(z);break;} l.moveToBeginning(); var ns=["pos","scale","op","rot","anchor"]; for(var z=0;z<ns.length;z++){var pp=P(l,ns[z]); while(pp.numKeys>0) pp.removeKey(1); if(ns[z]!="anchor") pp.expression="";} var an=l.property("ADBE Text Properties").property("ADBE Text Animators"); while(an.numProperties>0) an.property(1).remove(); }
  l.name=(o.name||("T_"+str)).substr(0,30);
  styleText(l,str,o); centerAnchor(l);
  if(o.maxW){ var r=l.sourceRectAtTime(o.a||0,false); if(r.width>o.maxW){ o.size=Math.floor((o.size||200)*o.maxW/r.width); styleText(l,str,o);} }
  P(l,"pos").setValue([o.x==null?540:o.x,o.y==null?820:o.y]);
  life(l,o.a||0,o.b||DUR); l.motionBlur=true; return l;
}
// ---- shapes ----
function shp(c,name){var l=c.layers.addShape(); l.name=name; l.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); return l;}
function grp(l){return l.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group");}
function addFill(l,col){grp(l).addProperty("ADBE Vector Graphic - Fill"); var f=grp(l).property(grp(l).numProperties); f.property("ADBE Vector Fill Color").setValue(col.length==3?col.concat([1]):col); return l;}
function addStroke(l,col,w){grp(l).addProperty("ADBE Vector Graphic - Stroke"); var s=grp(l).property(grp(l).numProperties); s.property("ADBE Vector Stroke Color").setValue(col.concat([1])); s.property("ADBE Vector Stroke Width").setValue(w); s.property("ADBE Vector Stroke Line Cap").setValue(2); s.property("ADBE Vector Stroke Line Join").setValue(2); return l;}
function addTrim(l){grp(l).addProperty("ADBE Vector Filter - Trim"); return grp(l).property(grp(l).numProperties);}
function rect(c,name,w,h,r,col,x,y){var l=shp(c,name); grp(l).addProperty("ADBE Vector Shape - Rect"); var rc=grp(l).property(1); rc.property("ADBE Vector Rect Size").setValue([w,h]); rc.property("ADBE Vector Rect Roundness").setValue(r); if(col) addFill(l,col); P(l,"pos").setValue([x,y]); l.motionBlur=true; return l;}
function ellipse(c,name,d,col,x,y){var l=shp(c,name); grp(l).addProperty("ADBE Vector Shape - Ellipse"); grp(l).property(1).property("ADBE Vector Ellipse Size").setValue([d,d]); if(col) addFill(l,col); P(l,"pos").setValue([x,y]); l.motionBlur=true; return l;}
function path(c,name,pts,closed,col,w,x,y,tans){var l=shp(c,name); grp(l).addProperty("ADBE Vector Shape - Group"); var s=new Shape(); s.vertices=pts; s.closed=!!closed; if(tans){s.inTangents=tans[0]; s.outTangents=tans[1];} grp(l).property(1).property("ADBE Vector Shape").setValue(s); addStroke(l,col,w); P(l,"pos").setValue([x||0,y||0]); l.motionBlur=true; return l;}
function rectSize(l){return grp(l).property(1).property("ADBE Vector Rect Size");}
function fillColor(l){var g=grp(l); for(var i=1;i<=g.numProperties;i++) if(g.property(i).matchName=="ADBE Vector Graphic - Fill") return g.property(i).property("ADBE Vector Fill Color");}
function full(c,name,col,a,b){var l=rect(c,name,CW+40,CH+40,0,col,540,960); l.motionBlur=false; life(l,a,b); return l;}
// background with hold color flips: [[t,col],...]
function bgFlips(c,flips,a,b){var l=full(c,"BG_FLIPS",flips[0][1],a,b); var fc=fillColor(l); var arr=[]; for(var i=0;i<flips.length;i++) arr.push([flips[i][0],flips[i][1].concat([1])]); keys(fc,arr,"hold"); l.moveToEnd(); return l;}
// ---- moves ----
function slam(l,t,o){o=o||{}; cue(t,"slam",l.name); var B=P(l,"scale").value[0], s0=(o.s0||170)*B/100, d=o.d||0.2; keys(P(l,"scale"),[[t,[s0,s0,100]],[t+d,[B,B,100]]]); bounce(P(l,"scale")); keys(P(l,"op"),[[t,0],[t+0.06,100]],"lin");}
function drop(l,t,o){o=o||{}; cue(t,"drop",l.name); var p=P(l,"pos").value, dy=o.dy==null?-260:o.dy, dx=o.dx||0, d=o.d||0.24; keys(P(l,"pos"),[[t,[p[0]+dx,p[1]+dy]],[t+d,[p[0],p[1]]]]); bounce(P(l,"pos")); keys(P(l,"op"),[[t,0],[t+0.05,100]],"lin");}
function pop(l,t,o){o=o||{}; cue(t,"pop",l.name); var B=P(l,"scale").value[0], d=o.d||0.22; keys(P(l,"scale"),[[t,[0,0,100]],[t+d,[B,B,100]]]); bounce(P(l,"scale"));}
function fadeOut(l,t,d){keys(P(l,"op"),[[t,100],[t+(d||0.12),0]],"lin"); l.outPoint=t+(d||0.12);}
function exitUp(l,t,o){o=o||{}; cue(t,"exit",l.name); var p=P(l,"pos").valueAtTime(t,false); var d=o.d||0.16; keys(P(l,"pos"),[[t,p],[t+d,[p[0]+(o.dx||0),p[1]+(o.dy==null?-160:o.dy)]]],"soft"); keys(P(l,"op"),[[t,100],[t+d,0]],"lin"); l.outPoint=t+d;}
function exitScale(l,t,o){o=o||{}; cue(t,"exit",l.name); var d=o.d||0.16; var s=P(l,"scale").valueAtTime(t,false); keys(P(l,"scale"),[[t,s],[t+d,[o.s1||0,o.s1||0,100]]],"soft"); l.outPoint=t+d;}
function moveTo(l,t,d,to,mode){var p=P(l,"pos").valueAtTime(t,false); keys(P(l,"pos"),[[t,p],[t+d,to]],mode);}
// split a text layer into two halves that fly apart
function crack(c,l,t){cue(t,"crack",l.name); var r=l.sourceRectAtTime(t,false); var top=l.duplicate();
  function half(L,isTop){var m=L.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); var s=new Shape(); var mid=r.top+r.height*0.52; var y0=isTop?r.top-300:mid, y1=isTop?mid:r.top+r.height+300; s.vertices=[[r.left-300,y0],[r.left+r.width+300,y0],[r.left+r.width+300,y1],[r.left-300,y1]]; s.closed=true; m.property("ADBE Mask Shape").setValue(s);
    var p=P(L,"pos").valueAtTime(t,false); keys(P(L,"pos"),[[t,p],[t+0.3,[p[0]+(isTop?-90:90),p[1]+(isTop?-420:420)]]],"soft"); keys(P(L,"rot"),[[t,0],[t+0.3,isTop?-9:9]],"soft"); keys(P(L,"op"),[[t+0.12,100],[t+0.3,0]],"lin"); L.outPoint=t+0.3;}
  half(top,true); half(l,false);}
// strike-through line drawn over a text layer
function strike(c,l,t,col){cue(t,"strike",l.name); var r=l.sourceRectAtTime(t,false); var p=P(l,"pos").valueAtTime(t,false); var w=r.width+60; var s=path(c,"STRIKE",[[-w/2,0],[w/2,0]],false,col||C.ink,22,p[0],p[1]+8); var tr=addTrim(s); keys(tr.property("ADBE Vector Trim End"),[[t,0],[t+0.16,100]]); keys(P(s,"rot"),[[t,0],[t+0.16,-4]]); life(s,t,l.outPoint); return s;}
// chip: pill + text, returns pill (text parented)
function chip(c,str,o){var size=o.size||54; var t=txt(c,str,{size:size,color:o.tc||C.white,font:o.font||"Cairo-Bold",x:0,y:0,ar:o.ar,a:o.a,b:o.b,name:"CT_"+str});
  var r=t.sourceRectAtTime(o.a||0,false);
  var pill=rect(c,"CHIP_"+str.substr(0,12),r.width+size*1.4,size*1.75,size*0.9,o.fill||C.orange,o.x,o.y); life(pill,o.a||0,o.b||DUR);
  t.moveBefore(pill); t.parent=pill; P(t,"pos").setValue([0,-size*0.08]); return pill;}
// count-up text via Source Text expression
function countText(c,o){cue(o.t0,"count",(o.pre||"")+o.to+(o.suf||"")+"|"+o.t1); var l=txt(c,"0",{size:o.size||200,color:o.color||C.orange,font:o.font||"Poppins-Black",x:o.x,y:o.y,ar:false,a:o.a,b:o.b,name:o.name||"COUNT"});
  l.property("ADBE Text Properties").property("ADBE Text Document").expression="var t0="+o.t0+",t1="+o.t1+",a="+o.from+",b="+o.to+";var k=ease(time,t0,t1,0,1);var v=a+(b-a)*k;var s=v.toFixed("+(o.dec||0)+");'"+(o.pre||"")+"'+s+'"+(o.suf||"")+"'";
  return l;}
// image layer fitted to width
function img(c,name,o){var it=item(name); var l=c.layers.add(it); var s=(o.w||it.width)/it.width*100; P(l,"scale").setValue([s,s]); P(l,"pos").setValue([o.x==null?540:o.x,o.y==null?960:o.y]); life(l,o.a||0,o.b||DUR); l.motionBlur=true; return l;}
function matte(l,m){ m.moveBefore(l); try{ l.setTrackMatte(m,TrackMatteType.ALPHA);}catch(e){ l.trackMatteType=TrackMatteType.ALPHA; } }
// ---- 2.5D devices ----
// screens: [[footageName,tIn,tOut,{scroll:[t0,t1,px]}],...]  swap = slide up from below
function screenComp(name,w,h,screens){var c=newComp(name,w,h);
  var bg=full(c,"SCR_BG",C.white,0,DUR); P(bg,"pos").setValue([w/2,h/2]);
  for(var i=0;i<screens.length;i++){var s=screens[i]; var it=item(s[0]); var sc=w/it.width*100; var ih=it.height*w/it.width;
    var l=c.layers.add(it); P(l,"scale").setValue([sc,sc]); var y0=ih/2; P(l,"pos").setValue([w/2,y0]); life(l,s[1],s[2]);
    if(i>0) keys(P(l,"pos"),[[s[1],[w/2,y0+h]],[s[1]+0.28,[w/2,y0]]]);
    if(s[3]&&s[3].scroll){var sv=s[3].scroll; keys(P(l,"pos"),[[sv[0],[w/2,y0]],[sv[1],[w/2,y0-sv[2]]]],"soft");}
  }
  return c;}
function scanBeam(c,t,d){cue(t,"scan","beam"); var w=c.width,h=c.height; var g=rect(c,"SCAN_GLOW",w,140,0,C.orange,w/2,-70); P(g,"op").setValue(16); var b=rect(c,"SCAN",w,10,0,C.orange,w/2,0);
  keys(P(b,"pos"),[[t,[w/2,-20]],[t+d,[w/2,h+80]]],"soft"); keys(P(g,"pos"),[[t,[w/2,-90]],[t+d,[w/2,h+10]]],"soft"); life(b,t,t+d); life(g,t,t+d);}
function tap(c,t,x,y){cue(t,"tap",c.name); var r=ellipse(c,"TAP",120,C.orange,x,y); keys(P(r,"scale"),[[t,[0,0,100]],[t+0.25,[160,160,100]]],"soft"); keys(P(r,"op"),[[t,75],[t+0.3,0]],"lin"); life(r,t,t+0.32);}
function deviceComp(kind,scr){
  var W,H,bw,bh,br,sw,sh,sr,cy;
  if(kind=="POS"){W=1000;H=900;bw=960;bh=Math.round(920*scr.height/scr.width)+40;br=34;sw=920;sh=sw*scr.height/scr.width;sr=14;cy=bh/2+10;}
  else{W=520;H=1040;bw=500;bh=1020;br=78;sw=462;sh=982;sr=62;cy=520;}
  var d=newComp("DEV_"+kind+"_"+scr.name,W,H); var sil=newComp("SIL_"+kind+"_"+scr.name,W,H);
  function body(c,col){var b=rect(c,"BODY",bw,bh,br,col,W/2,cy); if(kind=="POS"){rect(c,"NECK",130,110,0,col,W/2,cy+bh/2+50); rect(c,"BASE",380,30,15,col,W/2,cy+bh/2+108);} return b;}
  body(sil,C.side); body(d,C.ink);
  var s=d.layers.add(scr); P(s,"scale").setValue([sw/scr.width*100,sh/scr.height*100]); P(s,"pos").setValue([W/2,cy]);
  var m=rect(d,"SCR_MATTE",sw,sh,sr,C.white,W/2,cy); matte(s,m);
  if(kind=="PHONE"){rect(d,"ISLAND",130,38,19,C.ink,W/2,cy-sh/2+34);}
  var gl=rect(d,"GLARE",sw,sh,sr,C.white,W/2,cy); P(gl,"op").setValue(5);
  return [d,sil];}
// place device in scene comp as 3D with stacked thickness
function placeDevice(c,dc,o){cue(o.a,"device_in",o.name||dc[0].name); cue(o.b-0.3,"device_out",o.name||dc[0].name); var l=c.layers.add(dc[0]); l.threeDLayer=true; l.name=o.name||dc[0].name; life(l,o.a,o.b); P(l,"pos").setValue(o.pos||[540,900,0]); var sc=o.scale||100; P(l,"scale").setValue([sc,sc,sc]);
  var n=o.depth||12; for(var k=1;k<=n;k++){var s=c.layers.add(dc[1]); s.threeDLayer=true; s.name="THK_"+k; s.moveAfter(l); s.parent=l; P(s,"pos").setValue([dc[0].width/2,dc[0].height/2,k*2.4]); life(s,o.a,o.b);}
  l.motionBlur=true; return l;}
function cam(c,zoom){var z=zoom||2400; var k=c.layers.addCamera("CAM",[540,960]); k.property("ADBE Camera Options Group").property("ADBE Camera Zoom").setValue(z); P(k,"pos").setValue([540,960,-z]); return k;}
function shadow(c,x,y,w,a,b){var s=ellipse(c,"SHADOW",100,C.ink,x,y); P(s,"scale").setValue([w,14,100]); P(s,"op").setValue(22); var e=s.property("ADBE Effect Parade").addProperty("ADBE Box Blur2"); e.property(1).setValue(28); life(s,a,b); return s;}
// outlined ghost of a word that bursts outward behind it on impact
function echo(l,t,col,n){if(!(l instanceof TextLayer)) return; n=n||2; for(var i=0;i<n;i++){var d=l.duplicate(); d.name="ECHO_"+i; d.moveAfter(l);
  var ns=["scale","op","pos"]; for(var z=0;z<ns.length;z++){var pp=P(d,ns[z]); pp.expression=""; while(pp.numKeys>0) pp.removeKey(1);}
  P(d,"pos").setValue(P(l,"pos").valueAtTime(t+0.3,false));
  var tp=d.property("ADBE Text Properties").property("ADBE Text Document"); var td=tp.value; td.applyFill=false; td.applyStroke=true; td.strokeColor=col||C.white; td.strokeWidth=3; tp.setValue(td);
  var t0=t+0.08+i*0.07; keys(P(d,"scale"),[[t0,[100,100]],[t0+0.5,[150+i*30,150+i*30]]],"soft"); keys(P(d,"op"),[[t0,55],[t0+0.5,0]],"lin"); life(d,t0,t0+0.5);}}

// ===== OVERHAUL 2 additions =====
// 3D icons (Fluent Emoji 3D, MIT, upscaled 4x): pop / drop / fly in with a soft shadow, then float
var ICODIR="C:/Users/ma267/Downloads/Shopili/assets_ov2/icons3d/";
function icoItem(n){var it=item(n+".png"); if(it&&it instanceof FootageItem) return it; it=app.project.importFile(new ImportOptions(new File(ICODIR+n+".png"))); it.parentFolder=folder("ICONS3D"); return it;}
// ico(comp,"hamburger",{x,y,w,a,b,how:"pop"|"drop"|"fly"|"none",from:[x,y],rot0,float,amp,shadow,parent})
function ico(c,n,o){var it=icoItem(n); var l=c.layers.add(it); l.name="ICO_"+n; var s=(o.w||260)/it.width*100;
  P(l,"scale").setValue([s,s]); P(l,"pos").setValue([o.x==null?540:o.x,o.y==null?960:o.y]); life(l,o.a,o.b==null?DUR:o.b); l.motionBlur=true;
  if(o.shadow!==false){var ds=l.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow"); ds.property("ADBE Drop Shadow-0001").setValue(C.ink.concat([1])); ds.property("ADBE Drop Shadow-0002").setValue(70); ds.property("ADBE Drop Shadow-0003").setValue(180); ds.property("ADBE Drop Shadow-0004").setValue(26); ds.property("ADBE Drop Shadow-0005").setValue(60);}
  var how=o.how||"pop", a=o.a;
  if(how=="pop"){pop(l,a,{d:0.24}); keys(P(l,"rot"),[[a,o.rot0==null?-22:o.rot0],[a+0.3,0]]); bounce(P(l,"rot"));}
  else if(how=="drop"){drop(l,a,{dy:o.dy==null?-700:o.dy,dx:o.dx||0,d:0.3}); keys(P(l,"rot"),[[a,o.rot0==null?18:o.rot0],[a+0.3,0]]); bounce(P(l,"rot"));}
  else if(how=="fly"){var p=P(l,"pos").value; cue(a,"fly",l.name); keys(P(l,"pos"),[[a,o.from],[a+(o.d||0.4),p]]); bounce(P(l,"pos")); keys(P(l,"rot"),[[a,o.rot0==null?-30:o.rot0],[a+(o.d||0.4),0]]); bounce(P(l,"rot")); keys(P(l,"op"),[[a,0],[a+0.05,100]],"lin");}
  if(o.flt!==false){var amp=o.amp==null?9:o.amp, sd=Math.round(Math.random()*100)/10;
    P(l,"anchor").expression="var k="+(100/s)+";var t=time-"+(a+0.35)+";t>0?value+[0,"+amp+"*k*Math.sin(t*2.3+"+sd+")]:value";
    var bz="var amp=.06,freq=3.4,decay=6.5;var n=0;if(numKeys>0){n=nearestKey(time).index;if(key(n).time>time)n--;}var r=value;if(n>0){var t=time-key(n).time;if(t>0&&t<1.2){var v=velocityAtTime(key(n).time-thisComp.frameDuration/10);r=value+v*(amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t));}}";
    P(l,"rot").expression=bz+"var tf=time-"+(a+0.35)+";tf>0?r+2.5*Math.sin(tf*1.7+"+sd+"):r";
  }
  if(o.parent){l.parent=o.parent;}
  return l;}
// ring of icons on an ellipse around a centre, slowly orbiting; returns the null (scale it to 0 to suck them in)
function orbit(c,names,o){var nl=c.layers.addNull(); nl.name="ORBIT_"+String(o.a).replace(".","_"); P(nl,"pos").setValue([o.x,o.y]); life(nl,o.a,o.b);
  var rx=o.rx||o.r, ry=o.ry||o.r, sp=(o.spin==null?40:o.spin)*Math.PI/180/(o.b-o.a);
  for(var i=0;i<names.length;i++){var ang=(i/names.length)*2*Math.PI-Math.PI/2, t=o.a+(o.stagger==null?0.06:o.stagger)*i;
    var l=ico(c,names[i],{x:0,y:0,w:o.w||170,a:t,b:o.b,flt:false,shadow:o.shadow});
    l.parent=nl; P(l,"pos").expression="var th="+ang+"+(time-"+o.a+")*"+sp+";["+rx+"*Math.cos(th),"+ry+"*Math.sin(th)]";}
  return nl;}
// slow drifting dot grid over the background (difference blend so it reads on dark, light and orange)
function bgPattern(c,a,b,op){var l=shp(c,"BG_DOTS"); grp(l).addProperty("ADBE Vector Shape - Ellipse"); grp(l).property(1).property("ADBE Vector Ellipse Size").setValue([12,12]); addFill(l,C.white);
  var root=l.property("ADBE Root Vectors Group");
  var r1=root.addProperty("ADBE Vector Filter - Repeater"); r1.property("ADBE Vector Repeater Copies").setValue(14); r1.property("ADBE Vector Repeater Transform").property("ADBE Vector Repeater Position").setValue([90,0]);
  var r2=root.addProperty("ADBE Vector Filter - Repeater"); r2.property("ADBE Vector Repeater Copies").setValue(24); r2.property("ADBE Vector Repeater Transform").property("ADBE Vector Repeater Position").setValue([0,90]);
  P(l,"pos").expression="[-45+(time*22)%90, -45+(time*14)%90]"; P(l,"op").setValue(op||9); l.blendingMode=BlendingMode.DIFFERENCE; l.motionBlur=false; life(l,a,b);
  return l;}
// keep a layer directly above the background
function aboveBG(c,l){var bg=null; for(var i=c.numLayers;i>=1;i--){var n=c.layer(i).name; if(n=="BG_FLIPS"||n=="BG"){bg=c.layer(i);break;}} if(bg) l.moveBefore(bg);}
