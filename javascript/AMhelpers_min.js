function calculate(inputId,outputId,format){var fullstr=document.getElementById(inputId).value;if(format.indexOf("list")!=-1){var strarr=fullstr.split(/,/)}else{var strarr=new Array();strarr[0]=fullstr}for(var sc=0;sc<strarr.length;sc++){str=strarr[sc];str=str.replace(/,/g,"");var err="";if(str.match(/DNE/i)){str=str.toUpperCase()}else{if(str.match(/oo$/)||str.match(/oo\W/)){str="`"+str+"`"}else{if(format.indexOf("fraction")!=-1||format.indexOf("reducedfraction")!=-1){str=str.replace(/\s/g,"");if(!str.match(/^\(?\-?\(?\d+\)?\/\(?\d+\)?$/)&&!str.match(/^\(?\d+\)?\/\(?\-?\d+\)?$/)&&!str.match(/^\s*?\-?\d+\s*$/)){err+="not a valid fraction"}}else{if(format.indexOf("fracordec")!=-1){str=str.replace(/\s/g,"");if(!str.match(/^\s*\-?\(?\d+\s*\/\s*\-?\d+\)?\s*$/)&&!str.match(/^\s*?\-?\d+\s*$/)&&!str.match(/^(\d+|\d+\.\d*|\d*\.\d+)$/)){err+=" invalid entry format"}}else{if(format.indexOf("mixednumber")!=-1){if(!str.match(/^\s*\-?\s*\d+\s*(_|\s)\s*\d+\s*\/\s*\d+\s*$/)&&!str.match(/^\s*?\-?\d+\s*$/)&&!str.match(/^\s*\-?\d+\s*\/\s*\-?\d+\s*$/)){err+="not a valid mixed number"}str=str.replace(/_/," ")}else{if(format.indexOf("scinot")!=-1){str=str.replace(/\s/g,"");str=str.replace("x","xx");if(!str.match(/^\-?[1-9](\.\d*)?(\*|xx)10\^(\-?\d+)$/)){err+="not valid scientific notation"}}}}}if(format.indexOf("notrig")!=-1&&str.match(/(sin|cos|tan|cot|sec|csc)/)){str="no trig functions allowed"}else{if(format.indexOf("nodecimal")!=-1&&str.indexOf(".")!=-1){str="no decimals allowed"}else{try{var evalstr=str;if(format.indexOf("allowmixed")!=-1||format.indexOf("mixednumber")!=-1){evalstr=evalstr.replace(/(\d+)\s+(\d+\s*\/\s*\d+)/,"($1+$2)")}if(format.indexOf("scinot")!=-1){evalstr=evalstr.replace("xx","*")}with(Math){var res=eval(mathjs(evalstr))}}catch(e){err="syntax incomplete"}if(!isNaN(res)&&res!="Infinity"){if(format.indexOf("fraction")!=-1||format.indexOf("reducedfraction")!=-1||format.indexOf("mixednumber")!=-1||format.indexOf("scinot")!=-1||format.indexOf("noval")!=-1){str="`"+str+"` "+err}else{str="`"+str+" =` "+(Math.abs(res)<1e-15?0:res)+err}}else{if(str!=""){var Pdepth=0;var Bdepth=0;for(var i=0;i<str.length;i++){if(str.charAt(i)=="("){Pdepth++}else{if(str.charAt(i)==")"){Pdepth--}else{if(str.charAt(i)=="["){Bdepth++}else{if(str.charAt(i)=="]"){Bdepth--}}}}}str="`"+str+"` = undefined";if(Pdepth!=0||Bdepth!=0){str+=" (unmatched parens)"}trg=str.match(/(sin|cos|tan|sec|csc|cot)\^/);reg=new RegExp("(sqrt|ln|log|sin|cos|tan|sec|csc|cot|abs)([^(])");errstuff=str.match(reg);if(trg!=null){trg=trg[1];str+=" [use ("+trg+"(x))^2 instead of "+trg+"^2(x)]"}else{if(errstuff!=null){str+=" [use function notation - "+errstuff[1]+"("+errstuff[2]+"), not "+errstuff[0]+"]"}}}}}}}}strarr[sc]=str+" "}fullstr=strarr.join(", ");var outnode=document.getElementById(outputId);var n=outnode.childNodes.length;for(var i=0;i<n;i++){outnode.removeChild(outnode.firstChild)}outnode.appendChild(document.createTextNode(fullstr));if(!noMathRender){AMprocessNode(outnode)}}function ineqtointerval(b){var c=b.split(/or/);for(i=0;i<c.length;i++){str=c[i];var a="";if(pat=str.match(/^([^<]+)\s*(<=?)\s*[a-zA-Z]\s*(<=?)([^<]+)$/)){if(pat[2]=="<="){a+="["}else{a+="("}a+=pat[1]+","+pat[4];if(pat[3]=="<="){a+="]"}else{a+=")"}}else{if(pat=str.match(/^([^>]+)\s*(>=?)\s*[a-zA-Z]\s*(>=?)([^>]+)$/)){if(pat[3]==">="){a+="["}else{a+="("}a+=pat[4]+","+pat[1];if(pat[2]==">="){a+="]"}else{a+=")"}}else{if(pat=str.match(/^([^><]+)\s*([><]=?)\s*[a-zA-Z]\s*$/)){if(pat[2]==">"){a="(-oo,"+pat[1]+")"}else{if(pat[2]==">="){a="(-oo,"+pat[1]+"]"}else{if(pat[2]=="<"){a="("+pat[1]+",oo)"}else{if(pat[2]=="<="){a="["+pat[1]+",oo)"}}}}}else{if(pat=str.match(/^\s*[a-zA-Z]\s*([><]=?)\s*([^><]+)$/)){if(pat[1]=="<"){a="(-oo,"+pat[2]+")"}else{if(pat[1]=="<="){a="(-oo,"+pat[2]+"]"}else{if(pat[1]==">"){a="("+pat[2]+",oo)"}else{if(pat[1]==">="){a="["+pat[2]+",oo)"}}}}}else{if(str.match(/all\s*real/i)){a="(-oo,oo)"}else{a=""}}}}}c[i]=a}a=c.join("U");return a}function intcalculate(inputId,outputId,format){var fullstr=document.getElementById(inputId).value;if(fullstr.match(/DNE/i)){fullstr=fullstr.toUpperCase()}else{if(fullstr.replace(/\s+/g,"")==""){fullstr="no answer given"}else{var calcvals=new Array();var calcstrarr=new Array();if(format.indexOf("inequality")!=-1){fullstr=fullstr.replace(/or/g," or ");var origstr=fullstr;fullstr=ineqtointerval(fullstr);var pat=str.match(/([a-zA-Z]+)/);var ineqvar=pat[1]}else{fullstr=fullstr.replace(/\s+/g,"")}var strarr=fullstr.split(/U/);var isok=true;for(i=0;i<strarr.length;i++){str=strarr[i];sm=str.charAt(0);em=str.charAt(str.length-1);vals=str.substring(1,str.length-1);vals=vals.split(/,/);if(vals.length!=2){fullstr="syntax incomplete";isok=false;break}for(j=0;j<2;j++){if(vals[j].match(/oo$/)||vals[j].match(/oo\W/)){calcvals[j]=vals[j]}else{var err="";try{with(Math){var res=eval(mathjs(vals[j]))}}catch(e){err="syntax incomplete"}if(!isNaN(res)&&res!="Infinity"){vals[j]=vals[j];calcvals[j]=(Math.abs(res)<1e-15?0:res)+err}}}strarr[i]=sm+vals[0]+","+vals[1]+em;if(format.indexOf("inequality")!=-1){if(calcvals[0].match(/oo/)){if(calcvals[1].match(/oo/)){calcstrarr[i]="RR"}else{calcstrarr[i]=ineqvar+(em=="]"?"le":"lt")+calcvals[1]}}else{if(calcvals[1].match(/oo/)){calcstrarr[i]=ineqvar+(sm=="["?"ge":"gt")+calcvals[0]}else{calcstrarr[i]=calcvals[0]+(sm=="["?"le":"lt")+ineqvar+(em=="]"?"le":"lt")+calcvals[1]}}}else{calcstrarr[i]=sm+calcvals[0]+","+calcvals[1]+em}}if(isok){if(format.indexOf("inequality")!=-1){if(origstr.match(/all\s*real/)){fullstr=origstr}else{origstr=origstr.replace(/or/g,' \\ "or" \\ ');origstr=origstr.replace(/<=/g,"le");origstr=origstr.replace(/>=/g,"ge");origstr=origstr.replace(/</g,"lt");origstr=origstr.replace(/>/g,"gt");fullstr="`"+origstr+"= "+calcstrarr.join(' \\ "or" \\ ')+"`"}}else{fullstr="`"+strarr.join("uu")+"` = "+calcstrarr.join(" U ")}}}}var outnode=document.getElementById(outputId);var n=outnode.childNodes.length;for(var i=0;i<n;i++){outnode.removeChild(outnode.firstChild)}outnode.appendChild(document.createTextNode(fullstr));if(!noMathRender){AMprocessNode(outnode)}}function ntuplecalc(inputId,outputId){var fullstr=document.getElementById(inputId).value;fullstr=fullstr.replace(/\s+/g,"");if(fullstr.match(/DNE/i)){fullstr=fullstr.toUpperCase();outcalced="DNE";outstr="DNE"}else{var outcalced="";var NCdepth=0;var lastcut=0;for(var i=0;i<fullstr.length;i++){dec=false;if(NCdepth==0){outcalced+=fullstr.charAt(i);lastcut=i+1}if(fullstr.charAt(i).match(/[\(\[\<\{]/)){NCdepth++}else{if(fullstr.charAt(i).match(/[\)\]\>\}]/)){NCdepth--;dec=true}}if((NCdepth==0&&dec)||(NCdepth==1&&fullstr.charAt(i)==",")){sub=fullstr.substring(lastcut,i);err="";try{with(Math){var res=eval(mathjs(sub))}}catch(e){err="syntax incomplete"}if(!isNaN(res)&&res!="Infinity"){outcalced+=res}else{outcalced+=err}outcalced+=fullstr.charAt(i);lastcut=i+1}}outstr="`"+fullstr+"` = "+outcalced}if(outputId!=null){var outnode=document.getElementById(outputId);var n=outnode.childNodes.length;for(var i=0;i<n;i++){outnode.removeChild(outnode.firstChild)}outnode.appendChild(document.createTextNode(outstr));if(!noMathRender){AMprocessNode(outnode)}}return outcalced}function complexcalc(inputId,outputId){var fullstr=document.getElementById(inputId).value;fullstr=fullstr.replace(/\s+/g,"");if(fullstr.match(/DNE/i)){fullstr=fullstr.toUpperCase();outcalced="DNE";outstr="DNE"}else{var outcalced="";var arr=fullstr.split(",");for(var cnt=0;cnt<arr.length;cnt++){var prep=mathjs(arr[cnt],"i");try{with(Math){var real=eval("i=0;"+prep)}with(Math){var imag=eval("i=1;"+prep)}}catch(e){err="syntax incomplete"}if(!isNaN(real)&&real!="Infinity"&&!isNaN(imag)&&imag!="Infinity"){imag-=real;if(cnt!=0){outcalced+=","}outcalced+=real+(imag>=0?"+":"")+imag+"i"}else{outcalced=err;break}}outstr="`"+fullstr+"` = "+outcalced}if(outputId!=null){var outnode=document.getElementById(outputId);var n=outnode.childNodes.length;for(var i=0;i<n;i++){outnode.removeChild(outnode.firstChild)}outnode.appendChild(document.createTextNode(outstr));if(!noMathRender){AMprocessNode(outnode)}}return outcalced}function matrixcalc(inputId,outputId,rows,cols){function calced(estr){err="";try{with(Math){var res=eval(mathjs(estr))}}catch(e){err="syntax incomplete"}if(!isNaN(res)&&res!="Infinity"){estr=(Math.abs(res)<1e-15?0:res)+err}else{if(estr!=""){estr="undefined"}}return estr}if(rows!=null&&cols!=null){var count=0;var str="[";var calcstr="[";for(var row=0;row<rows;row++){if(row>0){str+=",";calcstr+=","}str+="(";calcstr+="(";for(var col=0;col<cols;col++){if(col>0){str+=",";calcstr+=","}str+=document.getElementById(inputId+"-"+count).value;calcstr+=calced(document.getElementById(inputId+"-"+count).value);count++}str+=")";calcstr+=")"}str+="]";calcstr+="]"}else{var str=document.getElementById(inputId).value;var calcstr=str;var MCdepth=0;calcstr=calcstr.replace("[","(");calcstr=calcstr.replace("]",")");calcstr=calcstr.replace(/\s+/g,"");var calclist=new Array();calcstr=calcstr.substring(1,calcstr.length-1);var lastcut=0;for(var i=0;i<calcstr.length;i++){if(calcstr.charAt(i)=="("){MCdepth++}else{if(calcstr.charAt(i)==")"){MCdepth--}else{if(calcstr.charAt(i)==","&&MCdepth==0){calclist[calclist.length]=calcstr.substring(lastcut+1,i-1);lastcut=i+1}}}}calclist[calclist.length]=calcstr.substring(lastcut+1,calcstr.length-1);for(var i=0;i<calclist.length;i++){calclist2=calclist[i].split(",");for(var j=0;j<calclist2.length;j++){calclist2[j]=calced(calclist2[j])}calclist[i]=calclist2.join(",")}calcstr="[("+calclist.join("),(")+")]"}str="`"+str+"` = `"+calcstr+"`";if(outputId!=null){var outnode=document.getElementById(outputId);var n=outnode.childNodes.length;for(var i=0;i<n;i++){outnode.removeChild(outnode.firstChild)}outnode.appendChild(document.createTextNode(str));if(!noMathRender){AMprocessNode(outnode)}}return calcstr}function mathjsformat(b,a){var c=document.getElementById(b).value;var d=document.getElementById(a);d.value=mathjs(c)}function stringqpreview(b,a){var d=document.getElementById(b).value;var f=document.getElementById(a);var e=f.childNodes.length;for(var c=0;c<e;c++){f.removeChild(f.firstChild)}f.appendChild(document.createTextNode("`"+d+"`"));if(!noMathRender){AMprocessNode(f)}}function AMpreview(inputId,outputId){var qn=inputId.slice(2);var vl=vlist[qn];var fl=flist[qn];vars=vl.split("|");var str=document.getElementById(inputId).value;str=str.replace(/,/g,"");var dispstr=str;for(var i=0;i<vars.length;i++){if(vars[i].charCodeAt(0)>96){if(arraysearch(vars[i].toUpperCase(),vars)==-1){vars[i]=vars[i].toLowerCase();str=str.replace(new RegExp(vars[i],"gi"),vars[i])}}else{if(arraysearch(vars[i].toLowerCase(),vars)==-1){vars[i]=vars[i].toLowerCase();str=str.replace(new RegExp(vars[i],"gi"),vars[i])}}}vl=vars.join("|");var varstoquote=new Array();for(var i=0;i<vars.length;i++){if(vars[i].length>1){var isgreek=false;for(var j=0;j<greekletters.length;j++){if(vars[i]==greekletters[j]){isgreek=true;break}}if(!isgreek){varstoquote.push(vars[i])}}}if(varstoquote.length>0){vltq=varstoquote.join("|");var reg=new RegExp("("+vltq+")","g");dispstr=str.replace(reg,'"$1"')}var outnode=document.getElementById(outputId);var n=outnode.childNodes.length;for(var i=0;i<n;i++){outnode.removeChild(outnode.firstChild)}outnode.appendChild(document.createTextNode("`"+dispstr+"`"));if(!noMathRender){AMprocessNode(outnode)}ptlist=pts[qn].split(",");var tstpt=0;res=NaN;if(iseqn[qn]==1){str=str.replace(/(.*)=(.*)/,"$1-($2)")}if(fl!=""){reg=new RegExp("("+fl+")\\(","g");str=str.replace(reg,"$1*sin($1+");vl=vl+"|"+fl}vars=vl.split("|");var totesteqn=mathjs(str,vl);while(tstpt<ptlist.length&&(isNaN(res)||res=="Infinity")){var totest="";testvals=ptlist[tstpt].split("~");for(var j=0;j<vars.length;j++){totest+=vars[j]+"="+testvals[j]+";"}totest+=totesteqn;var err="syntax ok";try{with(Math){var res=eval(totest)}}catch(e){err="syntax error"}tstpt++}if(isNaN(res)||res=="Infinity"){trg=str.match(/(sin|cos|tan|sec|csc|cot)\^/);reg=new RegExp("(sqrt|ln|log|sinh|cosh|tanh|sech|csch|coth|sin|cos|tan|sec|csc|cot|abs)("+vl+"|\\d)");errstuff=str.match(reg);if(trg!=null){trg=trg[1];err="syntax error: use ("+trg+"(x))^2 instead of "+trg+"^2(x)"}else{if(errstuff!=null){err+=": use "+errstuff[1]+"("+errstuff[2]+"), not "+errstuff[0]}else{var Pdepth=0;var Bdepth=0;for(var i=0;i<str.length;i++){if(str.charAt(i)=="("){Pdepth++}else{if(str.charAt(i)==")"){Pdepth--}else{if(str.charAt(i)=="["){Bdepth++}else{if(str.charAt(i)=="]"){Bdepth--}}}}}if(Pdepth!=0||Bdepth!=0){err+=": unmatched parens"}else{reg=new RegExp("(sqrt|ln|log|sin|cos|tan|sec|csc|cot|abs)([^(])");errstuff=str.match(reg);if(errstuff!=null&&errstuff[2]!="h"){err="syntax error: use function notation - "+errstuff[1]+"(x)"}else{err="syntax error"}}}}}else{reg=new RegExp("(sqrt|ln|log|sinh|cosh|tanh|sech|csch|tanh|sin|cos|tan|sec|csc|cot|abs)\\s*("+vl+")");errstuff=str.match(reg);if(errstuff!=null){err+=": warning: use "+errstuff[1]+"("+errstuff[2]+") rather than "+errstuff[0]}}outnode.appendChild(document.createTextNode(" "+err));var toclear="";for(var j=0;j<vl.length;j++){toclear+=vars[j]+"=NaN;"}eval(toclear)}function AMmathpreview(b,a){var d=document.getElementById(b).value;var f=document.getElementById(a);var e=f.childNodes.length;for(var c=0;c<e;c++){f.removeChild(f.firstChild)}f.appendChild(document.createTextNode("`"+d+"`"));if(!noMathRender){AMprocessNode(f)}}var greekletters=["alpha","beta","delta","epsilon","gamma","phi","psi","sigma","rho","theta"];var calctoproc={};var intcalctoproc={};var calcformat={};var functoproc={};var matcalctoproc={};var ntupletoproc={};var complextoproc={};var matsize={};var vlist={};var flist={};var pts={};var iseqn={};function doonsubmit(form,type2,skipconfirm){if(form!=null){if(form.className=="submitted"){alert("You have already submitted this page.  Please be patient while your submission is processed.");form.className="submitted2";return false}else{if(form.className=="submitted2"){return false}else{form.className="submitted"}}if(!skipconfirm){if(type2){var reallysubmit=confirmSubmit2(form)}else{var reallysubmit=confirmSubmit(form)}if(!reallysubmit){return false}}}for(var qn in intcalctoproc){qn=parseInt(qn);fullstr=document.getElementById("tc"+qn).value;fullstr=fullstr.replace(/\s+/g,"");if(fullstr.match(/DNE/i)){fullstr=fullstr.toUpperCase()}else{if(calcformat[qn].indexOf("inequality")!=-1){fullstr=ineqtointerval(fullstr)}strarr=fullstr.split(/U/);for(k=0;k<strarr.length;k++){str=strarr[k];if(str.length>0&&str.match(/,/)){sm=str.charAt(0);em=str.charAt(str.length-1);vals=str.substring(1,str.length-1);vals=vals.split(/,/);for(j=0;j<2;j++){if(!vals[j].match(/oo$/)&&!vals[j].match(/oo\W/)){var err="";try{with(Math){var res=eval(mathjs(vals[j]))}}catch(e){err="syntax incomplete"}if(!isNaN(res)&&res!="Infinity"){vals[j]=(Math.abs(res)<1e-15?0:res)+err}}}strarr[k]=sm+vals[0]+","+vals[1]+em}}fullstr=strarr.join("U")}document.getElementById("qn"+qn).value=fullstr}for(var qn in calctoproc){qn=parseInt(qn);str=document.getElementById("tc"+qn).value;if(calcformat[qn].indexOf("list")!=-1){strarr=str.split(/,/)}else{var strarr=new Array();strarr[0]=str}for(var sc=0;sc<strarr.length;sc++){str=strarr[sc];str=str.replace(/,/g,"");if(calcformat[qn].indexOf("scinot")!=-1){str=str.replace("x","*")}str=str.replace(/(\d+)\s*_\s*(\d+\s*\/\s*\d+)/,"($1+$2)");if(calcformat[qn].indexOf("mixednumber")!=-1||calcformat[qn].indexOf("allowmixed")!=-1){str=str.replace(/(\d+)\s+(\d+\s*\/\s*\d+)/,"($1+$2)")}if(str.match(/^\s*$/)){var res=""}else{if(str.match(/oo$/)||str.match(/oo\W/)){var res=str}else{if(str.match(/DNE/i)){var res=str.toUpperCase()}else{try{with(Math){var res=eval(mathjs(str))}}catch(e){err="syntax incomplete"}}}}strarr[sc]=res}document.getElementById("qn"+qn).value=strarr.join(",")}for(var qn in matcalctoproc){qn=parseInt(qn);if(matsize[qn]!=null){msize=matsize[qn].split(",");str=matrixcalc("qn"+qn,null,msize[0],msize[1])}else{str=matrixcalc("tc"+qn,null)}document.getElementById("qn"+qn).value=str}for(var qn in ntupletoproc){qn=parseInt(qn);str=ntuplecalc("tc"+qn,null);document.getElementById("qn"+qn).value=str}for(var qn in complextoproc){qn=parseInt(qn);str=complexcalc("tc"+qn,null);document.getElementById("qn"+qn).value=str}for(var qn in functoproc){qn=parseInt(qn);str=document.getElementById("tc"+qn).value;str=str.replace(/,/g,"");if(iseqn[qn]==1){str=str.replace(/(.*)=(.*)/,"$1-($2)")}fl=flist[qn];varlist=vlist[qn];vars=varlist.split("|");for(var j=0;j<vars.length;j++){if(vars[j].charCodeAt(0)>96){if(arraysearch(vars[j].toUpperCase(),vars)==-1){vars[j]=vars[j].toLowerCase();str=str.replace(new RegExp(vars[j],"gi"),vars[j])}}else{if(arraysearch(vars[j].toLowerCase(),vars)==-1){vars[j]=vars[j].toLowerCase();str=str.replace(new RegExp(vars[j],"gi"),vars[j])}}}varlist=vars.join("|");if(fl!=""){reg=new RegExp("("+fl+")\\(","g");str=str.replace(reg,"$1*sin($1+");varlist=varlist+"|"+fl}vars=varlist.split("|");var nh=document.getElementById("qn"+qn);nh.value=mathjs(str,varlist);ptlist=pts[qn].split(",");vals=new Array();for(var fj=0;fj<ptlist.length;fj++){inputs=ptlist[fj].split("~");totest="";for(var fk=0;fk<inputs.length;fk++){totest+=vars[fk]+"="+inputs[fk]+";"}if(nh.value==""){totest+=Math.random()+";"}else{totest+=nh.value+";"}try{with(Math){vals[fj]=eval(totest)}}catch(e){vals[fj]=NaN}}document.getElementById("qn"+qn+"-vals").value=vals.join(",")}return true}function arraysearch(c,b){for(var a=0;a<b.length;a++){if(b[a]==c){return a}}return -1}function toggleinlinebtn(e,d){var c=document.getElementById(e);c.style.display=="none"?c.style.display="":c.style.display="none";if(d!=null){var b=document.getElementById(d);var a=b.innerHTML;b.innerHTML=a.match(/\+/)?a.replace(/\+/,"-"):a.replace(/\-/,"+")}}function assessbackgsubmit(e,a){if(a!=null&&document.getElementById(a).innerHTML=="Submitting..."){return false}if(window.XMLHttpRequest){req=new XMLHttpRequest()}else{if(window.ActiveXObject){req=new ActiveXObject("Microsoft.XMLHTTP")}}if(req!=undefined){tinyMCE.triggerSave();doonsubmit();params="embedpostback=true";if(e!=null){var d=new Array();var b=document.getElementsByTagName("input");for(var c=0;c<b.length;c++){d.push(b[c])}var b=document.getElementsByTagName("select");for(var c=0;c<b.length;c++){d.push(b[c])}var b=document.getElementsByTagName("textarea");for(var c=0;c<b.length;c++){d.push(b[c])}var f=new RegExp("^(qn|tc)("+e+"\\b|"+(e+1)+"\\d{3})");for(var c=0;c<d.length;c++){if(d[c].name.match(f)){if((d[c].type!="radio"&&d[c].type!="checkbox")||d[c].checked){params+=("&"+d[c].name+"="+encodeURIComponent(d[c].value))}}}params+="&toscore="+e;params+="&verattempts="+document.getElementById("verattempts"+e).value}else{var d=document.getElementsByTagName("input");for(var c=0;c<d.length;c++){if(d[c].name.match(/^(qn|tc)/)){if(d[c].type!="radio"||d[c].type!="checkbox"||d[c].checked){params+=("&"+d[c].name+"="+encodeURIComponent(d[c].value))}}}params+="&verattempts="+document.getElementById("verattempts").value}params+="&asidverify="+document.getElementById("asidverify").value;params+="&disptime="+document.getElementById("disptime").value;params+="&isreview="+document.getElementById("isreview").value;if(a!=null){document.getElementById(a).innerHTML="Submitting..."}req.open("POST",assesspostbackurl,true);req.setRequestHeader("Content-type","application/x-www-form-urlencoded");req.setRequestHeader("Content-length",params.length);req.setRequestHeader("Connection","close");req.onreadystatechange=function(){assessbackgsubmitCallback(e,a)};req.send(params)}else{if(a!=null){document.getElementById(a).innerHTML="Error Submitting."}}}function assessbackgsubmitCallback(qn,noticetgt){if(req.readyState==4){if(req.status==200){if(noticetgt!=null){document.getElementById(noticetgt).innerHTML=""}if(qn!=null){var scripts=new Array();var resptxt=req.responseText;while(resptxt.indexOf("<script")>-1||resptxt.indexOf("<\/script")>-1){var s=resptxt.indexOf("<script");var s_e=resptxt.indexOf(">",s);var e=resptxt.indexOf("<\/script",s);var e_e=resptxt.indexOf(">",e);scripts.push(resptxt.substring(s_e+1,e));resptxt=resptxt.substring(0,s)+resptxt.substring(e_e+1)}document.getElementById("embedqwrapper"+qn).innerHTML=resptxt;if(usingASCIIMath){AMprocessNode(document.getElementById("embedqwrapper"+qn))}if(usingASCIISvg){setTimeout("drawPics()",100)}if(usingTinymceEditor){initeditor("textareas","mceEditor")}for(var i=0;i<scripts.length;i++){try{if(k=scripts[i].match(/canvases\[(\d+)\]/)){if(typeof G_vmlCanvasManager!="undefined"){scripts[i]=scripts[i]+'G_vmlCanvasManager.initElement(document.getElementById("canvas'+k[1]+'"));'}scripts[i]=scripts[i]+"initCanvases("+k[1]+");"}eval(scripts[i])}catch(ex){}}var pagescroll=0;if(typeof window.pageYOffset!="undefined"){pagescroll=window.pageYOffset}else{var B=document.body;var D=document.documentElement;D=(D.clientHeight)?D:B;pagescroll=D.scrollTop}var elpos=findPos(document.getElementById("embedqwrapper"+qn))[1];if(pagescroll>elpos){setTimeout(function(){window.scroll(0,elpos)},150)}}}else{if(noticetgt!=null){document.getElementById(noticetgt).innerHTML="Submission Error:\n"+req.status+"\n"+req.statusText}}}};