import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export const ExcelImport = ({
  excelQuestions,
  setExcelQuestions,
  handleSaveImportedQuestions,
}) => {
  // Handle file upload for Excel import
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const formattedQuestions = jsonData.map((row) => {
        // Create answers array in correct format
        const answers = [];

        if (row["A"])
          answers.push({
            content: row["A"],
            isCorrect: row["Answer"] === "A",
            explanation: "",
          });
        if (row["B"])
          answers.push({
            content: row["B"],
            isCorrect: row["Answer"] === "B",
            explanation: "",
          });
        if (row["C"])
          answers.push({
            content: row["C"],
            isCorrect: row["Answer"] === "C",
            explanation: "",
          });
        if (row["D"])
          answers.push({
            content: row["D"],
            isCorrect: row["Answer"] === "D",
            explanation: "",
          });

        return {
          content: row["Question"] || "",
          type: "multiple_choice",
          answers,
          difficulty: row["Difficulty"]
            ? parseInt(row["Difficulty"]) || 3
            : row["Difficulty"] === "easy"
            ? 1
            : row["Difficulty"] === "medium"
            ? 3
            : row["Difficulty"] === "hard"
            ? 5
            : 3,
          topic: row["Topic"] || "",
          priority: 3,
          tags: [],
          media: [],
        };
      });

      setExcelQuestions(formattedQuestions);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center w-full">
        <Label
          htmlFor="excel-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Excel files (.xlsx) supported
            </p>
          </div>
          <Input
            id="excel-upload"
            type="file"
            className="hidden"
            accept=".xlsx"
            onChange={handleFileUpload}
          />
        </Label>
      </div>
      {excelQuestions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">
            Preview ({excelQuestions.length} questions)
          </h3>
          <div className="max-h-64 overflow-y-auto">
            <ul className="mt-2 space-y-1">
              {excelQuestions.map((q, index) => (
                <li key={index} className="border p-2 rounded">
                  <strong>Q{index + 1}:</strong> {q.content}
                  {q.type === "multiple_choice" && (
                    <>
                      <br />
                      <strong>Options:</strong>{" "}
                      {q.answers.map((a) => a.content).join(" | ")}
                      <br />
                      <strong>Correct:</strong>{" "}
                      {q.answers
                        .filter((a) => a.isCorrect)
                        .map((a) => a.content)
                        .join(", ")}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="mt-4 w-full"
            onClick={handleSaveImportedQuestions}
            disabled={excelQuestions.length === 0}
          >
            Save All Questions
          </Button>
        </div>
      )}
    </div>
  );
};
