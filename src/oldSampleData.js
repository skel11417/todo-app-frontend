const sampleData = {
  tasks: [
    {id: 1, content: 'task 1',  subtaskIds: [4,5] , priority: 'a'},
    {id: 2, content: 'task 2', subtaskIds: [] , priority: 'a'},
    {id: 3, content: 'task 3', subtaskIds: [] , priority: 'a'},
    {id: 4, content: 'task 4 is a subtask of task 1',
    subtaskIds: [], priority: 'a'},
    {id: 5, content: 'task 5 is a subtask of task 1',
      subtaskIds: [], priority: 'a'},
    {id: 6, content: 'task 6 is a subtask of task 5', priority: 'a'},
    {id: 7, content: "Top", subtaskIds: [], priority: 'a'},
    {id: 8, content: "Bottom", subtaskIds: [], priority: 'a'}
  ],
  columns: [
    {id: "Today", tasks: [2], active: true},
    {id: "All", tasks:[1,2,3,7,8], active: true},
  ]
}

export default sampleData
