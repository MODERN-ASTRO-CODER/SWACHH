
const demoProducts=[
{id:1,name:"Seasonal vegetable basket",shop:"Fresh Basket · demo",price:149,category:"grocery",emoji:"🥬",tag:"Local pick"},
{id:2,name:"Steel water bottle",shop:"Green Corner · demo",price:299,category:"reuse",emoji:"🧴",tag:"Reusable"},
{id:3,name:"Everyday pantry pack",shop:"Neighbourhood Mart · demo",price:199,category:"grocery",emoji:"🌾",tag:"Essentials"},
{id:4,name:"Reusable shopping bag",shop:"Green Corner · demo",price:79,category:"reuse",emoji:"🛍️",tag:"Low waste"},
{id:5,name:"Plant-based cleaning bar",shop:"Fresh Basket · demo",price:89,category:"home",emoji:"🧼",tag:"Home care"},
{id:6,name:"Glass storage jar",shop:"Neighbourhood Mart · demo",price:129,category:"home",emoji:"🫙",tag:"Reuse"},
{id:7,name:"Fresh fruit box",shop:"Fresh Basket · demo",price:169,category:"grocery",emoji:"🍎",tag:"Seasonal"},
{id:8,name:"Cloth produce bags",shop:"Green Corner · demo",price:119,category:"reuse",emoji:"🌿",tag:"Reusable"}
];
const START_POINTS=120, POINTS_PER_KG={paper:200,plastic:300,metal:400}, VOUCHER_COST=1000, VOUCHER_VALUE=10, RETURN_ORDER_CAP_PERCENT=25;
// Migrate earlier prototype data so existing demo vouchers are not silently lost.
try{["swachhCart","swachhPoints","swachhVouchers","swachhAppliedVoucher","swachhReturnRecords","swachhLastReceipt"].forEach(k=>{if(localStorage.getItem(k)===null&&sessionStorage.getItem(k)!==null)localStorage.setItem(k,sessionStorage.getItem(k))})}catch(e){}
let cart=JSON.parse(localStorage.getItem("swachhCart")||"[]");
function money(n){return "₹"+Number(n).toLocaleString("en-IN")}
function readState(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function getPoints(){return Number(localStorage.getItem("swachhPoints")??START_POINTS)}
function setPoints(n){localStorage.setItem("swachhPoints",String(n))}
function getVouchers(){return readState("swachhVouchers",[])}
function setVouchers(v){localStorage.setItem("swachhVouchers",JSON.stringify(v))}
function toast(msg){let t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.classList.add("show");clearTimeout(window._toastTimer);window._toastTimer=setTimeout(()=>t.classList.remove("show"),2800)}
function initNav(){let btn=document.querySelector(".menu-toggle"),links=document.querySelector(".navlinks");if(btn&&links)btn.addEventListener("click",()=>links.classList.toggle("open"));document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"})))}
function productCard(p){return `<article class="product"><div class="product-visual"><span class="product-tag">${p.tag}</span><span class="product-emoji" aria-hidden="true">${p.emoji}</span><span class="visual-caption">A SWACHH local pick</span></div><div class="product-body"><small class="product-shop">${p.shop}</small><h3>${p.name}</h3><div class="product-rating" aria-label="Sample rating">★★★★★ <span>Sample pick</span></div><div class="product-price">${money(p.price)}<small> · demo price</small></div><div class="product-delivery">Neighbourhood shop · sample listing</div><button class="add" onclick="addToCart(${p.id})">Add to basket <span aria-hidden="true">＋</span></button></div></article>`}
function initProducts(){let host=document.getElementById("products");if(!host)return;let filter="all",query="",sort="featured";const search=document.getElementById("productSearch"),sorter=document.getElementById("productSort"),count=document.getElementById("resultsCount");function render(){let items=demoProducts.filter(p=>(filter==="all"||p.category===filter)&&`${p.name} ${p.shop} ${p.category} ${p.tag}`.toLowerCase().includes(query));if(sort==="price-low")items.sort((a,b)=>a.price-b.price);if(sort==="price-high")items.sort((a,b)=>b.price-a.price);if(sort==="name")items.sort((a,b)=>a.name.localeCompare(b.name));host.innerHTML=items.length?items.map(productCard).join(""):'<div class="empty search-empty">No sample products match that search. Try another name or category.</div>';if(count)count.textContent=`Showing ${items.length} of ${demoProducts.length} sample products`}document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));render()}));search?.addEventListener("input",()=>{query=search.value.trim().toLowerCase();render()});document.getElementById("searchProducts")?.addEventListener("click",()=>{query=(search?.value||"").trim().toLowerCase();render();document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"})});sorter?.addEventListener("change",()=>{sort=sorter.value;render()});render()}
function addToCart(id){if(!isSignedIn()){localStorage.setItem("swachhAfterSignIn","marketplace.html");localStorage.setItem("swachhPendingProduct",String(id));location.href="signin.html?next=marketplace.html";return}let p=demoProducts.find(x=>x.id===id),item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});saveCart();updateCartCount();toast("Added to your demo basket")}
function saveCart(){localStorage.setItem("swachhCart",JSON.stringify(cart))}
function updateCartCount(){document.querySelectorAll("#cartCount").forEach(el=>el.textContent=cart.reduce((n,x)=>n+x.qty,0))}
function initCart(){updateCartCount();document.querySelectorAll("[data-open-cart]").forEach(b=>b.addEventListener("click",openCart));let modal=document.getElementById("cartModal");if(modal)modal.addEventListener("click",e=>{if(e.target===modal)closeCart()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()})}
function openCart(){let modal=document.getElementById("cartModal");if(!modal){location.href="marketplace.html";return}modal.classList.add("open");renderCart()}
function closeCart(){document.getElementById("cartModal")?.classList.remove("open")}
function getAppliedVoucher(){return localStorage.getItem("swachhAppliedVoucher")||""}
function setAppliedVoucher(code){if(code)localStorage.setItem("swachhAppliedVoucher",code);else localStorage.removeItem("swachhAppliedVoucher")}
function renderCart(){
 let host=document.getElementById("cartItems");if(!host)return;
 host.innerHTML=cart.length?cart.map(x=>`<div class="cartline"><div><b>${x.emoji} ${x.name}</b><small style="display:block;color:var(--muted);margin-top:5px">${money(x.price)} × ${x.qty}</small></div><div style="display:flex;gap:6px;align-items:center"><button class="add" onclick="changeQty(${x.id},-1)">−</button><button class="add" onclick="changeQty(${x.id},1)">+</button></div></div>`).join(""):'<div class="empty">Your demo basket is empty.</div>';
 const subtotal=cart.reduce((n,x)=>n+x.price*x.qty,0),vouchers=getVouchers(),applied=getAppliedVoucher(),v=vouchers.find(x=>x.code===applied&&!x.used);
 let discount=v?Math.min(subtotal,v.value):0;
 let summary=document.getElementById("cartSummary");
 if(summary)summary.innerHTML=`<div class="voucher-apply"><label for="voucherSelect">Apply an EcoReward voucher</label><div class="voucher-controls"><select id="voucherSelect"><option value="">No voucher</option>${vouchers.filter(x=>!x.used).map(x=>`<option value="${x.code}" ${x.code===applied?"selected":""}>${x.code} · ${money(x.value)} off</option>`).join("")}</select><button class="btn btn-soft" onclick="applyVoucher()">Apply</button></div><small>Earn vouchers by returning eligible materials in the EcoReward demo.</small></div><div class="totals"><div><span>Subtotal</span><b>${money(subtotal)}</b></div><div><span>EcoReward discount</span><b>−${money(discount)}</b></div><div class="grand"><span>Demo total</span><b>${money(Math.max(0,subtotal-discount))}</b></div></div>`;
 let total=document.getElementById("cartTotal");if(total)total.textContent=money(Math.max(0,subtotal-discount));
 updateCartCount();
}
function applyVoucher(){const code=document.getElementById("voucherSelect")?.value||"";const voucher=getVouchers().find(x=>x.code===code&&!x.used);setAppliedVoucher(voucher?code:"");renderCart();toast(voucher?"EcoReward voucher applied":"Voucher removed")}
function changeQty(id,d){let x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(i=>i.id!==id);saveCart();renderCart()}
function checkoutDemo(){if(!isSignedIn()){localStorage.setItem("swachhAfterSignIn","checkout.html");location.href="signin.html?next=checkout.html";return}if(!cart.length){toast("Add a sample product first.");return}location.href="checkout.html"}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function initReturnForm(){
 const form=document.getElementById("returnForm");if(!form)return;
 let records=readState("swachhReturnRecords",[]);
 const orderSelect=document.getElementById("purchaseOrder"),itemSelect=document.getElementById("purchasedItem"),receipt=document.getElementById("purchaseReceipt"),photoInput=document.getElementById("wastePhoto"),photoPreview=document.getElementById("wastePhotoPreview"),estimate=document.getElementById("returnEstimate");
 const orders=readState("swachhOrders",[]);const last=readState("swachhLastReceipt",null);if(!orders.length&&last)orders.push(last);
 if(orderSelect)orderSelect.innerHTML='<option value="">Choose a SWACHH order receipt</option>'+orders.map(o=>`<option value="${escapeHTML(o.id)}">${escapeHTML(o.id)} · ${escapeHTML(o.date||"")} · ${money(o.total??o.subtotal??0)}</option>`).join("");
 function selectedOrder(){return orders.find(o=>o.id===orderSelect?.value)||null}
 function renderOrderProof(){
  const order=selectedOrder();if(!itemSelect||!receipt)return;
  itemSelect.innerHTML='<option value="">Choose a product from this receipt</option>'+(order?.items||[]).map((item,index)=>`<option value="${index}">${escapeHTML(item.name)} × ${Number(item.qty)||1}</option>`).join("");
  if(!order){receipt.innerHTML='<div class="proof-empty">Complete a demo purchase first. Your SWACHH receipt will appear here for return verification.</div>';updateEstimate();return}
  const rows=order.items.map(item=>`<div class="proof-receipt-row"><span>${escapeHTML(item.name)} × ${Number(item.qty)||1}</span><b>${money((Number(item.price)||0)*(Number(item.qty)||1))}</b></div>`).join("");
  receipt.innerHTML=`<div class="proof-receipt-head"><span>SWACHH PURCHASE RECEIPT</span><b>✓ ORDER FOUND</b></div><div class="proof-receipt-meta"><b>${escapeHTML(order.id)}</b><span>${escapeHTML(order.date||"")}</span></div>${rows}<div class="proof-receipt-total"><span>Paid at checkout</span><b>${money(order.total??order.subtotal??0)}</b></div><small class="proof-receipt-foot">Choose the product whose waste you are returning. This order must be from SWACHH.</small>`;
  updateEstimate();
 }
 function render(){
  const pts=getPoints(),sumKg=records.reduce((n,r)=>n+(Number(r.kg)||0),0);
  document.getElementById("dashKg").textContent=sumKg.toFixed(1)+" kg";document.getElementById("dashPoints").textContent=pts;document.getElementById("dashCount").textContent=records.length;
  document.getElementById("impactReturns")&&(document.getElementById("impactReturns").textContent=records.length);
  const host=document.getElementById("activity");if(host)host.innerHTML=records.length?records.slice(0,5).map(r=>`<div class="activity"><div style="font-size:1.3rem">♻️</div><div style="flex:1"><b>${escapeHTML(r.material)}</b><small>${escapeHTML(r.item||"")} · Order ${escapeHTML(r.orderId||"demo")} · ${r.time}${r.photoName?" · Photo: "+escapeHTML(r.photoName):""}</small></div><b>${Number(r.kg).toFixed(1)} kg<small>+${r.earned} pts</small></b></div>`).join(""):'<div class="empty">No demo returns logged yet.</div>';
 }
 function updateEstimate(){
  if(!estimate)return;const order=selectedOrder(),kg=Number(document.getElementById("quantity")?.value)||0;
  if(!order){estimate.textContent="Choose a SWACHH receipt to see your estimated points.";return}
  const cap=Math.floor(Math.max(0,Number(order.total??order.subtotal)||0)*RETURN_ORDER_CAP_PERCENT),used=records.filter(r=>r.orderId===order.id).reduce((n,r)=>n+(Number(r.earned)||0),0),available=Math.max(0,cap-used),material=document.getElementById("material")?.value,rate=POINTS_PER_KG[material]||0,points=Math.min(Math.round(kg*rate),available);
  estimate.textContent=kg>0&&rate?`Estimated: ${points} points (₹${(points/100).toFixed(2)} demo value). Order reward cap: ₹${(cap/100).toFixed(2)}.`:rate?`Earn ${money(rate/100)}/kg, up to ${RETURN_ORDER_CAP_PERCENT}% of this receipt total (${Math.floor(cap)} points max).`:`Choose waste material and weight to see an estimate (maximum ${RETURN_ORDER_CAP_PERCENT}% of the receipt total).`;
 }
 orderSelect?.addEventListener("change",renderOrderProof);document.getElementById("quantity")?.addEventListener("input",updateEstimate);document.getElementById("material")?.addEventListener("change",updateEstimate);
 photoInput?.addEventListener("change",()=>{if(!photoPreview)return;const file=photoInput.files?.[0];if(!file){photoPreview.innerHTML="";return}const url=URL.createObjectURL(file);photoPreview.innerHTML=`<img src="${url}" alt="Preview of returned waste"><span>${escapeHTML(file.name)}</span>`});
 form.addEventListener("submit",e=>{
  e.preventDefault();const order=selectedOrder(),itemIndex=itemSelect?.value===""?NaN:Number(itemSelect?.value),item=order?.items?.[itemIndex],material=document.getElementById("material").value,kg=Number(document.getElementById("quantity").value),note=document.getElementById("reference").value.trim(),photo=photoInput?.files?.[0];
  if(!order||!Number.isInteger(itemIndex)||!item||!material||kg<=0||!photo||!photo.type.startsWith("image/")){toast("Select a SWACHH receipt and purchased item, then add a photo of the waste.");return}
  const cap=Math.floor(Math.max(0,Number(order.total??order.subtotal)||0)*RETURN_ORDER_CAP_PERCENT),used=records.filter(r=>r.orderId===order.id).reduce((n,r)=>n+(Number(r.earned)||0),0),available=Math.max(0,cap-used),rate=POINTS_PER_KG[material]||0,earned=Math.min(Math.round(kg*rate),available);
  if(earned<=0){toast("This receipt has reached its demo reward limit. Link another eligible SWACHH order.");return}
  records.unshift({material,kg,shop:item.shop||"SWACHH demo shop",item:item.name,orderId:order.id,note,photoName:photo.name,earned,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});
  localStorage.setItem("swachhReturnRecords",JSON.stringify(records));setPoints(getPoints()+earned);render();form.reset();if(photoPreview)photoPreview.innerHTML="";orderSelect.value=order.id;renderOrderProof();itemSelect.value=String(itemIndex);updateEstimate();toast(`Demo return logged · ${earned} points (${money(earned/100)} demo value)`)
 });
 const reset=document.getElementById("resetDemo");if(reset)reset.addEventListener("click",()=>{records=[];localStorage.removeItem("swachhReturnRecords");localStorage.removeItem("swachhVouchers");localStorage.removeItem("swachhAppliedVoucher");setPoints(START_POINTS);render();renderOrderProof();toast("Demo returns and vouchers reset")});
 render();renderOrderProof();
}
function initRewards(){
 const points=getPoints(),vouchers=getVouchers(),pointsEl=document.getElementById("rewardPoints"),countEl=document.getElementById("voucherCount"),host=document.getElementById("voucherList"),progress=document.getElementById("pointsProgress"),remaining=document.getElementById("pointsRemaining");
 if(pointsEl)pointsEl.textContent=points;
 if(countEl)countEl.textContent=vouchers.filter(v=>!v.used).length;
 if(progress)progress.style.width=Math.min(100,points%VOUCHER_COST/VOUCHER_COST*100)+"%";
 if(remaining)remaining.textContent=(VOUCHER_COST-(points%VOUCHER_COST))%VOUCHER_COST+" points to next voucher";
 if(host)host.innerHTML=vouchers.length?vouchers.map(v=>`<div class="voucher ${v.used?"used":""}"><div class="voucher-symbol">₹</div><div class="voucher-info"><b>${money(v.value)} off demo voucher</b><small>${v.code} · ${v.used?"Used in demo checkout":"Available to apply in basket"}</small></div><span class="voucher-state">${v.used?"USED":"READY"}</span></div>`).join(""):'<div class="empty">No vouchers yet. Log a demo return on the Pilot Dashboard, then redeem your points here.</div>';
 const redeem=document.getElementById("redeemVoucher");if(redeem){const spend=Math.floor(points/VOUCHER_COST)*VOUCHER_COST,value=spend/VOUCHER_COST*VOUCHER_VALUE;redeem.disabled=spend===0;redeem.textContent=spend?`Redeem ${spend.toLocaleString("en-IN")} points for ${money(value)} voucher`:`Need ${VOUCHER_COST-points} more points for a ₹10 minimum`;redeem.onclick=()=>{let p=getPoints(),pointsToSpend=Math.floor(p/VOUCHER_COST)*VOUCHER_COST;if(!pointsToSpend){toast("Earn more points before redeeming.");return}const voucherValue=pointsToSpend/VOUCHER_COST*VOUCHER_VALUE;p-=pointsToSpend;setPoints(p);let list=getVouchers();let code="SW"+Math.random().toString(36).slice(2,7).toUpperCase();list.unshift({code,value:voucherValue,pointsSpent:pointsToSpend,used:false,created:new Date().toISOString()});setVouchers(list);initRewards();toast(`Created one ${money(voucherValue)} demo voucher`)}}
}
function initCheckout(){
 const host=document.getElementById("checkoutItems"); if(!host)return;
 if(!isSignedIn()){localStorage.setItem("swachhAfterSignIn","checkout.html");location.replace("signin.html?next=checkout.html");return;}
 const subtotal=()=>cart.reduce((n,x)=>n+x.price*x.qty,0);
 function render(){
  const vouchers=getVouchers(),code=getAppliedVoucher(),voucher=vouchers.find(v=>v.code===code&&!v.used);
  const discount=voucher?Math.min(subtotal(),voucher.value):0;
  host.innerHTML=cart.length?cart.map(x=>`<div class="cartline"><div><b>${x.emoji} ${escapeHTML(x.name)}</b><small style="display:block;color:var(--muted);margin-top:5px">${money(x.price)} × ${x.qty}</small></div><b>${money(x.price*x.qty)}</b></div>`).join(""):'<div class="empty">Your basket is empty. Add products in the marketplace first.</div>';
  const select=document.getElementById("checkoutVoucher"); if(select){const old=code;select.innerHTML='<option value="">No voucher</option>'+vouchers.filter(v=>!v.used).map(v=>`<option value="${v.code}" ${v.code===old?'selected':''}>${v.code} · ${money(v.value)} off</option>`).join("");}
  document.getElementById("checkoutSubtotal").textContent=money(subtotal());document.getElementById("checkoutDiscount").textContent="−"+money(discount);document.getElementById("checkoutTotal").textContent=money(Math.max(0,subtotal()-discount));
  const count=document.getElementById("checkoutVoucherCount");if(count)count.textContent=vouchers.filter(v=>!v.used).length;
 }
 document.getElementById("checkoutVoucher")?.addEventListener("change",e=>{setAppliedVoucher(e.target.value);render()});
 document.getElementById("placeDemoOrder")?.addEventListener("click",()=>{
  if(!cart.length){toast("Your basket is empty.");return}
  const sub=subtotal(),code=getAppliedVoucher(),vs=getVouchers(),idx=vs.findIndex(v=>v.code===code&&!v.used),discount=idx>=0?Math.min(sub,vs[idx].value):0;
  if(idx>=0){vs[idx].value=Math.max(0,vs[idx].value-discount);vs[idx].used=vs[idx].value<=0;setVouchers(vs)}
  const order={id:"SW-"+Date.now().toString().slice(-7),date:new Date().toLocaleString(),items:cart.map(x=>({...x})),subtotal:sub,discount,total:Math.max(0,sub-discount)};
  localStorage.setItem("swachhLastReceipt",JSON.stringify(order));const orders=readState("swachhOrders",[]);orders.unshift(order);localStorage.setItem("swachhOrders",JSON.stringify(orders));cart=[];saveCart();setAppliedVoucher("");
  document.getElementById("checkoutResult").innerHTML=`<div class="checkout-success"><b>Demo order created</b><span>No payment was collected. Your SWACHH purchase receipt is below.</span></div><div id="receiptPreview"></div>`;makeOrderReceipt();render();toast("Demo order complete")
 });
 render();
}
function initOrdersPage(){
 const host=document.getElementById("orderHistory");if(!host)return;
 const orders=readState("swachhOrders",[]);const last=readState("swachhLastReceipt",null);if(!orders.length&&last)orders.push(last);
 if(!orders.length){host.innerHTML='<div class="orders-empty"><div>🛍️</div><h2>No demo orders yet</h2><p>Your completed SWACHH demo purchases and receipts will show here.</p><a class="btn btn-primary" href="marketplace.html">Browse the marketplace →</a></div>';return}
 host.innerHTML=orders.map(order=>`<article class="history-card"><div class="history-card-head"><div><span class="history-label">DEMO ORDER</span><h2>${escapeHTML(order.id)}</h2><small>${escapeHTML(order.date||"")}</small></div><span class="history-status">Receipt saved</span></div><div class="history-items">${order.items.map(item=>`<div><span>${escapeHTML(item.emoji||"📦")} ${escapeHTML(item.name)} <small>× ${Number(item.qty)||1}</small></span><b>${money((Number(item.price)||0)*(Number(item.qty)||1))}</b></div>`).join("")}</div><div class="history-total"><span>Demo total</span><b>${money(order.total??order.subtotal??0)}</b></div><div class="history-actions"><button class="btn btn-outline" type="button" data-order-receipt="${escapeHTML(order.id)}">View receipt</button><a class="btn btn-soft" href="pilot.html">Return waste →</a></div></article>`).join("");
 host.addEventListener("click",e=>{const button=e.target.closest("[data-order-receipt]");if(button)makeOrderReceipt(button.dataset.orderReceipt)});
}
function makeOrderReceipt(orderId){
 const orders=readState("swachhOrders",[]),last=readState("swachhLastReceipt",null),available=orders.length?orders:(last?[last]:[]),order=orderId?(available.find(x=>x.id===orderId)||null):(last||available[0]),host=document.getElementById("receiptPreview");if(!order||!host)return;
 const rows=order.items.map(item=>`<div class="receipt-preview-row"><span>${escapeHTML(item.name)} × ${item.qty}</span><b>${money(item.price*item.qty)}</b></div>`).join("");
 host.innerHTML=`<section class="receipt-preview"><div class="receipt-brand">↻ SWACHH <span>· Sample Store</span></div><div class="receipt-heading"><div><small>ORDER CONFIRMATION</small><h3>Purchase receipt</h3></div><span class="receipt-status">DEMO</span></div><div class="receipt-id"><span>Order ${escapeHTML(order.id)}</span><span>${escapeHTML(order.date)}</span></div><div class="receipt-items">${rows}</div><div class="receipt-totals"><div><span>Subtotal</span><b>${money(order.subtotal)}</b></div><div><span>Demo voucher</span><b>−${money(order.discount)}</b></div><div class="receipt-total"><span>Demo total</span><b>${money(order.total)}</b></div></div><p class="receipt-disclaimer">DEMO · NOT A REAL PURCHASE. This order is saved in this browser for the return demo only. No payment or delivery took place.</p><button class="btn btn-outline receipt-print" onclick="printDemoReceipt()">Print / Save PDF</button></section>`;
 host.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function printDemoReceipt(){document.body.classList.add("print-receipt-only");window.print();window.setTimeout(()=>document.body.classList.remove("print-receipt-only"),800)}
function initReceiptScanner(){const input=document.getElementById("receiptFile"),btn=document.getElementById("scanReceipt"),status=document.getElementById("scanStatus"),out=document.getElementById("scanResult");if(!input||!btn)return;
 btn.addEventListener("click",async()=>{const file=input.files?.[0];if(!file){status.textContent="Choose a receipt image first.";return}if(!window.Tesseract){status.textContent="OCR library did not load. Check your internet connection and reload the page.";return}btn.disabled=true;status.textContent="Reading receipt image with OCR… this can take a little while.";out.innerHTML="";try{const result=await Tesseract.recognize(file,"eng",{logger:m=>{if(m.status&&m.progress!=null)status.textContent=`Scanning receipt: ${m.status} ${Math.round(m.progress*100)}%`}});const text=result.data.text||"";const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);const amounts=[...text.matchAll(/(?:₹|Rs\.?\s*)?([0-9]{1,6}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)/gi)].map(m=>Number(m[1].replace(/,/g,""))).filter(n=>n>0);const hasDate=/\b(?:\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}[\/-]\d{1,2}[\/-]\d{1,2})\b/.test(text);const hasTotal=/grand\s*total|total\s*(?:due|amount)?|amount\s*payable|net\s*amount/i.test(text);const hasMerchant=lines.slice(0,6).some(x=>x.length>=3);const flags=[];if(!hasDate)flags.push("A clear date was not detected.");if(!hasTotal)flags.push("A total label was not detected.");if(amounts.length<2)flags.push("Too few readable amounts were detected to cross-check the receipt.");if(text.length<35)flags.push("Very little text was extracted. Try a sharper, well-lit image.");const summary=flags.length?"Needs manual review":"Basic structure detected";status.textContent="OCR scan complete. This is a text/consistency check, not proof that the receipt is genuine.";out.innerHTML=`<div class="scan-badge">${summary}</div><p><b>Detected date:</b> ${hasDate?"Yes":"Not found"} · <b>Total label:</b> ${hasTotal?"Yes":"Not found"} · <b>Numeric amounts:</b> ${amounts.length}</p><p><b>Review notes</b></p><ul>${(flags.length?flags:["Date and total-like text were found. Compare the original receipt and transaction record manually."]).map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul><details><summary>Show OCR text extracted from image</summary><pre class="ocr-text">${escapeHTML(text)}</pre></details>`;}catch(err){status.textContent="Could not scan this image. Try a JPG or PNG with better lighting."}finally{btn.disabled=false}})
}
document.addEventListener("DOMContentLoaded",()=>{initNav();initProducts();initCart();initReturnForm();initRewards();initCheckout();initOrdersPage();initReceiptScanner();initAuth();handlePostLoginProduct();initPageTransitions();updateAccountNav()});


