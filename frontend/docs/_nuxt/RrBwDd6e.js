const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./YnBMBKeU.js","./B3jJ55nG.js","./entry.B_OhFspp.css","./CKKcHSDD.js","./Cs1QKzdY.js","./Dym_awWQ.js"])))=>i.map(i=>d[i]);
import{D as m,P as c,Q as d,j as v,R as g,S as l,T as h,E as _,H as r,e as y}from"./B3jJ55nG.js";import{q as C,w as f,e as w,s as P,j as $,u as N,a as j}from"./CKKcHSDD.js";import{u as T}from"./Cs1QKzdY.js";const D=async e=>{const{content:t}=m().public;typeof(e==null?void 0:e.params)!="function"&&(e=C(e));const a=e.params(),s=t.experimental.stripQueryParameters?f(`/navigation/${`${c(a)}.${t.integrity}`}/${w(a)}.json`):f(`/navigation/${c(a)}.${t.integrity}.json`);if(P())return(await d(()=>import("./YnBMBKeU.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url).then(o=>o.generateNavigation))(a);const n=await $fetch(s,{method:"GET",responseType:"json",params:t.experimental.stripQueryParameters?void 0:{_params:$(a),previewToken:T().getPreviewToken()}});if(typeof n=="string"&&n.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return n},E=v({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(e){const{query:t}=g(e),a=l(()=>{var n;return typeof((n=t.value)==null?void 0:n.params)=="function"?t.value.params():t.value});if(!a.value&&h("dd-navigation").value){const{navigation:n}=N();return{navigation:n}}const{data:s}=await j(`content-navigation-${c(a.value)}`,()=>D(a.value));return{navigation:s}},render(e){const t=_(),{navigation:a}=e,s=o=>r(y,{to:o._path},()=>o.title),n=(o,u)=>r("ul",u?{"data-level":u}:null,o.map(i=>i.children?r("li",null,[s(i),n(i.children,u+1)]):r("li",null,s(i)))),p=o=>n(o,0);return t!=null&&t.default?t.default({navigation:a,...this.$attrs}):p(a)}}),S=E;export{S as default};
