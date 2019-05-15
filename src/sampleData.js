const sampleData = {
  tasks: [
    {id: 1, content: 'task 1',
      subtasks: [
        {id: 4, content: 'task 4 is a subtask of task 1',
        subtasks: []
      },
        {id: 5, content: 'task 5 is a subtask of task 1',
          subtasks: [{id: 6, content: 'task 6 is a subtask of task 5'}]
        }
      ]
    },
    {id: 2, content: 'task 2', subtasks: [] },
    {id: 3, content: 'task 3', subtasks: [] }
  ],
  columns: [
    {id: "day", tasks: []},
    {id: "week", tasks: []},
    {id: "month", tasks: []},
    {id: "all", tasks:[1,2,3]}]
}

export default sampleData
