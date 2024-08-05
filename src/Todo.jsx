import React, { useEffect, useState } from 'react';
import './index.css';
import { toDoListArr } from './data';
import ConfirmationModal from './Modal';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// NOTE - Adding up logics into the same component as of now, instead of breaking into components

const Todo = () => {
    const [toDoList, setToDoList] = useState(toDoListArr);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        status: 'pending',
        priority: 'low',
        dueDate: new Date().toISOString().split('T')[0]
    });
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({ title: '', description: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        setErrors({ title: '', description: '' });
    }, [formData]);

    const generateUniqueId = () => Date.now();

    const resetFormData = (open = false) => {
        setFormData({
            id: '',
            title: '',
            description: '',
            status: 'pending',
            priority: 'low',
            dueDate: new Date().toISOString().split('T')[0]
        });
        setIsEditing(false);
        setErrors({ title: '', description: '' });
        setIsFormVisible(open);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let valid = true;

        if (!formData.title.trim()) {
            setErrors(prev => ({ ...prev, title: 'Title is required' }));
            valid = false;
        } else if (formData.title.length > 50) {
            setErrors(prev => ({ ...prev, title: 'Title cannot exceed 50 characters' }));
            valid = false;
        }

        if (!formData.description.trim()) {
            setErrors(prev => ({ ...prev, description: 'Description is required' }));
            valid = false;
        }

        if (!valid) return;

        if (isEditing) {
            setToDoList(prevToDoList =>
                prevToDoList.map(todo =>
                    todo.id === formData.id ? formData : todo
                )
            );
        } else {
            const newToDo = {
                ...formData,
                id: generateUniqueId()
            };
            setToDoList(prevToDoList => [
                ...prevToDoList,
                newToDo
            ]);
        }
        resetFormData();
    };

    const handleEdit = (id) => {
        const todoToEdit = toDoList.find(todo => todo.id === id);
        if (todoToEdit) {
            setFormData(todoToEdit);
            setIsEditing(true);
            setIsFormVisible(true);
        }
    };

    const openModal = (id) => {
        setTodoToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTodoToDelete(null);
    };

    const confirmDelete = () => {
        setToDoList(prevToDoList => prevToDoList.filter(todo => todo.id !== todoToDelete));
        closeModal();
    };

    const handleStatusChange = (status) => {
        setSelectedStatuses(prevStatuses =>
            prevStatuses.includes(status)
                ? prevStatuses.filter(s => s !== status)
                : [...prevStatuses, status]
        );
    };

    const filteredToDoList = selectedStatuses.length === 0
        ? toDoList
        : toDoList.filter(todo => selectedStatuses.includes(todo.status));

    const sortedToDoList = [...filteredToDoList].sort((a, b) => b.id - a.id);

    return (
        <div className="container">
            <div className={`leftContainer ${isFormVisible ? "showForm" : "hideForm"}`}>
                <div className="form">
                    <h6 style={{ color: "orange", fontWeight: 400 }}>© 2024 Apurva. All rights reserved.</h6>
                    <h2>{isEditing ? 'Update ToDo' : 'Add New ToDo'}</h2>

                    <div className="field">
                        <span className='label'>Title <span className="required">*</span></span>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            placeholder="Enter title"
                            onChange={handleChange}
                        />
                        {errors.title && <p className="error">{errors.title}</p>}
                    </div>

                    <div className="field">
                        <span className='label'>Description <span className="required">*</span></span>
                        <textarea
                            name="description"
                            value={formData.description}
                            placeholder="Enter description"
                            onChange={handleChange}
                        />
                        {errors.description && <p className="error">{errors.description}</p>}
                    </div>

                    <div className="field">
                        <span className='label'>Status</span>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                        </select>
                    </div>

                    <div className="field">
                        <span className='label'>Priority</span>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="field">
                        <span className='label'>Due Date</span>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={handleChange}
                        />
                    </div>

                    <button onClick={handleSubmit} className='submitBtn' type="submit">
                        {isEditing ? 'Update Task' : 'Add Task'}
                    </button>
                </div>
            </div>
            <div className="rightContainer">
                <div className='todosContainer'>
                    <div className='todosHeader'>
                        <h1>Organize your ToDo's here</h1>
                        <button
                            className="addNewButton"
                            onClick={() => resetFormData(!isFormVisible)}
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                            Add New ToDo
                        </button>
                    </div>
                    <div className='filterHeader'>
                        <span>Filter By</span>
                        <div className="filterContainer">
                            <button
                                className={`filterButton ${selectedStatuses.includes('pending') ? 'active' : ''}`}
                                onClick={() => handleStatusChange('pending')}
                            >
                                Pending
                            </button>
                            <button
                                className={`filterButton ${selectedStatuses.includes('completed') ? 'active' : ''}`}
                                onClick={() => handleStatusChange('completed')}
                            >
                                Completed
                            </button>
                            <button
                                className={`filterButton ${selectedStatuses.includes('in-progress') ? 'active' : ''}`}
                                onClick={() => handleStatusChange('in-progress')}
                            >
                                In Progress
                            </button>
                            <button
                                className={`filterButton ${selectedStatuses.length === 0 ? 'active' : ''}`}
                                onClick={() => setSelectedStatuses([])}
                            >
                                All
                            </button>
                        </div>
                    </div>

                    <div className="divider" />
                    {sortedToDoList.length > 0 ? (
                        <div className="todoList">
                            {sortedToDoList.map((todo) => (
                                <div key={todo.id} className='toDoBox'>
                                    <div className="todoItem">
                                        <div className="todo-id">ID- #{todo.id}</div>
                                        <div className="todo-title">{todo.title}</div>
                                        <div className="todo-description">{todo.description}</div>
                                        <div className={`todo-status status-${todo.status}`}>
                                            {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                                        </div>
                                        <div className="todo-priority">{todo.priority} Priority</div>
                                        <div className="todo-due-date">ToDo By: {todo.dueDate}</div>
                                    </div>
                                    <div className="buttonContainer">
                                        <button
                                            className="button updateButton"
                                            onClick={() => handleEdit(todo.id)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} /> Update
                                        </button>
                                        <button
                                            className="button deleteButton"
                                            onClick={() => openModal(todo.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="notFound">
                            {
                                selectedStatuses.length !== 0 ?
                                    "No ToDo's found in filtered results." :
                                    "Your ToDo's list is empty! Add new tasks to catch up."}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this task?"
            />
        </div>
    );
};

export default Todo;
