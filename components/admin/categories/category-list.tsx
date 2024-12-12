'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CategoryList() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Business Strategy', preamble: 'Evaluate your business strategy' },
    { id: 2, name: 'Market Analysis', preamble: 'Analyze market conditions' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Category name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Preamble</label>
                <Textarea placeholder="Category preamble" />
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Save Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-lg border border-gray-200 flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              <p className="text-gray-600 mt-1">{category.preamble}</p>
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