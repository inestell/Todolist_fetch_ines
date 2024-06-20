import React, {useState, useEffect} from 'react';
import './App.css';


function App() {
  	const[task, setTask] = useState("");
	const [list, setList] = useState([]);
	

	//This first function to get data from the API
	async function fetchTasks() {
		try {
			const response = await fetch('https://playground.4geeks.com/todo/users/inestell');
			const apiList = await response.json();
			console.log(apiList.todos);
			setList(apiList.todos);
		} catch (error) {
			console.error('Error fetching tasks: ', error)
		}
	};
	
	//Use effect to get the data from the API the first time
	useEffect(() => {
		fetchTasks();
	}, []);


	// This function to add tasks to the API and to the my browser list
	const addTask = async (e) => {
		if(e.key === 'Enter' && task.trim() !== "") {
			const addTaskToAPI = await fetch("https://playground.4geeks.com/todo/todos/inestell", {
				method: 'POST', 
				headers: {"Content-type": "application/json"},
				body: JSON.stringify({label: task, is_done: false})
			});
			setList([...list, {label: task, is_done: false}]);

			setTask("");
		}
	};

	// This function to delete tasks in the API and in my list
	const deleteTask = async (index) => {
		const deleteMyAPITask = await fetch(`https://playground.4geeks.com/todo/todos/${list[index].id}`, {
			method: "DELETE", 
		});
		fetchTasks();
	};

	//This function to delete all tasks
	const handleDeleteUser = async () => {
		const deleteAll = await fetch('https://playground.4geeks.com/todo/users/inestell'
		, {
			method: "DELETE"
		});
		setList([]);
	}

	return (
		<div>
			<div className="container">
				<h1>Todos</h1>
				<input placeholder={list.length !== 0 ? "What needs to be done?" : "No tasks, add a task"} 
						type="text" 
						value={task} 
						onChange={(e) => setTask(e.target.value)} 
						onKeyUp={addTask} />
				<ul>
					{list.map((item, index) => 
						<li key={index}>
							{item.label}
							<span className="hidden"
								onClick={() => deleteTask(index)}>✕</span>
						</li>)}
				</ul>
				<p className="info-below">{list.length} item left</p>
			</div>
			<div className="myButton">
				<button onClick={handleDeleteUser}>Delete this list</button>
			</div>
		</div>
	)
};


export default App