function isSignedIn(){try{const p=JSON.parse(sessionStorage.getItem("swachhDemoProfile")||"null");return !!(p&&p.signedIn&&p.email)}catch{return false}}
function finishSignIn(){const queryNext=new URLSearchParams(location.search).get("next");const next=localStorage.getItem("swachhAfterSignIn")||queryNext||"marketplace.html";localStorage.removeItem("swachhAfterSignIn");const pending=localStorage.getItem("swachhPendingProduct");if(pending&&next.includes("marketplace")){localStorage.removeItem("swachhPendingProduct");location.href="marketplace.html?add="+encodeURIComponent(pending);return}location.href=next}
function handlePostLoginProduct(){const params=new URLSearchParams(location.search),id=Number(params.get("add"));if(id&&isSignedIn()){localStorage.removeItem("swachhPendingProduct");addToCart(id);history.replaceState({},"",location.pathname)}}
function initAuth(){const form=document.getElementById("authForm");if(!form)return;let mode="signin";const title=document.getElementById("authTitle"),subtitle=document.getElementById("authSubtitle"),nameField=document.getElementById("nameField"),confirmField=document.getElementById("confirmField"),nameInput=document.getElementById("fullName"),confirmInput=document.getElementById("confirmPassword"),password=document.getElementById("password"),submit=document.getElementById("authSubmit"),message=document.getElementById("authMessage"),signinTab=document.getElementById("signinTab"),signupTab=document.getElementById("signupTab");function setMode(next){mode=next;const signup=mode==="signup";title.textContent=signup?"Create your account":"Welcome back";subtitle.textContent=signup?"Set up a demo profile to explore SWACHH.":"Sign in to continue to your demo account.";nameField.hidden=!signup;confirmField.hidden=!signup;nameInput.required=signup;confirmInput.required=signup;password.autocomplete=signup?"new-password":"current-password";submit.textContent=signup?"Create demo account →":"Sign in →";submit.type="submit";signinTab.classList.toggle("active",!signup);signupTab.classList.toggle("active",signup);message.textContent="";message.classList.remove("error");}signinTab.addEventListener("click",()=>setMode("signin"));signupTab.addEventListener("click",()=>setMode("signup"));form.addEventListener("submit",e=>{e.preventDefault();message.classList.remove("error");const email=document.getElementById("email").value.trim().toLowerCase(),pw=password.value;if(mode==="signup"){if(pw!==confirmInput.value){message.textContent="Those passwords do not match.";message.classList.add("error");return}const profile={name:nameInput.value.trim(),email,password:pw,createdAt:new Date().toISOString(),demo:true,signedIn:true};sessionStorage.setItem("swachhDemoProfile",JSON.stringify(profile));message.textContent="Demo profile created. You're signed in on this tab.";}else{let profile=null;try{profile=JSON.parse(sessionStorage.getItem("swachhDemoProfile")||"null")}catch{}if(!profile||profile.email!==email||profile.password!==pw){message.textContent="Email or password is incorrect, or no demo profile exists in this browser session. Create an account first.";message.classList.add("error");return}profile.signedIn=true;sessionStorage.setItem("swachhDemoProfile",JSON.stringify(profile));message.textContent="Signed in successfully. Welcome back, "+(profile.name||"friend")+".";}submit.textContent="Continue shopping →";submit.type="button";submit.onclick=finishSignIn;setTimeout(finishSignIn,650);});}


