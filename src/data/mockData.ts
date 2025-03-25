import  { Question, Submission } from '../types';

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'easy',
    tags: ['arrays', 'hash-table'],
    createdBy: 'staff1',
    createdAt: '2023-04-15',
    sampleInput: '[2,7,11,15], target = 9',
    sampleOutput: '[0,1]',
    constraints: 'You may assume that each input would have exactly one solution, and you may not use the same element twice.'
  },
  {
    id: 'q2',
    title: 'Binary Tree Level Order Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
    difficulty: 'medium',
    tags: ['binary-tree', 'bfs'],
    createdBy: 'staff1',
    createdAt: '2023-05-10',
    sampleInput: 'root = [3,9,20,null,null,15,7]',
    sampleOutput: '[[3],[9,20],[15,7]]',
    constraints: 'The number of nodes in the tree is in the range [0, 2000].'
  },
  {
    id: 'q3',
    title: 'Merge K Sorted Lists',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    difficulty: 'hard',
    tags: ['linked-list', 'heap'],
    createdBy: 'staff1',
    createdAt: '2023-06-01',
    sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
    sampleOutput: '[1,1,2,3,4,4,5,6]',
    constraints: 'k == lists.length, 0 <= k <= 10^4'
  },
  {
    id: 'q4',
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters (, ), {, }, [, and ], determine if the input string is valid.',
    difficulty: 'easy',
    tags: ['stack', 'string'],
    createdBy: 'staff1',
    createdAt: '2023-07-05',
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    constraints: '1 <= s.length <= 104, s consists of parentheses only []{}().'
  },
  {
    id: 'q5',
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
    difficulty: 'medium',
    tags: ['array', 'dynamic-programming'],
    createdBy: 'staff1',
    createdAt: '2023-08-12',
    sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
    sampleOutput: '6',
    constraints: '1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4'
  }
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 's1',
    userId: 'student1',
    questionId: 'q1',
    language: 'python',
    code: 'def twoSum(nums, target):\n    map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in map:\n            return [map[complement], i]\n        map[num] = i',
    status: 'accepted',
    timestamp: '2023-09-15T10:30:00Z'
  },
  {
    id: 's2',
    userId: 'student1',
    questionId: 'q4',
    language: 'javascript',
    code: 'function isValid(s) {\n  const stack = [];\n  const map = {\n    "(": ")",\n    "[": "]",\n    "{": "}"\n  };\n  \n  for (let i = 0; i < s.length; i++) {\n    const char = s[i];\n    if (char in map) {\n      stack.push(char);\n    } else {\n      const last = stack.pop();\n      if (map[last] !== char) return false;\n    }\n  }\n  \n  return stack.length === 0;\n}',
    status: 'accepted',
    timestamp: '2023-09-17T14:45:00Z'
  },
  {
    id: 's3',
    userId: 'student1',
    questionId: 'q2',
    language: 'java',
    code: 'class Solution {\n  public List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> result = new ArrayList<>();\n    if (root == null) return result;\n    \n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.offer(root);\n    \n    while (!queue.isEmpty()) {\n      int size = queue.size();\n      List<Integer> currentLevel = new ArrayList<>();\n      \n      for (int i = 0; i < size; i++) {\n        TreeNode node = queue.poll();\n        currentLevel.add(node.val);\n        \n        if (node.left != null) queue.offer(node.left);\n        if (node.right != null) queue.offer(node.right);\n      }\n      \n      result.add(currentLevel);\n    }\n    \n    return result;\n  }\n}',
    status: 'wrong',
    timestamp: '2023-09-20T09:15:00Z'
  }
];

export const getQuestionById = (id: string): Question | undefined => {
  return MOCK_QUESTIONS.find(q => q.id === id);
};

export const getSubmissionsByUser = (userId: string): Submission[] => {
  return MOCK_SUBMISSIONS.filter(s => s.userId === userId);
};
 