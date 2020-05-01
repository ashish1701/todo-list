import React, { useState, useEffect } from "react";
import activeIcon from "./images/radio-active.svg";
import inactiveIcon from "./images/radio-inactive.svg";
import closeIcon from "./images/close.svg";
import "./todo.css";

const ALL = "All";
const ACTIVE = "Active";
const COMPLETED = "Completed";

const DISPLAY_TYPES = [ALL, ACTIVE, COMPLETED];

class TodoList extends React.Component {
  state = {
    todoList: [],
    todo: "",
    displayTypes: DISPLAY_TYPES,
    typeOfDisplay: ALL,
  };

  componentDidMount() {
    const todoInLocalStorage = localStorage.getItem("todoList");
    if (todoInLocalStorage) {
      this.setState({ todoList: JSON.parse(todoInLocalStorage) });
    }
    window.addEventListener("beforeunload", this.saveStateToLocalStorage);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveStateToLocalStorage);

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  saveStateToLocalStorage = () => {
    localStorage.setItem("todoList", JSON.stringify(this.state.todoList));
  };

  updateTodoList = () => {
    const { todo } = this.state;
    if (todo) {
      const timestamp = new Date().getTime();
      this.setState({
        todoList: [
          { todo, isCompleted: false, timestamp },
          ...this.state.todoList,
        ],
        todo: "",
      });
    }
  };

  listToShow = () => {
    const { todoList, typeOfDisplay } = this.state;
    switch (typeOfDisplay) {
      case ALL:
        return todoList;
      case ACTIVE:
        return todoList.filter((ele) => !ele.isCompleted);
      case COMPLETED:
        return todoList.filter((ele) => ele.isCompleted);

      default:
        if (typeOfDisplay.match(/#[a-z]+/gi)) {
          return todoList.filter(
            (ele) => ele.todo.indexOf(typeOfDisplay) !== -1
          );
        }
        console.log("default case");
    }
  };

  setHashtagToTypes = (part) => {
    if (this.state.displayTypes.indexOf(part) === -1) {
      this.setState({
        displayTypes: [...this.state.displayTypes, part],
        typeOfDisplay: part,
      });
    }
  };

  getHighlightedText = (text) => {
    const parts = text.split(" ");
    return (
      <span className="todo-text">
        {parts.map((part) =>
          part.match(/#[a-z]+/gi) ? (
            <i
              onClick={() => this.setHashtagToTypes(part)}
              style={{ cursor: "pointer", background: "#000", color: "#fff" }}
            >
              {part}&nbsp;
            </i>
          ) : (
            `${part}${" "}`
          )
        )}
      </span>
    );
  };

  getUniqueKey = (i) => {
    return `${Math.floor(Math.random() * 100)}-${i}`;
  };

  changeCompleteStatus = (ind) => {
    const { todoList } = this.state;
    const newTodoList = [
      ...todoList.filter((ele, i) => i !== ind),
      {
        todo: todoList[ind].todo,
        timestamp: todoList[ind].timestamp,
        isCompleted: !todoList[ind].isCompleted,
      },
    ];
    this.setState({
      todoList: [
        ...newTodoList
          .filter((ele) => !ele.isCompleted)
          .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1)),
        ...newTodoList
          .filter((ele) => ele.isCompleted)
          .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1)),
      ],
    });
  };

  deleteTask = (ind) => {
    this.setState({
      todoList: this.state.todoList.filter((ele, i) => i !== ind),
    });
  };

  reset = () => {
    this.setState({
      todoList: [],
      todo: "",
      displayTypes: DISPLAY_TYPES,
      typeOfDisplay: ALL,
    });
  };

  render() {
    const { todoList, typeOfDisplay, displayTypes, todo } = this.state;
    return (
      <div className="container">
        <button className="resetButton" onClick={() => this.reset()}>
          Reset{" "}
        </button>

        <h1>Todos</h1>

        <div className="todo-container">
          <input
            placeholder="Type TODO"
            onChange={(e) => this.setState({ todo: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && this.updateTodoList()}
            value={todo}
            className="input_box"
          />

          {this.listToShow()?.length > 0 && (
            <div>
              {/* <button onClick={() => setTodoList([])}>Reset</button> */}
              {this.listToShow().map((list, i) => {
                return (
                  <div key={this.getUniqueKey(i)} className="todo-box">
                    <div style={{ display: "flex" }}>
                      <img
                        src={list.isCompleted ? activeIcon : inactiveIcon}
                        alt={`completed-${list.isCompleted}`}
                        onClick={() => this.changeCompleteStatus(i)}
                      />
                      {this.getHighlightedText(list.todo)}
                    </div>
                    <img
                      src={closeIcon}
                      alt="Close"
                      onClick={() => this.deleteTask(i)}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {todoList?.length > 0 && (
            <div className="types-container">
              {displayTypes.map((type, i) => (
                <div
                  key={i}
                  onClick={() => this.setState({ typeOfDisplay: type })}
                  className={`types-box ${
                    type === typeOfDisplay ? "active" : ""
                  }`}
                >
                  {" "}
                  <p>{type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TodoList;
