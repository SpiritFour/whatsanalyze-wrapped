import m from"./xLM71Y4W.js";import{j as c,E as l,H as r}from"./B3jJ55nG.js";import"./CKKcHSDD.js";import"./Cs1QKzdY.js";const f=(u,t)=>r("pre",null,JSON.stringify({message:"You should use slots with <ContentList>",slot:u,data:t},null,2)),h=c({name:"ContentList",props:{path:{type:String,required:!1,default:void 0},query:{type:Object,required:!1,default:void 0}},render(u){const t=l(),{path:p,query:a}=u,n={...a||{},path:p||(a==null?void 0:a.path)||"/"};return r(m,n,{default:t!=null&&t.default?({data:e,refresh:o,isPartial:d})=>t.default({list:e,refresh:o,isPartial:d,...this.$attrs}):e=>f("default",e.data),empty:e=>t!=null&&t.empty?t.empty(e):f("default",e==null?void 0:e.data),"not-found":e=>{var o;return t!=null&&t["not-found"]?(o=t==null?void 0:t["not-found"])==null?void 0:o.call(t,e):f("not-found",e==null?void 0:e.data)}})}}),L=h;export{L as default};
