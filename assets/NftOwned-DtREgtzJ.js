import{u,a as f,r as d,b as F,j as e,M as q,I as B,h,g as D,S,c as A}from"./index-CVBD42mg.js";import{p as P,f as j,u as G,U as L,O as V}from"./GraphQueries-lzSLY-vS.js";const _=n=>{const{marketplaceAddress:s,narutoAbi:a,narutoAddress:o}=u(),{runContractFunction:l}=f({abi:a,contractAddress:o,functionName:"approve",params:{to:s,tokenId:n}});return{approve:l}},Q=(n,s)=>{const{marketplaceAddress:a,marketplaceAbi:o,narutoAddress:l}=u(),{runContractFunction:i}=f({abi:o,contractAddress:a,functionName:"listNft",params:{nftAddress:l,tokenId:n,price:s?P(`${s}`):""}});return{listNft:i}};function Y({tokenId:n,isVisible:s,onClose:a,handleSuccess:o,defaultPrice:l}){const[i,N]=d.useState(0),{approve:C}=_(n),{listNft:x}=Q(n,i),m=F();async function b(c){await c.wait(1),x({onSuccess:r=>o(r),onError:r=>h(r,m)})}const p=()=>{if((i||0)<=0){h("",m,"Price Should be Greater than 0");return}C({onSuccess:c=>b(c),onError:c=>h(c,m)})};return e.jsxs(q,{isVisible:s,onCancel:a,title:"Sell NFT",onCloseButtonPressed:a,onOk:p,children:[e.jsx("div",{className:"mb-6",children:l&&e.jsx("p",{children:`You bought this ntf in ${j(l||0,"ether")} eth`})}),e.jsx(B,{label:"Price (in ETH)",name:"price",type:"number",onChange:c=>{N(c.target.value)}}),e.jsx("br",{})]})}const H=()=>{const{marketplaceAddress:n,marketplaceAbi:s,account:a}=u(),{runContractFunction:o}=f({abi:s,contractAddress:n,functionName:"getBalance",params:{seller:a}});return{getCollectedAmount:o}},z=()=>{const{narutoAddress:n,narutoAbi:s}=u(),{runContractFunction:a}=f({abi:s,contractAddress:n,functionName:"getMintFee",params:{}});return{getMintFee:a}},J=n=>{const{narutoAddress:s,narutoAbi:a}=u(),{runContractFunction:o}=f({abi:a,contractAddress:s,functionName:"requestNft",params:{},msgValue:n});return{requestNft:o}};function K(){const{marketplaceAddress:n,marketplaceAbi:s}=u(),{runContractFunction:a}=f({abi:s,contractAddress:n,functionName:"withdrawBalance",params:{}});return{withdrawAmount:a}}const tt=()=>{var w;const{account:n}=u(),[s,a]=d.useState(),[o,l]=d.useState(),{data:i,refetch:N}=G(V,{variables:{owner:n}}),[C,x]=d.useState(!1),[m,b]=d.useState(!1),[p,c]=d.useState({}),r=F(),{getCollectedAmount:y}=H(),{getMintFee:k}=z(),{requestNft:M}=J(o),{withdrawAmount:v}=K();d.useEffect(()=>{E(),U()},[n]);const E=async()=>{const t=await y();a(t.toString())},U=async()=>{const t=await k();l(t)},T=t=>{x(!0),c(t)},I=t=>{b(!0),c(t)},g=()=>{c({}),b(!1),x(!1)},R=async t=>{await t.wait(1),r({type:S,message:"NFT sold.",title:A,position:"topR"}),N(),g()},W=async t=>{await t.wait(1),r({type:S,message:"NFT price updated.",title:A,position:"topR"}),N(),g()},O=async t=>{await t.wait(1),r({type:S,message:"Successfully Withdrawed.",title:A,position:"topR"}),a()},$=async t=>{await t.wait(1),r({type:S,message:"NFT Requested Successfully. Please refresh page after some time",title:A,position:"topR"})};return e.jsxs("div",{className:"bg-[#04123C] overflow-auto h-[90vh] pt-4 px-6",children:[e.jsx("div",{children:e.jsxs("div",{className:"flex space-x-7 pb-8 items-end justify-end text-white",children:[e.jsx("button",{onClick:async()=>{o&&await M({onSuccess:t=>$(t),onError:t=>h(t,r)})},className:"text-[#04123C] font-semibold bg-[#F2F6FF] px-8 rounded-2xl py-2",children:"Mint NFT"}),e.jsx("button",{disabled:!s,onClick:()=>v({onError:t=>h(t,r),onSuccess:t=>O(t)}),className:`text-[#04123C] font-semibold  px-8 rounded-2xl py-2 ${s?"bg-gray-300":"bg-[#F2F6FF]"}`,children:`Withdraw ${+s?j(s,"ether")+" MATIC":""}`})]})}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 rounded",children:(w=i==null?void 0:i.nftDescriptions)!=null&&w.length?i.nftDescriptions.map(t=>e.jsxs("div",{className:"h-[300px] w-[250px] mt-3",children:[e.jsx("img",{id:`image-${t.id}`,src:D(t.tokenUrl,`image-${t.id}`),className:"h-full w-full object-cover rounded-md",alt:"No Image"}),e.jsx("br",{}),t.isListed?e.jsx(e.Fragment,{children:e.jsx("button",{className:"text-[#04123C] font-semibold bg-[#808B96] px-8 rounded-2xl py-2",onClick:()=>I(t),children:"Update"})}):e.jsx("button",{className:"text-[#04123C] font-semibold bg-[#808B96] px-8 rounded-2xl py-2",onClick:()=>T(t),children:"Sell"}),e.jsx("br",{})]},t.id)):e.jsx("div",{className:"grid place-items-center",children:e.jsx("b",{className:"text-[#ffff]",children:"No List Found"})})}),e.jsx(Y,{isVisible:C,tokenId:p.tokenId,defaultPrice:p.price,onClose:g,handleSuccess:R}),e.jsx(L,{isVisible:m,tokenId:p.tokenId,defaultPrice:p.price,onClose:g,handleSuccess:W})]})};export{tt as NftOwned};
