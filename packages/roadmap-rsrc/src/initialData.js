/**
 * Initial Data - The starting state of the flow document
 * 根据官方示例实现分支流向
 * 流向 1: Start → Roadmap → Magii → End
 * 流向 2: Start → Backstage → End
 */
export const initialData = {
  nodes: [
    // 开始节点
    { 
      id: 'start_0', 
      type: 'start', 
      data: { title: 'Start' },
      blocks: []
    },
    // 分支节点
    {
      id: 'condition_0',
      type: 'condition',
      data: { title: 'Split' },
      blocks: [
        // 分支 1: Roadmap → Magii
        {
          id: 'branch_0',
          type: 'block',
          data: { title: 'Branch 1' },
          blocks: [
            { 
              id: 'roadmap', 
              type: 'task', 
              data: { title: 'Roadmap' },
              blocks: []
            },
            { 
              id: 'magii', 
              type: 'task', 
              data: { title: 'Magii' },
              blocks: []
            }
          ]
        },
        // 分支 Ak
        {
          id: 'branch_ak',
          type: 'block',
          data: { title: 'Branch Ak' },
          blocks: [
            {
              id: 'ak',
              type: 'task',
              data: { title: 'Ak' },
              blocks: []
            }
          ]
        },
        // 分支 2: Backstage
        {
          id: 'branch_1',
          type: 'block',
          data: { title: 'Branch 2' },
          blocks: [
            { 
              id: 'backstage', 
              type: 'task', 
              data: { title: 'Backstage' },
              blocks: []
            }
          ]
        }
      ]
    },
    // 结束节点
    { 
      id: 'end_0', 
      type: 'end', 
      data: { title: 'End' }
    }
  ]
};
