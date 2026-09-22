import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

type Room = {id:number; title:string; host:string; country:string; viewers:number; category:string; live:boolean};
type User = {id:string; name:string; role:string; banned:boolean; official:boolean};

const initialRooms: Room[] = [
  {id:1,title:'Late Night Vibes',host:'Arhan',country:'India',viewers:128,category:'Hot',live:true},
  {id:2,title:'Music & Chill',host:'Ayaan',country:'Saudi Arabia',viewers:76,category:'Music',live:true},
  {id:3,title:'Friends Corner',host:'Zoya',country:'Kuwait',viewers:54,category:'Chat',live:true},
  {id:4,title:'Creative Talk',host:'Riya',country:'India',viewers:31,category:'Creative',live:true},
];

const gifts = [
  {name:'Rose', price:10, icon:'🌹'},
  {name:'Heart', price:50, icon:'❤️'},
  {name:'Star', price:100, icon:'⭐'},
  {name:'Crown', price:500, icon:'👑'},
  {name:'Diamond', price:1000, icon:'💎'},
];

const seedUsers: User[] = [
  {id:'VR10001',name:'Arhan',role:'OWNER',banned:false,official:true},
  {id:'VR10002',name:'Ayaan',role:'USER',banned:false,official:false},
  {id:'VR10003',name:'Zoya',role:'OFFICIAL',banned:false,official:true},
];

