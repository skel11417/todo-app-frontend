const sampleData = {
  allTasks: [
    {id: 1, content: 'task 1',  subtaskIds: [4,5] , priority: 'A'},
    {id: 2, content: 'task 2', subtaskIds: [] , priority: 'B'},
    {id: 3, content: 'task 3', subtaskIds: [] , priority: 'C'},
  ],
  // categories: [
    // {id: "A", tasks: [1], active: true},
    // {id: "B", tasks:[1,2,3,7,8], active: true},
    // {id: "C", tasks:[1,2,3,7,8], active: true},
  // ],
  timeframes: [
    {id: "day", active: true},
    {id: "week", active: true},
    {id: "month", active: true},
    {id: "all", active: true},
  ]
}

export default sampleData
