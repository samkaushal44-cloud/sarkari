const API = "https://sarkari-jobs-api-scby.onrender.com";

let current = [];

// ---------- LOADERS ----------
async function loadLatest(){
  setStatus("Loading latest jobs...");
  await fetchData("/api/latest");
}
async function loadAdmit(){
  setStatus("Loading admit cards...");
  await fetchData("/api/admit");
}
async function loadResult(){
  setStatus("Loading results...");
  await fetchData("/api/result");
}

// ---------- FETCH ----------
async function fetchData(path){
  try{
    const res = await fetch(API + path, { cache: "no-store" });
    if(!res.ok) throw new Error("API not reachable");

    const data = await res.json();
    if(!Array.isArray(data) || data.length === 0){
      setStatus("No data available right now.");
      render([]);
      return;
    }

    current = data;
    render(current);
    setStatus("");
    showList();
  }catch(err){
    console.error(err);
    setStatus("Server problem. Please try again later.");
  }
}

// ---------- RENDER LIST ----------
function render(arr){
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  arr.forEach((i, idx)=>{
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="javascript:void(0)" onclick="openPreview(${idx})">
        ${i.title}
      </a>
      <div class="muted">${i.date || ""}</div>
    `;
    ul.appendChild(li);
  });
}

// ---------- SEARCH ----------
function filterList(){
  const q = document.getElementById("search").value.toLowerCase();
  render(current.filter(i => i.title.toLowerCase().includes(q)));
}

// ---------- STATUS ----------
function setStatus(msg){
  document.getElementById("status").innerText = msg;
}

// ---------- PREVIEW PAGE ----------
function openPreview(index){
  const item = current[index];
  if(!item) return;

  document.getElementById("pTitle").innerText = item.title;
  document.getElementById("pDate").innerText = item.date || "";
  document.getElementById("pApply").href = item.link;

  document.getElementById("listPage").classList.add("hidden");
  document.getElementById("previewPage").classList.remove("hidden");
  window.scrollTo(0,0);
}

function goBack(){
  document.getElementById("previewPage").classList.add("hidden");
  document.getElementById("listPage").classList.remove("hidden");
}

// ---------- INIT ----------
function showList(){
  document.getElementById("previewPage").classList.add("hidden");
  document.getElementById("listPage").classList.remove("hidden");
}

// Auto load on start
loadLatest();