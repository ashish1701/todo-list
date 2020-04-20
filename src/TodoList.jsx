import React, { useState } from "react";
import "./todo.css";

class TodoList extends React.Component {
  state = {
    todoList: [],
    changeHeading: { index: 0, change: false },
    newTaskDesc: {},
  };

  createANewList = () => {
    this.setState({
      todoList: [...this.state.todoList, { heading: "", list: [] }],
    });
  };

  setHeading = (index, heading) => {
    this.setState({
      todoList: this.state.todoList.map((el, i) => {
        return i === index ? { ...el, heading } : el;
      }),
    });
  };

  saveHeading = () => this.setState({ changeHeading: {} });

  addNewTask = (ind, deleteInfo) => {
    if (this.state.newTaskDesc.value) {
      this.setState(
        {
          todoList: this.state.todoList.map((el, i) => {
            return i === ind
              ? { ...el, list: [...el.list, this.state.newTaskDesc.value] }
              : el;
          }),
          newTaskDesc: {},
        },
        () => {
          if (deleteInfo)
            this.deleteTask(deleteInfo.todoListInd, deleteInfo.taskInd);
        }
      );
    }
  };

  deleteTask = (todoInd, listInd) => {
    this.setState({
      todoList: this.state.todoList.map((el, i) => {
        return i === todoInd
          ? { ...el, list: el.list.filter((_, i) => i !== listInd) }
          : el;
      }),
    });
  };

  onDropEl = (event, todoIndex) => {
    const el = JSON.parse(event.dataTransfer.getData("listInfo"));
    const value = this.state.todoList[el.todoListInd].list[el.taskInd];
    this.setState({ newTaskDesc: { value } }, () => {
      this.addNewTask(todoIndex, el);
    });

    // deleteTask(el.todoListInd, el.taskInd);
  };
  render() {
    const { todoList, changeHeading, newTaskDesc } = this.state;
    return (
      <>
        <h1>To Do List</h1>
        <div className="d-f-f-w">
          {todoList.length > 0 && (
            <div className="d-f-f-w">
              {todoList.map((todo, i) => {
                return (
                  <div
                    key={i}
                    className="list"
                    onDragOver={(event) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      console.log(event, "onDrop");
                      this.onDropEl(event, i);
                    }}
                  >
                    {changeHeading.index === i && changeHeading.change ? (
                      <input
                        placeholder="Set Heading"
                        value={todo.heading}
                        onChange={(e) => this.setHeading(i, e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && this.saveHeading()
                        }
                        id="heading"
                        autoFocus
                        className="heading-input-box"
                      />
                    ) : (
                      <p
                        className="list-heading"
                        onClick={() =>
                          this.toggleChangeHeading({ index: i, change: true })
                        }
                      >
                        {todo.heading || "Click to add title"}
                      </p>
                    )}
                    <div>
                      {" "}
                      {todo.list.map((list, ind) => {
                        return (
                          <div
                            key={ind}
                            className="task-details-container"
                            draggable
                            onDragStart={(e) => {
                              console.log(list);
                              e.dataTransfer.setData(
                                "listInfo",
                                JSON.stringify({
                                  todoListInd: i,
                                  taskInd: ind,
                                })
                              );
                            }}
                          >
                            <img
                              src="https://img.icons8.com/carbon-copy/100/000000/delete-forever--v1.png"
                              alt="Delete"
                              style={{
                                height: 16,
                                float: "right",
                                cursor: "pointer",
                              }}
                              onClick={() => this.deleteTask(i, ind)}
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
                        this.setState({
                          newTaskDesc: { i, value: e.target.value },
                        })
                      }
                      value={newTaskDesc.i === i ? newTaskDesc.value : ""}
                      onKeyPress={(e) =>
                        e.key === "Enter" && this.addNewTask(i)
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}
          <p className="add-list-container" onClick={this.createANewList}>
            + Add a new list
          </p>
        </div>
      </>
    );
  }
}

export default TodoList;
