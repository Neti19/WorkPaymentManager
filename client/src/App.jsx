import React,{useEffect,useState}from'react';
import{Routes,Route,Navigate,NavLink,useNavigate,useParams,useLocation,Link}from'react-router-dom';
import QRCode from 'qrcode';
import { QrCode } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileDown } from 'lucide-react';
import { Video } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Wallet,
  ChartNoAxesCombined,
  LogOut,
  Plus,
  Search,
  Instagram,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Copy,
  ExternalLink,
  Trash2,
  Edit3,
  ChevronRight,
  Menu,
  X,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import{api,money,date}from'./lib/api.js';
function Auth({onLogin}){const location=useLocation();const[mode,setMode]=useState(location.pathname==='/register'?'register':'login'),[form,setForm]=useState({name:'',email:'',password:''}),[error,setError]=useState(''),[busy,setBusy]=useState(false);const nav=useNavigate();async function submit(e){e.preventDefault();setBusy(true);setError('');try{const d=await api(`/auth/${mode}`,{method:'POST',body:JSON.stringify(form)});localStorage.setItem('wpm_token',d.token);onLogin(d.user);nav('/')}catch(e){setError(e.message)}finally{setBusy(false)}}return <div className="auth-wrap"><div className="auth-card"><div className="brand-mark">W<span>&</span>P</div><p className="eyebrow">WORKSPACE MANAGEMENT</p><h1>{mode==='login'?'Welcome back':'Create your workspace'}</h1><p className="muted">Manage customer work, progress and payments in one place.</p><form onSubmit={submit}>{mode==='register'&&<input placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>}<input type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/><input type="password" placeholder="Password (minimum 8 characters)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength="8"/>{error&&<div className="alert error">{error}</div>}<button className="btn primary full" disabled={busy}>{busy?'Please wait…':mode==='login'?'Sign in':'Create account'}</button></form><p className="switch-auth">{mode==='login'?"New here?":"Already have an account?"} <button onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}}>{mode==='login'?'Create account':'Sign in'}</button></p><small className="muted">Your account and records are stored in your MongoDB database.</small></div></div>}

function Shell({ user, onLogout, children }) {
  const [open, setOpen] = useState(false);

  // Restore previously selected theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wpm_theme') || 'light';
  });

  // Apply theme whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wpm_theme', theme);
  }, [theme]);

  // Toggle between light and dark
  function toggleTheme() {
    setTheme(current =>
      current === 'light' ? 'dark' : 'light'
    );
  }

  return (
    <div className="app-shell">

      <aside className={`sidebar ${open ? 'show' : ''}`}>

        <div className="brand">
          <div className="brand-mark small">
            W<span>&</span>P
          </div>

          <div>
            <b>Work<span>&</span>Pay</b>
            <small>MANAGEMENT SUITE</small>
          </div>

          <button
            className="icon-btn close-nav"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>

        <div className="nav-caption">WORKSPACE</div>

        <nav>
          <NavLink to="/" end onClick={() => setOpen(false)}>
            <LayoutDashboard /> Dashboard
          </NavLink>

          <NavLink to="/customers" onClick={() => setOpen(false)}>
            <Users /> Customers
          </NavLink>

          <NavLink to="/works" onClick={() => setOpen(false)}>
            <BriefcaseBusiness /> Works
          </NavLink>
        </nav>

        <div className="nav-caption">INSIGHTS</div>

        <nav>
          <NavLink to="/payments" onClick={() => setOpen(false)}>
            <Wallet /> Payments
          </NavLink>
          <NavLink to="/reports" onClick={() => setOpen(false)}>
            <FileDown /> Reports
          </NavLink>
        </nav>

        <div className="sidebar-bottom">

          <div className="private-note">
            <span className="secure-dot" />

            <div>
              <b>Private workspace</b>
              <small>Your business records</small>
            </div>
          </div>

          <div className="profile">
            <div className="avatar">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>

            <div className="profile-name">
              <b>{user?.name}</b>
              <small>{user?.email}</small>
            </div>

            <button
              className="icon-btn"
              title="Sign out"
              onClick={onLogout}
            >
              <LogOut size={18} />
            </button>
          </div>

        </div>
      </aside>

      {open && (
        <div
          className="scrim"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="main-area">

        <header className="topbar">

          <button
            className="icon-btn mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          <div>
            <div className="top-title">
              Workspace overview
            </div>

            <div className="top-sub">
              A clear view of your work and finances
            </div>
          </div>

          <div className="topbar-actions">

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <>
                  <Moon size={18} />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun size={18} />
                  <span>Light Mode</span>
                </>
              )}
            </button>

            <div className="top-date">
              <CalendarDays size={17} />
              {date(new Date())}
            </div>

          </div>
        </header>

        <section className="page-content">
          {children}
        </section>

      </main>
    </div>
  );
}

