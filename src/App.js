import React, { useEffect, useState } from "react";
import "./styles/App.css";
import "./styles/normalize.css";
import List from "./components/List";
import Alert from "./components/Alert";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./utils/firebase/firebase";

const App = () => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [list, setList] = useState([]);
  const [isEditing, setisEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [alertMsg, setAlertMsg] = useState({
    show: false,
    type: "",
    msg: "",
  });

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("created", "desc"));

    onSnapshot(q, (querySnapShot) => {
      setList(
        querySnapShot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        })
      );
    });
  }, []);

  // delete item
  const deleteItem = async (id) => {
    const itemToEditRef = await doc(db, "tasks", id);
    await deleteDoc(itemToEditRef);

    setAlertMsg({
      show: true,
      msg: "Item Deleted !",
      type: "deleted",
    });
  };

  // clear Item
  const clearItems = () => {
    setList([]);
    setAlertMsg({
      show: true,
      msg: "Items Cleared !",
      type: "clear",
    });
  };

  // edit item
  const editItem = (id) => {
    const itemToEdit = list.find((item) => item.id === id);
    setisEditing(true);
    setEditId(id);
    setItemName(itemToEdit.title);
    setQuantity(itemToEdit.quantity);
  };

  // onSubmit
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!itemName || !quantity) {
      setAlertMsg({
        show: true,
        msg: "Please Enter A Item !",
        type: "danger",
      });
    } else if (itemName && quantity && isEditing) {
      try {
        const itemToEditRef = await doc(db, "tasks", editId);
        await updateDoc(itemToEditRef, {
          title: itemName,
          quantity: quantity,
        });
        setAlertMsg({
          show: true,
          msg: "Item Edited Successfully !",
          type: "edited",
        });
        setItemName("");
        setQuantity("");
        setisEditing(false);
        setEditId("");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await addDoc(collection(db, "tasks"), {
          title: itemName,
          quantity: quantity,
          created: Timestamp.now(),
        });
        setItemName("");
        setQuantity("");
        setAlertMsg({
          show: true,
          msg: "Item Added Successfully !",
          type: "success",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <main>
        <div className="title">
          <h1> 5 Star Hotel 🍕</h1>
        </div>

        {alertMsg.show && <Alert {...alertMsg} showAlert={setAlertMsg} />}

        <form onSubmit={submitHandler}>
          <div className="form-control">
            <input
              type="text"
              value={itemName}
              placeholder="I like to Eat...😋"
              onChange={(e) => setItemName(e.target.value)}
            />
            <input
              type="number"
              value={quantity}
              placeholder="No of Quantity...⁉"
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div className="btn">
              <button type="submit">{isEditing ? "Update" : "Enter"}</button>
            </div>
          </div>
        </form>

        {list.length > 0 && (
          <div className="list-container">
            <div className="order">
              <p>Your Orders:</p>
            </div>

            <List items={list} deleteItem={deleteItem} editItem={editItem} />
            <div className="btn">
              <button id="clr" type="button" onClick={clearItems}>
                Clear All
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default App;
