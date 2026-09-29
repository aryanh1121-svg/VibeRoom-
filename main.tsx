import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

type Role = 'OWNER' | 'OFFICIAL' | 'MANAGER' | 'USER';

type Room = {
  id: number;
  title: string;
  host: string;
  users: number;
  category: string;
};

type User = {
  id: string;
  name: string;
  role: Role;
  banned?: boolean;
};

const initialRooms: Room[] = [
  { id: 1, title: 'Late Night Vibes', host: 'Arhan', users: 28, category: 'Popular' },
  { id: 2, title: 'Music & Chill', host: 'Ayaan', users: 42, category: 'Music' },
  { id: 3, title: 'Friends Corner', host: 'Zoya', users: 19, category: 'Friends' },
  { id: 4, title: 'Creative Talk', host: 'Riya', users: 13, category: 'Talk' },
];

const gifts = [
  { name: 'Rose', price: 10, icon: '🌹' },
  { name: 'Heart', price: 50, icon: '❤️' },
  { name: 'Star', price: 100, icon: '⭐' },
  { name: 'Crown', price: 500, icon: '👑' },
  { name: 'Diamond', price: 1000, icon: '💎' },
];

const seedUsers: User[] = [
  { id: 'VR10001', name: 'Arhan', role: 'OWNER' },
  { id: 'VR10002', name: 'Ayaan', role: 'USER' },
  { id: 'VR10003', name: 'Zoya', role: 'OFFICIAL' },
];