function App(){
  const [tab,setTab]=useState('Home');
  const [rooms,setRooms]=useState(initialRooms);
  const [selected,setSelected]=useState<Room|null>(null);
  const [coins,setCoins]=useState(()=>Number(localStorage.getItem('vibeCoins')||'5000'));
  const [users,setUsers]=useState<User[]>(seedUsers);
  const [showAdmin,setShowAdmin]=useState(false);
  const [toast,setToast]=useState('');
  const [filter,setFilter]=useState('All');

  useEffect(()=>localStorage.setItem('vibeCoins',String(coins)),[coins]);
  useEffect(()=>{ if(toast){const t=setTimeout(()=>setToast(''),1800);return()=>clearTimeout(t)}},[toast]);

  const filtered=useMemo(()=>rooms.filter(r=>filter==='All'||r.country===filter||r.category===filter),[rooms,filter]);

  const sendGift=(price:number,name:string)=>{
    if(coins<price){setToast('Not enough VibeCoins');return}
    setCoins(c=>c-price); setToast(`${name} sent 🎁`);
  };

  const createRoom=()=>{
    const id=Date.now();
    setRooms(r=>[{id,title:'My New Room',host:'Arhan',country:'India',viewers:1,category:'Chat',live:true},...r]);
    setToast('Room created');
  };

  const ban=(id:string)=>{
    setUsers(u=>u.map(x=>x.id===id?{...x,banned:true}:x)); setToast('User banned');
  };
  const unban=(id:string)=>{
    setUsers(u=>u.map(x=>x.id===id?{...x,banned:false}:x)); setToast('User unbanned');
  };
  const promote=(id:string)=>{
    setUsers(u=>u.map(x=>x.id===id?{...x,role:'MANAGER'}:x)); setToast('Manager assigned');
  };
  const official=(id:string)=>{
    setUsers(u=>u.map(x=>x.id===id?{...x,official:true,role:x.role==='USER'?'OFFICIAL':x.role}:x)); setToast('Official status updated');
  };

  if(selected) return <RoomView room={selected} coins={coins} onBack={()=>setSelected(null)} sendGift={sendGift} toast={toast}/>;

  return <div className="app">
    <header className="top">
      <div className="brand">Vibe<span>Room</span></div>
      <button className="coin" onClick={()=>setToast('Coins are virtual only')}>🪙 {coins}</button>
      <button className="icon" onClick={()=>setShowAdmin(true)}>☰</button>
    </header>

    <main>
      {tab==='Home' && <>
        <section className="hero">
          <div><p className="eyebrow">LIVE NOW</p><h1>What’s happening right now?</h1><p>Join a room, meet people and share your vibe.</p></div>
          <button onClick={createRoom}>＋ Start a room</button>
        </section>
        <div className="tabs">{['Popular','Following','Recent'].map((x,i)=><button className={i===0?'active':''} key={x}>{x}</button>)}</div>
        <div className="chips">{['All','India','Saudi Arabia','Kuwait','Music','Chat','Creative'].map(x=><button className={filter===x?'chip activeChip':'chip'} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
        <h2>Live rooms</h2>
        <div className="grid">{filtered.map(r=><RoomCard key={r.id} room={r} onClick={()=>setSelected(r)}/>)}</div>
      </>}

      {tab==='Explore' && <section className="panel"><h1>Explore</h1><p>Find rooms by country and category.</p><div className="grid">{rooms.map(r=><RoomCard key={r.id} room={r} onClick={()=>setSelected(r)}/>)}</div></section>}
      {tab==='Message' && <section className="panel"><h1>Messages</h1><div className="message">💬 No messages yet. Your conversations will appear here.</div></section>}
      {tab==='Me' && <section className="panel profile"><div className="avatar">A</div><h1>Arhan</h1><p>ID: VR10001</p><div className="stats"><b>5,000</b><span>VibeCoins</span><b>0</b><span>Followers</span></div><button onClick={()=>setShowAdmin(true)}>⚙ Management Center</button></section>}
    </main>

    <nav className="bottom">{['Home','Explore','Message','Me'].map(x=><button className={tab===x?'navActive':''} onClick={()=>setTab(x)} key={x}><span>{x==='Home'?'⌂':x==='Explore'?'◉':x==='Message'?'✉':'◉'}</span>{x}</button>)}</nav>

    {showAdmin && <Admin users={users} close={()=>setShowAdmin(false)} ban={ban} unban={unban} promote={promote} official={official}/>}
    {toast && <div className="toast">{toast}</div>}
  </div>
}

function RoomCard({room,onClick}:{room:Room,onClick:()=>void}){
  return <button className="roomCard" onClick={onClick}>
    <div className="cover"><div className="roomAvatar">{room.host[0]}</div><span className="live">LIVE</span></div>
    <div className="roomInfo"><b>{room.title}</b><span>{room.host} · 🇮🇳</span><span>👥 {room.viewers} listening</span></div>
  </button>
}

function RoomView({room,coins,onBack,sendGift,toast}:{room:Room;coins:number;onBack:()=>void;sendGift:(p:number,n:string)=>void;toast:string}){
  return <div className="roomPage">
    <header className="roomTop"><button onClick={onBack}>←</button><div><b>{room.title}</b><small>👥 {room.viewers} listening</small></div><button>⋯</button></header>
    <div className="stage"><div className="hostCircle">{room.host[0]}</div><p>🎙 {room.host} · Host</p><span>Voice room</span></div>
    <div className="speakers"><h3>Speakers</h3><div className="people"><div>🧑<small>Host</small></div><div>👩<small>Speaker</small></div><div>👨<small>Speaker</small></div></div></div>
    <div className="chat"><div className="chatLine"><b>Ayaan:</b> Welcome everyone 👋</div><div className="chatLine"><b>Zoya:</b> Nice room!</div></div>
    <div className="giftRow">{gifts.map(g=><button onClick={()=>sendGift(g.price,g.name)} key={g.name}>{g.icon}<small>{g.price}</small></button>)}</div>
    <div className="roomActions"><button>🎙 Mic</button><button>✋ Raise</button><button>💬 Chat</button><button>🎮 Games</button></div>
    <div className="coinBar">🪙 {coins} VibeCoins <span>Virtual currency only</span></div>
    {toast && <div className="toast">{toast}</div>}
  </div>
}

function Admin({users,close,ban,unban,promote,official}:{users:User[];close:()=>void;ban:(id:string)=>void;unban:(id:string)=>void;promote:(id:string)=>void;official:(id:string)=>void}){
  return <div className="modal"><div className="admin"><div className="adminHead"><h2>Management Center</h2><button onClick={close}>✕</button></div>
    <p className="muted">Owner controls · role-based moderation</p>
    <div className="adminGrid"><div><b>Users</b><span>{users.length}</span></div><div><b>Reports</b><span>0</span></div><div><b>Managers</b><span>{users.filter(u=>u.role==='MANAGER').length}</span></div></div>
    <h3>User management</h3>{users.map(u=><div className="userRow" key={u.id}><div><b>{u.name} {u.official?'✓':''}</b><small>{u.id} · {u.role}</small></div><div className="actions">{u.role!=='MANAGER'&&u.role!=='OWNER'&&<button onClick={()=>promote(u.id)}>Manager</button>}{!u.official&&u.role!=='OWNER'&&<button onClick={()=>official(u.id)}>Official</button>}{u.banned?<button onClick={()=>unban(u.id)}>Unban</button>:u.role!=='OWNER'&&<button onClick={()=>ban(u.id)}>Ban</button>}</div></div>)}
    <div className="notice">Sensitive actions should be enforced by Firebase security rules/server functions in production.</div>
  </div></div>
}

createRoot(document.getElementById('root')!).render(<App/>);
