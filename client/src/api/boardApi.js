const BASE_URL = 'http://localhost:5000/api';

export async function createBoard(title) {
  const res = await fetch(`${BASE_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to create board');
  return res.json();
}

export async function getBoards() {
  const res = await fetch(`${BASE_URL}/boards`);
  if (!res.ok) throw new Error('Failed to fetch boards');
  return res.json();
}

export async function getBoard(id) {
  const res = await fetch(`${BASE_URL}/boards/${id}`);
  if (!res.ok) throw new Error('Failed to fetch board');
  return res.json();
}

export async function createColumn(boardId, title, order = 0) {
  const res = await fetch(`${BASE_URL}/columns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ boardId, title, order }),
  });
  if (!res.ok) throw new Error('Failed to create column');
  return res.json();
}

export async function deleteColumn(id) {
  const res = await fetch(`${BASE_URL}/columns/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete column');
  return res.json();
}

export async function createTask(columnId, title, description = '', order = 0) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ columnId, title, description, order }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function moveTask(id, columnId, order) {
  const res = await fetch(`${BASE_URL}/tasks/${id}/move`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ columnId, order }),
  });
  if (!res.ok) throw new Error('Failed to move task');
  return res.json();
}