function App() {
  const [tab, setTab] = useState('Home');
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selected, setSelected] = useState<Room | null>(null);
  const [coins, setCoins] = useState(5000);
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [showAdmin, setShowAdmin] = useState(false);
  const [toast, setToast] = useState('');

  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    if (category === 'All') return rooms;
    return rooms.filter((room) => room.category === category);
  }, [rooms, category]);

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  }

  function createRoom() {
    const newRoom: Room = {
      id: Date.now(),
      title: `Vibe Room ${rooms.length + 1}`,
      host: 'Arhan',
      users: 1,
      category: 'Friends',
    };

    setRooms((prev) => [newRoom, ...prev]);
    setSelected(newRoom);
    notify('Room created successfully');
  }

  function sendGift(price: number, name: string) {
    if (coins < price) {
      notify('Not enough coins');
      return;
    }

    setCoins((prev) => prev - price);
    notify(`${name} sent 🎁`);
  }

  function ban(id: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, banned: true } : user
      )
    );
    notify('User banned');
  }

  function unban(id: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, banned: false } : user
      )
    );
    notify('User unbanned');
  }

  function promote(id: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, role: 'MANAGER' } : user
      )
    );
    notify('User promoted to Manager');
  }

  function official(id: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, role: 'OFFICIAL' } : user
      )
    );
    notify('Official status added');
  }

  if (selected) {
    return (
      <RoomView
        room={selected}
        coins={coins}
        onBack={() => setSelected(null)}
        onGift={sendGift}
      />
    );
  }

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          Vibe<span>Room</span>
        </div>

        <button className="coin" onClick={() => notify('Coins: ' + coins)}>
          🪙 {coins}
        </button>

        <button className="icon" onClick={() => setShowAdmin(!showAdmin)}>
          ⚙️
        </button>
      </header>

      <main>
        {tab === 'Home' && (
          <>
            <section className="hero">
              <div>
                <p className="eyebrow">LIVE VOICE CHAT</p>
                <h1>Meet. Talk. Vibe.</h1>
                <p>Join a room and talk with your friends.</p>
              </div>

              <button className="primary" onClick={createRoom}>
                ＋ Create Room
              </button>
            </section>

            <div className="tabs">
              {['Popular', 'Music', 'Friends', 'Talk'].map((item) => (
                <button
                  key={item}
                  className={category === item ? 'active' : ''}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="chips">
              {['All', 'Popular', 'Music', 'Friends', 'Talk'].map((item) => (
                <button
                  key={item}
                  className={category === item ? 'chip active' : 'chip'}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <h2>Live rooms</h2>

            <div className="grid">
              {filtered.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onClick={() => setSelected(room)}
                />
              ))}
            </div>
          </>
        )}

        {tab === 'Explore' && (
          <section className="page">
            <h2>Explore</h2>
            <p>Discover new voice rooms and communities.</p>
            <button className="primary" onClick={createRoom}>
              ＋ Create Room
            </button>
          </section>
        )}

        {tab === 'Message' && (
          <section className="page">
            <h2>Messages</h2>
            <div className="message">No new messages</div>
          </section>
        )}

        {tab === 'Me' && (
          <section className="page">
            <div className="profile">
              <div className="avatar">A</div>
              <h2>Arhan</h2>
              <p>ID: VR10001</p>
              <span className="role">OWNER</span>
            </div>

            <div className="wallet">
              🪙 Balance: <b>{coins}</b>
            </div>

            <button
              className="primary"
              onClick={() => setShowAdmin(!showAdmin)}
            >
              Admin Panel
            </button>
          </section>
        )}
      </main>

      <nav className="bottom">
        {['Home', 'Explore', 'Message', 'Me'].map((item) => (
          <button
            key={item}
            className={tab === item ? 'selected' : ''}
            onClick={() => setTab(item)}
          >
            <span>
              {item === 'Home' && '🏠'}
              {item === 'Explore' && '🔎'}
              {item === 'Message' && '💬'}
              {item === 'Me' && '👤'}
            </span>
            {item}
          </button>
        ))}
      </nav>

      {showAdmin && (
        <Admin
          users={users}
          onClose={() => setShowAdmin(false)}
          onBan={ban}
          onUnban={unban}
          onPromote={promote}
          onOfficial={official}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function RoomCard({
  room,
  onClick,
}: {
  room: Room;
  onClick: () => void;
}) {
  return (
    <button className="room-card" onClick={onClick}>
      <div className="room-avatar">🎙️</div>

      <div className="room-info">
        <h3>{room.title}</h3>
        <p>Host: {room.host}</p>
        <span>👥 {room.users} people</span>
      </div>

      <div className="live">LIVE</div>
    </button>
  );
}

function RoomView({
  room,
  coins,
  onBack,
  onGift,
}: {
  room: Room;
  coins: number;
  onBack: () => void;
  onGift: (price: number, name: string) => void;
}) {
  return (
    <div className="room-view">
      <header className="room-header">
        <button className="back" onClick={onBack}>
          ←
        </button>

        <div>
          <b>{room.title}</b>
          <small>👥 {room.users} online</small>
        </div>

        <span>🪙 {coins}</span>
      </header>

      <div className="stage">
        <div className="speaker">
          <div className="big-avatar">A</div>
          <h2>{room.host}</h2>
          <span>🎙️ Host</span>
        </div>

        <div className="people">
          <div>👤</div>
          <div>👤</div>
          <div>👤</div>
          <div>＋</div>
        </div>
      </div>

      <div className="gift-panel">
        <h3>Send Gift</h3>

        <div className="gift-grid">
          {gifts.map((gift) => (
            <button
              key={gift.name}
              onClick={() => onGift(gift.price, gift.name)}
            >
              <strong>{gift.icon}</strong>
              <span>{gift.name}</span>
              <small>🪙 {gift.price}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="room-actions">
        <button>🎙️ Mic</button>
        <button>🔊 Speaker</button>
        <button>💬 Chat</button>
        <button className="leave" onClick={onBack}>
          Leave
        </button>
      </div>
    </div>
  );
}

function Admin({
  users,
  onClose,
  onBan,
  onUnban,
  onPromote,
  onOfficial,
}: {
  users: User[];
  onClose: () => void;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  onPromote: (id: string) => void;
  onOfficial: (id: string) => void;
}) {
  return (
    <div className="admin-overlay">
      <div className="admin">
        <div className="admin-head">
          <h2>Admin Panel</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {users.map((user) => (
          <div className="user-row" key={user.id}>
            <div className="user-avatar">{user.name[0]}</div>

            <div className="user-details">
              <b>{user.name}</b>
              <small>{user.id}</small>
              <span>{user.role}</span>
            </div>

            <div className="user-actions">
              {user.banned ? (
                <button onClick={() => onUnban(user.id)}>Unban</button>
              ) : (
                <button onClick={() => onBan(user.id)}>Ban</button>
              )}

              <button onClick={() => onPromote(user.id)}>Manager</button>
              <button onClick={() => onOfficial(user.id)}>Official</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
