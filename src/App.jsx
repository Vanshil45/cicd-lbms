import React, { useMemo, useState } from 'react';
import {
  Search, Plus, BookOpen, Users, ArrowLeftRight, ChartNoAxesCombined,
  LayoutDashboard, LibraryBig, Settings, Bell, ChevronDown, MoreHorizontal,
  Clock3, CheckCircle2, AlertCircle, BookMarked, X, CalendarDays,
  ArrowUpRight, Filter, Menu, RotateCcw
} from 'lucide-react';

const initialBooks = [
  { id: 1, title: 'The Midnight Library', author: 'Matt Haig', category: 'Fiction', isbn: '9780525559474', copies: 8, available: 5, status: 'Available', color: 'lavender', cover: 'ML' },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', category: 'Self-help', isbn: '9780735211292', copies: 12, available: 3, status: 'Available', color: 'peach', cover: 'AH' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', isbn: '9780132350884', copies: 6, available: 0, status: 'Checked out', color: 'blue', cover: 'CC' },
  { id: 4, title: 'Educated', author: 'Tara Westover', category: 'Biography', isbn: '9780399590504', copies: 5, available: 2, status: 'Available', color: 'sage', cover: 'ED' },
  { id: 5, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', isbn: '9780553380163', copies: 4, available: 1, status: 'Available', color: 'navy', cover: 'HT' },
  { id: 6, title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Finance', isbn: '9780857197689', copies: 7, available: 0, status: 'Checked out', color: 'rose', cover: 'PM' },
  { id: 7, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Fiction', isbn: '9780141439518', copies: 9, available: 7, status: 'Available', color: 'cream', cover: 'PP' },
  { id: 8, title: 'Deep Work', author: 'Cal Newport', category: 'Self-help', isbn: '9781455586691', copies: 5, available: 2, status: 'Available', color: 'teal', cover: 'DW' }
];
const initialLoans = [
  { id: 1, name: 'Olivia Rhye', initials: 'OR', book: 'Atomic Habits', date: 'Nov 08, 2026', due: 'Nov 15, 2026', state: 'On time', tone: 'green' },
  { id: 2, name: 'Phoenix Baker', initials: 'PB', book: 'Clean Code', date: 'Nov 02, 2026', due: 'Nov 10, 2026', state: 'Overdue', tone: 'red' },
  { id: 3, name: 'Lana Steiner', initials: 'LS', book: 'The Psychology of Money', date: 'Nov 09, 2026', due: 'Nov 16, 2026', state: 'On time', tone: 'green' },
  { id: 4, name: 'Demi Wilkinson', initials: 'DW', book: 'Educated', date: 'Nov 10, 2026', due: 'Nov 17, 2026', state: 'On time', tone: 'green' }
];
const categories = ['All books', 'Fiction', 'Self-help', 'Technology', 'Biography', 'Science', 'Finance'];

function App() {
  const [books, setBooks] = useState(initialBooks);
  const [loans, setLoans] = useState(initialLoans);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All books');
  const [activeNav, setActiveNav] = useState('Overview');
  const [modal, setModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', category: 'Fiction', isbn: '', copies: 1 });
  const [toast, setToast] = useState('');

  const filteredBooks = useMemo(() => books.filter(book => {
    const matchesQuery = `${book.title} ${book.author} ${book.isbn}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === 'All books' || book.category === category);
  }), [books, query, category]);

  const notify = message => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const addBook = e => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    const copies = Math.max(1, Number(form.copies) || 1);
    setBooks(prev => [{ ...form, id: Date.now(), copies, available: copies, status: 'Available', color: 'lavender', cover: form.title.slice(0, 2).toUpperCase() }, ...prev]);
    setForm({ title: '', author: '', category: 'Fiction', isbn: '', copies: 1 });
    setModal(false);
    notify('Book added to your collection');
  };

  const returnBook = loan => {
    setLoans(prev => prev.filter(item => item.id !== loan.id));
    setBooks(prev => prev.map(book => book.title === loan.book ? { ...book, available: Math.min(book.copies, book.available + 1), status: 'Available' } : book));
    notify(`${loan.book} marked as returned`);
  };

  const issueBook = book => {
    if (!book.available) return notify('No copies are currently available');
    const loan = { id: Date.now(), name: 'New Member', initials: 'NM', book: book.title, date: 'Nov 13, 2026', due: 'Nov 20, 2026', state: 'On time', tone: 'green' };
    setLoans(prev => [loan, ...prev]);
    setBooks(prev => prev.map(item => item.id === book.id ? { ...item, available: item.available - 1, status: item.available - 1 === 0 ? 'Checked out' : 'Available' } : item));
    notify(`Issued “${book.title}” to New Member`);
  };

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Books', icon: LibraryBig },
    { label: 'Members', icon: Users },
    { label: 'Borrow & return', icon: ArrowLeftRight },
    { label: 'Reports', icon: ChartNoAxesCombined }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><BookOpen size={19}/></div><span>pageturn</span><span className="brand-dot">.</span></div>
        <div className="workspace"><div className="workspace-icon">C</div><div><strong>Central Library</strong><small>Workspace</small></div><ChevronDown size={15} className="muted-icon"/></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>{navItems.map(({label, icon: Icon}) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => {setActiveNav(label); setMobileMenu(false);}}><Icon size={18}/><span>{label}</span>{label === 'Borrow & return' && <span className="nav-count">{loans.length}</span>}</button>)}</nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon">✦</div><strong>Need a hand?</strong><p>Explore the quick guide to get the most out of PageTurn.</p><button onClick={() => notify('Quick guide: add books, issue copies, and track returns.')}>View quick guide <ArrowUpRight size={13}/></button></div>
          <button className="nav-item"><Settings size={18}/> <span>Settings</span></button>
          <div className="profile"><div className="avatar admin">JD</div><div><strong>Jordan Davis</strong><small>Library admin</small></div><MoreHorizontal size={18} className="muted-icon"/></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={20}/></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeNav}</strong></div>
          <div className="top-actions"><span className="today"><CalendarDays size={15}/> Friday, November 13, 2026</span><button className="icon-button notification" onClick={() => notify('You’re all caught up!')}><Bell size={18}/><i/></button><div className="avatar admin top-avatar">JD</div></div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div><div className="eyebrow">YOUR LIBRARY AT A GLANCE</div><h1>Good morning, Jordan <span>✦</span></h1><p>Here’s what’s happening at your library today.</p></div>
            <button className="primary-btn" onClick={() => setModal(true)}><Plus size={17}/> Add new book</button>
          </section>

          <section className="stats-grid">
            <Stat icon={<LibraryBig size={18}/>} label="Total books" value={books.reduce((n,b)=>n+b.copies,0).toLocaleString()} detail="Across your collection" trend="+8.2%" tint="purple"/>
            <Stat icon={<BookMarked size={18}/>} label="Books borrowed" value={loans.length + 124} detail="Currently checked out" trend="+4.6%" tint="blue"/>
            <Stat icon={<Users size={18}/>} label="Active members" value="248" detail="12 joined this month" trend="+12.5%" tint="orange"/>
            <Stat icon={<AlertCircle size={18}/>} label="Overdue books" value={loans.filter(l=>l.state==='Overdue').length} detail="Needs your attention" trend="Review" tint="red" alert/>
          </section>

          <section className="content-grid">
            <div className="panel collection-panel">
              <div className="panel-heading"><div><h2>Book collection</h2><p>Manage and keep track of your library inventory.</p></div><button className="text-button" onClick={() => {setCategory('All books');setActiveNav('Books')}}>View all books <ArrowUpRight size={14}/></button></div>
              <div className="collection-tools"><div className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by title, author or ISBN..." /></div><button className="filter-btn" onClick={() => setCategory(category === 'All books' ? 'Fiction' : 'All books')}><Filter size={15}/> Filter <span className="filter-indicator"/></button></div>
              <div className="category-tabs">{categories.map(cat=><button key={cat} className={category===cat?'selected':''} onClick={()=>setCategory(cat)}>{cat}</button>)}</div>
              <div className="table-wrap"><table><thead><tr><th>BOOK TITLE</th><th>CATEGORY</th><th>ISBN</th><th>AVAILABLE</th><th>STATUS</th><th></th></tr></thead><tbody>
                {filteredBooks.map(book=><tr key={book.id}><td><div className="book-cell"><div className={`book-cover ${book.color}`}><span>{book.cover}</span></div><div><strong>{book.title}</strong><small>{book.author}</small></div></div></td><td><span className="category-pill">{book.category}</span></td><td className="isbn">{book.isbn || '—'}</td><td><strong className="availability">{book.available}</strong><span className="of-total"> / {book.copies}</span></td><td><span className={`status ${book.available ? 'available' : 'checked'}`}><i/>{book.available ? 'Available' : 'Checked out'}</span></td><td><button className="row-action" title="Issue book" onClick={()=>issueBook(book)} disabled={!book.available}><ArrowLeftRight size={16}/></button></td></tr>)}
                {filteredBooks.length===0 && <tr><td colSpan="6" className="empty-state">No books found. Try another search or category.</td></tr>}
              </tbody></table></div>
              <div className="table-footer"><span>Showing <strong>{filteredBooks.length}</strong> of <strong>{books.length}</strong> books</span><div><button disabled>Previous</button><button className="page-number">1</button><button disabled>Next</button></div></div>
            </div>

            <div className="right-column">
              <div className="panel activity-panel"><div className="panel-heading compact"><div><h2>Recent activity</h2><p>Latest library transactions</p></div><button className="more-btn" onClick={()=>notify('Showing the latest activity')}><MoreHorizontal size={19}/></button></div>
                <div className="activity-list">
                  <Activity icon={<ArrowLeftRight size={15}/>} color="violet" title="Book issued" detail="Olivia Rhye · Atomic Habits" time="10:42 AM"/>
                  <Activity icon={<RotateCcw size={15}/>} color="green" title="Book returned" detail="Lana Steiner · Educated" time="09:18 AM"/>
                  <Activity icon={<Plus size={15}/>} color="orange" title="New book added" detail="The Midnight Library" time="Yesterday"/>
                  <Activity icon={<Users size={15}/>} color="blue" title="New member registered" detail="Demi Wilkinson" time="Yesterday"/>
                </div><button className="activity-link" onClick={()=>notify('You’re viewing all recent activity')}>View all activity <ArrowUpRight size={14}/></button>
              </div>
              <div className="panel loans-panel"><div className="panel-heading compact"><div><h2>Due soon</h2><p>Keep an eye on upcoming returns.</p></div><span className="due-count">{loans.length} active</span></div>
                <div className="loan-list">{loans.slice(0,3).map(loan=><div className="loan-row" key={loan.id}><div className="avatar member">{loan.initials}</div><div className="loan-info"><strong>{loan.name}</strong><small>{loan.book}</small></div><div className="loan-due"><strong>{loan.due.split(',')[0]}</strong><small className={loan.state==='Overdue'?'overdue':''}>{loan.state}</small></div><button className="return-btn" onClick={()=>returnBook(loan)} title="Mark as returned"><RotateCcw size={14}/></button></div>)}</div>
                <button className="activity-link" onClick={()=>setActiveNav('Borrow & return')}>Manage transactions <ArrowUpRight size={14}/></button>
              </div>
            </div>
          </section>
          <footer><span>© 2026 PageTurn Library Management</span><span>Made for curious minds <span className="heart">♥</span></span></footer>
        </div>
      </main>

      {modal && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}><div className="modal"><div className="modal-head"><div><div className="modal-icon"><BookOpen size={19}/></div><h2>Add a new book</h2><p>Add a title to your library collection.</p></div><button className="close-btn" onClick={()=>setModal(false)}><X size={19}/></button></div><form onSubmit={addBook}><label>Book title<input required autoFocus value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. The Great Gatsby"/></label><label>Author<input required value={form.author} onChange={e=>setForm({...form,author:e.target.value})} placeholder="Author name"/></label><div className="form-row"><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><label>Number of copies<input type="number" min="1" value={form.copies} onChange={e=>setForm({...form,copies:e.target.value})}/></label></div><label>ISBN <span className="optional">(optional)</span><input value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})} placeholder="978..."/></label><div className="modal-actions"><button type="button" className="cancel-btn" onClick={()=>setModal(false)}>Cancel</button><button className="primary-btn" type="submit"><Plus size={16}/> Add book</button></div></form></div></div>}
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}

function Stat({icon,label,value,detail,trend,tint,alert}) {
  return <div className="stat-card"><div className="stat-top"><div className={`stat-icon ${tint}`}>{icon}</div><span className={`trend ${alert?'alert-trend':''}`}>{alert?<AlertCircle size={12}/>:<ArrowUpRight size={12}/>} {trend}</span></div><div className="stat-value">{value}</div><div className="stat-label">{label}</div><div className="stat-detail">{detail}</div></div>;
}
function Activity({icon,color,title,detail,time}) {
  return <div className="activity-item"><div className={`activity-icon ${color}`}>{icon}</div><div className="activity-copy"><strong>{title}</strong><small>{detail}</small></div><span className="activity-time">{time}</span></div>;
}

export default App;
