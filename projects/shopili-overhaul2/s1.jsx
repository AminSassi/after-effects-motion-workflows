// ===== ACT 1: HOOK (0-7.20) / PAIN (7.20-16.64) / LOGO (16.64-20.40) =====
// ---- K1 HOOK: one giant word per VO word, each with its 3D icon; background flips color on every word
SCN="K1";
var c=newComp("K1_HOOK");
bgFlips(c,[[0,C.ink],[0.62,C.orange],[1.40,C.ink],[2.26,C.off],[2.86,C.orange],[3.42,C.ink],[4.64,C.off],[5.98,C.orange]],0,7.25);
aboveBG(c,bgPattern(c,0,7.25,10));
// "عندك" : the businesses peek in from the edges
var w0=txt(c,"عندك",{size:190,color:C.white,y:960,a:0,b:0.62}); slam(w0,0.02,{s0:130});
var peek=[["shopping_cart",-160,520,190,540],["convenience_store",1240,640,890,640],["hot_beverage",-160,1360,200,1360],["hamburger",1240,1460,870,1440]];
for(var i=0;i<peek.length;i++){var k=peek[i]; ico(c,k[0],{x:k[3],y:k[4],w:190,a:0.06+i*0.05,b:0.62,how:"fly",from:[k[1],k[2]],d:0.3,flt:false,shadow:false});}
// word + icon pairs (icon above, word below)
function pair(word,icon,a,b,col,how,o){o=o||{};
  var ic=ico(c,icon,{x:540,y:o.iy||640,w:o.iw||430,a:a,b:b,how:how||"pop",from:o.from,d:0.28,rot0:o.rot0});
  var w=txt(c,word,{size:o.size||300,color:col,y:o.wy||1150,a:a,b:b,maxW:940});
  return [ic,w];}
var p1=pair("عطرية","shopping_cart",0.62,1.40,C.white,"drop"); slam(p1[1],0.66); echo(p1[1],0.66,C.white);
var p2=pair("مغازة","convenience_store",1.40,2.26,C.orange,"pop"); drop(p2[1],1.44,{dy:-420});
var p3=pair("قهوة","hot_beverage",2.26,2.86,C.ink,"pop",{rot0:30}); slam(p3[1],2.30,{s0:55}); echo(p3[1],2.30,C.orange);
// steam over the coffee: three short strokes that rise and fade
for(var i=0;i<3;i++){var sx=470+i*70; var sm=path(c,"STEAM_"+i,[[0,40],[-16,0],[0,-40]],false,C.grey,12,sx,420,[[[0,0],[0,14],[0,14]],[[0,-14],[0,-14],[0,0]]]); life(sm,2.42+i*0.06,2.86);
  keys(P(sm,"pos"),[[2.42+i*0.06,[sx,450]],[2.86,[sx,360]]],"lin"); keys(P(sm,"op"),[[2.42+i*0.06,0],[2.55+i*0.06,80],[2.86,0]],"lin");}
var p4=pair("ريستوران","fork_and_knife_with_plate",2.86,3.42,C.white,"fly",{from:[1500,640],size:290}); drop(p4[1],2.88,{dx:760,dy:0});
// "وإلا فاست فود": burger + fries
var bu=ico(c,"hamburger",{x:370,y:640,w:360,a:3.42,b:4.64,how:"drop",dy:-800});
var fr=ico(c,"french_fries",{x:720,y:620,w:330,a:3.56,b:4.64,how:"drop",dy:-800,rot0:-18});
var w5a=txt(c,"وإلا",{size:120,color:C.grey,y:1000,a:3.42,b:4.64}); drop(w5a,3.42,{dy:-140});
var w5=txt(c,"فاست فود",{size:270,color:C.orange,y:1200,a:3.56,b:4.64,maxW:960}); slam(w5,3.56); echo(w5,3.56,C.orange);
// "تعرف اللي الخدمة موش كان": all six icons orbit the word
var l1=txt(c,"تعرف اللي",{size:110,color:C.ink,y:780,a:4.64,b:5.98}); drop(l1,4.64,{dy:90});
var l2=txt(c,"الخدمة",{size:190,color:C.ink,y:960,a:5.10,b:5.98}); slam(l2,5.10); echo(l2,5.10,C.orange,1);
var l3=txt(c,"موش كان",{size:130,color:C.orange,y:1150,a:5.60,b:5.98}); drop(l3,5.60,{dy:110});
var ob=orbit(c,["shopping_cart","convenience_store","hot_beverage","fork_and_knife_with_plate","hamburger","french_fries"],{x:540,y:960,rx:430,ry:640,w:150,a:4.70,b:5.98,spin:35,stagger:0.07});
// "بيع وشرا": coin + banknote, struck out, then everything cracks / falls
var b1=txt(c,"بيع وشرا",{size:300,color:C.white,y:1060,a:5.98,b:7.25,maxW:960}); slam(b1,5.98); echo(b1,5.98,C.white);
var cn=ico(c,"coin",{x:330,y:620,w:280,a:5.98,b:7.25,how:"pop"}); var bn=ico(c,"dollar_banknote",{x:740,y:640,w:320,a:6.08,b:7.25,how:"pop",rot0:20});
var st=strike(c,b1,6.50,C.ink); st.outPoint=6.95;
crack(c,b1,6.95);
keys(P(cn,"pos"),[[6.95,[330,620]],[7.25,[150,2300]]],"soft"); keys(P(bn,"pos"),[[6.95,[740,640]],[7.25,[980,2300]]],"soft");
log("K1 ok");

