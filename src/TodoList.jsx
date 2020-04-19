import React, { useState } from "react";
import "./todo.css";

const TodoList = () => {
  const [todoList, setTodoList] = useState([]);
  const [changeHeading, toggleChangeHeading] = useState({
    index: 0,
    change: false,
  });

  const [newTaskDesc, setNewTaskDesc] = useState({});

  const createANewList = () => {
    setTodoList([...todoList, { heading: "", list: [] }]);
  };

  const setHeading = (index, heading) => {
    setTodoList(
      todoList.map((el, i) => {
        return i === index ? { ...el, heading } : el;
      })
    );
    // toggleChangeHeading({});
  };

  const saveHeading = () => {
    toggleChangeHeading({});
  };

  const addNewTask = (ind) => {
    if (newTaskDesc.value) {
      setTodoList(
        todoList.map((el, i) => {
          return i === ind ? { ...el, list: [...el.list, newTaskDesc.value] } : el;
        })
      );
      setNewTaskDesc({});
    }
  };

  const deleteTask = (todoInd, listInd) => {
    setTodoList(
      todoList.map((el, i) => {
        return i === todoInd
          ? { ...el, list: el.list.filter((_, i) => i !== listInd) }
          : el;
      })
    );
  };

  return (
    <>
      <h1>To Do List</h1>
      <div className="d-f-f-w">
        {todoList.length > 0 && (
          <div className="d-f-f-w">
            {todoList.map((todo, i) => {
              return (
                <div key={i} className="list">
                  {changeHeading.index === i && changeHeading.change ? (
                    <input
                      placeholder="Set Heading"
                      value={todo.heading}
                      onChange={(e) => setHeading(i, e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && saveHeading()}
                      id="heading"
                      autoFocus
                      className="heading-input-box"
                    />
                  ) : (
                    <p
                      className="list-heading"
                      onClick={() =>
                        toggleChangeHeading({ index: i, change: true })
                      }
                    >
                      {todo.heading || "Click to add title"}
                    </p>
                  )}
                  <div>
                    {" "}
                    {todo.list.map((list, ind) => {
                      return (
                        <div key={ind} className="task-details-container" draggable>
                          <img
                            src="https://img.icons8.com/carbon-copy/100/000000/delete-forever--v1.png"
                            alt="Delete"
                            style={{
                              height: 16,
                              float: "right",
                              cursor: "pointer",
                            }}
                            onClick={() => deleteTask(i, ind)}
                          />
                          <p className="task-text">{list}</p>
                        </div>
                      );
                    })}
                  </div>
                  <input
                    placeholder="+ Add New Task"
                    className="add-new-task-input"
                    onChange={(e) =>
                      setNewTaskDesc({ i, value: e.target.value })
                    }
                    value={newTaskDesc.i === i ? newTaskDesc.value : ""}
                    onKeyPress={(e) => e.key === "Enter" && addNewTask(i)}
                  />
                </div>
              );
            })}
          </div>
        )}
        <p className="add-list-container" onClick={createANewList}>
          + Add a new list
        </p>
      </div>
    </>
  );
};

export default TodoList;
