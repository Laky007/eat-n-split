import { useEffect, useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, setFriends] = useState([]);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [friendSelected, setFriendSelected] = useState("");

  function handleAddFriend(newFriend) {
    const newFriends = [...friends, newFriend];
    setFriends(newFriends);
    setIsAddingFriend(false);
  }

  function handleBtnAddFriend() {
    setIsAddingFriend(!isAddingFriend);
    setFriendSelected("");
  }

  function handleSelectFriend(f) {
    //setFriendSelected(f);
    setFriendSelected((cur) => (cur?.id === f.id ? "" : f));
    setIsAddingFriend(false);
  }

  function handleSubmitNewBalance(name, amount) {
    const updatedFriends = friends.map((obj) => {
      if (obj.name === name) {
        obj.balance = obj.balance + amount;
      }
      return obj;
    });

    setFriends(updatedFriends);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelect={handleSelectFriend}
          friendSelected={friendSelected}
        />

        {isAddingFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <button className="button" onClick={handleBtnAddFriend}>
          {isAddingFriend ? "Cancel" : "Add Friend"}
        </button>
      </div>
      {friendSelected && (
        <FormSplitBill
          friendSelected={friendSelected}
          onUpdateNewBalance={handleSubmitNewBalance}
          onAfterSplit={() => setFriendSelected("")}
        />
      )}
    </div>
  );
}
export default App;

function FriendsList({ friends, onSelect, friendSelected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          friendSelected={friendSelected}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, friendSelected }) {
  const isSelected = friend.id === friendSelected?.id;

  function handleToggle() {
    onSelect(friend);
  }

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance === 0 ? (
        <p>You and {friend.name} are even</p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you ${friend.balance}{" "}
        </p>
      ) : (
        <p className="red">
          You owe {friend.name} ${friend.balance * -1}
        </p>
      )}

      <button className="button" onClick={handleToggle}>
        {isSelected ? "Close" : "Select"}
      </button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [formData, setFormData] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData) {
      alert("Please enter a friend name");
      return;
    }

    const newFriend = {
      id: Math.floor(Math.random() * 1000000),
      name: formData,
      image:
        "https://i.pravatar.cc/48?u=" + Math.floor(Math.random() * 1000000),
      balance: 0,
    };
    onAddFriend(newFriend);
    setFormData("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label> 🙋‍♂️ Friend name </label>
      <input
        type="text"
        onChange={(e) => setFormData(e.target.value)}
        value={formData}
      />
      <label> 📷 image URL</label>
      <input
        type="text"
        placeholder="https://xsgames.co/randomusers/avatar.php?g=male"
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friendSelected, onUpdateNewBalance, onAfterSplit }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const friendExpense = bill - yourExpense;
  const [whoPays, setWhoPays] = useState("");

  useEffect(() => {
    if (!friendSelected) return;

    setBill("");
    setYourExpense("");
    setWhoPays("");
  }, [friendSelected]);

  function handleSelectWhoPays(e) {
    setWhoPays(e.target.value);
  }

  function handleSubmitSplitBill(e) {
    e.preventDefault();
    if (!bill || !yourExpense) return;

    if (whoPays === friendSelected.name) {
      const urExp = yourExpense * -1;
      onUpdateNewBalance(friendSelected.name, urExp);
    } else {
      onUpdateNewBalance(friendSelected.name, friendExpense);
    }
    onAfterSplit();
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmitSplitBill}>
      <h2>Split a bill with {friendSelected.name}</h2>
      <label> 💸 Bill value</label>
      <input
        type="number"
        value={bill}
        min={0}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label> 🙆‍♂️ Your expense</label>
      <input
        type="number"
        value={yourExpense}
        min={0}
        max={bill}
        onChange={(e) => setYourExpense(Number(e.target.value))}
      />

      <label> 💁‍♂️ {friendSelected.name}'s expense</label>
      <input type="text" disabled value={friendExpense} readOnly={true} />

      <label> 🤑 Who is paying the bill?</label>
      <select onChange={handleSelectWhoPays}>
        <option value="You">You</option>
        <option value={friendSelected.name}>{friendSelected.name}</option>
      </select>
      <button className="button"> Split Bill</button>
    </form>
  );
}

//si yo pago le sumo su gasto al balance
//si el paga le resto mi gasto al balance
