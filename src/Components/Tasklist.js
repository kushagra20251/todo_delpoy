import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Taskform from "./Taskform";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Button } from "@material-ui/core";
function Tasklist() {
  const [open, setOpen] = React.useState(false);
  
  const handleClickToOpen = () => {
    setOpen(true);
  };
  
  const handleToClose = () => {
    setOpen(false);
  };
  const handleclicked=()=>{
    
    for (let i = 0; i < arr.length; i++) {
      db.collection("tasks").doc(arr[i].id).update({ isCompleted: true });
      document.getElementsByClassName(`id${arr[i].id}`)[0].style.color =
        "black";
      document.getElementsByClassName(
        `id${arr[i].id}`
      )[0].style.textDecoration = "none";
    }
    
    let l = tasks;
    for (let i = 0; i < arr.length; i++) {
      let index = l.findIndex((value) => value.id === arr[i].id);
      setcompletedtasks([...completedtasks, tasks[index]]);
      l.splice(index, 1);
    }
    
    settasks(l);
    
    if (change) setchange(false);
    else setchange(true);
    console.log(change);
    setOpen(false);

  }
  const [tasks, settasks] = useState([]);
  const [change, setchange] = useState(false);
  const [showcompleted, setshowcompleted] = useState(false);
  const [completedtasks, setcompletedtasks] = useState([]);
  let arr = [];
  useEffect(() => {
    db.collection("tasks")
      .where("isCompleted", "==", false)
      .onSnapshot((querySnapshot) => {
        let a = [];
        let c = 0;
        querySnapshot.forEach((doc) => {
          a.push({ ...doc.data(), id: doc.id });
          c++;

          if (c === querySnapshot.size) settasks(a);
        });
      });
  }, []);
  useEffect(() => {
    db.collection("tasks")
      .where("isCompleted", "==", true)
      .get()
      .then((querySnapshot) => {
        let a = [];
        let c = 0;
        querySnapshot.forEach((doc) => {
          a.push({ ...doc.data(), id: doc.id });
          c++;

          if (c === querySnapshot.size) {
            setcompletedtasks(a);
            setshowcompleted(true);
          }
        });
      });
  }, []);

  const strikeout = (id, index, name, isCompleted) => {
    if (isCompleted) {
      document.getElementsByClassName(`id${id}`)[0].style.color = "black";
      document.getElementsByClassName(`id${id}`)[0].style.textDecoration =
        "none";
      let l = tasks;
      l[index].isCompleted = false;
      settasks(l);
      arr.splice(index, 1);
    } else {
      document.getElementsByClassName(`id${id}`)[0].style.color = "red";
      document.getElementsByClassName(`id${id}`)[0].style.textDecoration =
        "line-through";
      let l = tasks;
      l[index].isCompleted = true;
      settasks(l);
      arr.push({ id });
    }
  };

  const handleSubmit = (event, task) => {
    event.preventDefault();
    settasks([...tasks, { name: task }]);
    let date2 = new Date();
    db.collection("tasks").add({
      name: task,
      date: date2,
      isCompleted: false,
    });
  };

  const list = tasks.map((i, index) => (
    <li
      className={`id${i.id} xyz`}
      onClick={() => strikeout(i.id, index, i.name, i.isCompleted)}
    >
      {i.name}
    </li>
  ));

  const list2 = completedtasks.map((i, index) => <li>{i.name}</li>);
  const makeCompleted = () => {
    for (let i = 0; i < arr.length; i++) {
      db.collection("tasks").doc(arr[i].id).update({ isCompleted: true });
      document.getElementsByClassName(`id${arr[i].id}`)[0].style.color =
        "black";
      document.getElementsByClassName(
        `id${arr[i].id}`
      )[0].style.textDecoration = "none";
    }
    
    let l = tasks;
    for (let i = 0; i < arr.length; i++) {
      let index = l.findIndex((value) => value.id === arr[i].id);
      setcompletedtasks([...completedtasks, tasks[index]]);
      l.splice(index, 1);
    }
    
    settasks(l);
    
    if (change) setchange(false);
    else setchange(true);
    console.log();
  };
  return (
    <div className="containers">
      <div className="wrapper">
        <Taskform handleSubmit={handleSubmit} />
        {list.length > 0 && (
          <div>
            <div className="todolist">
              <div className="lists">{list} </div>
            </div>
            <Button
              variant="primary"
              className="button"
              onClick={makeCompleted}
            >
              Remove Completed Task
            </Button>
            <Dialog open={open} onClose={makeCompleted}>
        <DialogTitle>{"choose an option"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to remove this taks?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleToClose} 
                  color="primary" autoFocus>
            NO
          </Button>
          <Button onClick={{makeCompleted}} 
                  color="primary" autoFocus>
            YES!
          </Button>
        </DialogActions>
      </Dialog>

          </div>
        )}
      </div>
      {list2.length > 0 && (
        <div className="completedlist">
          <div>
            {showcompleted && (
              <div className="completedlistelement">
                <h4>Completed task list</h4>
                {list2}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasklist;