function initPageTransitions(){
 const body=document.body;body.classList.add("page-ready");
 document.querySelectorAll('a[href]').forEach(a=>{
  const href=a.getAttribute('href');
  if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto:')||a.target==='_blank'||a.hasAttribute('download'))return;
  a.addEventListener('click',e=>{if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const url=new URL(a.href,location.href);if(url.origin!==location.origin||url.pathname===location.pathname&&url.search===location.search)return;e.preventDefault();body.classList.add('page-leaving');setTimeout(()=>location.href=a.href,150)});
 });
}
function updateAccountNav(){
 const profile=(()=>{try{return JSON.parse(sessionStorage.getItem('swachhDemoProfile')||'null')}catch{return null}})();
 document.querySelectorAll('.navcta').forEach(host=>{
  const signins=[...host.querySelectorAll('a[href="signin.html"]')];
  if(profile&&profile.signedIn){signins.forEach(a=>{a.textContent='Hi, '+(profile.name||'there').split(' ')[0]+' ↗';a.href='account.html';a.classList.add('account-link')})}
 });
}
function signOutDemo(){try{const p=JSON.parse(sessionStorage.getItem('swachhDemoProfile')||'null');if(p){p.signedIn=false;sessionStorage.setItem('swachhDemoProfile',JSON.stringify(p))}}catch{}location.href='index.html'}


