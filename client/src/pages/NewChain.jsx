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

  const [inputVariable, setInputVariable] = useState("topic");
  const [questions, setQuestions] = useState([{ id: uuidv4(), text: "" }]);

  const [outputFormat, setOutputFormat] = useState(
    "Summary:\n\n{{previousContext}}"
  );

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: saveChain, isPending } = useMutation({
    mutationFn: async () => {
      const nodes = [];
      const edges = [];

      const inputNodeId = `node-input-${uuidv4()}`;
      nodes.push({
        id: inputNodeId,
        type: "input",
        text: `{{${inputVariable}}}`,
        position: { x: 100, y: 100 },
      });

      let previousNodeId = inputNodeId;
      questions.forEach((question, index) => {
        const questionNodeId = `node-llm-${index}-${uuidv4()}`;
        nodes.push({
          id: questionNodeId,
          type: "llm",
          text: question.text,
          position: { x: 300 + index * 200, y: 100 },
        });

        edges.push({
          source: previousNodeId,
          target: questionNodeId,
        });

        previousNodeId = questionNodeId;
      });

      const outputNodeId = `node-output-${uuidv4()}`;
      nodes.push({
        id: outputNodeId,
        type: "output",
        text: outputFormat,
        position: { x: 300 + questions.length * 200, y: 100 },
      });

      edges.push({
        source: previousNodeId,
        target: outputNodeId,
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
    if (!inputVariable.trim())
      newErrors.inputVariable = "Input variable name is required.";
    if (questions.length === 0)
      newErrors.questions = "At least one question is required.";
    if (questions.some((q) => !q.text.trim()))
      newErrors.questionText = "All questions must have text.";
    if (!outputFormat.trim())
      newErrors.outputFormat = "Output format is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    saveChain();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-950 py-12 px-6">
      <div className="max-w-3xl mx-auto p-8 bg-gray-900 shadow-2xl rounded-xl border border-gray-800">
        <h2 className="text-4xl font-bold mb-8 text-white">Create New Chain</h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Chain Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Blog Post Generator"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-white rounded-lg p-3 w-full focus:outline-none focus:border-gray-600 transition-colors"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            placeholder="Describe what this chain does..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-white rounded-lg p-3 w-full h-20 focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        <div className="mb-8 p-6 bg-gray-800 border border-gray-700 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <span className="bg-gray-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
              1
            </span>
            Input Variable
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            What input will the user provide? (e.g., "topic", "keyword",
            "product")
          </p>
          <input
            type="text"
            placeholder="Variable name (e.g., topic)"
            value={inputVariable}
            onChange={(e) =>
              setInputVariable(e.target.value.replace(/\s/g, "_"))
            }
            className="border border-gray-700 bg-gray-900 text-white rounded-lg p-3 w-full focus:outline-none focus:border-gray-600 transition-colors"
          />
          {errors.inputVariable && (
            <p className="text-red-400 text-sm mt-1">{errors.inputVariable}</p>
          )}
          <p className="text-xs text-gray-500 mt-3">
            This will be available as{" "}
            <code className="bg-gray-900 px-2 py-1 rounded text-gray-300">{`{{${inputVariable}}}`}</code>{" "}
            in your prompts
          </p>
        </div>

        <div className="mb-8 p-6 bg-gray-800 border border-gray-700 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <span className="bg-gray-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
              2
            </span>
            Questions / Prompts
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Add the questions or instructions for the AI to process sequentially
          </p>

          {questions.map((question, index) => (
            <div key={question.id} className="mb-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Question {index + 1}
                  </label>
                  <textarea
                    placeholder={`e.g., Write a ${
                      index === 0
                        ? "brief introduction"
                        : "detailed explanation"
                    } about the ${inputVariable}`}
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(question.id, e.target.value)
                    }
                    className="border border-gray-700 bg-gray-900 text-white rounded-lg p-3 w-full h-24 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                  />
                </div>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteQuestion(question.id)}
                    className="mt-7 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {errors.questions && (
            <p className="text-red-400 text-sm mb-2">{errors.questions}</p>
          )}
          {errors.questionText && (
            <p className="text-red-400 text-sm mb-2">{errors.questionText}</p>
          )}

          <button
            type="button"
            onClick={addQuestion}
            className="mt-3 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm font-medium transition-colors"
          >
            + Add Another Question
          </button>
        </div>

        <div className="mb-8 p-6 bg-gray-800 border border-gray-700 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <span className="bg-gray-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
              3
            </span>
            Output Format
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            How should the final output be formatted?
          </p>
          <textarea
            placeholder="e.g., Final Summary:&#10;&#10;{{previousContext}}"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="border border-gray-700 bg-gray-900 text-white rounded-lg p-3 w-full h-24 text-sm font-mono focus:outline-none focus:border-gray-600 transition-colors"
          />
          {errors.outputFormat && (
            <p className="text-red-400 text-sm mt-1">{errors.outputFormat}</p>
          )}
          <p className="text-xs text-gray-500 mt-3">
            Use{" "}
            <code className="bg-gray-900 px-2 py-1 rounded text-gray-300">
              {"{{previousContext}}"}
            </code>{" "}
            to include all previous outputs
          </p>
        </div>

        <div className="mb-8 p-6 bg-gray-800 border border-gray-700 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            Chain Preview:
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-400 overflow-x-auto">
            <div className="px-3 py-2 bg-gray-900 rounded-lg border border-gray-700 whitespace-nowrap">
              Input: {inputVariable}
            </div>
            <span>→</span>
            {questions.map((q, i) => (
              <React.Fragment key={q.id}>
                <div className="px-3 py-2 bg-gray-900 rounded-lg border border-gray-700 whitespace-nowrap">
                  Q{i + 1}
                </div>
                <span>→</span>
              </React.Fragment>
            ))}
            <div className="px-3 py-2 bg-gray-900 rounded-lg border border-gray-700 whitespace-nowrap">
              Output
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="block w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isPending ? "Creating Chain..." : "Create Chain"}
        </button>
      </div>
    </div>
  );
}
