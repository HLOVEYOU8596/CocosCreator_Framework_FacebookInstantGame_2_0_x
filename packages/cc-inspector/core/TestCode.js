module.exports={test(){},test2(){},test3(){function t(t){return"object"==typeof t&&(t=t.constructor),cc.js._getClassId(t)}function s(e,i,s){let o;if("object"==typeof i){if(cc.Enum.isEnum(i))return cc.Enum.getList(i);o=i.constructor}else o=i;let c={};if(e[s]=c,o){c.name=cc.js.getClassName(o),c.name.startsWith("cc.")&&(c.name=c.name.slice(3));let s=u(o);s.length>0&&(c.extends=s);let r=o.__props__;if(r){for(let t={},n=0;n<r.length;n++){let s=r[n],o={},c=cc.Class.attr(i,s);c&&l(e,o,c),t[s]=o}n.isAnyChildClassOf(o,cc._BaseNode,cc.Component)&&(t._id={type:cc.String,visible:!1}),c.properties=t}}return c}function c(t,e,n,i){let s=i.__props__;if(s){for(let e={},o=0;o<s.length;o++){let l=s[o],c=n[l];e[l]=p(t,c,i,l,n)}e.value=o}}let r=n._components;if(r){f.__comps__=[];for(let n=0;n<r.length;n++){let i=r[n],o=i.constructor;if(d=t(o)){let t=s(e,i,d),n="function"==typeof i.start||"function"==typeof i.update||"function"==typeof i.lateUpdate||"function"==typeof i.onEnable||"function"==typeof i.onDisable;t.editor={inspector:o.hasOwnProperty("_inspector")&&o._inspector,icon:o.hasOwnProperty("_icon")&&o._icon,help:o._help,_showTick:n};let l={type:d};c(e,l,i,o),l.value._id={type:"string",value:i._id},f.__comps__.push(l),t.properties.__scriptAsset.visible=!!i.__scriptUuid,l.value.__scriptAsset.value={uuid:i.__scriptUuid}}}}function c(t,e,n,i){let s=i.__props__;if(s){for(let e={},o=0;o<s.length;o++){let l=s[o],c=n[l];e[l]=p(t,c,i,l,n)}e.value=o}}function p(t,n,s,o,l){let c,r=d(t,s,o),p=cc.Class.attr(s,o);if(c=Array.isArray(n)?{type:r,value:e.map(n,function(e){return _(t,e,s,o,p)})}:null==n&&Array.isArray(i(p.default))?{type:"Object",value:null}:_(t,n,s,o,p),"function"==typeof p.visible){let t=v(l,p.visible);t!==v.ERRORED&&(c.visible=!!t)}return c}return f}};