/* Highlight the current destination in the grouped primary navigation. */
document.addEventListener("DOMContentLoaded",()=>{
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const active={"index.html":"home","signin.html":"home","marketplace.html":"shop","pilot.html":"returns","rewards.html":"rewards","ecoreward.html":"rewards","checkout.html":"shop","orders.html":"orders","account.html":"about","about.html":"about"};
  document.querySelectorAll(".navlinks [data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===active[page]));
});

/* Global page transitions and mobile shopping navigation */
document.addEventListener("DOMContentLoaded",()=>{
  const current=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const map={"index.html":"home","signin.html":"account","marketplace.html":"explore","ecoreward.html":"rewards","rewards.html":"rewards","checkout.html":"cart","orders.html":"orders","account.html":"account","about.html":"account","pilot.html":"returns"};
  document.querySelectorAll(".mobile-dock a").forEach(a=>{
    if(a.dataset.dock===map[current])a.classList.add("active");
    a.addEventListener("click",e=>{
      const href=a.getAttribute("href");
      if(!href||href.startsWith("#")||href===current)return;
      e.preventDefault();document.body.classList.add("sw-leaving");
      setTimeout(()=>location.href=href,150);
    });
  });
  const count=document.getElementById("dockCartCount");
  if(count){
    try{const items=JSON.parse(sessionStorage.getItem("swachhCart")||"[]");count.textContent=items.reduce((n,i)=>n+(Number(i.qty)||Number(i.quantity)||1),0)}catch{count.textContent="0"}
  }
  document.querySelectorAll('a[href$=".html"]').forEach(a=>{
    a.addEventListener("click",e=>{
      if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==="_blank")return;
      const url=new URL(a.href,location.href);
      if(url.origin!==location.origin||url.pathname===location.pathname)return;
      e.preventDefault();document.body.classList.add("sw-leaving");setTimeout(()=>location.href=a.href,150);
    });
  });
});


