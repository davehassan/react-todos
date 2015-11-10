var TodoList = React.createClass({
  getInitialState: function () {
    return { todos: TodoStore.all() } ;
  },

  render: function () {

    return (<div>
              {this.state.todos.map(function (todo) {
                return <TodoListItem key={todo.title} todo={todo}></TodoListItem>;
              })}
              <TodoForm />
           </div>);
  },

  todosChanged: function () {
    this.setState({ todos: TodoStore.all() });
  },

  componentDidMount: function () {
    TodoStore.addChangeHandler(this.todosChanged);
    TodoStore.fetch();
  },

  componentWillUnmount: function () {
    TodoStore.removeChangeHandler(this.todosChanged);
  }
});

var TodoListItem = React.createClass({
  handleDestroy: function () {
    TodoStore.destroy(this.props.todo.id);
  },

  render: function () {
    return (
      <div>
        <div>{this.props.todo.title}</div>
        <DoneButton todo={this.props.todo} />
        <TodoDetailView destroy={this.handleDestroy} todo={this.props.todo} />
      </div>
    );
  }
});

var TodoDetailView = React.createClass({
  getInitialState: function () {
    return { displayed: false };
  },

  render: function () {
    return (
      <div>
        <div> • {this.props.todo.body}</div>
        <button onClick={this.props.destroy}>Delete</button>
      </div>
    );
  }
});

var TodoForm = React.createClass({
  getInitialState: function () {
    return { title: "", body: "" };
  },

  updateTitle: function (e) {
    this.setState({ title: e.currentTarget.value });
  },

  updateBody: function (e) {
    this.setState({ body: e.currentTarget.value });
  },

  handleSubmit: function (e) {
    // debugger;
    var todoObj = { title: this.state.title, body: this.state.body, done: false };
    TodoStore.create(todoObj);
    this.setState({ title: "", body: "" });
  },

  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Title:
          <input type="text" value={this.state.title} onChange={this.updateTitle} />
        </label>
        <label> Body:
          <input type="textarea" value={this.state.body} onChange={this.updateBody} />
        </label>
        <button>Submit!</button>
      </form>
    );
  }
});

var DoneButton = React.createClass({
  handleDone: function () {
    TodoStore.toggleDone(this.props.todo.id);
  },

  render: function () {
    return (
      <button onClick={this.handleDone}>{this.props.todo.done ? "Undo" : "Done" }</button>
    );
  }
});
