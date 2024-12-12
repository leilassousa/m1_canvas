'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function QuestionList() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      category: 'Business Strategy',
      text: 'How well defined is your business strategy?',
    },
    {
      id: 2,
      category: 'Market Analysis',
      text: 'Who are your main competitors?',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business Strategy</SelectItem>
                    <SelectItem value="market">Market Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Question</label>
                <Textarea placeholder="Enter question" />
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Save Question
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white p-6 rounded-lg border border-gray-200 flex justify-between items-start"
          >
            <div>
              <div className="text-sm font-medium text-orange-600 mb-1">
                {question.category}
              </div>
              <p className="text-gray-900">{question.text}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}