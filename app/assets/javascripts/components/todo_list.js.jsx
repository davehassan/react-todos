var TodoList = React.createClass({
  getInitialState: function () {
    return { todos: TodoStore.all()} ;
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
  getInitialState: function () {
    return { displayed: false };
  },

  toggleDisplay: function () {
    this.setState({ displayed: !this.state.displayed });
  },

  handleDestroy: function () {
    TodoStore.destroy(this.props.todo.id);
  },

  render: function () {
    return (
      <div>
        <div onClick={this.toggleDisplay}>{this.props.todo.title}</div>
        <DoneButton item={this.props.todo} />
        <TodoDetailView destroy={this.handleDestroy} todo={this.props.todo} displayed={this.state.displayed}/>
      </div>
    );
  }
});

var TodoDetailView = React.createClass({
  render: function () {
    var details = (
      <div>
        <div>{this.props.todo.body}</div>
        <button onClick={this.props.destroy}>Delete</button>
        <TodoSteps todo={this.props.todo}/>
      </div>
    );
    return (this.props.displayed ? details : <div></div>);
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
    TodoStore.toggleDone(this.props.item.id);
  },

  render: function () {
    return (
      <button onClick={this.handleDone}>{this.props.item.done ? "Undo" : "Done" }</button>
    );
  }
});

var TodoSteps = React.createClass({
  getInitialState: function () {
    return { steps: [], words: "fak" };
  },

  stepsChanged: function () {
    this.setState({ steps: StepStore.all(this.props.todo.id) });
  },

  componentDidMount: function () {
    StepStore.addChangeHandler(this.stepsChanged);
    StepStore.fetch(this.props.todo.id);
  },

  componentWillUnmount: function () {
    StepStore.removeChangeHandler(this.stepsChanged);
  },

  handleChange: function (e) {
    this.setState({ words: e.currentTarget.value });
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var stepObj = { words: this.state.words, todoId: this.props.todo.id };
    debugger;
    StepStore.create(stepObj);
    this.setState({ words: "" });
  },

  handleDestroy: function (e) {
    StepStore.destroy(parseInt(e.currentTarget.id));
  },

  render: function () {
    return(
      <ul>
        {
          this.state.steps.map(function (step, idx) {
            return (
              <li key={step.id}>
                <div>{step.words}</div>
                <DoneButton item={step} />
                <button id={step.id} onClick={this.handleDestroy}>X</button>
              </li>
            );
          }.bind(this))
        }
        <form onSubmit={this.handleSubmit}>
          <label>New Step
            <input type="text" value={this.state.words} onChange={this.handleChange}/>
            <button>Add Step</button>
          </label>
        </form>
      </ul>
    );
  }
});