// ---- K2 PAIN: the daily mess piles up (word + icon), then implodes into one orange dot
SCN="K2";
var c2=newComp("K2_PAIN");
full(c2,"BG",C.ink,7.20,16.70);
aboveBG(c2,bgPattern(c2,7.20,16.70,7));
var ALL=c2.layers.addNull(); ALL.name="ALL"; P(ALL,"pos").setValue([540,960]); life(ALL,7.20,16.70);
var STK=c2.layers.addNull(); STK.name="STACK"; P(STK,"pos").setValue([540,960]); life(STK,7.20,16.70);
// [word, color, y, rot, t, sub, subcol, tsub, wordX, icon, iconX, iconHow]
var stack=[
 ["ستوك",C.white,470,-3,7.20,"لازمك تتبّعو",C.orange,7.92,640,"package",210,"drop"],
 ["كريدي",C.orange,800,2.5,8.76,"لازمك تقيّدو",C.white,9.54,440,"ledger",860,"pop"],
 ["فورنيسورات",C.white,1120,-2,10.36,"لازمك تخلّصهم",C.orange,11.34,640,"delivery_truck",200,"fly"]];
for(var i=0;i<stack.length;i++){var s=stack[i];
  var w=txt(c2,s[0],{size:210,color:s[1],x:s[8],y:s[2],a:s[4],b:16.70,maxW:640}); P(w,"rot").setValue(s[3]); drop(w,s[4],{dy:-900,d:0.26});
  var sb=txt(c2,s[5],{size:66,color:s[6],font:"Cairo-Bold",x:s[8],y:s[2]+140,a:s[7],b:16.70}); drop(sb,s[7],{dy:50});
  var ic=ico(c2,s[9],{x:s[10],y:s[2]+40,w:250,a:s[4]+0.04,b:16.70,how:s[11],from:[1400,s[2]+40],d:0.45,dy:-900});
  w.parent=STK; sb.parent=STK; ic.parent=STK;
  // every new landing kicks the existing pile slightly
  if(i>0){ var r0=P(STK,"rot"); r0.setValueAtTime(s[4]+0.22,0); r0.setValueAtTime(s[4]+0.27,i%2?1.5:-1.5); r0.setValueAtTime(s[4]+0.45,0); }
}
// pile shrinks to the top, the cash register word takes over
keys(P(STK,"pos"),[[12.10,[540,960]],[12.45,[540,500]]]); keys(P(STK,"scale"),[[12.10,[100,100]],[12.45,[50,50]]]);
var k=txt(c2,"كاسة",{size:300,color:C.orange,y:930,a:12.28,b:16.70}); slam(k,12.28,{s0:230}); echo(k,12.28,C.orange,3);
var q=txt(c2,"قدّاش؟",{size:96,color:C.white,y:1110,a:13.66,b:16.70}); drop(q,13.66,{dy:60});
var bag=ico(c2,"money_bag",{x:540,y:1350,w:270,a:12.50,b:16.70,how:"pop"});
var cin=chip(c2,"دخل",{size:70,fill:C.green,x:830,y:1380,a:14.16,b:16.70}); pop(cin,14.16);
var cou=chip(c2,"خرج",{size:70,fill:C.deep,x:250,y:1380,a:15.22,b:16.70}); pop(cou,15.22);
var up=path(c2,"ARR_UP",[[0,40],[0,-40],[-26,-14],[0,-40],[26,-14]],false,C.green,12,830,1270); life(up,14.24,16.70); pop(up,14.24);
var dn=path(c2,"ARR_DN",[[0,-40],[0,40],[-26,14],[0,40],[26,14]],false,C.deep,12,250,1270); life(dn,15.30,16.70); pop(dn,15.30);
// money in: three coins rain into the bag; money out: banknote with wings flies away
for(var i=0;i<3;i++){var t=14.20+i*0.12; var ci=ico(c2,"coin",{x:540,y:1330,w:110,a:t,b:t+0.42,how:"fly",from:[760+i*90,780],d:0.32,flt:false,shadow:false}); exitScale(ci,t+0.30,{d:0.1});}
var bs=P(bag,"scale").valueAtTime(13.5,false)[0]; keys(P(bag,"scale"),[[14.50,[bs,bs]],[14.58,[bs*1.1,bs*1.1]],[14.72,[bs,bs]]]);
var mw=ico(c2,"money_with_wings",{x:540,y:1300,w:220,a:15.26,b:16.70,how:"pop",flt:false});
keys(P(mw,"pos"),[[15.45,[540,1300]],[16.00,[120,760]]],"soft"); keys(P(mw,"op"),[[15.80,100],[16.00,0]],"lin");
var top=[STK,k,q,bag,cin,cou,up,dn]; for(var i=0;i<top.length;i++) top[i].parent=ALL;
keys(P(ALL,"scale"),[[16.02,[100,100]],[16.44,[0,0]]],"soft"); keys(P(ALL,"rot"),[[16.02,0],[16.44,140]],"soft");
var dot=ellipse(c2,"DOT",100,C.orange,540,960); life(dot,16.28,16.70); keys(P(dot,"scale"),[[16.28,[0,0]],[16.38,[40,40]],[16.66,[2500,2500]]]); cue(16.28,"wipe","implode");
log("K2 ok");

