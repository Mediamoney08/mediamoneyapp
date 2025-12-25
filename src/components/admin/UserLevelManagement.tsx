import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllUserLevels, 
  createUserLevel, 
  updateUserLevel, 
  deleteUserLevel 
} from '@/db/api';
import type { UserLevel } from '@/types/types';
import { Award, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function UserLevelManagement() {
  const [levels, setLevels] = useState<UserLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<UserLevel | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_percentage: 0,
    min_spent: 0,
    color: '#gray',
    priority: 0,
    is_active: true,
  });

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      setLoading(true);
      const data = await getAllUserLevels();
      setLevels(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load user levels',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLevel) {
        await updateUserLevel(editingLevel.id, formData);
        toast({
          title: 'Success',
          description: 'User level updated successfully',
        });
      } else {
        await createUserLevel(formData);
        toast({
          title: 'Success',
          description: 'User level created successfully',
        });
      }
      setDialogOpen(false);
      resetForm();
      loadLevels();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save user level',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (level: UserLevel) => {
    setEditingLevel(level);
    setFormData({
      name: level.name,
      description: level.description || '',
      discount_percentage: level.discount_percentage,
      min_spent: level.min_spent,
      color: level.color,
      priority: level.priority,
      is_active: level.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user level?')) return;
    
    try {
      await deleteUserLevel(id);
      toast({
        title: 'Success',
        description: 'User level deleted successfully',
      });
      loadLevels();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user level',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      discount_percentage: 0,
      min_spent: 0,
      color: '#gray',
      priority: 0,
      is_active: true,
    });
    setEditingLevel(null);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Level Management</h2>
          <p className="text-muted-foreground">Configure user tiers and discount levels</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Level
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingLevel ? 'Edit User Level' : 'Add User Level'}</DialogTitle>
              <DialogDescription>
                Configure user tier with discount percentage and spending requirements
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Level Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Gold"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Badge Color</Label>
                    <Input
                      id="color"
                      type="text"
                      placeholder="#FFD700"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount_percentage">Discount % *</Label>
                    <Input
                      id="discount_percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min_spent">Min Spent ($) *</Label>
                    <Input
                      id="min_spent"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.min_spent}
                      onChange={(e) => setFormData({ ...formData, min_spent: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="0"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Level description and benefits..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingLevel ? 'Update' : 'Create'} Level
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            User Levels
          </CardTitle>
          <CardDescription>
            {levels.length} level{levels.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading levels...</div>
          ) : levels.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No user levels configured. Add your first level to start offering discounts.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min Spent</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levels.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: level.color }}
                        />
                        <span className="font-medium">{level.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {level.discount_percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell>${level.min_spent.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{level.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      {level.is_active ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(level.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(level)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(level.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
