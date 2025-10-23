import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { createChain } from "../api/chains";
import toast from "react-hot-toast";
import React from "react";

export default function NewChain() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Input configuration
  const [inputVariable, setInputVariable] = useState("topic");
  
  // Questions (LLM nodes)
  const [questions, setQuestions] = useState([
    { id: uuidv4(), text: "" }
  ]);
  
  // Output format
  const [outputFormat, setOutputFormat] = useState("Summary:\n\n{{previousContext}}");
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: saveChain, isPending } = useMutation({
    mutationFn: async () => {
      // Build nodes in the standard format
      const nodes = [];
      const edges = [];
      
      // 1. Input Node
      const inputNodeId = `node-input-${uuidv4()}`;
      nodes.push({
        id: inputNodeId,
        type: "input",
        text: `{{${inputVariable}}}`,
        position: { x: 100, y: 100 }
      });
      
      // 2. LLM Nodes (questions)
      let previousNodeId = inputNodeId;
      questions.forEach((question, index) => {
        const questionNodeId = `node-llm-${index}-${uuidv4()}`;
        nodes.push({
          id: questionNodeId,
          type: "llm",
          text: question.text,
          position: { x: 300 + (index * 200), y: 100 }
        });
        
        // Connect to previous node
        edges.push({
          source: previousNodeId,
          target: questionNodeId
        });
        
        previousNodeId = questionNodeId;
      });
      
      // 3. Output Node
      const outputNodeId = `node-output-${uuidv4()}`;
      nodes.push({
        id: outputNodeId,
        type: "output",
        text: outputFormat,
        position: { x: 300 + (questions.length * 200), y: 100 }
      });
      
      // Connect last question to output
      edges.push({
        source: previousNodeId,
        target: outputNodeId
      });
      
      return createChain({
        title,
        description,
        nodes,
        edges,
        userId: "b1ab05e6-6e3f-45f1-81d8-322cf6e50397",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chains"] });
      toast.success("Chain created successfully!");
      navigate(`/chains/${data.id}`);
    },
    onError: (err) => {
      console.error("Error creating chain:", err);
      toast.error("Failed to create chain.");
    },
  });

  const addQuestion = () => {
    setQuestions([...questions, { id: uuidv4(), text: "" }]);
  };

  const updateQuestion = (id, text) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const deleteQuestion = (id) => {
    if (questions.length <= 1) {
      toast.error("At least one question is required");
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!inputVariable.trim()) newErrors.inputVariable = "Input variable name is required.";
    if (questions.length === 0) newErrors.questions = "At least one question is required.";
    if (questions.some((q) => !q.text.trim()))
      newErrors.questionText = "All questions must have text.";
    if (!outputFormat.trim()) newErrors.outputFormat = "Output format is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    saveChain();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Chain</h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Chain Title *
        </label>
        <input
          type="text"
          placeholder="e.g., Blog Post Generator"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          placeholder="Describe what this chain does..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full h-20"
        />
      </div>

      {/* Step 1: Input Variable */}
      <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
          <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
          Input Variable
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          What input will the user provide? (e.g., "topic", "keyword", "product")
        </p>
        <input
          type="text"
          placeholder="Variable name (e.g., topic)"
          value={inputVariable}
          onChange={(e) => setInputVariable(e.target.value.replace(/\s/g, '_'))}
          className="border border-gray-300 rounded p-2 w-full"
        />
        {errors.inputVariable && (
          <p className="text-red-500 text-sm mt-1">{errors.inputVariable}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          This will be available as <code className="bg-gray-200 px-1 rounded">{`{{${inputVariable}}}`}</code> in your prompts
        </p>
      </div>

      {/* Step 2: Questions (LLM Nodes) */}
      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
          Questions / Prompts
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Add the questions or instructions for the AI to process sequentially
        </p>

        {questions.map((question, index) => (
          <div key={question.id} className="mb-3">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Question {index + 1}
                </label>
                <textarea
                  placeholder={`e.g., Write a ${index === 0 ? 'brief introduction' : 'detailed explanation'} about the ${inputVariable}`}
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full h-24 text-sm"
                />
              </div>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteQuestion(question.id)}
                  className="mt-6 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        
        {errors.questions && <p className="text-red-500 text-sm mb-2">{errors.questions}</p>}
        {errors.questionText && <p className="text-red-500 text-sm mb-2">{errors.questionText}</p>}

        <button
          type="button"
          onClick={addQuestion}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
        >
          + Add Another Question
        </button>
      </div>

      {/* Step 3: Output Format */}
      <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-amber-800 flex items-center gap-2">
          <span className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
          Output Format
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          How should the final output be formatted?
        </p>
        <textarea
          placeholder="e.g., Final Summary:\n\n{{previousContext}}"
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full h-24 text-sm font-mono"
        />
        {errors.outputFormat && (
          <p className="text-red-500 text-sm mt-1">{errors.outputFormat}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Use <code className="bg-gray-200 px-1 rounded">{'{{previousContext}}'}</code> to include all previous outputs
        </p>
      </div>

      {/* Preview */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Chain Preview:</h4>
        <div className="flex items-center gap-2 text-xs text-gray-600 overflow-x-auto">
          <div className="px-3 py-2 bg-green-100 rounded border border-green-300 whitespace-nowrap">
            Input: {inputVariable}
          </div>
          <span>→</span>
          {questions.map((q, i) => (
            <React.Fragment key={q.id}>
              <div className="px-3 py-2 bg-blue-100 rounded border border-blue-300 whitespace-nowrap">
                Q{i + 1}
              </div>
              <span>→</span>
            </React.Fragment>
          ))}
          <div className="px-3 py-2 bg-amber-100 rounded border border-amber-300 whitespace-nowrap">
            Output
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isPending}
        className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? "Creating Chain..." : "Create Chain"}
      </button>
    </div>
  );
}