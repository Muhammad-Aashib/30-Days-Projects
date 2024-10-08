"use client";
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

//Interface
interface Task {
    id: number;
    text: string;
    completed: boolean;
}

export default function TodoList() {

    // State Hooks for Managing Tasks
    const [tasks, setTasks] = useState<Task[]>([]);
    //New Task Input
    const [newTask, setNewTask] = useState<string>("");
    //Editing Task
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTaskText, setEditedTaskText] = useState<string>("");
    //Component Mount Status
    const [isMounted, setIsMounted] = useState<boolean>(false);

    //Effect Hooks on Component Mount
    useEffect(() => {
        setIsMounted(true);
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks) as Task[]);
        }
      }, []);

      //Effect Hook For Saving Tasks
      useEffect(() => {
        if (isMounted) {
          localStorage.setItem("tasks", JSON.stringify(tasks));
        }
      }, [tasks, isMounted]);

      //Adding a Task
      const addTask = (): void => {
        if (newTask.trim() !== "") {
          setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
          setNewTask("");
        }
      };

      //Toggle the Completion of a Task
      const toggleTaskCompletion = (id: number): void => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
      };

      //Editing a Task
      const startEditingTask = (id: number, text: string): void => {
        setEditingTaskId(id);
        setEditedTaskText(text);
      }

      //Updating an Edited task
      const updateTask = (): void => {
        if (editedTaskText.trim() !== "") {
          setTasks(
            tasks.map((task) =>
              task.id === editingTaskId ? { ...task, text: editedTaskText } : task
            )
          );
          setEditingTaskId(null);
          setEditedTaskText("");
        }
      };

      //Delete Task
      const deleteTask = (id: number): void => {
        setTasks(tasks.filter((task) => task.id !== id));
      };

      //JSX Statement
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Todo List
            </h1>
            <div className="flex items-center mb-4">
              <Input
                type="text"
                placeholder="Add a new task"
                value={newTask}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
                className="flex-1 mr-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <Button
                onClick={addTask}
                className="bg-black hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-md"
              >
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-md px-4 py-2"
                >
                  <div className="flex items-center">
                    <Checkbox
                      checked={task.completed}
                      className="mr-2"
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                    />
                    {editingTaskId === task.id ? (
                      <Input
                        type="text"
                        value={editedTaskText}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedTaskText(e.target.value)}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === "Enter") {
                            updateTask();
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      />
                    ) : (
                      <span
                        className={`flex-1 text-gray-800 dark:text-gray-200 ${
                          task.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : ""
                        }`}
                      >
                        {task.text}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {editingTaskId === task.id ? (
                      <Button
                        onClick={updateTask}
                        className="bg-black hover:bg-slate-800 text-white font-medium py-1 px-2 rounded-md mr-2"
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        onClick={() => startEditingTask(task.id, task.text)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-medium py-1 px-2 rounded-md mr-2"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