/* V9 route transitions: expanding green reveal, with accessible reduced-motion fallback */
document.addEventListener("DOMContentLoaded",()=>{
  let cover=document.querySelector(".sw-transition-cover");
  if(!cover){cover=document.createElement("div");cover.className="sw-transition-cover";cover.innerHTML='<div><div class="transition-mark">↻</div><span class="transition-label">SWACHH</span></div>';document.body.appendChild(cover);}
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href$=".html"]').forEach(a=>{
    a.addEventListener("click",e=>{
      if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==="_blank")return;
      const url=new URL(a.href,location.href);
      if(url.origin!==location.origin||url.pathname===location.pathname)return;
      e.preventDefault();
      if(reduce){location.href=a.href;return;}
      cover.classList.add("on");
      window.setTimeout(()=>location.href=a.href,310);
    });
  });
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const active={"marketplace.html":"explore","ecoreward.html":"rewards","rewards.html":"rewards","checkout.html":"cart","orders.html":"orders","account.html":"account","about.html":"account","pilot.html":"returns"};
  document.querySelectorAll(".mobile-dock a").forEach(a=>{
    if(a.dataset.dock===active[page])a.classList.add("active");
  });
  const count=document.getElementById("dockCartCount");
  if(count){
    try{
      let items=JSON.parse(sessionStorage.getItem("swachhCart")||"[]");
      if(!Array.isArray(items))items=[];
      count.textContent=items.reduce((n,i)=>n+(Number(i.qty)||Number(i.quantity)||1),0);
    }catch{count.textContent="0";}
  }
});

