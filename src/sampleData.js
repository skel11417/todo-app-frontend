const sampleData = {
  tasks: [
    {id: 1, content: 'task 1',  subtaskIds: [4,5] },
    {id: 2, content: 'task 2', subtaskIds: [] },
    {id: 3, content: 'task 3', subtaskIds: [] },
    {id: 4, content: 'task 4 is a subtask of task 1',
    subtaskIds: []},
    {id: 5, content: 'task 5 is a subtask of task 1',
      subtaskIds: []},
    {id: 6, content: 'task 6 is a subtask of task 5'},
    {id: 7, content: "Top", subtaskIds: []},
    {id: 8, content: "Bottom", subtaskIds: []}
  ],
  columns: [
    {id: "Today", tasks: [2], active: true},
    {id: "Week", tasks: [1,2], active: true},
    {id: "Month", tasks: [1,2,3], active: false},
    {id: "All", tasks:[1,2,3,7,8], active: false},
  ]
}

export default sampleData
