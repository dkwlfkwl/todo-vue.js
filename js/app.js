
(function(window){
	'use strict';

	var storageGetData = JSON.parse(localStorage.getItem('todoList')) || [];

	var app = new Vue({
		el: '#todoApp',
		data: function() {
			return {
				todos: storageGetData,
				filter: 'all',
				editTodo: null
			}
		},

		watch: {
			todos: {
				deep: true,
				handler: function(data) {
					localStorage.setItem('todoList', JSON.stringify(data));
				}
			}
		},

		computed: {
			todoView: function() {
				var filter = this.filter;

				return this.todos.filter(function(todo) {
					if(filter === 'active') {
						return !todo.complete;
					} else if(filter === 'completed') {
						return todo.complete;
					} else {
						return true;
					}
				});
			},

			activeTodos: function() {
				return this.todos.filter(function(todo) {
					return todo.complete === false;
				});
			},

			activeTodosCount: function() {
				return this.activeTodos.length;
			},

			showClearCompleted: function() {
				return this.todos.length - this.activeTodos.length;
			}
		},

		mounted: function() {
			this.$refs.inputBox.focus();
		},
		
		methods: {
			create: function(e) {
				var id = new Date().valueOf();
				var content = e.target.value.trim();

				if(content.length === 0){
					e.target.value = '';
					return false;
				}
				this.todos.splice(0, 0, {
					id: id,
					edit: false,
					complete: false,
					content: content
				});

				e.target.value = '';
			},

			remove : function(tgId) {
				this.todos = this.todos.filter(function(todo) {
					return todo.id !== tgId;
				});
			},

			dbclickTodo : function(todo) {
				todo.edit = true;
				this.editTodo = todo;
			},

			edit : function(e, tgTodo) {
				var content = e.target.value;

				if(content.trim().length === 0) {
					this.remove(tgTodo.id);

					return false;
				}

				tgTodo.content = content;
				tgTodo.edit = false;
				this.editTodo = null;
			},

			editCancel : function(tgTodo) {
				this.editTodo = null;
				tgTodo.edit = false;
			},

			completedRemove : function() {
				this.todos = this.todos.filter(function(el) {
					return el.complete === false;
				});
			},

			completedAll : function() {
				var state = this.todos.some(function(todo) {
					return todo.complete === false;
				});

				this.todos = this.todos.map(function(todo) {
					if(state) {
						todo.complete = true;
						return todo;
					} else {
						todo.complete = false;
						return todo;
					}
				});
			}
		},

		directives: {
			'todo-focus': function(el, binding) {
				if(binding.value) {
					el.focus();
				}
			}
		}
	})

})(window)