function PageHead({eyebrow,title,desc,action}){return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="muted">{desc}</p></div>{action}</div>}
function Dashboard(){const[s,setS]=useState(null),[works,setWorks]=useState([]),[err,setErr]=useState('');useEffect(()=>{Promise.all([api('/works/summary'),api('/works')]).then(([a,b])=>{setS(a);setWorks(b.slice(0,5))}).catch(e=>setErr(e.message))},[]);if(err)return <div className="alert error">{err}</div>;return <><PageHead eyebrow="OVERVIEW" title="Good work starts with clarity." desc="Here's what's happening across your workspace." action={<Link className="btn primary" to="/works/new"><Plus size={17}/> New work</Link>}/>{!s?<div className="loading">Loading your workspace…</div>:<><div className="stats-grid"><Stat icon={<Users/>} label="Customers" value={s.customers} tone="violet"/><Stat icon={<BriefcaseBusiness/>} label="Total works" value={s.works} tone="blue"/><Stat icon={<CheckCircle2/>} label="Completed" value={s.completed} tone="green"/><Stat icon={<Clock3/>} label="In progress" value={s.active} tone="amber"/></div><div className="finance-grid"><div className="finance-card dark"><div className="finance-label">Total received</div><div className="finance-value">{money(s.received)}</div><div className="finance-foot"><span className="finance-dot"/>Payments recorded across all works</div><div className="finance-orb"/></div><div className="finance-card light"><div className="finance-label">Outstanding balance</div><div className="finance-value">{money(s.outstanding)}</div><div className="finance-foot">From {s.works} work records</div><div className="progress-track"><span style={{width:`${s.totalValue?Math.min(100,s.received/s.totalValue*100):0}%`}}/></div><div className="finance-meta"><span>Received {s.totalValue?Math.round(s.received/s.totalValue*100):0}%</span><span>Total {money(s.totalValue)}</span></div></div></div><div className="section-card"><div className="section-head"><div><h2>Recent works</h2><p className="muted">Your latest customer projects</p></div><Link className="text-link" to="/works">View all <ArrowUpRight size={16}/></Link></div><WorkTable rows={works}/></div></>}</>}
function Stat({icon,label,value,tone}){return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><div className="stat-label">{label}</div><div className="stat-value">{value}</div></div><span className="stat-arrow"><ArrowUpRight size={16}/></span></div>}
function Status({value}){return <span className={`status ${String(value).toLowerCase().replace(' ','-')}`}><i/>{value}</span>}
function WorkTable({rows}){return <div className="table-wrap"><table><thead><tr><th>WORK / CUSTOMER</th><th>STATUS</th><th>PROJECT VALUE</th><th>RECEIVED</th><th>REMAINING</th><th/></tr></thead><tbody>{rows.map(w=><tr key={w._id}><td><Link className="work-title" to={`/works/${w._id}`}>{w.name}</Link><small>{w.customer?.name||'Customer'} · {date(w.startDate)}</small></td><td><Status value={w.status}/></td><td>{money(w.totalAmount)}</td><td className="positive">{money(w.totalReceived)}</td><td className="remaining">{money(w.remainingAmount)}</td><td><Link className="row-arrow" to={`/works/${w._id}`}><ChevronRight size={18}/></Link></td></tr>)}</tbody></table>{!rows.length&&<div className="empty">No works yet. Create your first work to get started.</div>}</div>}
function Customers(){const[rows,setRows]=useState([]),[q,setQ]=useState(''),[show,setShow]=useState(false),[form,setForm]=useState({name:'',instagramProfile:''}),[err,setErr]=useState('');async function load(){setRows(await api('/customers'))}useEffect(()=>{load().catch(e=>setErr(e.message))},[]);async function save(e){e.preventDefault();try{await api('/customers',{method:'POST',body:JSON.stringify(form)});setForm({name:'',instagramProfile:''});setShow(false);load()}catch(e){setErr(e.message)}}async function del(id){if(!confirm('Delete this customer?'))return;try{await api(`/customers/${id}`,{method:'DELETE'});load()}catch(e){setErr(e.message)}}const filtered=rows.filter(c=>c.name.toLowerCase().includes(q.toLowerCase()));return <><PageHead eyebrow="RELATIONSHIPS" title="Customers" desc="Keep customer details and all related work in one place." action={<button className="btn primary" onClick={()=>setShow(!show)}><Plus size={17}/> Add customer</button>}/>{err&&<div className="alert error">{err}</div>}{show&&<form className="form-card inline-form" onSubmit={save}><h3>New customer</h3><div className="form-grid"><label>Customer name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Aarya Shah"/></label><label>Instagram profile URL<input value={form.instagramProfile} onChange={e=>setForm({...form,instagramProfile:e.target.value})} placeholder="https://instagram.com/username"/></label></div><div className="form-actions"><button className="btn primary">Save customer</button><button type="button" className="btn ghost" onClick={()=>setShow(false)}>Cancel</button></div></form>}<div className="section-card"><div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search customers…" value={q} onChange={e=>setQ(e.target.value)}/></div><span className="muted small-text">{filtered.length} customers</span></div><div className="table-wrap"><table><thead><tr><th>CUSTOMER</th><th>INSTAGRAM PROFILE</th><th>WORKS</th><th>ADDED</th><th/></tr></thead><tbody>{filtered.map(c=><tr key={c._id}><td><div className="customer-cell"><span className="customer-avatar">{c.name[0]?.toUpperCase()}</span><b>{c.name}</b></div></td><td>{c.instagramProfile?<a className="insta-link" href={c.instagramProfile} target="_blank" rel="noreferrer"><Instagram size={15}/> View profile <ExternalLink size={13}/></a>:<span className="muted">Not added</span>}</td><td>{c.workCount||0}</td><td>{date(c.createdAt)}</td><td><button className="icon-btn danger-text" onClick={()=>del(c._id)} title="Delete customer"><Trash2 size={17}/></button></td></tr>)}</tbody></table>{!filtered.length&&<div className="empty">No customers match your search.</div>}</div></div></>}
function WorkForm(){const nav=useNavigate(),[customers,setCustomers]=useState([]),[err,setErr]=useState(''),[f,setF]=useState({customer:'',name:'',description:'',startDate:new Date().toISOString().slice(0,10),expectedCompletionDate:'',totalAmount:'',status:'Pending',completed:'',remaining:''});useEffect(()=>{api('/customers').then(c=>{setCustomers(c);if(c[0])setF(x=>({...x,customer:c[0]._id}))}).catch(e=>setErr(e.message))},[]);async function submit(e){e.preventDefault();try{const w=await api('/works',{method:'POST',body:JSON.stringify(f)});nav(`/works/${w._id}`)}catch(e){setErr(e.message)}}return <><PageHead eyebrow="PROJECT SETUP" title="Create a work" desc="Add the project details and agree on the expected value."/><form className="form-card" onSubmit={submit}>{err&&<div className="alert error">{err}</div>}<div className="form-grid"><label>Customer<select required value={f.customer} onChange={e=>setF({...f,customer:e.target.value})}><option value="">Select customer</option>{customers.map(c=><option value={c._id} key={c._id}>{c.name}</option>)}</select></label><label>Work name<input required value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="e.g. Website redesign"/></label><label>Start date<input type="date" value={f.startDate} onChange={e=>setF({...f,startDate:e.target.value})}/></label><label>Expected completion<input type="date" value={f.expectedCompletionDate} onChange={e=>setF({...f,expectedCompletionDate:e.target.value})}/></label><label>Total work amount (₹)<input type="number" min="0.01" step="0.01" required value={f.totalAmount} onChange={e=>setF({...f,totalAmount:e.target.value})} placeholder="0.00"/></label><label>Current status<select value={f.status} onChange={e=>setF({...f,status:e.target.value})}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label><label className="span-2">Work description<textarea rows="3" value={f.description} onChange={e=>setF({...f,description:e.target.value})}/></label><label>Completed work<textarea rows="3" value={f.completed} onChange={e=>setF({...f,completed:e.target.value})}/></label><label>Remaining work<textarea rows="3" value={f.remaining} onChange={e=>setF({...f,remaining:e.target.value})}/></label></div><div className="form-actions"><button className="btn primary">Create work</button><button type="button" className="btn ghost" onClick={()=>nav('/works')}>Cancel</button></div></form></>}
function Works(){const[rows,setRows]=useState([]),[q,setQ]=useState('');useEffect(()=>{api('/works').then(setRows).catch(()=>{})},[]);return <><PageHead eyebrow="PROJECTS" title="Works" desc="Track delivery, payments and balances for every project." action={<Link className="btn primary" to="/works/new"><Plus size={17}/> New work</Link>}/><div className="section-card"><div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search work or customer…" value={q} onChange={e=>setQ(e.target.value)}/></div><span className="muted small-text">{rows.length} total</span></div><WorkTable rows={rows.filter(w=>(w.name+' '+(w.customer?.name||'')).toLowerCase().includes(q.toLowerCase()))}/></div></>}
function WorkDetails(){const{id}=useParams(),[w,setW]=useState(null),[customers,setCustomers]=useState([]),[err,setErr]=useState(''),[share,setShare]=useState(''),[payment,setPayment]=useState({type:'Advance',date:new Date().toISOString().slice(0,10),amount:'',description:''}),[progress,setProgress]=useState({completed:'',remaining:'',status:'Pending'});async function load(){const x=await api(`/works/${id}`);setW(x);setProgress({completed:x.completed||'',remaining:x.remaining||'',status:x.status})}useEffect(()=>{load().catch(e=>setErr(e.message));api('/customers').then(setCustomers)},[id]);if(!w)return <div className="alert error">{err||'Loading work…'}</div>;async function addPayment(e){e.preventDefault();try{await api(`/works/${id}/payments`,{method:'POST',body:JSON.stringify(payment)});setPayment({...payment,amount:'',description:''});load()}catch(e){setErr(e.message)}}async function updateProgress(e)
  {e.preventDefault();try{await api(`/works/${id}/progress`,{method:'POST',body:JSON.stringify(progress)});load()}catch(e){setErr(e.message)}}
async function saveVideoLink(e) {
  e.preventDefault();

  try {
    const result = await api(`/works/${id}/video`, {
      method: 'PATCH',
      body: JSON.stringify({
        videoUrl: w.videoUrl || ''
      })
    });

    setW(current => ({
      ...current,
      videoUrl: result.videoUrl
    }));

    alert('Project video link saved successfully!');
  } catch (error) {
    setErr(error.message);
  }
}
async function shareLink(){try{const d=await api(`/works/${id}/share`,{method:'POST'});setShare(d.shareUrl);await navigator.clipboard.writeText(d.shareUrl)}catch(e){setErr(e.message)}}async function disable(){await api(`/works/${id}/share/disable`,{method:'POST'});setShare('');load()}return <><PageHead eyebrow="WORK DETAILS" title={w.name} desc={`${w.customer?.name||'Customer'} · Started ${date(w.startDate)}`} action={<Link className="btn ghost" to="/works">← All works</Link>}/>{err&&<div className="alert error">{err}</div>}<div className="detail-stats"><div><small>PROJECT VALUE</small><b>{money(w.totalAmount)}</b></div><div><small>TOTAL RECEIVED</small><b className="positive">{money(w.totalReceived)}</b></div><div><small>REMAINING</small><b className="remaining">{money(w.remainingAmount)}</b></div><div><small>STATUS</small><Status value={w.status}/></div></div><div className="two-col"><div className="section-card"><div className="section-head"><div><h2>Record a payment</h2><p className="muted">Add an advance or additional payment</p></div><Wallet/></div><form className="stack-form" onSubmit={addPayment}><label>Payment type<select value={payment.type} onChange={e=>setPayment({...payment,type:e.target.value})}><option>Advance</option><option>Additional</option></select></label><label>Payment date<input type="date" value={payment.date} onChange={e=>setPayment({...payment,date:e.target.value})}/></label><label>Amount (₹)<input type="number" required min="0.01" step="0.01" value={payment.amount} onChange={e=>setPayment({...payment,amount:e.target.value})}/></label><label>Description<textarea rows="2" value={payment.description} onChange={e=>setPayment({...payment,description:e.target.value})} placeholder="Optional note"/></label><button className="btn primary">Save payment</button></form><div className="subsection"><h3>Payment history</h3>{w.payments?.length?w.payments.slice().reverse().map(p=><div className="payment-row" key={p._id}><div><b>{p.type}</b><small>{date(p.date)} {p.description&&`· ${p.description}`}</small></div><strong>{money(p.amount)}</strong><button className="icon-btn danger-text" onClick={async()=>{if(confirm('Delete this payment?')){await api(`/works/${id}/payments/${p._id}`,{method:'DELETE'});load()}}}><Trash2 size={15}/></button></div>):<div className="empty compact">No payments recorded.</div>}</div></div><div className="section-card"><div className="section-head"><div><h2>Work progress</h2><p className="muted">Keep the customer status up to date</p></div><ChartNoAxesCombined/></div><form className="stack-form" onSubmit={updateProgress}><label>Status<select value={progress.status} onChange={e=>setProgress({...progress,status:e.target.value})}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label><label>Completed work<textarea rows="4" value={progress.completed} onChange={e=>setProgress({...progress,completed:e.target.value})}/></label><label>Remaining work<textarea rows="4" value={progress.remaining} onChange={e=>setProgress({...progress,remaining:e.target.value})}/></label><button className="btn primary">Update progress</button></form>
<div className="subsection">
  <h3>Project video for customer</h3>

  <p className="muted small-text">
    Paste the Google Drive video link. Your customer can watch it
    from their existing status page.
  </p>

  <form className="stack-form" onSubmit={saveVideoLink}>
    <label>
      Google Drive video link

      <input
        type="url"
        placeholder="https://drive.google.com/file/d/..."
        value={w.videoUrl || ''}
        onChange={e =>
          setW(current => ({
            ...current,
            videoUrl: e.target.value
          }))
        }
      />
    </label>

    <div className="form-actions">
      <button type="submit" className="btn primary">
        <ExternalLink size={16} />
        Save Video Link
      </button>

      {w.videoUrl && (
        <button
          type="button"
          className="btn ghost"
          onClick={() => {
            setW(current => ({ ...current, videoUrl: '' }));
          }}
        >
          Clear
        </button>
      )}
    </div>
  </form>

  {w.videoUrl && (
    <p className="muted small-text">
      A video link is currently saved in this form.
      Click Save Video Link to update it.
    </p>
  )}
</div>
<div className="subsection"><h3>Customer status link</h3><p className="muted small-text">Anyone with this unique link can view this work's status and payment summary.</p>{share||w.shareEnabled?<><div className="share-url">{share||`${window.location.origin}/status/${w.shareToken}`}</div><div className="form-actions"><button className="btn soft" onClick={()=>{navigator.clipboard.writeText(share||`${window.location.origin}/status/${w.shareToken}`)}}><Copy size={15}/> Copy link</button><button className="btn ghost" onClick={disable}>Disable link</button></div></>:<button className="btn soft" onClick={shareLink}><ExternalLink size={16}/> Generate share link</button>}</div></div></div><div className="section-card history-card"><h2>Progress history</h2>{w.updates?.length?w.updates.slice().reverse().map(u=><div className="history-row" key={u._id}><div className="history-dot"/><div><div className="history-top"><b>{date(u.date)}</b><Status value={u.status}/></div><p><b>Completed:</b> {u.completed||'—'}</p><p><b>Remaining:</b> {u.remaining||'—'}</p></div></div>):<p className="muted">No progress updates yet.</p>}</div></>}
function Payments(){const[rows,setRows]=useState([]);useEffect(()=>{api('/works').then(ws=>setRows(ws.flatMap(w=>(w.payments||[]).map(p=>({...p,workName:w.name,customer:w.customer?.name}))).sort((a,b)=>new Date(b.date)-new Date(a.date))))},[]);return <><PageHead eyebrow="FINANCIALS" title="Payments" desc="A combined view of all advances and additional payments."/><div className="section-card"><div className="table-wrap"><table><thead><tr><th>DATE</th><th>WORK / CUSTOMER</th><th>TYPE</th><th>DESCRIPTION</th><th>AMOUNT</th></tr></thead><tbody>{rows.map(p=><tr key={p._id}><td>{date(p.date)}</td><td><b>{p.workName}</b><small>{p.customer}</small></td><td><span className="type-pill">{p.type}</span></td><td>{p.description||'—'}</td><td className="positive">{money(p.amount)}</td></tr>)}</tbody></table>{!rows.length&&<div className="empty">No payments have been recorded.</div>}</div></div></>}

function Reports() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = new Date();

  const [month, setMonth] = useState(String(today.getMonth()));
  const [year, setYear] = useState(String(today.getFullYear()));

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const selectedMonth = Number(month);
  const selectedYear = Number(year);

  const years = Array.from(
    { length: 6 },
    (_, index) => today.getFullYear() - index
  );

  useEffect(() => {
    api('/works')
      .then(setWorks)
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  // Keep the date in YYYY-MM-DD format
  function getPaymentDate(value) {
    if (!value) return '';

    if (typeof value === 'string') {
      return value.slice(0, 10);
    }

    const dateValue = new Date(value);

    if (Number.isNaN(dateValue.getTime())) return '';

    return dateValue.toISOString().slice(0, 10);
  }

  // Prepare all payment records
  const allPayments = works.flatMap(work =>
    (work.payments || []).map(payment => ({
      ...payment,
      workId: work._id,
      workName: work.name,
      customerName: work.customer?.name || 'Customer',
      workStatus: work.status,
      projectValue: Number(work.totalAmount || 0),
      paymentDate: getPaymentDate(payment.date)
    }))
  ).filter(payment => payment.paymentDate);

  // Monthly payments
  const monthlyPayments = allPayments.filter(payment => {
    const [paymentYear, paymentMonth] =
      payment.paymentDate.split('-').map(Number);

    return (
      paymentYear === selectedYear &&
      paymentMonth === selectedMonth + 1
    );
  });

  const monthlyTotal = monthlyPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  // Group monthly payments by work
  const monthlyWorkSummary = works.map(work => {
    const workPayments = monthlyPayments.filter(
      payment => payment.workId === work._id
    );

    const received = workPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

    return {
      id: work._id,
      name: work.name,
      customer: work.customer?.name || 'Customer',
      status: work.status || 'Pending',
      projectValue: Number(work.totalAmount || 0),
      received,
      paymentCount: workPayments.length
    };
  }).filter(work => work.received > 0);

  // Yearly payments
  const yearlyPayments = allPayments.filter(payment =>
    Number(payment.paymentDate.slice(0, 4)) === selectedYear
  );

  const yearlyTotal = yearlyPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  // Calculate January to December totals
  const yearlyMonthlySummary = months.map((monthName, index) => {
    const monthPayments = yearlyPayments.filter(payment =>
      Number(payment.paymentDate.slice(5, 7)) === index + 1
    );

    const total = monthPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    return {
      month: monthName,
      total
    };
  });

  function pdfMoney(value) {
    return `INR ${Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // Generate Monthly PDF
  function downloadMonthlyPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('WORK & PAY', 14, 20);

    doc.setFontSize(15);
    doc.text('Monthly Work & Payment Report', 14, 32);

    doc.setFontSize(10);
    doc.text(
      `Period: ${months[selectedMonth]} ${selectedYear}`,
      14,
      42
    );

    doc.text(
      `Generated: ${new Date().toLocaleDateString('en-IN')}`,
      14,
      49
    );

    autoTable(doc, {
      startY: 58,
      head: [['Monthly Summary', 'Amount']],
      body: [
        ['Total received this month', pdfMoney(monthlyTotal)],
        ['Works with payments', String(monthlyWorkSummary.length)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [42, 48, 90] }
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [[
        'Work Name',
        'Customer',
        'Status',
        'Project Amount',
        'Received This Month'
      ]],
      body: monthlyWorkSummary.map(work => [
        work.name,
        work.customer,
        work.status,
        pdfMoney(work.projectValue),
        pdfMoney(work.received)
      ]),
      foot: [[
        'TOTAL',
        '',
        '',
        '',
        pdfMoney(monthlyTotal)
      ]],
      theme: 'striped',
      headStyles: { fillColor: [42, 48, 90] },
      footStyles: { fillColor: [42, 48, 90] },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });

    if (monthlyWorkSummary.length === 0) {
      doc.setFontSize(11);
      doc.text(
        'No work payments were recorded during this month.',
        14,
        doc.lastAutoTable.finalY + 12
      );
    }

    doc.save(
      `Monthly_Report_${months[selectedMonth]}_${selectedYear}.pdf`
    );
  }

  // Generate Yearly PDF - monthly totals only
  function downloadYearlyPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('WORK & PAY', 14, 20);

    doc.setFontSize(15);
    doc.text('Yearly Payment Report', 14, 32);

    doc.setFontSize(10);
    doc.text(`Year: ${selectedYear}`, 14, 42);

    doc.text(
      `Generated: ${new Date().toLocaleDateString('en-IN')}`,
      14,
      49
    );

    autoTable(doc, {
      startY: 60,
      head: [['Month', 'Total Payment Received']],
      body: yearlyMonthlySummary.map(item => [
        item.month,
        pdfMoney(item.total)
      ]),
      foot: [[
        'YEARLY TOTAL',
        pdfMoney(yearlyTotal)
      ]],
      theme: 'striped',
      headStyles: { fillColor: [42, 48, 90] },
      footStyles: {
        fillColor: [42, 48, 90],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        1: { halign: 'right' }
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(`Yearly_Report_${selectedYear}.pdf`);
  }

  if (loading) {
    return <div className="loading">Loading report data...</div>;
  }

  return (
    <div className="reports-page">
      <PageHead
        eyebrow="BUSINESS INSIGHTS"
        title="Reports"
        desc="View your work earnings and download monthly or yearly PDF reports."
      />

      {error && <div className="alert error">{error}</div>}

      {/* Report filters */}
      <div className="section-card reports-filter-card">
        <div className="reports-section-heading">
          <div>
            <h2>Report period</h2>
            <p className="muted">Choose the month and year for your reports.</p>
          </div>
          <CalendarDays size={22} />
        </div>

        <div className="reports-filter-grid">
          <label>
            Select month
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
            >
              {months.map((name, index) => (
                <option value={index} key={name}>{name}</option>
              ))}
            </select>
          </label>

          <label>
            Select year
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
            >
              {years.map(item => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Summary cards */}
      <div className="reports-summary-grid">
        <div className="reports-summary-card reports-summary-primary">
          <div className="reports-summary-label">
            {months[selectedMonth]} {selectedYear}
          </div>
          <div className="reports-summary-value">
            {money(monthlyTotal)}
          </div>
          <div className="reports-summary-foot">
            {monthlyWorkSummary.length} works with payments
          </div>
        </div>

        <div className="reports-summary-card">
          <div className="reports-summary-label">
            Total received in {selectedYear}
          </div>
          <div className="reports-summary-value">
            {money(yearlyTotal)}
          </div>
          <div className="reports-summary-foot">
            {yearlyPayments.length} payment transactions
          </div>
        </div>
      </div>

      {/* Monthly work summary */}
      <div className="section-card reports-content-card">
        <div className="reports-section-heading">
          <div>
            <h2>Monthly work summary</h2>
            <p className="muted">
              Amount received for each work during {months[selectedMonth]} {selectedYear}.
            </p>
          </div>
          <span className="reports-count">
            {monthlyWorkSummary.length} works
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>WORK / CUSTOMER</th>
                <th>STATUS</th>
                <th>PROJECT AMOUNT</th>
                <th>RECEIVED THIS MONTH</th>
              </tr>
            </thead>

            <tbody>
              {monthlyWorkSummary.map(work => (
                <tr key={work.id}>
                  <td>
                    <b>{work.name}</b>
                    <small>{work.customer}</small>
                  </td>
                  <td><Status value={work.status} /></td>
                  <td>{money(work.projectValue)}</td>
                  <td className="positive">
                    <b>{money(work.received)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {monthlyWorkSummary.length === 0 && (
            <div className="reports-empty">
              <CalendarDays size={28} />
              <b>No payments this month</b>
              <p>No work payments were recorded for this selected period.</p>
            </div>
          )}
        </div>

        <div className="reports-total-row">
          <span>Total received during {months[selectedMonth]}</span>
          <strong>{money(monthlyTotal)}</strong>
        </div>

        <div className="reports-download-area">
          <button
            className="btn primary"
            onClick={downloadMonthlyPDF}
          >
            <FileDown size={17} />
            Download Monthly PDF
          </button>
        </div>
      </div>

      {/* Yearly month-wise summary */}
      <div className="section-card reports-content-card">
        <div className="reports-section-heading">
          <div>
            <h2>Yearly payment summary</h2>
            <p className="muted">
              Total payment received in each month of {selectedYear}.
            </p>
          </div>
          <span className="reports-count">12 months</span>
        </div>

        <div className="reports-month-list">
          {yearlyMonthlySummary.map(item => (
            <div className="reports-month-row" key={item.month}>
              <span>{item.month}</span>
              <strong>{money(item.total)}</strong>
            </div>
          ))}
        </div>

        <div className="reports-total-row yearly-total-row">
          <span>Total received in {selectedYear}</span>
          <strong>{money(yearlyTotal)}</strong>
        </div>

        <div className="reports-download-area">
          <button
            className="btn primary"
            onClick={downloadYearlyPDF}
          >
            <FileDown size={17} />
            Download Yearly PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function PublicStatus() {
  const { token } = useParams();

  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wpm_public_theme') || 'light';
  });

  const upiId = 'patelmayoor151-1@oksbi';

  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Work & Pay')}&cu=INR`;

  const [qrCode, setQrCode] = useState('');

  // Generate UPI QR code
  useEffect(() => {
    QRCode.toDataURL(upiLink, {
      width: 250,
      margin: 2,
      errorCorrectionLevel: 'H',
    })
      .then(setQrCode)
      .catch(console.error);
  }, [upiLink]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('wpm_public_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(current =>
      current === 'light' ? 'dark' : 'light'
    );
  }

  // Copy UPI ID
 async function copyUpiId() {
  try {
    await navigator.clipboard.writeText(upiId);
    alert('UPI ID copied successfully!');
  } catch {
    alert('Unable to copy UPI ID. Please copy it manually.');
  }
}

  // Load customer project status
  useEffect(() => {
    let alive = true;

    const load = () => {
      api(`/public-status/${token}`)
        .then(d => {
          if (alive) {
            setData(d);
            setErr('');
          }
        })
        .catch(e => {
          if (alive) setErr(e.message);
        });
    };

    load();

    const interval = setInterval(load, 20000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [token]);

  return (
    <div className={`public-page public-theme-${theme}`}>

      {/* Header */}
      <div className="public-brand">
        <div className="brand-mark small">
          W<span>&</span>P
        </div>

        <b>Work<span>&</span>Pay</b>

        <button
          className="public-theme-toggle"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <>
              <Moon size={18} />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun size={18} />
              <span>Light Mode</span>
            </>
          )}
        </button>
      </div>

      {err ? (
        <div className="public-card">
          <AlertCircle />
          <h1>Status unavailable</h1>
          <p>{err}</p>
        </div>
      ) : !data ? (
        <div className="public-card">
          Loading work status…
        </div>
      ) : (
        <>
          {/* Project Hero + QR Payment */}
          

{/* Project Hero + Payment Section */}
<div className="public-hero public-hero-layout">

  {/* LEFT: Project information */}
  <div className="public-hero-content">
    <div className="eyebrow">
      CUSTOMER PROJECT UPDATE
    </div>

    <h1>{data.name}</h1>

    <p>Prepared for {data.customerName}</p>

    <Status value={data.status} />
  </div>

  {/* RIGHT: Payment button or payment details */}
  <div className="customer-payment-area">

    {!showPaymentDetails ? (
      <button
        type="button"
        className="customer-payment-open-btn"
        onClick={() => setShowPaymentDetails(true)}
      >
        <span className="customer-open-icon">
          <QrCode size={25} />
        </span>

        <span className="customer-open-text">
          <b>Make a Payment</b>
          <small>View QR code and UPI details</small>
        </span>

        <ArrowUpRight size={21} />
      </button>
    ) : (
      <div className="customer-qr-card">

        <div className="customer-qr-heading">
          <div className="customer-qr-icon">
            <QrCode size={21} />
          </div>

          <div>
            <h3>Payment Details</h3>
            <p>Scan and pay using UPI</p>
          </div>

          <button
            type="button"
            className="customer-payment-close"
            onClick={() => setShowPaymentDetails(false)}
            aria-label="Hide payment details"
          >
            ×
          </button>
        </div>

        <div className="customer-qr-frame">
          {qrCode ? (
            <img src={qrCode} alt="UPI payment QR code" />
          ) : (
            <div className="customer-qr-loading">
              Generating QR...
            </div>
          )}
        </div>

        <div className="customer-upi-details">
          <span>PAYEE NAME</span>
          <b>Work & Pay</b>

          <span>UPI ID</span>
          <b>{upiId}</b>
        </div>

        <div className="customer-qr-actions">
          <button
            type="button"
            className="customer-copy-btn"
            onClick={copyUpiId}
          >
            <Copy size={15} />
            Copy UPI
          </button>

          <a href={upiLink} className="customer-pay-btn">
            Pay Now
            <ArrowUpRight size={16} />
          </a>
        </div>

        <p className="customer-qr-hint">
          Scan using any UPI payment application
        </p>

      </div>
    )}

  </div>
</div>


          {/* Financial Summary */}
          <div className="public-grid">

            <div className="public-card">
              <small>PROJECT VALUE</small>
              <b>{money(data.totalAmount)}</b>
            </div>

            <div className="public-card">
              <small>PAID SO FAR</small>
              <b className="positive">
                {money(data.totalReceived)}
              </b>
            </div>

            <div className="public-card">
              <small>REMAINING</small>
              <b className="remaining">
                {money(data.remainingAmount)}
              </b>
            </div>

          </div>
          {/* Customer Project Video */}
{data.videoUrl && (
  <div className="public-card customer-video-card">

    <div className="customer-video-heading">
      <div>
        <h2>Your Project Video</h2>
        <p>Watch your completed project video.</p>
      </div>

      <Video size={24} />
    </div>

    <a
      href={data.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="customer-video-btn"
    >
      <Video size={18} />
      Watch Project Video
      <ArrowUpRight size={17} />
    </a>

    <p className="muted small-text">
      Your video will open securely in Google Drive.
    </p>

  </div>
)}
          {/* Work Progress */}
          <div className="public-card">

            <h2>Work progress</h2>

            <div className="public-progress">

              <div>
                <b>Completed work</b>
                <p>
                  {data.completed ||
                    'Details will be updated here.'}
                </p>
              </div>

              <div>
                <b>Remaining work</b>
                <p>
                  {data.remaining ||
                    'No remaining work details provided.'}
                </p>
              </div>

            </div>

            <p className="muted small-text">
              Last updated {date(data.updatedAt)}
              {' · '}
              Auto-refreshes every 20 seconds
            </p>

            <div className="refresh-note">
              <RefreshCw size={14} />
              Live status updates enabled
            </div>

          </div>

          {/* Payment History */}
          <div className="public-card">

            <h2>Payment history</h2>

            {(data.payments || []).map((p, i) => (
              <div className="payment-row" key={i}>

                <div>
                  <b>{p.type}</b>

                  <small>
                    {date(p.date)}
                    {p.description && ` · ${p.description}`}
                  </small>
                </div>

                <strong>{money(p.amount)}</strong>

              </div>
            ))}


            {(!data.payments || data.payments.length === 0) && (
              <p className="muted">No payments recorded yet.</p>
            )}
            {data?.videoUrl && (
              <a
                href={data.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Project Video
              </a>
            )}
          </div>
        </>
      )}

    </div>
  );
}
export default function App(){const[user,setUser]=useState(null),[checking,setChecking]=useState(true);const nav=useNavigate();useEffect(()=>{if(!localStorage.getItem('wpm_token')){setChecking(false);return}api('/auth/me').then(d=>setUser(d.user)).catch(()=>localStorage.removeItem('wpm_token')).finally(()=>setChecking(false))},[]);function logout(){localStorage.removeItem('wpm_token');setUser(null);nav('/login')}if(checking)return <div className="loading full-screen">Loading workspace…</div>;return <Routes><Route path="/status/:token" element={<PublicStatus/>}/><Route path="/login" element={user?<Navigate to="/"/>:<Auth onLogin={setUser}/>}/><Route path="/register" element={user?<Navigate to="/"/>:<Auth onLogin={setUser}/>}/><Route path="*" element={user?<Shell user={user} onLogout={logout}><Routes><Route path="/" element={<Dashboard/>}/><Route path="/customers" element={<Customers/>}/><Route path="/works" element={<Works/>}/><Route path="/works/new" element={<WorkForm/>}/><Route path="/works/:id" element={<WorkDetails/>}/>
<Route path="/payments" element={<Payments/>}/><Route path="/reports" element={<Reports/>}/>
<Route path="*" element={<Navigate to="/"/>}/></Routes></Shell>:<Navigate to="/login"/>}/></Routes>}
