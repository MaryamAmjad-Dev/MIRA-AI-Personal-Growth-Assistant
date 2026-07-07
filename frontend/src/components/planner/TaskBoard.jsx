import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Badge from '../ui/Badge';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function TaskBoard({ tasks, onStatusChange, onEdit, onDelete }) {
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId;
    const task = tasks.find((t) => t._id === result.draggableId);
    if (task && task.status !== newStatus) onStatusChange(task._id, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task-board">
        {COLUMNS.map((col) => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="task-column glass-card">
                <h3>{col.title} ({grouped[col.id].length})</h3>
                {grouped[col.id].map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(prov) => (
                      <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="task-card">
                        <div className="task-card-header">
                          <p>{task.title}</p>
                          <Badge variant={task.priority === 'high' ? 'negative' : task.priority === 'low' ? 'neutral' : 'default'}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.dueDate && <span className="task-due">{new Date(task.dueDate).toLocaleDateString()}</span>}
                        <div className="task-card-actions">
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(task)}>Edit</button>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>Delete</button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