// ---- K3 LOGO: orange flash -> white burst -> logo impact; every business icon orbits and gets pulled into the logo
SCN="K3";
var c3=newComp("K3_LOGO");
full(c3,"BG",C.off,16.64,20.45);
aboveBG(c3,bgPattern(c3,16.64,20.45,6));
var orf=full(c3,"OR",C.orange,16.64,17.00);
var burst=ellipse(c3,"BURST",100,C.white,540,820); life(burst,16.68,17.00); keys(P(burst,"scale"),[[16.68,[0,0]],[16.96,[2600,2600]]],"soft");
var ring=ellipse(c3,"RING",100,null,540,820); addStroke(ring,C.orange,6); life(ring,16.86,17.60); keys(P(ring,"scale"),[[16.86,[300,300]],[17.55,[1400,1400]]],"soft"); keys(P(ring,"op"),[[16.86,100],[17.55,0]],"lin");
var logo=img(c3,"shopili_logo.png",{w:880,x:540,y:820,a:16.80,b:20.45}); pop(logo,16.80,{d:0.24}); cue(16.80,"logo","shopili");
keys(P(logo,"scale"),[[17.2,[57.9,57.9]],[20.1,[60.5,60.5]]],"lin");
var ob3=orbit(c3,["shopping_cart","convenience_store","hot_beverage","fork_and_knife_with_plate","hamburger","package","ledger","delivery_truck"],{x:540,y:820,rx:480,ry:330,w:120,a:17.20,b:18.40,spin:60,stagger:0.05});
keys(P(ob3,"scale"),[[17.95,[100,100]],[18.35,[0,0]]],"soft"); cue(17.95,"suck","icons into logo");
keys(P(logo,"scale"),[[18.30,[58.6,58.6]],[18.40,[64,64]],[18.62,[59,59]]]);
var ring2=ellipse(c3,"RING2",100,null,540,820); addStroke(ring2,C.orange,8); life(ring2,18.34,19.00); keys(P(ring2,"scale"),[[18.34,[200,200]],[18.95,[1100,1100]]],"soft"); keys(P(ring2,"op"),[[18.34,100],[18.95,0]],"lin");
var tl=txt(c3,"تنجّم تسيّر خدمتك الكل",{size:84,color:C.ink,font:"Cairo-ExtraBold",y:1120,a:18.00,b:20.45,maxW:940}); drop(tl,18.00,{dy:70});
var pl=txt(c3,"من بلاصة وحدة",{size:175,color:C.orange,y:1300,a:18.84,b:20.45,maxW:960}); slam(pl,18.84); echo(pl,18.84,C.orange,1);
exitUp(logo,20.14,{dy:-500,d:0.22}); exitUp(tl,20.18,{dy:-500,d:0.22}); exitUp(pl,20.20,{dy:-600,d:0.22});
log("K3 ok");
